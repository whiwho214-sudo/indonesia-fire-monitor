"""
WSGI configuration untuk FastAPI di PythonAnywhere
Ganti 'yourusername' dengan username PythonAnywhere Anda!
"""

import sys
import os

# Add path to project
# GANTI 'yourusername' dengan username PythonAnywhere Anda!
path = '/home/yourusername/indonesia-fire-monitor/ml-prediction'
if path not in sys.path:
    sys.path.insert(0, path)

# Change to project directory
os.chdir(path)

# Import FastAPI app
try:
    from api.prediction_api import app
    application = app
except Exception as e:
    # Error handling untuk debug
    def application(environ, start_response):
        status = '500 Internal Server Error'
        headers = [('Content-type', 'text/plain')]
        start_response(status, headers)
        return [f'Error loading app: {str(e)}'.encode()]

