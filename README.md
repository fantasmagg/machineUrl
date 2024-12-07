# Modelo de predicción de URLs y PDFs. 
---

## Descripción del Proyecto

Este proyecto presenta un modelo de Inteligencia Artificial diseñado para evaluar URLs y archivos PDF, prediciendo su categoría como Benigna, Deficiente, Malware o Phishing. Este modelo está entrenado para ayudar a identificar y mitigar amenazas potenciales en la web, proporcionando una herramienta eficaz para la ciberseguridad.

## ¿Cómo Funciona?

### Evaluación de URLs

El modelo de IA analiza características específicas de las URLs, tales como patrones en el dominio, subdominios, longitud de la URL, presencia de ciertos caracteres, entre otros. Utiliza técnicas de aprendizaje supervisado para clasificar las URLs en una de las siguientes categorías:

- **Benigna**: URLs seguras y legítimas.
- **Deficiente**: URLs que pueden tener problemas menores o estar mal formadas, pero no representan una amenaza significativa.
- **Malware**: URLs que alojan software malicioso diseñado para dañar o infiltrarse en sistemas informáticos.
- **Phishing**: URLs diseñadas para engañar a los usuarios y robar información confidencial.

### Evaluación de Archivos PDF

El modelo también puede analizar archivos PDF para determinar si son malignos o no. Utiliza técnicas de análisis de contenido y estructura del PDF para detectar características asociadas con documentos maliciosos.

#### Proceso de Predicción para URLs

1. **Extracción de Características**: Se extraen diversas características de la URL para su análisis.
2. **Preprocesamiento de Datos**: Las características extraídas se normalizan y se preparan para el modelo.
3. **Clasificación**: El modelo aplica técnicas de machine learning para clasificar la URL en una de las cuatro categorías.
4. **Resultado**: Se devuelve la categoría predicha junto con una probabilidad asociada a la predicción.

#### Proceso de Predicción para PDFs

1. **Extracción de Características**: Se extraen características del contenido y estructura del archivo PDF.
2. **Preprocesamiento de Datos**: Las características extraídas se normalizan y se preparan para el modelo.
3. **Clasificación**: El modelo aplica técnicas de machine learning para clasificar el PDF como maligno o benigno.
4. **Resultado**: Se devuelve la categoría predicha junto con una probabilidad asociada a la predicción.

## Datos Utilizados para Entrenamiento

Para entrenar el modelo, se utilizó un conjunto de datos compuesto por:

### URLs

- **Cantidad Total de Datos**: 1,130,123 URLs.
- **Distribución de Categorías**:
  - **Benigna**: 791,086 URLs
  - **Deficiente**: 226,025 URLs
  - **Malware**: 57,132 URLs
  - **Phishing**: 55,474 URLs

### PDFs

- **Cantidad Total de Datos**: 20,210 PDFs.
- **Distribución de Categorías**:
  - **Benigna**: 11,101 PDFs
  - **Maligno**: 9,109 PDFs

### Origen de los Datos

Los datos fueron recolectados de varias fuentes confiables que incluyen:
- Bases de datos públicas de amenazas cibernéticas.
- Listas blancas y negras de URLs y PDFs.
- Herramientas de análisis de seguridad web y documentos.

## Motivación del Proyecto

La proliferación de amenazas cibernéticas como el phishing, el malware y documentos PDF maliciosos representa un riesgo significativo para usuarios y organizaciones. Este proyecto se desarrolló con el objetivo de:

- **Mejorar la Seguridad en Línea**: Proporcionar una herramienta automática para la detección temprana de amenazas web y de documentos.
- **Reducir el Riesgo de Ciberataques**: Identificar y prevenir accesos a URLs y archivos PDF maliciosos.
- **Facilitar el Análisis de URLs y PDFs**: Proveer un sistema rápido y preciso para evaluar la seguridad de URLs y documentos PDF.

## Problema que Resuelve

Este modelo aborda varios problemas críticos en la ciberseguridad:

- **Prevención de Phishing**: Ayuda a prevenir ataques de phishing al identificar y bloquear URLs sospechosas.
- **Detección de Malware**: Identifica URLs y archivos PDF que hospedan malware, protegiendo a los usuarios de posibles infecciones.
- **Evaluación de URLs y PDFs**: Facilita la tarea de evaluar URLs y PDFs, reduciendo la carga de trabajo manual en equipos de seguridad.


Esperamos que este proyecto sea útil y contribuya a un entorno web más seguro.

¡Gracias por tu interés y colaboración!
