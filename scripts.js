// Backend URL - Change this to your actual Heroku backend URL
const BACKEND_URL = 'https://proscript-44c78bc26a5f.herokuapp.com';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const getStartedBtn = document.getElementById('getStartedBtn');
    const generatorSection = document.getElementById('generator');
    const generateBtn = document.getElementById('generateBtn');
    const resultContainer = document.getElementById('resultContainer');
    const resultPreview = document.getElementById('resultPreview');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const connectionModal = document.getElementById('connectionModal');
    const connectionModalTitle = document.getElementById('connectionModalTitle');
    const connectionModalMessage = document.getElementById('connectionModalMessage');
    const connectionModalBtn = document.getElementById('connectionModalBtn');
    const closeConnectionModal = document.getElementById('closeConnectionModal');
    const loginBtn = document.getElementById('loginBtn');
    const userWelcome = document.getElementById('userWelcome');
    const userName = document.getElementById('userName');
    const logoutLink = document.getElementById('logoutLink');

    // Check backend connection on page load
    checkBackendConnection();

    // Event Listeners
    getStartedBtn.addEventListener('click', function() {
        generatorSection.style.display = 'block';
        window.scrollTo({
            top: generatorSection.offsetTop - 20,
            behavior: 'smooth'
        });
    });

    generateBtn.addEventListener('click', generateDocument);

    copyBtn.addEventListener('click', function() {
        const content = resultPreview.innerText;
        navigator.clipboard.writeText(content)
            .then(() => showNotification('Document copied to clipboard!', 'success'))
            .catch(() => showNotification('Failed to copy content', 'error'));
    });

    downloadBtn.addEventListener('click', function() {
        const content = resultPreview.innerHTML;
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('Document downloaded successfully!');
    });

    connectionModalBtn.addEventListener('click', function() {
        connectionModal.style.display = 'none';
    });

    closeConnectionModal.addEventListener('click', function() {
        connectionModal.style.display = 'none';
    });

    // Simulated login functionality
    loginBtn.addEventListener('click', function() {
        // In a real app, this would show a login form
        simulateLogin();
    });

    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginBtn.style.display = 'inline-block';
        userWelcome.style.display = 'none';
        alert('You have been logged out');
    });

    // Functions
    function checkBackendConnection() {
        loadingOverlay.style.display = 'flex';
        loadingText.textContent = 'Connecting to backend...';

        fetch(`${BACKEND_URL}/api/status`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Backend server not responding properly');
                }
                return response.json();
            })
            .then(data => {
                loadingOverlay.style.display = 'none';

                // Show success modal
                connectionModalTitle.textContent = 'Backend Connection Successful';
                connectionModalMessage.textContent = 'Server is running. You can now generate documents.';
                connectionModal.style.display = 'flex';

                // Update login status if user is logged in
                if (data.user) {
                    loginBtn.style.display = 'none';
                    userWelcome.style.display = 'flex';
                    userName.textContent = data.user.name || 'User';
                }
            })
            .catch(error => {
                loadingOverlay.style.display = 'none';

                // Show error modal
                connectionModalTitle.textContent = 'Connection Error';
                connectionModalMessage.textContent = 'Error connecting to backend: Failed to fetch. Please make sure the server is running.';
                connectionModal.style.display = 'flex';

                console.error('Backend connection error:', error);
            });
    }

    // Modify this function in your scripts.js file
