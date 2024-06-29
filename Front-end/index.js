document.getElementById('url-checker').addEventListener('submit', function(e) {
  e.preventDefault();
  const url = document.getElementById('url').value.trim();
  //const apiUrl = 'http://127.0.0.1:5000/predict'; // Replace with your Flask API URL

  if (url === '') {
    displayErrorMessage('Por favor, ingrese una URL.');
    return;
  }

  const payload = { url: url };

  fetch('http://127.0.0.1:5000/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    createPopup(data);
  })
  .catch(error => {
    console.error('Error:', error);
    displayErrorMessage('Error al verificar la URL. Por favor, inténtelo de nuevo.');
  });
});

document.getElementById('verify-pdf').addEventListener('click', function() {
  const pdfFile = document.getElementById('pdf').files[0];
  if (!pdfFile) {
    displayErrorMessage('Seleccione un archivo PDF.');
    return;
  }

  const formData = new FormData();
  formData.append('file', pdfFile);

 // const apiUrl = 'http://127.0.0.1:5000/analizarpdf'; // Replace with your Flask API endpoint for PDF prediction

  fetch('http://127.0.0.1:5000/analizarpdf', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    createPopup2(data)
  })
  .catch(error => {
    console.error('Error:', error);
    displayErrorMessage('Error al verificar el archivo PDF. Por favor, inténtelo de nuevo.');
  });
});


function createPopup2(data) {
  const popupContainer = document.getElementById('popup-container');
  popupContainer.innerHTML = ''; // Clear previous popup

  const { file, prediction } = data;
  const popup = document.createElement('div');
  popup.classList.add('popup');

  let iconClass, messageClass, bgColor, borderColor, iconColor, message;
  switch(prediction) {
    case 'clean':
      iconClass = 'success-icon';
      messageClass = 'success-message';
      bgColor = '#edfbd8';
      borderColor = '#84d65a';
      iconColor = '#84d65a';
      message = 'El PDF esta limpia.';
      break;

    case 'malware':
      iconClass = 'malware-icon';
      messageClass = 'malware-message';
      bgColor = '#ffe6e6';
      borderColor = '#e60000';
      iconColor = '#e60000';
      message = 'El PDF contiene malware.';
      break;
    default:
      return;
  }

  popup.style.backgroundColor = bgColor;
  popup.style.borderColor = borderColor;



  popup.innerHTML = `
    <div class="popup-icon ${iconClass}">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${iconClass}-svg">
        <!-- Add the appropriate SVG based on the icon -->
      </svg>
    </div>
    <div class="${messageClass}">
      ${message}
      <ul class="">${file}</ul>
    </div>
    <div class="popup-icon close-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="close-svg">
        <path d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z" class="close-path"></path>
      </svg>
    </div>
  `;

  popup.querySelector('.close-svg').addEventListener('click', () => {
    popupContainer.innerHTML = '';
  });

  popupContainer.appendChild(popup);
}

function createPopup(data) {
  const popupContainer = document.getElementById('popup-container');
  popupContainer.innerHTML = ''; // Clear previous popup

  const { url, prediction, probabilities } = data;
  const popup = document.createElement('div');
  popup.classList.add('popup');

  let iconClass, messageClass, bgColor, borderColor, iconColor, message;
  switch(prediction) {
    case 'benign':
      iconClass = 'success-icon';
      messageClass = 'success-message';
      bgColor = '#edfbd8';
      borderColor = '#84d65a';
      iconColor = '#84d65a';
      message = 'La URL es benigna.';
      break;
    case 'defacement':
      iconClass = 'alert-icon';
      messageClass = 'alert-message';
      bgColor = '#fefce8';
      borderColor = '#facc15';
      iconColor = '#facc15';
      message = 'La URL es de desfiguración.';
      break;
    case 'phishing':
      iconClass = 'error-icon';
      messageClass = 'error-message';
      bgColor = '#fef2f2';
      borderColor = '#007bff'; // Blue color for phishing
      iconColor = '#007bff';
      message = 'La URL es un intento de phishing.';
      break;
    case 'malware':
      iconClass = 'malware-icon';
      messageClass = 'malware-message';
      bgColor = '#ffe6e6';
      borderColor = '#e60000';
      iconColor = '#e60000';
      message = 'La URL contiene malware.';
      break;
    default:
      return;
  }

  popup.style.backgroundColor = bgColor;
  popup.style.borderColor = borderColor;

  const probabilityList = Object.entries(probabilities).map(([key, value]) => {
    let colorClass;
    switch(key) {
      case 'benign':
        colorClass = 'probability-benign';
        break;
      case 'defacement':
        colorClass = 'probability-defacement';
        break;
      case 'phishing':
        colorClass = 'probability-phishing';
        break;
      case 'malware':
        colorClass = 'probability-malware';
        break;
    }
    return `<li class="${colorClass}">${key}: ${value}%</li>`;
  }).join('');

  popup.innerHTML = `
    <div class="popup-icon ${iconClass}">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${iconClass}-svg">
        <!-- Add the appropriate SVG based on the icon -->
      </svg>
    </div>
    <div class="${messageClass}">
      ${message}
      <ul class="probabilities-list">${probabilityList}</ul>
    </div>
    <div class="popup-icon close-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="close-svg">
        <path d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z" class="close-path"></path>
      </svg>
    </div>
  `;

  popup.querySelector('.close-svg').addEventListener('click', () => {
    popupContainer.innerHTML = '';
  });

  popupContainer.appendChild(popup);
}

function displayErrorMessage(message) {
  const popupContainer = document.getElementById('popup-container');
  popupContainer.innerHTML = ''; // Clear previous popup

  const popup = document.createElement('div');
  popup.classList.add('popup', 'error-popup');
  popup.innerHTML = `
    <div class="popup-icon error-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="error-icon-svg">
        <!-- Add the appropriate SVG based on the icon -->
      </svg>
    </div>
    <div class="error-message">
      ${message}
    </div>
    <div class="popup-icon close-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="close-svg">
        <path d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z" class="close-path"></path>
      </svg>
    </div>
  `;

  popup.querySelector('.close-svg').addEventListener('click', () => {
    popupContainer.innerHTML = '';
  });

  popupContainer.appendChild(popup);
}
