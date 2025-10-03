// Main Tenant Management Application

// Current filter state
let currentFilters = {
    keyword: '',
    plan: '',
    status: '',
    industry: '',
    businessType: ''
};

let currentTab = 'all';

// Initialize the application
function initTenantManagement() {
    // Setup admin visibility
    updateAdminTabsVisibility();
    
    // Initialize filter listeners
    initFilterListeners();
    
    // Initialize tab listeners
    initTabListeners();
    
    // Initialize bulk action listeners
    initBulkActionListeners();
    
    // Initialize modal listeners
    initModalListeners();
    
    // Initialize mobile sidebar
    initMobileSidebar();
    
    // Initial render
    showTab('all');
    
    console.log('Tenant Management System initialized');
}

// Filter Management
function initFilterListeners() {
    const keyword = document.getElementById('keyword');
    const plan = document.getElementById('plan');
    const status = document.getElementById('status');
    const refresh = document.getElementById('refreshBtn');
    
    if (keyword) {
        keyword.addEventListener('input', () => {
            currentFilters.keyword = keyword.value;
            filterAndRender();
        });
    }
    
    if (plan) {
        plan.addEventListener('change', () => {
            currentFilters.plan = plan.value;
            filterAndRender();
        });
    }
    
    if (status) {
        status.addEventListener('change', () => {
            currentFilters.status = status.value;
            filterAndRender();
        });
    }
    
    if (refresh) {
        refresh.addEventListener('click', () => {
            location.reload();
        });
    }
}

// Tab Management
function initTabListeners() {
    const tabAll = document.getElementById('tabAll');
    const tabVerified = document.getElementById('tabVerified');
    const tabAwaiting = document.getElementById('tabAwaiting');
    const tabRejected = document.getElementById('tabRejected');
    const tabSuspended = document.getElementById('tabSuspended');
    const tabClosed = document.getElementById('tabClosed');
    const tabDraft = document.getElementById('tabDraft');
    const tabInactive = document.getElementById('tabInactive');
    
    if (tabAll) tabAll.addEventListener('click', () => showTab('all'));
    if (tabVerified) tabVerified.addEventListener('click', () => showTab('verified'));
    if (tabAwaiting) tabAwaiting.addEventListener('click', () => showTab('awaiting'));
    if (tabRejected) tabRejected.addEventListener('click', () => showTab('rejected'));
    if (tabSuspended) tabSuspended.addEventListener('click', () => showTab('suspended'));
    if (tabClosed) tabClosed.addEventListener('click', () => showTab('closed'));
    if (tabDraft) tabDraft.addEventListener('click', () => showTab('draft'));
    if (tabInactive) tabInactive.addEventListener('click', () => showTab('inactive'));
}

function showTab(tab) {
    currentTab = tab;
    
    // Update tab active states
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
    if (activeTab) activeTab.classList.add('active');
    
    // Show/hide appropriate sections
    const resultsCard = document.getElementById('resultsCard');
    const filtersCard = document.getElementById('filtersCard');
    const processingCard = document.getElementById('processingCard');
    const bulkActionsPanel = document.getElementById('bulkActionsPanel');
    
    if (tab === 'draft') {
        if (resultsCard) resultsCard.style.display = 'none';
        if (filtersCard) filtersCard.style.display = 'none';
        if (processingCard) processingCard.style.display = 'block';
        if (bulkActionsPanel) bulkActionsPanel.style.display = 'none';
        renderDrafts('draftCards');
    } else {
        if (resultsCard) resultsCard.style.display = 'block';
        if (filtersCard) filtersCard.style.display = 'block';
        if (processingCard) processingCard.style.display = 'none';
        if (bulkActionsPanel) bulkActionsPanel.style.display = 'block';
        
        // Set status filter based on tab
        const statusSelect = document.getElementById('status');
        if (statusSelect) {
            statusSelect.value = tab === 'all' ? '' : tab;
            currentFilters.status = statusSelect.value;
        }
        
        filterAndRender();
    }
}

// Filtering and Rendering
function filterAndRender() {
    const filtered = filterTenants(tenants, currentFilters);
    renderAllTenants(filtered, 'tenantCards');
}

// Bulk Actions
function initBulkActionListeners() {
    const verifyBtn = document.getElementById('verifySelected');
    const suspendBtn = document.getElementById('suspendSelected');
    const closeBtn = document.getElementById('closeSelected');
    const exportBtn = document.getElementById('exportSelected');
    const bulkUpdateBtn = document.getElementById('bulkUpdateBtn');
    
    if (verifyBtn) verifyBtn.addEventListener('click', verifySelected);
    if (suspendBtn) suspendBtn.addEventListener('click', suspendSelected);
    if (closeBtn) closeBtn.addEventListener('click', closeSelected);
    if (exportBtn) exportBtn.addEventListener('click', exportSelected);
    
    if (bulkUpdateBtn) {
        bulkUpdateBtn.addEventListener('click', () => {
            alert('Bulk update functionality would open a CSV editor here.');
        });
    }
    
    // Listen for checkbox changes
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('tenant-checkbox')) {
            updateBulkActionsVisibility();
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTenantManagement);
} else {
    initTenantManagement();
}
