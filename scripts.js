// Global variables
const BACKEND_URL = 'https://proscript-44c78bc26a5f.herokuapp.com';
let currentUser = null;

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI
    updateUI();
    
    // Event listeners
    document.getElementById('loginBtn').addEventListener('click', showLoginModal);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('getStartedBtn').addEventListener('click', scrollToGenerator);
    document.getElementById('generateBtn').addEventListener('click', generateDocument);
    document.getElementById('advancedToggleBtn').addEventListener('click', toggleAdvancedOptions);
    
    // Copy and download buttons
    if (document.getElementById('copyBtn')) {
        document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
    }
    if (document.getElementById('downloadWordBtn')) {
        document.getElementById('downloadWordBtn').addEventListener('click', downloadAsWord);
    }
    if (document.getElementById('downloadPdfBtn')) {
        document.getElementById('downloadPdfBtn').addEventListener('click', downloadAsPdf);
    }
});

function updateUI() {
    const userWelcome = document.querySelector('.user-welcome');
    const loginBtn = document.getElementById('loginBtn');
    const generatorSection = document.getElementById('generator');
    
    if (currentUser) {
        userWelcome.style.display = 'block';
        loginBtn.style.display = 'none';
        document.querySelector('.user-name').textContent = currentUser.name;
        generatorSection.style.display = 'block';
    } else {
        userWelcome.style.display = 'none';
        loginBtn.style.display = 'block';
        generatorSection.style.display = 'none';
    }
}

function scrollToGenerator() {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });
}

function showLoginModal() {
    // For simplicity, just set a mock user
    currentUser = { name: 'Demo User' };
    updateUI();
}

function logout() {
    currentUser = null;
    updateUI();
}

function toggleAdvancedOptions() {
    const advancedOptions = document.getElementById('advancedOptions');
    if (advancedOptions.style.display === 'block') {
        advancedOptions.style.display = 'none';
    } else {
        advancedOptions.style.display = 'block';
    }
}

function useExamplePrompt(index) {
    const examplePrompts = [
        "Create a business proposal for a new eco-friendly packaging solution for a food delivery company.",
        "Develop a marketing plan for launching a new fitness app targeting working professionals aged 25-40."
    ];
    
    document.getElementById('document-description').value = examplePrompts[index-1];
}

function generateDocument() {
    // Get form values
    const documentType = document.getElementById('documentType').value;
    const title = document.getElementById('document-title').value;
    const description = document.getElementById('document-description').value;
    const additionalInfo = document.getElementById('additional-info').value;
    const includeCharts = document.getElementById('includeCharts').checked;
    const includeImages = document.getElementById('includeImages').checked;
    
    // Validate inputs
    if (!title || !description) {
        alert('Please provide a title and description for your document.');
        return;
    }
    
    // Show loading indicator
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'flex';
    
    // Send to backend
    fetch(`${BACKEND_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType, title, description, additionalInfo })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to generate document');
        }
        return response.json();
    })
    .then(data => {
        // Hide loading
        loadingOverlay.style.display = 'none';
        
        // Display the result
        displayResult(data);
    })
    .catch(error => {
        // Hide loading
        loadingOverlay.style.display = 'none';
        
        // Show error
        alert('Error connecting to backend: ' + error.message);
        console.error('Error:', error);
    });
}

function displayResult(data) {
    const resultContainer = document.getElementById('resultContainer');
    const resultPreview = document.getElementById('resultPreview');
    
    // Format the content
    let formattedContent = `<div class="result-document">
        <h1 class="document-title">${data.title}</h1>
        ${formatMarkdown(data.content)}
    </div>`;
    
    // Update the preview
    resultPreview.innerHTML = formattedContent;
    
    // Show the result container
    resultContainer.style.display = 'block';
    
    // Scroll to result
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

function formatMarkdown(markdown) {
    // Simple markdown to HTML conversion
    return markdown
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\n/g, '<br>');
}

function copyToClipboard() {
    const content = document.getElementById('resultPreview').innerText;
    navigator.clipboard.writeText(content)
        .then(() => alert('Content copied to clipboard!'))
        .catch(() => alert('Failed to copy content. Please try again.'));
}

function downloadAsWord() {
    alert('In a real implementation, this would download your document as a Word file.');
}

function downloadAsPdf() {
    alert('In a real implementation, this would download your document as a PDF file.');
}
