// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const getStartedBtn = document.getElementById('getStartedBtn');
const userWelcome = document.querySelector('.user-welcome');

// Backend URL - Update this to your Heroku URL when deployed
const BACKEND_URL = 'http://localhost:3000'; // Local development
// const BACKEND_URL = 'https://proscript.herokuapp.com'; // Production

// Hide welcome message initially
userWelcome.style.display = 'none';

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');
    
    if (token && storedUserName) {
        loginBtn.style.display = 'none';
        userWelcome.style.display = 'inline-flex';
        document.querySelector('.user-name').textContent = storedUserName;
    }
    
    // Initialize the generator section
    initializeGenerator();
});

// Login functionality
loginBtn.addEventListener('click', function() {
    // For demo purposes, we'll use a simple prompt
    // In a real app, you'd have a proper login form
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    
    if (email && password) {
        // Mock login - in a real app, you'd verify with the backend
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('userName', email.split('@')[0]);
        
        loginBtn.style.display = 'none';
        userWelcome.style.display = 'inline-flex';
        document.querySelector('.user-name').textContent = email.split('@')[0];
    }
});

// Logout functionality
logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    
    loginBtn.style.display = 'inline-block';
    userWelcome.style.display = 'none';
});

// Get Started button
getStartedBtn.addEventListener('click', function() {
    document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });
});

// Initialize the generator section
function initializeGenerator() {
    const generatorSection = document.querySelector('#generator .generator-container');
    
    // Create the generator UI
    generatorSection.innerHTML = `
        <h2 class="section-title">AI Document Generator</h2>
        <div class="generator-form">
            <div class="form-group">
                <label for="documentType">Document Type</label>
                <select id="documentType" class="form-control">
                    <option value="business-proposal">Business Proposal</option>
                    <option value="report">Business Report</option>
                    <option value="letter">Professional Letter</option>
                    <option value="email">Business Email</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="documentPrompt">What do you need?</label>
                <textarea id="documentPrompt" class="form-control" rows="4" 
                    placeholder="Describe what you need (e.g., 'A business proposal for a new software product targeting small businesses')"></textarea>
            </div>
            
            <div class="form-group options">
                <div class="option-item">
                    <input type="checkbox" id="includeCharts" checked>
                    <label for="includeCharts">Include Charts</label>
                </div>
                <div class="option-item">
                    <input type="checkbox" id="includeImages" checked>
                    <label for="includeImages">Include Images</label>
                </div>
            </div>
            
            <button id="generateBtn" class="btn">Generate Document</button>
        </div>
        
        <div class="document-preview">
            <h3>Preview</h3>
            <div id="previewContent" class="preview-container">
                <p class="placeholder-text">Your generated document will appear here...</p>
            </div>
            <button id="downloadBtn" class="btn btn-outline" disabled>Download as PDF</button>
        </div>
    `;
    
    // Add event listener for the generate button
    document.getElementById('generateBtn').addEventListener('click', generateDocument);
    
    // Add event listener for the download button
    document.getElementById('downloadBtn').addEventListener('click', downloadDocument);
}

// Generate document function
async function generateDocument() {
    const documentType = document.getElementById('documentType').value;
    const prompt = document.getElementById('documentPrompt').value;
    const includeCharts = document.getElementById('includeCharts').checked;
    const includeImages = document.getElementById('includeImages').checked;
    
    if (!prompt) {
        alert('Please describe what you need in your document.');
        return;
    }
    
    // Show loading state
    const previewContent = document.getElementById('previewContent');
    previewContent.innerHTML = '<p class="loading">Generating your document...</p>';
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/generate-document`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                documentType,
                prompt,
                includeCharts,
                includeImages
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Display the generated content
            displayGeneratedDocument(data.data);
            
            // Enable the download button
            document.getElementById('downloadBtn').disabled = false;
        } else {
            previewContent.innerHTML = `<p class="error">Error: ${data.message}</p>`;
        }
    } catch (error) {
        console.error('Error generating document:', error);
        previewContent.innerHTML = '<p class="error">Failed to generate document. Please try again.</p>';
    }
}

// Display the generated document
function displayGeneratedDocument(data) {
    const previewContent = document.getElementById('previewContent');
    
    // For demo purposes, we'll create a simple document preview
    // In a real app, you'd format this properly based on the document type
    let content = `
        <div class="generated-document">
            <h1>${data.documentType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h1>
            <p>${data.generatedContent}</p>
    `;
    
    if (data.includeCharts) {
        content += `
            <div class="chart-placeholder">
                <img src="${BACKEND_URL}/placeholder?width=600&height=300&text=Sample Chart" alt="Sample Chart">
            </div>
        `;
    }
    
    if (data.includeImages) {
        content += `
            <div class="image-placeholder">
                <img src="${BACKEND_URL}/placeholder?width=600&height=400&text=Sample Image" alt="Sample Image">
            </div>
        `;
    }
    
    content += `</div>`;
    previewContent.innerHTML = content;
}

// Download document function
function downloadDocument() {
    alert('In a complete implementation, this would download the document as a PDF.');
    // In a real app, you would:
    // 1. Either generate a PDF on the backend and download it
    // 2. Or use a library like jsPDF to create a PDF from the HTML content
}
