// Modal Management Functions

// Audit Log Modal
function showAuditLogModal(tenantId) {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) {
        alert('Tenant not found');
        return;
    }
    
    // Generate audit log entries
    const auditEntries = [
        {
            timestamp: tenant.created,
            action: 'Tenant Created',
            details: 'Initial tenant setup completed',
            user: 'System Admin'
        },
        {
            timestamp: tenant.lastActivity,
            action: 'Profile Updated',
            details: 'Contact information and business details modified',
            user: 'System Admin'
        },
        {
            timestamp: tenant.created,
            action: 'Status Changed',
            details: `Status updated to ${tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}`,
            user: 'System Admin'
        },
        {
            timestamp: tenant.lastActivity,
            action: 'Profile Viewed',
            details: 'Tenant profile accessed for review',
            user: 'System Admin'
        },
        {
            timestamp: tenant.lastActivity,
            action: 'Settings Updated',
            details: 'Configuration settings modified',
            user: 'System Admin'
        }
    ];
    
    // Sort by most recent first
    auditEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Update modal content
    const modal = document.getElementById('auditLogModal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    
    modalTitle.textContent = `Audit Log - ${tenant.name}`;
    
    modalBody.innerHTML = auditEntries.map(entry => `
        <div class="audit-entry">
            <div class="audit-timestamp">${new Date(entry.timestamp).toLocaleString()}</div>
            <div class="audit-action">${entry.action}</div>
            <div class="audit-details">
                ${entry.details}
                <span class="audit-user">by ${entry.user}</span>
            </div>
        </div>
    `).join('');
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideAuditLogModal() {
    const modal = document.getElementById('auditLogModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Bulk Import Modal
function showBulkImportModal() {
    resetBulkImportModal();
    const modal = document.getElementById('bulkImportModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideBulkImportModal() {
    const modal = document.getElementById('bulkImportModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetBulkImportModal();
}

function resetBulkImportModal() {
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const importProgress = document.getElementById('importProgress');
    const progressFill = document.getElementById('progressFillImport');
    const progressText = document.getElementById('progressText');
    const startBtn = document.getElementById('startImportBtn');
    const fileUploadArea = document.getElementById('fileUploadArea');
    
    if (fileInput) fileInput.value = '';
    if (fileInfo) fileInfo.classList.remove('show');
    if (importProgress) importProgress.classList.remove('show');
    if (progressFill) progressFill.style.width = '0%';
    if (progressText) progressText.textContent = 'Validating data...';
    if (startBtn) startBtn.disabled = true;
    if (fileUploadArea) fileUploadArea.classList.remove('dragover');
}

// File Upload Functions
function handleFileSelect(file) {
    if (!file.name.toLowerCase().endsWith('.csv')) {
        alert('Please select a CSV file only.');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB.');
        return;
    }
    
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const fileInfo = document.getElementById('fileInfo');
    const startBtn = document.getElementById('startImportBtn');
    
    if (fileName) fileName.textContent = file.name;
    if (fileSize) fileSize.textContent = formatFileSize(file.size);
    if (fileInfo) fileInfo.classList.add('show');
    if (startBtn) startBtn.disabled = false;
}

function downloadTemplate() {
    const templateContent = `Tenant Name,Subdomain,Industry,Business Type,Contact Email,Phone,Website,Plan
McDonald's,mcdonalds,food-beverage,restaurant-fast-food,admin@mcdonalds.com,+1-555-0100,https://mcdonalds.com,enterprise
Starbucks,starbucks,food-beverage,cafe-coffee-shop,contact@starbucks.com,+1-555-0101,https://starbucks.com,enterprise
Pizza Hut,pizzahut,food-beverage,restaurant-fast-food,info@pizzahut.com,+1-555-0102,https://pizzahut.com,professional`;
    
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'bulk_import_template.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    showNotification('Template downloaded successfully!', 'success');
}

function simulateImport() {
    const startBtn = document.getElementById('startImportBtn');
    const cancelBtn = document.getElementById('cancelImportBtn');
    const importProgress = document.getElementById('importProgress');
    const progressFill = document.getElementById('progressFillImport');
    const progressText = document.getElementById('progressText');
    
    if (startBtn) startBtn.disabled = true;
    if (cancelBtn) cancelBtn.disabled = true;
    if (importProgress) importProgress.classList.add('show');
    
    const steps = [
        { progress: 20, text: 'Reading file...' },
        { progress: 40, text: 'Validating data...' },
        { progress: 60, text: 'Processing records...' },
        { progress: 80, text: 'Creating tenant accounts...' },
        { progress: 100, text: 'Import completed!' }
    ];
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            if (progressFill) progressFill.style.width = step.progress + '%';
            if (progressText) progressText.textContent = step.text;
            currentStep++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                showNotification('Bulk import completed successfully!', 'success');
                hideBulkImportModal();
                filterAndRender();
            }, 1000);
        }
    }, 800);
}

// Initialize Modal Event Listeners
function initModalListeners() {
    // Audit Log Modal
    const auditModal = document.getElementById('auditLogModal');
    const auditClose = document.getElementById('auditLogModalClose');
    
    if (auditClose) {
        auditClose.addEventListener('click', hideAuditLogModal);
    }
    
    if (auditModal) {
        auditModal.addEventListener('click', (e) => {
            if (e.target === auditModal) hideAuditLogModal();
        });
    }
    
    // Bulk Import Modal
    const bulkModal = document.getElementById('bulkImportModal');
    const bulkClose = document.getElementById('bulkImportModalClose');
    const downloadBtn = document.getElementById('downloadTemplateBtn');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileRemove = document.getElementById('fileRemove');
    const cancelBtn = document.getElementById('cancelImportBtn');
    const startBtn = document.getElementById('startImportBtn');
    const bulkImportBtn = document.getElementById('bulkImportBtn');
    
    if (bulkClose) {
        bulkClose.addEventListener('click', hideBulkImportModal);
    }
    
    if (bulkModal) {
        bulkModal.addEventListener('click', (e) => {
            if (e.target === bulkModal) hideBulkImportModal();
        });
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadTemplate);
    }
    
    if (fileUploadArea && fileInput) {
        fileUploadArea.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) handleFileSelect(file);
        });
        
        // Drag and drop
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.classList.add('dragover');
        });
        
        fileUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('dragover');
        });
        
        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const dt = new DataTransfer();
                dt.items.add(files[0]);
                fileInput.files = dt.files;
                handleFileSelect(files[0]);
            }
        });
    }
    
    if (fileRemove) {
        fileRemove.addEventListener('click', resetBulkImportModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideBulkImportModal);
    }
    
    if (startBtn) {
        startBtn.addEventListener('click', simulateImport);
    }
    
    if (bulkImportBtn) {
        bulkImportBtn.addEventListener('click', showBulkImportModal);
    }
}

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideAuditLogModal();
        hideBulkImportModal();
    }
});
