
//Nuevo
document.getElementById('selector').addEventListener('change', function(e) {
  const urlField = document.querySelector('.url');
  const pdfField = document.querySelector('.pdf');
  const emailField = document.querySelector('.email');
  
  urlField.classList.add('hidden');
  pdfField.classList.add('hidden');
  emailField.classList.add('hidden');
  
  switch (e.target.value) {
    case 'url':
      urlField.classList.remove('hidden');
      break;
    case 'pdf':
      pdfField.classList.remove('hidden');
      break;
    case 'email':
      emailField.classList.remove('hidden');
      break;
  }
});

document.getElementById('btn-analyzer').addEventListener('click', function(e) {
  e.preventDefault();
console.log("funciona")
  const analyzerType = document.getElementById('selector').value;

  if (analyzerType === 'url') {
    analyzeUrl();
    console.log("url")
  } else if (analyzerType === 'pdf') {
   analyzePdf();
   console.log("pdf")
  }
  else if(analyzerType === 'email'){
    analyzeEmail();
  }

});

function analyzeUrl() {
  const url = document.getElementById('url').value.trim();

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
}

function analyzeEmail() {
  const email = document.getElementById('email').value.trim();

  if (email === '') {
    displayErrorMessage('Por favor, ingrese una URL.');
    return;
  }

  const payload = { email: email };

  fetch('http://127.0.0.1:5000/predict_email', {
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
    createPopupEmail(data);
  })
  .catch(error => {
    console.error('Error:', error);
    displayErrorMessage('Error al verificar la URL. Por favor, inténtelo de nuevo.');
  });
}


function analyzePdf() {
  const pdfFile = document.getElementById('pdf').files[0];

  if (!pdfFile) {
    displayErrorMessage('Seleccione un archivo PDF.');
    return;
  }

  const formData = new FormData();
  formData.append('file', pdfFile);

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
    createPopup2(data);
  })
  .catch(error => {
    console.error('Error:', error);
    displayErrorMessage('Error al verificar el archivo PDF. Por favor, inténtelo de nuevo.');
  });
}

function createPopup(data) {
  const popupContainer = document.getElementById('popup-container');
  popupContainer.innerHTML = ''; // Clear previous popup

  const { url, prediction, probabilities } = data;

  const popup = document.createElement('div');
  popup.classList.add('popup');


  popup.innerHTML = `
    <div class="w-full max-w-4xl border-teal-400 border-2  rounded-3xl px-4 md:px-6 py-12 md:py-16 md:ml-8 ">
    <i class="fa-solid fa-circle-xmark close-svg"></i>
      <h2 class="text-2xl md:text-3xl font-bold text-center mb-6 text-primary">Analysis Results</h2>
      <div class=" rounded-lg shadow-lg p-6 md:p-8">
        <div class="relative w-full overflow-auto">
          <table class="w-full caption-bottom text-sm">
            <thead class="[&amp;_tr]:border-b">
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">Metricas</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">Valores</th>
              </tr>
            </thead>
            <tbody class="[&amp;_tr:last-child]:border-0">
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">URL</td>
                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">${url}</td>
              </tr>
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Prediction</td>
                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">${prediction}</td>
              </tr>
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Benign</td>
                <td class="p-4 text-green align-middle [&amp;:has([role=checkbox])]:pr-0">${(parseFloat(probabilities.benign) * 100).toFixed(2)}%</td>
              </tr>
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Defacement</td>
                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">${(parseFloat(probabilities.defacement) * 100).toFixed(2)}%</td>
              </tr>
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Malware</td>
                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">${(parseFloat(probabilities.malware) * 100).toFixed(2)}%</td>
              </tr>
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Phishing</td>
                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">${(parseFloat(probabilities.phishing) * 100).toFixed(2)}%</td>
              </tr>
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  popup.querySelector('.close-svg').addEventListener('click', () => {
    popupContainer.innerHTML = '';
  });

  popupContainer.appendChild(popup);
}

function createPopupEmail(data) {
  const popupContainer = document.getElementById('popup-container');
  popupContainer.innerHTML = ''; // Clear previous popup

  const { probabilities } = data;

  const popup = document.createElement('div');
  popup.classList.add('popup');


  popup.innerHTML = `
    <div class="w-full max-w-4xl border-teal-400 border-2  rounded-3xl px-4 md:px-6 py-12 md:py-16 md:ml-8 ">
    <i class="fa-solid fa-circle-xmark close-svg"></i>
      <h2 class="text-2xl md:text-3xl font-bold text-center mb-6 text-primary">Analysis Results</h2>
      <div class=" rounded-lg shadow-lg p-6 md:p-8">
        <div class="relative w-full overflow-auto">
          <table class="w-full caption-bottom text-sm">
            <thead class="[&amp;_tr]:border-b">
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">Metricas</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">Valores</th>
              </tr>
            </thead>
            <tbody class="[&amp;_tr:last-child]:border-0">
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Resultado</td>
                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">${probabilities}</td>
              </tr>
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  popup.querySelector('.close-svg').addEventListener('click', () => {
    popupContainer.innerHTML = '';
  });

  popupContainer.appendChild(popup);
}

function createPopup2(data) {
  const popupContainer = document.getElementById('popup-container');
  popupContainer.innerHTML = ''; // Clear previous popup

  const { file, prediction } = data;
  const popup = document.createElement('div');
  popup.classList.add('popup');

  popup.innerHTML = `


  <div class="w-full max-w-4xl px-4 md:px-6   rounded-3xl rounded-3xl py-12 md:py-16 md:ml-8 ">
    <i class="fa-solid fa-circle-xmark close-svg"></i>
      <h2 class="text-white text-2xl md:text-3xl font-bold text-center mb-6 text-primary">Analysis Results</h2>
      <div class="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div class="relative w-full overflow-auto">
          <table class="w-full caption-bottom text-sm">
            <thead class="[&amp;_tr]:border-b">
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">Metricas</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">Valores</th>
              </tr>
            </thead>
            <tbody class="[&amp;_tr:last-child]:border-0">
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">File Name</td>
                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">${file}</td>
              </tr>
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td class="p-4 align-middle ${prediction == "clean" ? "text-green-600" : "text-red-600"} [&amp;:has([role=checkbox])]:pr-0">Prediction</td>
                <td class="p-4 align-middle ${prediction == "clean" ? "text-green-600" : "text-red-600"} [&amp;:has([role=checkbox])]:pr-0">${prediction}</td>
              </tr>
           
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"></tr>
            </tbody>
          </table>
        </div>
      </div>
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
