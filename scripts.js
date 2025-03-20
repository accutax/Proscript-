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
});

function generateDocument() {
  // Get form values
  const documentType = document.getElementById('documentType').value;
  const prompt = document.getElementById('promptInput')?.value || document.querySelector('textarea')?.value || "Sample document";
  const includeCharts = document.getElementById('includeCharts')?.checked || false;
  const includeImages = document.getElementById('includeImages')?.checked || false;
  
  console.log("Generating document with:", { documentType, prompt, includeCharts, includeImages });
  
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
# Make sure you're in your GitHub repository directory
touch scripts.js
# Copy the scripts.js code above into this file
git add scripts.js
git commit -m "Add scripts.js with correct backend URL"
git push origin master
