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
// scripts.js - Add this to your GitHub repository

// Backend URL - make sure this points to your Heroku app
const BACKEND_URL = 'https://proscript-44c78bc26a5f.herokuapp.com';

// Connect to backend when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log("Document loaded, connecting to backend:", BACKEND_URL);
  
  // Check if backend is running
  fetch(`${BACKEND_URL}/api/health`)
    .then(response => response.json())
    .then(data => {
      console.log("Backend connection successful:", data);
      alert("Backend connection successful! Server is running.");
    })
    .catch(error => {
      console.error("Error connecting to backend:", error);
      alert("Error connecting to backend: " + error);
    });
  
  // Set up event listeners
  setupEventListeners();
});

function setupEventListeners() {
  // Get Started button
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
  
  // Advanced Options toggle
  const advancedToggleBtn = document.getElementById('advancedToggleBtn');
  const advancedOptions = document.getElementById('advancedOptions');
  if (advancedToggleBtn && advancedOptions) {
    advancedToggleBtn.addEventListener('click', function() {
      if (advancedOptions.style.display === 'block') {
        advancedOptions.style.display = 'none';
      } else {
        advancedOptions.style.display = 'block';
      }
    });
  }
  
  // Generate Document button
  const generateBtn = document.getElementById('generateBtn');
  if (generateBtn) {
    generateBtn.addEventListener('click', generateDocument);
  }
  
  // Copy button
  const copyBtn = document.getElementById('copyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
      const resultPreview = document.getElementById('resultPreview');
      if (resultPreview) {
        navigator.clipboard.writeText(resultPreview.innerText)
          .then(() => alert('Document copied to clipboard!'))
          .catch(err => console.error('Failed to copy: ', err));
      }
    });
  }
}

function generateDocument() {
  // Get form values
  const documentType = document.getElementById('documentType').value;
  const prompt = document.getElementById('promptInput').value;
  const tone = document.getElementById('toneSelect')?.value || 'professional';
  const length = document.getElementById('lengthSelect')?.value || 'standard';
  const includeCharts = document.getElementById('includeCharts')?.checked || false;
  const includeImages = document.getElementById('includeImages')?.checked || false;
  
  // Validate input
  if (!prompt) {
    alert('Please describe your document.');
    return;
  }
  
  // Create request data
  const requestData = {
    documentType,
    prompt,
    tone,
    length,
    includeCharts,
    includeImages
  };
  
  console.log("Generating document with:", requestData);
  
  // Show loading overlay
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.style.display = 'flex';
  }
  
  // Send request to backend
  fetch(`${BACKEND_URL}/api/generate-document`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData)
  })
  .then(response => response.json())
  .then(data => {
    // Hide loading overlay
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
    
    console.log("Document generated successfully:", data);
    
    // Display the generated document
    displayGeneratedDocument(data);
  })
  .catch(error => {
    // Hide loading overlay
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
    
    console.error("Error generating document:", error);
    alert("Error generating document. Please try again.");
  });
}

function displayGeneratedDocument(data) {
  const resultContainer = document.getElementById('resultContainer');
  const resultPreview = document.getElementById('resultPreview');
  
  if (!resultContainer || !resultPreview) {
    console.error("Result container or preview not found");
    return;
  }
  
  // Create document HTML
  let documentHTML = `<div class="result-document">`;
  
  // Add title
  documentHTML += `<h1 class="document-title">${data.type || 'Generated Document'}</h1>`;
  
  // Add content
  documentHTML += data.content;
  
  documentHTML += `</div>`;
  
  // Set the HTML
  resultPreview.innerHTML = documentHTML;
  
  // Show the result container
  resultContainer.style.display = 'block';
  
  // Scroll to result
  resultContainer.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

// Example prompt function
window.useExamplePrompt = function(index) {
  const examplePrompts = [
    "Create a business proposal for a new eco-friendly packaging solution for a food delivery company.",
    "Develop a marketing plan for launching a new fitness app targeting working professionals aged 25-40."
  ];
  
  const promptInput = document.getElementById('promptInput');
  if (promptInput && index >= 1 && index <= examplePrompts.length) {
    promptInput.value = examplePrompts[index-1];
  }
};
// env.js
const BACKEND_URL = 'https://proscript-44c78bc26a5f.herokuapp.com';
