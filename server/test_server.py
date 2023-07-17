from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# TEST
# @app.route("/test", methods=["GET"])
# def test():

#     print("이미지 생성 완료")
#     # res = Response(json.dumps(jsonAll, default=json_default, ensure_ascii=False), content_type="application/json; charset=utf-8");
#     # res.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
#     return "짜잔"


@app.route("/")
def helloWorld():
    return "Hello, cross-origin-world!"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)