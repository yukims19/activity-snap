from flask import jsonify
from flask_restful import Resource, request
from api.utils.imageProcessor import get_image_metadata

class ImageProcessor(Resource):
    def post(self):   
        try:     
            images = request.files.getlist('images')
            metadata = get_image_metadata(images)            
            return metadata
        except Exception as error:
            return jsonify({'error': error})

