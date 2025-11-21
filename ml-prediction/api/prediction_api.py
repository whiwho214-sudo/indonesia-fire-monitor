"""
FastAPI endpoint untuk Hotspot Prediction 2 Hari Ke Depan
Mendukung: LSTM (Deep Learning) dan Random Forest
"""
import sys
import os
from pathlib import Path

# Add parent directory to Python path so we can import from src
# This allows the script to be run from any location
current_file = Path(__file__).resolve()
ml_prediction_dir = current_file.parent.parent
if str(ml_prediction_dir) not in sys.path:
    sys.path.insert(0, str(ml_prediction_dir))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

from src.prediction import predict_with_random_forest, predict_with_lstm, predict_future_hotspots

app = FastAPI(title="Hotspot Prediction API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request models
class PredictionRequest(BaseModel):
    latitude: float
    longitude: float
    date: Optional[str] = None  # YYYY-MM-DD format
    model_type: Optional[str] = "both"  # 'rf', 'lstm', or 'both'
    historical_data: Optional[List[dict]] = None


class GridPredictionRequest(BaseModel):
    bbox: List[float]  # [west, south, east, north]
    date: Optional[str] = None
    model_type: Optional[str] = "both"
    grid_size: Optional[float] = 0.1


# Response models
class PredictionResponse(BaseModel):
    probability: float
    risk_level: str
    confidence: float
    model: str
    prediction: Optional[int] = None
    error: Optional[str] = None


class GridPredictionResponse(BaseModel):
    predictions: List[dict]
    total: int


@app.get("/")
async def root():
    """Root endpoint - quick health check"""
    print("📥 GET / - Health check request received")
    return {
        "message": "Hotspot Prediction API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "/api/predict": "Single location prediction",
            "/api/predictions/grid": "Grid prediction for area",
            "/api/predictions/batch": "Batch predictions"
        }
    }


