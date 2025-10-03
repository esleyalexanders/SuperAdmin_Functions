// Tenant Management Utility Functions

// Status Helper Functions
function getStatusBadge(status) {
    const badges = {
        draft: 'badge draft',
        review: 'badge review',
        awaiting: 'badge awaiting',
        suspended: 'badge suspended',
        closed: 'badge closed',
        verified: 'badge verified',
        rejected: 'badge rejected',
        inactive: 'badge inactive'
    };
    return badges[status] || 'badge';
}

function getStatusDot(status) {
    const dots = {
        draft: 'status-dot draft',
        review: 'status-dot review',
        awaiting: 'status-dot awaiting',
        suspended: 'status-dot suspended',
        closed: 'status-dot closed',
        verified: 'status-dot verified',
        rejected: 'status-dot rejected',
        inactive: 'status-dot inactive'
    };
    return dots[status] || 'status-dot';
}

function getStatusText(status) {
    const texts = {
        draft: 'Draft (Not Paid)',
        review: 'In Review',
        awaiting: 'Awaiting Verification',
        suspended: 'Suspended',
        closed: 'Closed',
        verified: 'Verified (Paid, Verified)',
        rejected: 'Rejected',
        inactive: 'Inactive'
    };
    return texts[status] || status;
}

// Format Helper Functions
function formatIndustry(code) {
    const map = {
        'food-beverage': 'Food & Beverage',
        'retail': 'Retail',
        'services': 'Services',
        'hospitality': 'Hospitality',
        'health-medical': 'Health & Medical',
        'home-garden': 'Home & Garden',
        'other': 'Other'
    };
    return map[code] || code;
}

function formatBusinessType(code) {
    if (typeof businessTypes === 'undefined') return code;
    
    const all = Object.values(businessTypes).flat();
    const item = all.find(i => i.value === code);
    return item ? item.text : code;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Filter Functions
function filterTenants(tenants, filters) {
    const { keyword, plan, status, industry, businessType } = filters;
    
    return tenants.filter(tenant => {
        const matchKeyword = !keyword || [
            tenant.name,
            tenant.subdomain,
            tenant.contact
        ].some(v => (v || '').toLowerCase().includes(keyword.toLowerCase()));
        
        const matchPlan = !plan || tenant.plan === plan;
        const matchStatus = !status || tenant.status === status;
        const matchIndustry = !industry || tenant.industry === industry;
        const matchBusinessType = !businessType || tenant.businessType === businessType;

        return matchKeyword && matchPlan && matchStatus && matchIndustry && matchBusinessType;
    });
}

// Selection Functions
function getSelectedTenants() {
    const checkboxes = document.querySelectorAll('.tenant-checkbox:checked');
    return Array.from(checkboxes).map(cb => parseInt(cb.value));
}

function updateBulkActionsVisibility() {
    const selected = getSelectedTenants();
    const bulkPanel = document.getElementById('bulkActionsPanel');
    
    if (bulkPanel) {
        bulkPanel.style.display = selected.length > 0 ? 'block' : 'none';
    }
}

// Draft Management
function getDrafts() {
    return JSON.parse(localStorage.getItem('tenantDrafts') || '[]')
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

function saveDraft(draftData) {
    const drafts = getDrafts();
    const existingIndex = drafts.findIndex(d => d.id === draftData.id);
    
    draftData.updatedAt = Date.now();
    
    if (existingIndex >= 0) {
        drafts[existingIndex] = draftData;
    } else {
        drafts.push(draftData);
    }
    
    localStorage.setItem('tenantDrafts', JSON.stringify(drafts));
}

function deleteDraft(draftId) {
    const drafts = getDrafts();
    const filtered = drafts.filter(d => d.id !== draftId);
    localStorage.setItem('tenantDrafts', JSON.stringify(filtered));
}

// Admin Check
function isAdmin() {
    return localStorage.getItem('userRole') === 'admin' || true; // Set to true for demo
}

function updateAdminTabsVisibility() {
    const adminTabs = document.querySelectorAll('.tab.admin-only');
    const adminValue = isAdmin();
    
    adminTabs.forEach(tab => {
        tab.style.display = adminValue ? 'inline-block' : 'none';
    });
}

// Mobile Sidebar Toggle
function initMobileSidebar() {
    if (window.innerWidth <= 576) {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;
        
        // Check if toggle button already exists
        if (document.getElementById('sidebarToggle')) return;
        
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'sidebarToggle';
        toggleBtn.innerHTML = '☰';
        toggleBtn.style.cssText = 'position: fixed; top: 20px; left: 20px; z-index: 1001; background: #007bff; color: white; border: none; padding: 10px 14px; border-radius: 6px; font-size: 20px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2);';
        document.body.appendChild(toggleBtn);
        
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && e.target !== toggleBtn) {
                sidebar.classList.remove('open');
            }
        });
    }
}

// Initialize on load
if (typeof window !== 'undefined') {
    window.addEventListener('resize', initMobileSidebar);
    window.addEventListener('DOMContentLoaded', initMobileSidebar);
}
