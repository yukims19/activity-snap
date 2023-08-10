from flask import jsonify
from flask_restful import Resource, request
from api.utils.imageProcessor import get_image_metadata
from dotenv import load_dotenv
import os
import openai

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

class Chat(Resource):
    def post(self):   
        try:            
            user_message = request.get_json().get('message')
            image_metadata = request.get_json().get('metadata')
            messages = [
              {
                "role": "system",
                "content": "You are a activity summarization assistant. Given the images, you will give a summary of what happened. The image data includes timestamp, location, captions and people."
              },
              {
                "role": "assistant",
                "content": f"Here are the info of the images. {image_metadata}"
              },
              {
                "role": "assistant",
                "content": """These images capture a person's life moments. Each image has the following four piece of data:
                - datetime: describes when the picture is taken
                - location: describes where the picture is taken
                - caption: explains the picture
                - people: describes who is in the picture
                Base on the information provided, do your best to predict the person's activity objectively and answer user's questions."""
              },
              {
                "role": "user",
                "content": user_message
              }
            ]
            print('>>>>Messages to GPT: ', messages)
            response = openai.ChatCompletion.create(
              model="gpt-3.5-turbo",
              messages=messages
            )
            print('>>>>>Response from GPT: ', response)
            return response.choices[0].message.content
            
            return 'hello'
        except Exception as error:
            return jsonify({'error': error})

