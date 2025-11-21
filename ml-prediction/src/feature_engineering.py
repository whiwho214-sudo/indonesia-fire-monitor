"""
Feature Engineering untuk Hotspot Prediction
Membuat features temporal dan spatial untuk prediksi 2 hari ke depan
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.preprocessing import StandardScaler, LabelEncoder
import pickle
import os
import time


def extract_datetime_features(df):
    """Extract temporal features dari date"""
    if 'acq_date' in df.columns:
        df['acq_date'] = pd.to_datetime(df['acq_date'], errors='coerce')
        df['year'] = df['acq_date'].dt.year
        df['month'] = df['acq_date'].dt.month
        df['day'] = df['acq_date'].dt.day
        df['day_of_year'] = df['acq_date'].dt.dayofyear
        df['week_of_year'] = df['acq_date'].dt.isocalendar().week
        df['is_weekend'] = (df['acq_date'].dt.dayofweek >= 5).astype(int)
        
        # Seasonal features (untuk Indonesia)
        df['is_dry_season'] = ((df['month'] >= 4) & (df['month'] <= 9)).astype(int)
        df['is_rainy_season'] = ((df['month'] >= 10) | (df['month'] <= 3)).astype(int)
    
    return df


def create_spatial_grid(df, grid_size=0.1):
    """Create spatial grid features"""
    # Round coordinates to grid
    df['grid_lat'] = (df['latitude'] / grid_size).round() * grid_size
    df['grid_lon'] = (df['longitude'] / grid_size).round() * grid_size
    
    return df


def create_temporal_features(df, prediction_days=2):
    """
    Create temporal features untuk prediksi N hari ke depan
    - Count hotspot dalam X hari terakhir
    - Average brightness dalam X hari terakhir
    - Trend (naik/turun)
    
    OPTIMIZED VERSION: Menggunakan vectorization untuk lebih cepat
    """
    import time
    
    print("   Optimizing temporal features calculation...")
    start_total = time.time()
    
    df = df.sort_values(['grid_lat', 'grid_lon', 'acq_date']).copy()
    
    # Ensure acq_date is datetime
    if not pd.api.types.is_datetime64_any_dtype(df['acq_date']):
        df['acq_date'] = pd.to_datetime(df['acq_date'], errors='coerce')
    
    # Group by grid location
    df['hotspot_id'] = df.groupby(['grid_lat', 'grid_lon']).ngroup()
    
    # Initialize columns
    for days in [1, 3, 7, 14, 30]:
        df[f'count_last_{days}d'] = 0
        df[f'avg_brightness_last_{days}d'] = 0.0
        df[f'max_brightness_last_{days}d'] = 0.0
    
    # Use groupby + rolling for better performance
    print("   Using optimized groupby approach...")
    
    grouped = df.groupby('hotspot_id')
    total_groups = len(grouped)
    processed = 0
    
    for days in [1, 3, 7, 14, 30]:
        print(f"   Calculating {days}-day features (optimized)...")
        start_time = time.time()
        
        # Process each group more efficiently
        def calculate_features(group):
            """Calculate features for one location group"""
            group = group.sort_values('acq_date').copy()
            
            # Initialize result arrays
            count = np.zeros(len(group))
            avg_bright = np.zeros(len(group))
            max_bright = np.zeros(len(group))
            
            brightness_arr = group['brightness'].values if 'brightness' in group.columns else np.zeros(len(group))
            dates_arr = pd.to_datetime(group['acq_date']).values
            
            # Calculate for each row
            for i in range(len(group)):
                date_limit = dates_arr[i] - np.timedelta64(days, 'D')
                
                # Find indices within the window (before current date)
                mask = (dates_arr >= date_limit) & (dates_arr < dates_arr[i])
                historical_idx = np.where(mask)[0]
                
                if len(historical_idx) > 0:
                    count[i] = len(historical_idx)
                    avg_bright[i] = brightness_arr[historical_idx].mean() if len(brightness_arr[historical_idx]) > 0 else 0
                    max_bright[i] = brightness_arr[historical_idx].max() if len(brightness_arr[historical_idx]) > 0 else 0
            
            return pd.DataFrame({
                'count': count,
                'avg_bright': avg_bright,
                'max_bright': max_bright
            }, index=group.index)
        
        # Apply to each group (with progress)
        results = []
        for name, group in grouped:
            results.append(calculate_features(group))
            processed += 1
            if processed % 1000 == 0:
                elapsed = time.time() - start_time
                rate = processed / elapsed if elapsed > 0 else 0
                remaining = (total_groups - processed) / rate if rate > 0 else 0
                print(f"     Progress: {processed}/{total_groups} ({processed*100//total_groups}%) - ~{remaining:.0f}s remaining")
        
        # Combine results
        if results:
            combined = pd.concat(results)
            df.loc[combined.index, f'count_last_{days}d'] = combined['count'].values
            df.loc[combined.index, f'avg_brightness_last_{days}d'] = combined['avg_bright'].values
            df.loc[combined.index, f'max_brightness_last_{days}d'] = combined['max_bright'].values
        
        elapsed = time.time() - start_time
        print(f"   ✅ Completed {days}-day features in {elapsed:.1f}s")
        processed = 0  # Reset for next iteration
    
    # Trend features
    df['hotspot_trend_7d'] = (df['count_last_7d'] - df['count_last_14d']).fillna(0)
    
    total_time = time.time() - start_total
    print(f"   ✅ All temporal features completed in {total_time:.1f}s")
    
    return df


def create_target_variable(df, prediction_days=2):
    """
    Create target variable: apakah akan ada hotspot dalam N hari ke depan?
    """
    df = df.sort_values(['grid_lat', 'grid_lon', 'acq_date'])
    
    # Create target: 1 jika ada hotspot dalam 2 hari ke depan, 0 jika tidak
    df['target'] = 0
    df['target_brightness'] = 0.0
    df['target_count'] = 0
    
    for idx, row in df.iterrows():
        current_date = row['acq_date']
        future_date = current_date + timedelta(days=prediction_days)
        
        # Check if ada hotspot di grid yang sama dalam 2 hari ke depan
        same_grid = df[
            (df['grid_lat'] == row['grid_lat']) &
            (df['grid_lon'] == row['grid_lon']) &
            (df['acq_date'] > current_date) &
            (df['acq_date'] <= future_date)
        ]
        
        if len(same_grid) > 0:
            df.at[idx, 'target'] = 1
            df.at[idx, 'target_brightness'] = same_grid['brightness'].mean() if 'brightness' in same_grid.columns else 0
            df.at[idx, 'target_count'] = len(same_grid)
    
    return df


def create_sequences(df, sequence_length=7, prediction_days=2):
    """
    Create sequences untuk LSTM model
    Sequence: X hari terakhir -> predict Y hari ke depan
    """
    df = df.sort_values(['grid_lat', 'grid_lon', 'acq_date'])
    
    sequences = []
    targets = []
    locations = []
    
    feature_cols = [
        'brightness', 'count_last_1d', 'count_last_3d', 'count_last_7d',
        'avg_brightness_last_7d', 'month', 'day_of_year', 'is_dry_season'
    ]
    
    # Filter columns yang ada
    available_features = [col for col in feature_cols if col in df.columns]
    
    for hotspot_id in df['hotspot_id'].unique():
        subset = df[df['hotspot_id'] == hotspot_id].copy()
        subset = subset.sort_values('acq_date')
        
        if len(subset) < sequence_length + prediction_days:
            continue
        
        # Normalize features
        subset_features = subset[available_features].fillna(0).values
        
        # Create sequences
        for i in range(len(subset) - sequence_length - prediction_days + 1):
            seq = subset_features[i:i+sequence_length]
            target_row = subset.iloc[i+sequence_length+prediction_days-1]
            
            sequences.append(seq)
            targets.append(target_row['target'])
            locations.append({
                'lat': target_row['grid_lat'],
                'lon': target_row['grid_lon'],
                'date': target_row['acq_date']
            })
    
    return np.array(sequences), np.array(targets), locations


def prepare_features(input_file, output_file, prediction_days=1):
    """
    Main function untuk prepare features
    """
    print(f"📊 Loading data from {input_file}...")
    df = pd.read_csv(input_file)
    
    print(f"   Original data: {len(df)} rows")
    
    # Clean data
    if 'latitude' in df.columns and 'longitude' in df.columns:
        df['latitude'] = pd.to_numeric(df['latitude'], errors='coerce')
        df['longitude'] = pd.to_numeric(df['longitude'], errors='coerce')
        df = df.dropna(subset=['latitude', 'longitude'])
    
    # Convert brightness to numeric
    if 'brightness' in df.columns:
        df['brightness'] = pd.to_numeric(df['brightness'], errors='coerce').fillna(0)
    else:
        df['brightness'] = 0
    
    # Extract datetime features
    print("⏰ Extracting datetime features...")
    df = extract_datetime_features(df)
    
    # Create spatial grid
    print("🗺️  Creating spatial grid...")
    df = create_spatial_grid(df, grid_size=0.1)
    
    # Create temporal features
    print("📈 Creating temporal features...")
    df = create_temporal_features(df, prediction_days=prediction_days)
    
    # Create target variable
    print(f"🎯 Creating target variable (prediction {prediction_days} days ahead)...")
    df = create_target_variable(df, prediction_days=prediction_days)
    
    # Save processed data
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    df.to_csv(output_file, index=False)
    
    print(f"✅ Saved processed data to {output_file}")
    print(f"   Processed data: {len(df)} rows")
    print(f"   Target distribution: {df['target'].value_counts().to_dict()}")
    
    return df


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Feature engineering untuk hotspot prediction')
    parser.add_argument('--input', type=str, default='data/raw/hotspots.csv', help='Input CSV file')
    parser.add_argument('--output', type=str, default='data/processed/features.csv', help='Output CSV file')
    parser.add_argument('--days', type=int, default=1, help='Prediction days ahead')
    
    args = parser.parse_args()
    
    df = prepare_features(args.input, args.output, prediction_days=args.days)

