import pandas as pd
import numpy as np
import tensorflow as tf
import re
from tld import get_tld

# Definir funciones de extracción de características
def having_ip_address(url):
    match = re.search(
        r'(([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.)',
        url)
    return 1 if match else 0

def abnormal_url(url):
    try:
        hostname = url.split('/')[2]
        match = re.search(re.escape(hostname), url)
        return 1 if match else 0
    except IndexError:
        return 0

def count_dot(url):
    return url.count('.')

def count_www(url):
    return url.count('www')

def count_atrate(url):
    return url.count('@')

def no_of_dir(url):
    return url.count('/')

def no_of_embed(url):
    return url.count('//')

def shortening_service(url):
    match = re.search(
        r'bit\.ly|goo\.gl|shorte\.st|go2l\.ink|x\.co|ow\.ly|t\.co|tinyurl|tr\.im|is\.gd|cli\.gs|yfrog\.com|migre\.me|ff\.im|tiny\.cc|url4\.eu|twit\.ac|su\.pr|twurl\.nl|snipurl\.com|short\.to|BudURL\.com|ping\.fm|post\.ly|Just\.as|bkite\.com|snipr\.com|fic\.kr|loopt\.us|doiop\.com|short\.ie|kl\.am|wp\.me|rubyurl\.com|om\.ly|to\.ly|bit\.do|t\.co|lnkd\.in|db\.tt|qr\.ae|adf\.ly|bitly\.com|cur\.lv|tinyurl\.com|ow\.ly|bit\.ly|ity\.im|q\.gs|is\.gd|po\.st|bc\.vc|twitthis\.com|u\.to|j\.mp|buzurl\.com|cutt\.us|u\.bb|yourls\.org|prettylinkpro\.com|scrnch\.me|filoops\.info|vzturl\.com|qr\.net|1url\.com|tweez\.me|v\.gd|tr\.im|link\.zip\.net',
        url)
    return 1 if match else 0

def count_https(url):
    return url.count('https')

def count_http(url):
    return url.count('http')

def count_per(url):
    return url.count('%')

def count_ques(url):
    return url.count('?')

def count_hyphen(url):
    return url.count('-')

def count_equal(url):
    return url.count('=')

def url_length(url):
    return len(url)

def hostname_length(url):
    try:
        return len(url.split('/')[2])
    except IndexError:
        return 0

def suspicious_words(url):
    return int('security' in url or 'confirm' in url or 'bank' in url)

def digit_count(url):
    digits = [i for i in url if i.isdigit()]
    return len(digits)

def letter_count(url):
    letters = [i for i in url if i.isalpha()]
    return len(letters)

def fd_length(url):
    try:
        return len(url.split('/')[3])
    except IndexError:
        return 0

def tld_length(tld):
    return len(tld) if tld else 0

# Cargar el modelo guardado
model = tf.keras.models.load_model('url_model.h5')

# Mapear etiquetas de texto a valores numéricos
label_mapping = {'benign': 0, 'defacement': 1, 'phishing': 2, 'malware': 3}
reverse_label_mapping = {v: k for k, v in label_mapping.items()}

# Definir la función para predecir la clase de una URL
def predict_url(url, model):
    features = pd.Series([
        having_ip_address(url),
        abnormal_url(url),
        count_dot(url),
        count_www(url),
        count_atrate(url),
        no_of_dir(url),
        no_of_embed(url),
        shortening_service(url),
        count_https(url),
        count_http(url),
        count_per(url),
        count_ques(url),
        count_hyphen(url),
        count_equal(url),
        url_length(url),
        hostname_length(url),
        suspicious_words(url),
        digit_count(url),
        letter_count(url),
        fd_length(url),
        tld_length(get_tld(url, fail_silently=True))
    ])
    features = features.values.reshape(1, -1)
    prediction = model.predict(features)
    return reverse_label_mapping[np.argmax(prediction[0])]

# Probar el modelo con una nueva URL
new_url = "https://www.tensorflow.org/guide/keras/sequential_model?hl=es-419"
predicted_class = predict_url(new_url, model)
print(f"La URL {new_url} es clasificada como: {predicted_class}")
