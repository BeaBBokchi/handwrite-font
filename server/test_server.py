from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
CORS(app, resources={r'*': {'origins': '*'}})
# CORS(app, resources={r'*': {'origins': 'https://hwangtoemat.github.io'}})

# TEST
@app.route("/test", methods=["GET"])
def test():

    print("이미지 생성 완료")

    return "짜잔"


@app.route("/")
def helloWorld():
    return "Hello, cross-origin-world!"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3030, debug=True)