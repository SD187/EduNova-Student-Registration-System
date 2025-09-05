from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello World!'

@app.route('/health')
def health():
    return 'Server is running!'

if __name__ == '__main__':
    print("Starting simple Flask server...")
    app.run(debug=True, host='127.0.0.1', port=5000)
