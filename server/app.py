from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
CORS(app, resources={r'*': {'origins': '*'}})
# CORS(app, resources={r'*': {'origins': 'https://hwangtoemat.github.io'}})

# Upload
@app.route("/upload", methods=["POST"])
def upload():
    uid = request.form.get('uid')
    time = request.form.get('time')
    url = request.form.get('url')
    print(uid)
    print(time)
    print(url)
    return ""

# TEST
@app.route("/test", methods=["GET"])
def test():

    testData = {
        "id": "id_data",
        "number": "number_data",
        "time": "2023-07-27"
    }

    return testData


@app.route("/")
def home():
    return "Hello, cross-origin-world!"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3030, debug=True)