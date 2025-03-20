// Global variables
const BACKEND_URL = 'https://proscript-44c78bc26a5f.herokuapp.com';

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
  console.log("Document loaded, connecting to backend:", BACKEND_URL);
  
  // Test backend connection
  testBackendConnection();
  
  // Add event listener to generate button
  const generateBtn = document.getElementById('generateBtn');
  if (generateBtn) {
    generateBtn.addEventListener('click', generateDocument);
  }
});

function testBackendConnection() {
  console.log("Testing backend connection...");
  
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
}

function generateDocument() {
  // Get form values
  const documentType = document.getElementById('documentType').value;
  const promptInput = document.getElementById('promptInput') || document.querySelector('textarea');
  const prompt = promptInput ? promptInput.value : "Sample document";
  
  console.log("Generating document with:", { documentType, prompt });
  
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
      title: "Sample Document", 
      description: prompt,
      additionalInfo: "Generated from ProScript"
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
    alert("Document generated successfully!");
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