function generateDocument(documentType, prompt, includeCharts, includeImages) {
  console.log("Generating document with:", { documentType, prompt, includeCharts, includeImages });
  
  // Show loading indicator
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) loadingOverlay.style.display = 'flex';
  
  // Send request to backend
  return fetch(`${BACKEND_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentType, prompt, includeCharts, includeImages })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Received data from server:", data);
    
    // Check if data has the expected structure
    if (!data || !data.content) {
      console.error('Invalid response structure:', data);
      
      // Create default content if missing
      data = {
        success: true,
        content: {
          title: `Generated ${documentType.replace(/-/g, ' ')}`,
          body: `This is a generated document based on: ${prompt}`,
          sections: [
            {
              heading: 'Default Content',
              content: 'The server response was missing the expected content structure.'
            }
          ]
        }
      };
      
      // Log that we're using default content
      console.log('Using default content due to invalid server response');
    }
    
    // Hide loading indicator
    if (loadingOverlay) loadingOverlay.style.display = 'none';
    
    return data;
  })
  .catch(error => {
    console.error("Error generating document:", error);
    
    // Hide loading indicator
    if (loadingOverlay) loadingOverlay.style.display = 'none';
    
    throw error;
  });
}
    function generateDocumentFallback(documentType, prompt, includeCharts, includeImages) {
        // This is a fallback function that generates content on the client side
        // when the backend is not available

        let content = `<div style="font-family: Arial, sans-serif; line-height: 1.6;">`;

        // Add title based on document type
        const title = documentType.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');

        content += `<h1 style="color: #0a192f; text-align: center; margin-bottom: 30px;">${title}</h1>`;

        // Add executive summary
        content += `
            <h2 style="color: #0a192f; margin-top: 30px;">Executive Summary</h2>
            <p>This document was generated based on your prompt: "${prompt}"</p>
            <p>In a real implementation, this would contain AI-generated content specific to your request.</p>
        `;

        // Add some sections based on document type
        if (documentType === 'business-proposal') {
            content += `
                <h2 style="color: #0a192f; margin-top: 30px;">Proposal Overview</h2>
                <p>This business proposal outlines a comprehensive strategy for implementing innovative solutions that address the specific needs mentioned in your prompt.</p>

                <h2 style="color: #0a192f; margin-top: 30px;">Market Analysis</h2>
                <p>A thorough market analysis would be included here, with relevant data and insights specific to your industry and target market.</p>
            `;

            if (includeCharts) {
                content += `
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
                        <h3 style="margin-top: 0;">Market Trend Analysis</h3>
                        <div style="height: 200px; background-color: #e9ecef; display: flex; align-items: center; justify-content: center; border-radius: 4px;">
                            <p>Chart Placeholder: In a real implementation, this would be an actual chart.</p>
                        </div>
                    </div>
                `;
            }
        } else if (documentType === 'marketing-plan') {
            content += `
                <h2 style="color: #0a192f; margin-top: 30px;">Target Audience</h2>
                <p>This section would include a detailed analysis of your target audience, including demographics, psychographics, and behavior patterns.</p>

                <h2 style="color: #0a192f; margin-top: 30px;">Marketing Strategies</h2>
                <p>A comprehensive set of marketing strategies would be outlined here, tailored to your specific goals and target audience.</p>
            `;

            if (includeCharts) {
                content += `
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
                        <h3 style="margin-top: 0;">Marketing Budget Allocation</h3>
                        <div style="height: 200px; background-color: #e9ecef; display: flex; align-items: center; justify-content: center; border-radius: 4px;">
                            <p>Chart Placeholder: In a real implementation, this would be an actual chart.</p>
                        </div>
                    </div>
                `;
            }
        }

        // Add conclusion
        content += `
            <h2 style="color: #0a192f; margin-top: 30px;">Conclusion</h2>
            <p>This document provides a framework for addressing the requirements specified in your prompt. In a full implementation, it would include more detailed content, analysis, and recommendations.</p>
        `;

        content += `</div>`;

        resultPreview.innerHTML = content;
        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth' });
        alert('Document generated (fallback mode)');
    }

    function simulateLogin() {
        loginBtn.style.display = 'none';
        userWelcome.style.display = 'flex';
        userName.textContent = 'User';
        alert('You have been logged in as a demo user');
    }

    // Example prompt functionality
    window.useExamplePrompt = function(index) {
        const examplePrompts = [
            "Create a business proposal for a new eco-friendly packaging solution for a food delivery company.",
            "Develop a marketing plan for launching a new fitness app targeting working professionals aged 25-40."
        ];

        document.getElementById('promptInput').value = examplePrompts[index - 1];
    };

    function showNotification(message, type) {
        alert(message);
    }
});
// In your scripts.js file
function handleGenerateClick() {
  const documentType = document.getElementById('documentType').value;
  const prompt = document.getElementById('promptInput').value;
  const includeCharts = document.getElementById('includeCharts')?.checked || false;
  const includeImages = document.getElementById('includeImages')?.checked || false;
  
  // Try to generate from backend
  generateDocument(documentType, prompt, includeCharts, includeImages)
    .then(data => {
      // Display the generated document
      showResult(documentType, prompt, includeCharts, includeImages);
    })
    .catch(error => {
      console.error("Error from backend:", error);
      
      // Fallback to client-side generation
      console.log("Using client-side fallback generation");
      showResult(documentType, prompt, includeCharts, includeImages);
      
      // Show error message
      alert("Using offline document generation due to server error: " + error.message);
    });
  
  return false;
}
// In your scripts.js file, update the document generation function
function generateDocument(documentType, prompt, includeCharts, includeImages) {
  console.log("Generating document with:", { documentType, prompt, includeCharts, includeImages });
  
  // Show loading indicator
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) loadingOverlay.style.display = 'flex';
  
  // Send request to backend
  return fetch(`${BACKEND_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentType, prompt, includeCharts, includeImages })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Received data from server:", data);
    
    // Check if data contains content
    if (!data || !data.content) {
      throw new Error('No content received from server');
    }
    
    // Hide loading indicator
    if (loadingOverlay) loadingOverlay.style.display = 'none';
    
    return data;
  })
  .catch(error => {
    console.error("Error generating document:", error);
    
    // Hide loading indicator
    if (loadingOverlay) loadingOverlay.style.display = 'none';
    
    throw error;
  });
}
// In your scripts.js file
function handleGenerateClick() {
  const documentType = document.getElementById('documentType').value;
  const prompt = document.getElementById('promptInput').value;
  const includeCharts = document.getElementById('includeCharts')?.checked || false;
  const includeImages = document.getElementById('includeImages')?.checked || false;
  
  // Show loading indicator
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) loadingOverlay.style.display = 'flex';
  
  // Try to generate from backend
  fetch(`${BACKEND_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentType, prompt, includeCharts, includeImages })
  })
  .then(response => response.json())
  .then(data => {
    // Hide loading indicator
    if (loadingOverlay) loadingOverlay.style.display = 'none';
    
    if (data && data.content) {
      // Display the generated document
      showResult(documentType, prompt, includeCharts, includeImages);
    } else {
      // Fallback to client-side generation
      console.log("No content in response, using client-side fallback");
      showResult(documentType, prompt, includeCharts, includeImages);
    }
  })
  .catch(error => {
    console.error("Error from backend:", error);
    
    // Hide loading indicator
    if (loadingOverlay) loadingOverlay.style.display = 'none';
    
    // Fallback to client-side generation
    console.log("Using client-side fallback generation");
    showResult(documentType, prompt, includeCharts, includeImages);
  });
  
  return false;
}
