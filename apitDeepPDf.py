import joblib
from flask import Flask, request, jsonify
import pandas as pd
import re
from tld import get_tld
import tensorflow as tf
from pymongo import MongoClient
from datetime import datetime
from urllib.parse import urlparse
import subprocess
import numpy as np
from flask_cors import CORS
from Funciones import abnormal_url, count_atrate, count_dot, count_equal, count_http, count_https, count_hyphen, count_per, count_ques, count_www, digit_count, fd_length, having_ip_address, hostname_length, letter_count, no_of_dir, no_of_embed, shortening_service, suspicious_words, tld_length, url_length

app = Flask(__name__) 

CORS(app)
# Conectar a MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['url_analysis_db']
collection = db['url_analysis']

# Definir funciones de extracción de características para URLs

# Mapear etiquetas de texto a valores numéricos
label_mapping = {'benign': 0, 'defacement': 1, 'phishing': 2, 'malware': 3}
reverse_label_mapping = {v: k for k, v in label_mapping.items()}



def predict_url(url, model):
    # Extrae características de la URL
    features = pd.Series([
        having_ip_address(url),  # Verifica si la URL tiene una dirección IP
        abnormal_url(url),  # Verifica si la URL es anormal
        count_dot(url),  # Cuenta la cantidad de puntos en la URL
        count_www(url),  # Cuenta la cantidad de 'www' en la URL
        count_atrate(url),  # Cuenta la cantidad de '@' en la URL
        no_of_dir(url),  # Cuenta el número de directorios en la URL
        no_of_embed(url),  # Cuenta el número de embebidos en la URL
        shortening_service(url),  # Verifica si se utiliza un servicio de acortamiento de URL
        count_https(url),  # Cuenta la cantidad de 'https' en la URL
        count_http(url),  # Cuenta la cantidad de 'http' en la URL
        count_per(url),  # Cuenta la cantidad de '%' en la URL
        count_ques(url),  # Cuenta la cantidad de '?' en la URL
        count_hyphen(url),  # Cuenta la cantidad de guiones en la URL
        count_equal(url),  # Cuenta la cantidad de '=' en la URL
        url_length(url),  # Calcula la longitud de la URL
        hostname_length(url),  # Calcula la longitud del hostname en la URL
        suspicious_words(url),  # Verifica si hay palabras sospechosas en la URL
        digit_count(url),  # Cuenta la cantidad de dígitos en la URL
        letter_count(url),  # Cuenta la cantidad de letras en la URL
        fd_length(url),  # Calcula la longitud del directorio de nivel superior
        tld_length(get_tld(url, fail_silently=True))  # Calcula la longitud del TLD (Top-Level Domain)
    ])

    # Reorganiza las características en un formato adecuado para la predicción
    features = features.values.reshape(1, -1)

    # Realiza la predicción utilizando el modelo proporcionado
    prediction = model.predict(features)

    # Obtiene la clase predicha mapeándola a su etiqueta
    predicted_class = reverse_label_mapping[np.argmax(prediction[0])]

    # Calcula las probabilidades asociadas a cada clase y las formatea
    probabilities_dict = {reverse_label_mapping[i]: format(prob, '.6f') for i, prob in enumerate(prediction[0])}

    # Devuelve la clase predicha y las probabilidades
    return predicted_class, probabilities_dict


# Definir funciones de extracción de características para PDFs
model_columns = [
    'obj', 'endobj', 'stream', 'endstream', 'xref', 'trailer', 'startxref',
    '/Page', '/Encrypt', '/ObjStm', '/JS', '/JavaScript', '/AA', '/OpenAction',
    '/AcroForm', '/JBIG2Decode', '/RichMedia', '/Launch', '/EmbeddedFile', '/XFA', '/Colors'
]

# Función para analizar un PDF con pdfid.py
def analyze_pdf_with_pdfid(pdf_path):
    result = subprocess.run(['python', 'pdfid.py', pdf_path], capture_output=True, text=True)
    return result.stdout

# Función para extraer características específicas del PDF
def extract_pdf_features(pdf_path):
    output = analyze_pdf_with_pdfid(pdf_path)
    lines = output.splitlines()

    pdf_data = {feature: 0 for feature in model_columns}
    for line in lines:
        for feature in model_columns:
            if line.strip().startswith(feature):
                parts = line.split()
                if len(parts) == 2:
                    key, value = parts
                    pdf_data[key] = int(value)

    return pdf_data

# Cargar el modelo guardado para PDFs
xgb_model_pdf = joblib.load('xgb_model.pkl')

# Cargar el modelo de deep learning
model = tf.keras.models.load_model('url_model.h5')

# Cargar el modelo guardado para Email
xgb_model_email = joblib.load('modelo_email.pkl')

vectorizer = joblib.load('vectorizer.pkl')
'''
 
    base_url = extract_base_url(url)

    # Verificar si la URL base ya existe en la base de datos
    existing_record = collection.find_one({'base_url': base_url})

    if existing_record:
        # Incrementar el contador de intentos si ya existe
        collection.update_one({'base_url': base_url},{'$inc': {'attempt_count': 1}, '$set': {'last_accessed': datetime.now()}})
        attempt_count = existing_record['attempt_count'] + 1
    else:
        # Guardar la nueva URL base en la base de datos
        record = {
            'base_url': base_url,
            'attempt_count': 1,
            'last_accessed': datetime.now()
        }
        collection.insert_one(record)
        attempt_count = 1
'''

@app.route('/predict', methods=['POST'])
def predict_url_endpoint():
    data = request.get_json()
    url = data['url']


    predicted_class, probabilities = predict_url(url, model)

    return jsonify(
        {'url': url, 'prediction': predicted_class, 'probabilities': probabilities})
    
@app.route('/predict_email', methods=['POST'])
def predict_url_email():
    data = request.get_json()
    email = data.get('email')  # Use get method to avoid KeyError

    if email:
        # Vectorizar el texto del correo electrónico
        features = vectorizer.transform([email])

        # Hacer la predicción
        probabilities = xgb_model_email.predict(features)
        print(probabilities)

        return jsonify({'email text': email, 'probabilities': "Safe" if probabilities[0] == 0 else "Phising"})
    else:
        return jsonify({'error': 'Email not provided'}), 400



@app.route('/analizarpdf', methods=['POST'])
def predict_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    print(file)
    file_path = 'temp.pdf'
    file.save(file_path)

    pdf_features = extract_pdf_features(file_path)
    pdf_features_df = pd.DataFrame([pdf_features])
    pdf_features_df = pdf_features_df.reindex(columns=model_columns, fill_value=0)

    pdf_prediction = xgb_model_pdf.predict(pdf_features_df)
    result = 'malicious' if pdf_prediction[0] else 'clean'

    return jsonify({"file": file.filename, "prediction": result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
