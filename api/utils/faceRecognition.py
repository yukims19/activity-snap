import face_recognition

def get_known_faces():
    yuki_image = face_recognition.load_image_file("Yuki.jpg")
    liba_image = face_recognition.load_image_file("Liba.jpg")
    yuki_encoding = face_recognition.face_encodings(yuki_image)[0]
    liba_encoding = face_recognition.face_encodings(liba_image)[0]

    encodings = [yuki_encoding, liba_encoding]
    names = ['Yuki', 'Liba']
    return {"encodings": encodings, "names": names}

known_encodings, names = get_known_faces().values()

def get_unknown_face_encodings(images):
    result = []
    for image in images:
        unknown_image = face_recognition.load_image_file(image.name)
        encodings = face_recognition.face_encodings(unknown_image)
        encoding = [] if len(encodings) == 0 else encodings[0]
        result.append(encoding)
    return result


def get_face_names(image):
    unknown_image = face_recognition.load_image_file(image)
    unknown_encodings = face_recognition.face_encodings(unknown_image)
    if (len(unknown_encodings) == 0):
        return []

    unknown_encoding = unknown_encodings[0]

    results = face_recognition.compare_faces(
        known_encodings, unknown_encoding)

    matched_names = []
    for idx, item in enumerate(results):
        if (item):
            matched_names.append(names[idx])

    return matched_names
