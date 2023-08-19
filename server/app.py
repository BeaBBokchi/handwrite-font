from flask import Flask, request
from flask_cors import CORS

import os

app = Flask(__name__)
CORS(app)
CORS(app, resources={r'*': {'origins': '*'}})

# Upload
@app.route("/upload", methods=["POST"])
def upload():
    
    crop = os.path.join(os.getcwd(), "crop.py")
    os.system('{} {}'.format('python', crop))
    
    generate = os.path.join(os.getcwd(), "generate.py")
    os.system('{} {}'.format('python', generate))
    
    
    
    # uid = request.form.get('uid')
    # time = request.form.get('time')
    # url = request.form.get('url')
    # print("uid = " + uid)
    # print("time = " + time)
    # print("url = " + url)

    # uid = "nZ0dUCizxeRTjxPd4n0bQbPJp4y1"
    # time = "1692004940838"
    # url = "https://firebasestorage.googleapis.com/v0/b/handwrite-font.appspot.com/o/web-upload%2FnZ0dUCizxeRTjxPd4n0bQbPJp4y11692004940838?alt=media&token=fdc6c3cb-8ae6-41a1-be74-b1080b36bea2"

    return ""

# TEST
@app.route("/test", methods=["GET"])
def test():

    # testData = {
    #     "id": "id_data",
    #     "number": "number_data",
    #     "time": "2023-07-27"
    # }
    
    os.system("crop.py")
    os.system("generate.py")

    return testData


@app.route("/")
def home():
    return "Hello, cross-origin-world!"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3030, debug=True)