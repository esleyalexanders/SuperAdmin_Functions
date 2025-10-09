// Tenant Management Utility Functions

// Status Helper Functions
function getStatusBadge(status) {
    const badges = {
        review: 'badge review',
        awaiting: 'badge awaiting',
        suspended: 'badge suspended',
        closed: 'badge closed',
        verified: 'badge verified',
        inactive: 'badge inactive'
    };
    return badges[status] || 'badge';
}

function getStatusDot(status) {
    const dots = {
        review: 'status-dot review',
        awaiting: 'status-dot awaiting',
        suspended: 'status-dot suspended',
        closed: 'status-dot closed',
        verified: 'status-dot verified',
        inactive: 'status-dot inactive'
    };
    return dots[status] || 'status-dot';
}

function getStatusText(status) {
    const texts = {
        review: 'In Review',
        awaiting: 'Awaiting Verification',
        suspended: 'Suspended',
        closed: 'Closed',
        verified: 'Verified',
        inactive: 'Inactive'
    };
    return texts[status] || status;
}

// Grouped status label, e.g. (Active, Verified) or (Inactive, Suspended)
function getGroupedStatusText(status) {
    let group = '';
    if (status === 'verified' || status === 'awaiting') {
        group = 'Active';
    } else if (status === 'suspended' || status === 'closed') {
        group = 'Inactive';
    } else {
        // Fallback for uncommon statuses
        group = '';
    }
    const text = getStatusText(status);
    return group ? `(${group}, ${text})` : text;
}

// Return only the group label (Active/Inactive) based on status
function getStatusGroup(status) {
    if (status === 'verified' || status === 'awaiting') return 'Active';
    if (status === 'suspended' || status === 'closed') return 'Inactive';
    return '';
}

// Relative time from ISO date string
function formatRelative(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const sec = Math.floor(diffMs / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    if (day > 0) return `${day} day${day>1?'s':''} ago`;
    if (hr > 0) return `${hr} hour${hr>1?'s':''} ago`;
    if (min > 0) return `${min} min ago`;
    return `just now`;
}

// Create display-ready contact info when data is incomplete
function deriveContactInfo(tenant) {
    const email = tenant.contact || '';
    let name = tenant.contactName || '';
    let phone = tenant.contactPhone || '';
    
    if (!name && email) {
        const user = email.split('@')[0] || '';
        name = user
            .replace(/\./g, ' ')
            .replace(/[-_]/g, ' ')
            .split(' ')
            .filter(Boolean)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
        if (!name) name = 'Account Owner';
    }
    
    if (!phone) {
        const seed = (tenant.id || 0) + (tenant.subdomain ? tenant.subdomain.length : 0);
        const digits = (1000 + (seed * 73) % 8999).toString().padStart(4, '0');
        phone = `+1 (555) ${digits.slice(0,3)}-${digits.slice(1)}`;
    }
    
    return { name, email: email || 'owner@' + (tenant.subdomain || 'tenant') + '.com', phone };
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
        // Group statuses: Active (verified, awaiting), Inactive (suspended, closed)
        let matchStatus = true;
        if (status === 'active') {
            matchStatus = tenant.status === 'verified' || tenant.status === 'awaiting';
        } else if (status === 'inactive') {
            matchStatus = tenant.status === 'suspended' || tenant.status === 'closed';
        }
        // Exact status when provided (verified/awaiting/suspended/closed)
        if (status && status !== 'active' && status !== 'inactive') {
            matchStatus = tenant.status === status;
        }
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

// Draft management removed

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

    // No substatus UI anymore
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
