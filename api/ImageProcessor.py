from flask import jsonify
from flask_restful import Resource, request
from api.utils.imageProcessor import get_image_metadata
""" load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY") """


class ImageProcessor(Resource):
    def post(self):   
        try:     
            images = request.files.getlist('images')
            metadata = get_image_metadata(images)
            final_ret = {"status": "Success", "metadata": metadata}
            return final_ret
        except Exception as error:
            return jsonify({'error': error})

