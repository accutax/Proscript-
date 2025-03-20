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
    
    // Initialize generator section
    initializeGenerator();
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

function showLoginModal() {
    // Create modal HTML
    const modalHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal">
            <div class="modal-header">
                <h3>Login to ProScript</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="tabs">
                    <button class="tab-btn active" data-tab="login">Login</button>
                    <button class="tab-btn" data-tab="register">Register</button>
                </div>
                <div class="tab-content" id="login-tab">
                    <form id="login-form">
                        <div class="form-group">
                            <label for="login-email">Email</label>
                            <input type="email" id="login-email" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Password</label>
                            <input type="password" id="login-password" required>
                        </div>
                        <button type="submit" class="btn">Login</button>
                    </form>
                </div>
                <div class="tab-content" id="register-tab" style="display: none;">
                    <form id="register-form">
                        <div class="form-group">
                            <label for="register-name">Name</label>
                            <input type="text" id="register-name" required>
                        </div>
                        <div class="form-group">
                            <label for="register-email">Email</label>
                            <input type="email" id="register-email" required>
                        </div>
                        <div class="form-group">
                            <label for="register-password">Password</label>
                            <input type="password" id="register-password" required>
                        </div>
                        <button type="submit" class="btn">Register</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Add event listeners
    document.querySelector('.close-btn').addEventListener('click', closeModal);
    document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const tabId = this.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
            document.getElementById(`${tabId}-tab`).style.display = 'block';
        });
    });
    
    // Form submission
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });
    
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        register();
    });
}

function closeModal() {
    document.querySelector('.modal-container').remove();
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Send to backend
    fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        currentUser = data;
        closeModal();
        updateUI();
    })
    .catch(error => {
        alert('Login failed. Please check your credentials.');
        console.error('Error:', error);
    });
}

function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    // Send to backend
    fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Registration failed');
        }
        return response.json();
    })
    .then(data => {
        alert('Registration successful! Please log in.');
        document.querySelectorAll('.tab-btn')[0].click(); // Switch to login tab
    })
    .catch(error => {
        alert('Registration failed. Please try again.');
        console.error('Error:', error);
    });
}

function logout() {
    currentUser = null;
    updateUI();
}

function scrollToGenerator() {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });
}

function initializeGenerator() {
    const generatorContainer = document.querySelector('.generator-container');
    
    generatorContainer.innerHTML = `
        <h2>Document Generator</h2>
        <p>Select a document type and provide details to generate your document</p>
        
        <div class="generator-grid">
            <div class="document-types">
                <div class="document-type active" data-type="Business Proposal">
                    <i class="fas fa-handshake"></i>
                    <h3>Business Proposal</h3>
                    <p>Create a compelling business proposal for potential clients or investors.</p>
                </div>
                <div class="document-type" data-type="Marketing Plan">
                    <i class="fas fa-bullhorn"></i>
                    <h3>Marketing Plan</h3>
                    <p>Develop a comprehensive marketing strategy for your product or service.</p>
                </div>
                <div class="document-type" data-type="Project Report">
                    <i class="fas fa-chart-line"></i>
                    <h3>Project Report</h3>
                    <p>Generate a detailed report on project progress, outcomes, and next steps.</p>
                </div>
            </div>
            
            <div class="document-form">
                <div class="form-group">
                    <label for="document-title">Document Title</label>
                    <input type="text" id="document-title" placeholder="Enter a title for your document">
                </div>
                
                <div class="form-group">
                    <label for="document-description">Brief Description</label>
                    <textarea id="document-description" placeholder="Provide a brief description of what you need"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="additional-info">Additional Information</label>
                    <textarea id="additional-info" placeholder="Add any specific details or requirements"></textarea>
                </div>
                
                <button id="generate-btn" class="btn">Generate Document</button>
            </div>
            
            <div class="document-preview">
                <div class="preview-placeholder">
                    <i class="fas fa-file-alt"></i>
                    <p>Your document will appear here</p>
                </div>
                <div class="preview-content" style="display: none;">
                    <h3 class="preview-title"></h3>
                    <div class="preview-text"></div>
                    <button class="btn download-btn">Download Document</button>
                </div>
                <div class="loading-indicator" style="display: none;">
                    <div class="spinner"></div>
                    <p>Generating document...</p>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    document.querySelectorAll('.document-type').forEach(type => {
        type.addEventListener('click', function() {
            document.querySelectorAll('.document-type').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    document.getElementById('generate-btn').addEventListener('click', generateDocument);
}

function generateDocument() {
    // Get form values
    const documentType = document.querySelector('.document-type.active').getAttribute('data-type');
    const title = document.getElementById('document-title').value;
    const description = document.getElementById('document-description').value;
    const additionalInfo = document.getElementById('additional-info').value;
    
    // Validate inputs
    if (!title || !description) {
        alert('Please provide a title and description for your document.');
        return;
    }
    
    // Show loading indicator
    const previewPlaceholder = document.querySelector('.preview-placeholder');
    const previewContent = document.querySelector('.preview-content');
    const loadingIndicator = document.querySelector('.loading-indicator');
    
    previewPlaceholder.style.display = 'none';
    previewContent.style.display = 'none';
    loadingIndicator.style.display = 'flex';
    
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
        // Update preview
        document.querySelector('.preview-title').textContent = data.title;
        document.querySelector('.preview-text').innerHTML = formatMarkdown(data.content);
        
        // Show preview
        loadingIndicator.style.display = 'none';
        previewContent.style.display = 'block';
        
        // Add download functionality
        document.querySelector('.download-btn').addEventListener('click', function() {
            downloadDocument(data.title, data.content);
        });
    })
    .catch(error => {
        loadingIndicator.style.display = 'none';
        previewPlaceholder.style.display = 'flex';
        alert('Error connecting to backend: ' + error.message);
        console.error('Error:', error);
    });
}

function formatMarkdown(markdown) {
    // Simple markdown to HTML conversion
    return markdown
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\n/g, '<br>');
}

function downloadDocument(title, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `${title}.md`);
    
    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.click();
    
    document.body.removeChild(element);
}
