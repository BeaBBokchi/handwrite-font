import flask

server = flask.Flask(__name__, static_url_path="")


@server.route("/")
def index():
    return server.send_static_file("index.html")

