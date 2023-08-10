from flask import Flask, send_from_directory
from api.Chat import Chat
from api.ImageProcessor import ImageProcessor
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS

from api.Summarize import Summarize  # comment this on deployment

app = Flask(__name__, static_url_path='', static_folder='frontend/build')
CORS(app)  # comment this on deployment
api = Api(app)


@app.route("/", defaults={'path': ''})
def serve(path):
    return send_from_directory(app.static_folder, 'index.html')


api.add_resource(ImageProcessor, '/process-image')
api.add_resource(Chat, '/chat')
api.add_resource(Summarize, '/summarize')
