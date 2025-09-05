from flask import Flask, send_from_directory
import os

app = Flask(__name__)

# Get the parent directory (where frontend files are located)
FRONTEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR = os.path.join(FRONTEND_DIR, 'public')

@app.route('/')
def serve_index():
    """Serve the public home page"""
    return send_from_directory(PUBLIC_DIR, 'index.html')

@app.route('/health')
def health():
    return "Server is running!"

if __name__ == '__main__':
    print(f"FRONTEND_DIR: {FRONTEND_DIR}")
    print(f"PUBLIC_DIR: {PUBLIC_DIR}")
    print(f"PUBLIC_DIR exists: {os.path.exists(PUBLIC_DIR)}")
    app.run(debug=True, host='127.0.0.1', port=5001)
