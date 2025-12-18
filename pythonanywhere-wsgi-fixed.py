"""
WSGI configuration untuk FastAPI di PythonAnywhere
FIXED: Menggunakan ASGI-to-WSGI adapter untuk FastAPI
"""
import sys
import os

# GANTI 'nicocode' dengan username PythonAnywhere Anda!
username = 'nicocode'

# Add path to project
path = f'/home/{username}/indonesia-fire-monitor/ml-prediction'
if path not in sys.path:
    sys.path.insert(0, path)

# Change to project directory
os.chdir(path)

# Import FastAPI app
try:
    from api.prediction_api import app
    
    # FastAPI perlu ASGI-to-WSGI adapter
    # Install mangum: pip install --user mangum
    try:
        from mangum import Mangum
        # Wrap FastAPI dengan Mangum untuk WSGI
        application = Mangum(app)
    except ImportError:
        # Jika mangum tidak ada, install dulu
        # Atau pakai alternatif: uvicorn dengan asyncio
        def application(environ, start_response):
            status = '500 Internal Server Error'
            headers = [('Content-type', 'text/plain')]
            start_response(status, headers)
            error_msg = 'Mangum not installed. Run: pip install --user mangum\n'
            error_msg += 'Then reload web app.'
            return [error_msg.encode()]
            
except Exception as e:
    # Error handling
    def application(environ, start_response):
        status = '500 Internal Server Error'
        headers = [('Content-type', 'text/plain')]
        start_response(status, headers)
        error_msg = f'Error loading app: {str(e)}\n\n'
        error_msg += f'Path: {path}\n'
        error_msg += f'Check error logs for details.'
        return [error_msg.encode()]

