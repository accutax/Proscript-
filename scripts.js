// Global variables
const BACKEND_URL = 'https://proscript-44c78bc26a5f.herokuapp.com';

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
  console.log("Document loaded, connecting to backend:", BACKEND_URL);
  
  // Test backend connection
  fetch(`${BACKEND_URL}/api/health`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Backend connection successful:", data);
      alert("Backend connection successful! Server is running.");
    })
    .catch(error => {
      console.error("Backend connection failed:", error);
      alert("Error connecting to backend: " + error.message);
    });
  
  // Add event listener to generate button
  const generateBtn = document.getElementById('generateBtn');
  if (generateBtn) {
    generateBtn.addEventListener('click', generateDocument);
  }
  
  // Add event listener to Get Started button
  const getStartedBtn = document.getElementById('getStartedBtn');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', function() {
      const generatorSection = document.getElementById('generator');
      if (generatorSection) {
        generatorSection.style.display = 'block';
        window.scrollTo({
          top: generatorSection.offsetTop - 20,
          behavior: 'smooth'
        });
      }
    });
  }
});

function generateDocument() {
  // Get form values
  const documentType = document.getElementById('documentType').value;
  const promptInput = document.getElementById('promptInput');
  const prompt = promptInput ? promptInput.value : document.querySelector('textarea').value;
  
  // Get advanced options if they exist
  let tone = 'professional';
  let length = 'standard';
  let includeCharts = true;
  let includeImages = true;
  
  const toneSelect = document.getElementById('toneSelect');
  if (toneSelect) tone = toneSelect.value;
  
  const lengthSelect = document.getElementById('lengthSelect');
  if (lengthSelect) length = lengthSelect.value;
  
  const chartsCheckbox = document.getElementById('includeCharts');
  if (chartsCheckbox) includeCharts = chartsCheckbox.checked;
  
  const imagesCheckbox = document.getElementById('includeImages');
  if (imagesCheckbox) includeImages = imagesCheckbox.checked;
  
  // Validate input
  if (!prompt || prompt.trim() === '') {
    alert('Please describe your document.');
    return;
  }
  
  console.log("Generating document with:", { 
    documentType, 
    prompt, 
    tone, 
    length, 
    includeCharts, 
    includeImages 
  });
  
  // Show loading indicator
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.style.display = 'flex';
  }
  
  // Send to backend
  fetch(`${BACKEND_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      documentType, 
      prompt,
      options: {
        tone,
        length,
        includeCharts,
        includeImages
      }
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Document generated successfully:", data);
    
    // Hide loading
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
    
    // Display the result
    displayGeneratedDocument(data);
  })
  .catch(error => {
    console.error("Error generating document:", error);
    
    // Hide loading
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
    
    alert("Error generating document: " + error.message);
  });
}

function displayGeneratedDocument(data) {
  const resultContainer = document.getElementById('resultContainer');
  const resultPreview = document.getElementById('resultPreview');
  
  if (!resultContainer || !resultPreview) {
    alert("Document generated successfully! However, the display area couldn't be found.");
    return;
  }
  
  // Create HTML content from the generated document
  let content = `<div class="result-document">`;
  
  // Add title
  content += `<h1 class="document-title">${data.title}</h1>`;
  
  // Add content (convert newlines to <br> tags)
  content += `<div class="document-content">${data.content.replace(/\n/g, '<br>')}</div>`;
  
  content += `</div>`;
  
  // Insert the content
  resultPreview.innerHTML = content;
  
  // Show the result container
  resultContainer.style.display = 'block';
  
  // Scroll to the result
  resultContainer.scrollIntoView({ behavior: 'smooth' });
  
  // Set up download buttons
  setupDownloadButtons(data);
}

function setupDownloadButtons(data) {
  const copyBtn = document.getElementById('copyBtn');
  const downloadWordBtn = document.getElementById('downloadWordBtn');
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  
  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
      navigator.clipboard.writeText(data.content)
        .then(() => alert('Content copied to clipboard!'))
        .catch(() => alert('Failed to copy content. Please try again.'));
    });
  }
  
  if (downloadWordBtn) {
    downloadWordBtn.addEventListener('click', function() {
      window.location.href = `${BACKEND_URL}/api/download?id=${data.id}&format=docx`;
    });
  }
  
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', function() {
      window.location.href = `${BACKEND_URL}/api/download?id=${data.id}&format=pdf`;
    });
  }
}
