from flask import Flask, request
from flask_cors import CORS
import urllib.request
from PIL import Image
import database

import os

app = Flask(__name__)
CORS(app)
CORS(app, resources={r'*': {'origins': '*'}})

# Upload original style
@app.route("/upload", methods=["POST"])
def upload():

    uid = request.form.get('uid')
    time = request.form.get('time')
    url = request.form.get('url')
    file = request.form.get('file')
    # 이메일도 받기 (firebase 사용)
    print("uid = " + uid)
    print("time = " + time)
    print("url = " + url)
    # print("file = " + file)

    # uid = "nZ0dUCizxeRTjxPd4n0bQbPJp4y1"
    # time = "1692004940838"
    # url = "https://firebasestorage.googleapis.com/v0/b/handwrite-font.appspot.com/o/web-upload%2FnZ0dUCizxeRTjxPd4n0bQbPJp4y11692004940838?alt=media&token=fdc6c3cb-8ae6-41a1-be74-b1080b36bea2"

    urllib.request.urlretrieve(url, f"upload/{uid}.png")

    # crop = os.path.join(os.getcwd(), "crop.py") # TODO : arg input
    # os.system('{} {}'.format('python', crop))

    # rm_crop = os.path.join(os.getcwd(), "dataset/crop_results") # TODO : arg input
    # os.system('{} {} {}'.format('rm', '-r', rm_crop))
    
    # generate = os.path.join(os.getcwd(), "generate_family.py")
    # os.system('{} {}'.format('python', generate))

    serverUpload(uid, time, url)
    
    return ""

# Upload refine data
@app.route("/refine", methods=["POST"])
def refine():

    # testData = {
    #     "id": "id_data",
    #     "number": "number_data",
    #     "time": "2023-07-27"
    # }

    # uid = request.form.get('uid')
    # time = request.form.get('time')
    # url = request.form.get('url')
    # 이메일도 받기 (firebase 사용)

    uid = "nZ0dUCizxeRTjxPd4n0bQbPJp4y1"
    time = "1692004940838"
    # url = "https://firebasestorage.googleapis.com/v0/b/handwrite-font.appspot.com/o/web-upload%2FnZ0dUCizxeRTjxPd4n0bQbPJp4y11692004940838?alt=media&token=fdc6c3cb-8ae6-41a1-be74-b1080b36bea2"

    
    # generate = os.path.join(os.getcwd(), "generate.py")
    # os.system('{} {}'.format('python', generate))

    # upload(uid, time)

    print ("yes")

    return ""


@app.route("/")
def home():
    return "Hello, cross-origin-world!"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3030, debug=True)