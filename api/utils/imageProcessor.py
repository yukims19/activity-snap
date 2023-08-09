from PIL import Image
from PIL import Image, ExifTags
from PIL.ExifTags import TAGS, GPSTAGS
from geopy.geocoders import Nominatim

from transformers import AutoProcessor, BlipForConditionalGeneration

from api.utils.faceRecognition import get_face_names

geolocator = Nominatim(user_agent="image_caption")

model_id = "Salesforce/blip-image-captioning-base"  # "Salesforce/blip2-opt-2.7b"
model = BlipForConditionalGeneration.from_pretrained(model_id)
processor = AutoProcessor.from_pretrained(model_id)

def get_decimal_coordinates(info):
    if info is None or len(info.keys()) is 0:
        return []

    gpsLatRef = info.get(1)
    gpsLat = info.get(2)
    gpsLonRef = info.get(3)
    gpsLon = info.get(4)

    lat = float(gpsLat[0]+(gpsLat[1]/60)+(gpsLat[2]/(3600*100)))
    lon = float(gpsLon[0]+(gpsLon[1]/60)+(gpsLon[2]/(3600*100)))
    if gpsLatRef == 'S':
        lat = -lat
    if gpsLonRef == 'W':
        lon = -lon

    return [lat, lon]

#known_encodings, names
def get_image_metadata(images, ):
    print('>>>>>>>>Get Image Metadata...')
    results = {}
    for idx, i in enumerate(images):
        print('')
        print('>>>>>>Image No.', idx+1, '<<<<<<', i.filename)
        image = Image.open(i)
        exif = image.getexif()
        datetime = exif[306]
        gps_ifd = exif.get_ifd(ExifTags.IFD.GPSInfo)
        coordinates = get_decimal_coordinates(gps_ifd)
        location = geolocator.reverse(
            ','.join(map(str, coordinates)), language='en')
        print('>>>Got Location: ', location)

        print('>>>Start generating caption.')
        inputs = processor(image, return_tensors="pt")
        out = model.generate(**inputs)
        caption = processor.batch_decode(out, skip_special_tokens=True)[0]
        print('>>>The caption is: ', caption)

        print('>>>Start geting face names')
        matched_names = get_face_names(i)
        print('>>>The face names are: ', matched_names) 

        results[i.filename] = {"datetime": datetime, "location": location.address, "caption": caption, "people": matched_names}
        
    return results