@app.post("/api/predict", response_model=dict)
async def predict_hotspot(request: PredictionRequest):
    """
    Predict hotspot untuk lokasi dan tanggal tertentu
    """
    try:
        # Parse date
        if request.date:
            target_date = pd.to_datetime(request.date)
        else:
            # Default: 1 day ahead
            target_date = datetime.now() + timedelta(days=1)
        
        target_date = pd.to_datetime(target_date)
        
        # Validate coordinates
        if not (-90 <= request.latitude <= 90) or not (-180 <= request.longitude <= 180):
            raise HTTPException(status_code=400, detail="Invalid coordinates")
        
        result = {}
        
        # Predict with Random Forest
        if request.model_type in ['rf', 'both']:
            rf_result = predict_with_random_forest(
                request.latitude,
                request.longitude,
                target_date,
                request.historical_data
            )
            result['random_forest'] = rf_result
        
        # Predict with LSTM
        if request.model_type in ['lstm', 'both']:
            try:
                lstm_result = predict_with_lstm(
                    request.latitude,
                    request.longitude,
                    target_date,
                    request.historical_data
                )
                result['lstm'] = lstm_result
            except Exception as e:
                # If LSTM fails (e.g., TensorFlow not available), skip it
                print(f"Warning: LSTM prediction failed: {e}")
                if request.model_type == 'lstm':
                    # If only LSTM requested and it fails, raise error
                    raise HTTPException(status_code=500, detail=f"LSTM prediction failed: {str(e)}")
                # If 'both', just continue with RF only
                result['lstm'] = {
                    'probability': 0.0,
                    'risk_level': 'unknown',
                    'confidence': 0.0,
                    'error': str(e)
                }
        
        # Combine results jika both
        if request.model_type == 'both' and 'random_forest' in result and 'lstm' in result:
            rf_prob = result['random_forest'].get('probability', 0)
            lstm_prob = result['lstm'].get('probability', 0)
            
            avg_prob = (rf_prob + lstm_prob) / 2
            
            # Determine combined risk level
            if avg_prob >= 0.7:
                risk_level = 'high'
            elif avg_prob >= 0.4:
                risk_level = 'medium'
            else:
                risk_level = 'low'
            
            result['combined'] = {
                'probability': avg_prob,
                'risk_level': risk_level,
                'confidence': avg_prob,
                'rf_probability': rf_prob,
                'lstm_probability': lstm_prob
            }
        
        return {
            'latitude': request.latitude,
            'longitude': request.longitude,
            'date': target_date.isoformat(),
            'predictions': result
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/predictions/grid")
async def get_prediction_grid(
    bbox: str,  # Comma-separated: west,south,east,north
    date: Optional[str] = None,
    model_type: str = "rf",  # Default to RF only for speed
    grid_size: Optional[float] = 0.15  # Default to 0.15 for better coverage
):
    """
    Get prediction grid untuk area tertentu
    Menggunakan data historis dari request jika tersedia
    Note: LSTM disabled for grid prediction due to speed
    """
    print(f"📥 Received request: bbox={bbox}, date={date}, model_type={model_type}, grid_size={grid_size}")
    
    # Force RF only untuk grid - LSTM too slow
    if model_type in ['both', 'lstm']:
        print("⚠️ Grid prediction: Using RF only (LSTM too slow)")
        model_type = 'rf'
    
    try:
        # Parse bbox
        bbox_list = [float(x) for x in bbox.split(',')]
        if len(bbox_list) != 4:
            raise HTTPException(status_code=400, detail="Invalid bbox format. Use: west,south,east,north")
        
        # Parse date
        if date:
            target_date = pd.to_datetime(date)
        else:
            target_date = datetime.now() + timedelta(days=1)
        
        # Try to load historical data from file
        historical_data = None
        try:
            hist_file = 'data/raw/hotspots.csv'
            if os.path.exists(hist_file):
                hist_df = pd.read_csv(hist_file)
                hist_df['acq_date'] = pd.to_datetime(hist_df['acq_date'], errors='coerce')
                # Filter untuk data dalam 30 hari terakhir
                cutoff_date = target_date - timedelta(days=30)
                hist_df = hist_df[hist_df['acq_date'] >= cutoff_date]
                if len(hist_df) > 0:
                    historical_data = hist_df.to_dict('records')
        except Exception as e:
            print(f"Warning: Could not load historical data: {e}")
        
        # Generate predictions
        # Use historical data if available for better predictions
        print(f"🔮 Starting prediction generation...")
        start_time = datetime.now()
        
        # Use RF only for grid - much faster
        # Pass grid_size to prediction function
        predictions = predict_future_hotspots(
            target_date,
            bbox_list,
            'rf',  # Force RF only for grid predictions
            model_dir='data/models',
            grid_size=grid_size  # Use grid_size from parameter or default 0.15
        )
        
        elapsed = (datetime.now() - start_time).total_seconds()
        print(f"✅ Generated {len(predictions)} predictions in {elapsed:.2f} seconds")
        
        # If we have historical data, enhance predictions
        # NOTE: Skip untuk grid prediction (too slow for many points)
        # Only enhance if predictions are few (single point prediction)
        if historical_data and len(historical_data) > 0 and len(predictions) < 10:
            hist_df = pd.DataFrame(historical_data)
            # Ensure latitude/longitude columns are numeric
            if 'latitude' in hist_df.columns and 'longitude' in hist_df.columns:
                hist_df['latitude'] = pd.to_numeric(hist_df['latitude'], errors='coerce')
                hist_df['longitude'] = pd.to_numeric(hist_df['longitude'], errors='coerce')
                # Pre-convert acq_date untuk speed
                if 'acq_date' in hist_df.columns:
                    hist_df['acq_date'] = pd.to_datetime(hist_df['acq_date'], errors='coerce')
                cutoff_date = target_date - timedelta(days=7)
                
                for pred in predictions:
                    # Find nearby historical hotspots
                    lat, lon = pred['latitude'], pred['longitude']
                    nearby = hist_df[
                        ((hist_df['latitude'] - lat).abs() < 0.2) &
                        ((hist_df['longitude'] - lon).abs() < 0.2)
                    ].copy()  # Use .copy() to avoid SettingWithCopyWarning
                    
                    if len(nearby) > 0:
                        # Adjust probability based on historical data
                        if 'acq_date' in nearby.columns:
                            recent_count = len(nearby[nearby['acq_date'] >= cutoff_date])
                            if recent_count > 0:
                                pred['probability'] = min(pred.get('probability', 0) * 1.2, 1.0)
        elif historical_data and len(historical_data) > 0 and len(predictions) >= 10:
            print(f"   ⚠️ Skipping historical data enhancement untuk {len(predictions)} predictions (too slow)")
        
        # Filter predictions dengan probability > threshold 
        # Use very low threshold to show more results, or no filter if predictions are few
        threshold = 0.05 if len(predictions) > 10 else 0.0  # No filter if few predictions
        
        filtered = [
            {
                'latitude': p['latitude'],
                'longitude': p['longitude'],
                'probability': p.get('probability', 0),
                'risk_level': p.get('rf_risk', p.get('risk_level', 'low'))
            }
            for p in predictions
            if p.get('probability', 0) >= threshold  # Use >= instead of > to include edge cases
        ]
        
        print(f"   Filtered predictions: {len(filtered)} from {len(predictions)} total (threshold: {threshold})")
        
        # If no predictions after filter but we have raw predictions, show at least top 3
        if len(filtered) == 0 and len(predictions) > 0:
            print(f"   ⚠️ No predictions passed threshold, showing top {min(3, len(predictions))} predictions anyway")
            # Sort by probability descending and take top 3
            sorted_preds = sorted(predictions, key=lambda x: x.get('probability', 0), reverse=True)
            filtered = [
                {
                    'latitude': p['latitude'],
                    'longitude': p['longitude'],
                    'probability': p.get('probability', 0),
                    'risk_level': p.get('rf_risk', p.get('risk_level', 'low'))
                }
                for p in sorted_preds[:3]  # Top 3
            ]
        
        result = {
            'predictions': filtered if len(filtered) > 0 else [],
            'total': len(filtered),
            'total_raw': len(predictions),
            'date': target_date.isoformat(),
            'bbox': bbox_list,
            'filter_threshold': 0.1,
            'status': 'success'
        }
        
        print(f"📤 Sending response: {result['total']} predictions")
        print(f"✅ Response ready - sending to client...")
        return result
    
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"❌ Error in get_prediction_grid: {str(e)}")
        print(f"❌ Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        # Return error response instead of raising to avoid client timeout
        return {
            'predictions': [],
            'total': 0,
            'total_raw': 0,
            'status': 'error',
            'error': str(e),
            'date': target_date.isoformat() if 'target_date' in locals() else None,
            'bbox': bbox_list if 'bbox_list' in locals() else []
        }


@app.post("/api/predictions/batch")
async def batch_predictions(locations: List[dict], date: Optional[str] = None, model_type: str = "both"):
    """
    Batch predictions untuk multiple locations
    """
    try:
        # Parse date
        if date:
            target_date = pd.to_datetime(date)
        else:
            target_date = datetime.now() + timedelta(days=1)
        
        results = []
        
        for loc in locations:
            lat = loc.get('latitude')
            lon = loc.get('longitude')
            
            if lat is None or lon is None:
                continue
            
            result = await predict_hotspot(
                PredictionRequest(
                    latitude=lat,
                    longitude=lon,
                    date=date,
                    model_type=model_type,
                    historical_data=loc.get('historical_data')
                )
            )
            results.append(result)
        
        return {
            'results': results,
            'total': len(results)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/models/status")
async def get_models_status():
    """
    Get status of available models
    """
    import os
    
    model_dir = 'data/models'
    
    status = {
        'random_forest': {
            'available': os.path.exists(os.path.join(model_dir, 'random_forest_1day.pkl')),
            'metadata': None
        },
        'lstm': {
            'available': os.path.exists(os.path.join(model_dir, 'lstm_1day.h5')),
            'metadata': None
        }
    }
    
    # Load metadata jika ada
    import json
    
    rf_meta_path = os.path.join(model_dir, 'rf_metadata_1day.json')
    if os.path.exists(rf_meta_path):
        with open(rf_meta_path, 'r') as f:
            status['random_forest']['metadata'] = json.load(f)
    
    lstm_meta_path = os.path.join(model_dir, 'lstm_metadata_1day.json')
    if os.path.exists(lstm_meta_path):
        with open(lstm_meta_path, 'r') as f:
            status['lstm']['metadata'] = json.load(f)
    
    return status


if __name__ == "__main__":
    import uvicorn
    
    print("=" * 50)
    print("🚀 Starting Hotspot Prediction API")
    print("=" * 50)
    print(f"📡 Server will run on: http://127.0.0.1:8000")
    print(f"🌐 Access from browser: http://localhost:8000")
    print(f"🌐 Or directly: http://127.0.0.1:8000")
    print("=" * 50)
    print("")
    
    try:
        # Use 127.0.0.1 instead of 0.0.0.0 to ensure localhost access
        # 0.0.0.0 allows external access but might have firewall issues
        uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
    except KeyboardInterrupt:
        print("\n⚠️ API stopped by user")
    except Exception as e:
        print(f"\n❌ ERROR starting API: {e}")
        import traceback
        traceback.print_exc()

