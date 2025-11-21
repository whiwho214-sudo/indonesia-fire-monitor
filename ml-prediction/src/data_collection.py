"""
Script untuk mengumpulkan historical hotspot data dari NASA FIRMS API
"""
import requests
import pandas as pd
from datetime import datetime, timedelta
import time
import json

# NASA FIRMS API Configuration
NASA_API_KEY = '28a847cd248c2272dc9b58b20e74fa9f'
NASA_BASE_URL = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv'

# Indonesia bounding box
INDONESIA_BBOX = [95, -11, 141, 6]  # [west, south, east, north]

# Satellite sources
SOURCES = [
    'VIIRS_SNPP_NRT',
    'VIIRS_NOAA20_NRT',
    'MODIS_Terra_NRT',
    'MODIS_Aqua_NRT'
]


def fetch_hotspots_for_date_range(start_date, end_date, source='VIIRS_SNPP_NRT'):
    """
    Fetch hotspots untuk date range tertentu
    NASA API maksimal 10 hari per request
    """
    all_hotspots = []
    
    current_date = start_date
    while current_date <= end_date:
        # Calculate days (max 10)
        days_ahead = min((end_date - current_date).days + 1, 10)
        
        url = f"{NASA_BASE_URL}/{NASA_API_KEY}/{source}/{','.join(map(str, INDONESIA_BBOX))}/{days_ahead}"
        
        try:
            print(f"Fetching {source} for {current_date} to {current_date + timedelta(days=days_ahead-1)}...")
            response = requests.get(url, timeout=30)
            
            if response.status_code == 200:
                # Parse CSV
                lines = response.text.strip().split('\n')
                if len(lines) > 1:  # Has data
                    headers = lines[0].split(',')
                    for line in lines[1:]:
                        if line.strip():
                            values = line.split(',')
                            hotspot = dict(zip(headers, values))
                            hotspot['source'] = source
                            all_hotspots.append(hotspot)
                    
                    print(f"  Found {len(lines)-1} hotspots")
            else:
                print(f"  Error: {response.status_code}")
            
            # Rate limiting
            time.sleep(1)
            
        except Exception as e:
            print(f"  Error fetching data: {e}")
        
        current_date += timedelta(days=days_ahead)
    
    return all_hotspots


def collect_historical_data(days_back=365, output_file='data/raw/hotspots.csv'):
    """
    Collect historical hotspot data untuk N hari terakhir
    """
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days_back)
    
    print(f"Collecting historical data from {start_date.date()} to {end_date.date()}")
    
    all_data = []
    
    for source in SOURCES:
        print(f"\nFetching data from {source}...")
        hotspots = fetch_hotspots_for_date_range(start_date, end_date, source)
        all_data.extend(hotspots)
    
    # Convert to DataFrame
    df = pd.DataFrame(all_data)
    
    if len(df) > 0:
        # Clean and save
        df['latitude'] = pd.to_numeric(df['latitude'], errors='coerce')
        df['longitude'] = pd.to_numeric(df['longitude'], errors='coerce')
        df = df.dropna(subset=['latitude', 'longitude'])
        
        df.to_csv(output_file, index=False)
        print(f"\n✅ Saved {len(df)} hotspots to {output_file}")
    else:
        print("\n⚠️ No data collected")
    
    return df


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Collect historical hotspot data')
    parser.add_argument('--days', type=int, default=365, help='Number of days to collect')
    parser.add_argument('--output', type=str, default='data/raw/hotspots.csv', help='Output file')
    
    args = parser.parse_args()
    
    df = collect_historical_data(args.days, args.output)
    print(f"\n📊 Summary:")
    print(f"  Total hotspots: {len(df)}")
    if len(df) > 0:
        print(f"  Date range: {df['acq_date'].min()} to {df['acq_date'].max()}")
        print(f"  Unique locations: {df[['latitude', 'longitude']].drop_duplicates().shape[0]}")

