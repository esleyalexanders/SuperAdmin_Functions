// Tenant Lifecycle Management Functions

function performLifecycleAction(tenantId, action) {
    const tenantIndex = tenants.findIndex(t => t.id === tenantId);
    if (tenantIndex === -1) {
        alert('Tenant not found');
        return;
    }
    
    const tenant = tenants[tenantIndex];
    
    try {
        switch (action) {
            case 'verify':
                if (tenant.status !== 'awaiting') {
                    throw new Error('Only awaiting verification tenants can be verified');
                }
                tenant.status = 'verified';
                showNotification('Tenant verified successfully', 'success');
                break;
                
            case 'reject':
                if (tenant.status !== 'awaiting') {
                    throw new Error('Only awaiting verification tenants can be rejected');
                }
                tenant.status = 'closed';
                showNotification('Tenant marked as Closed', 'warning');
                break;
                
            case 'suspend':
                window.location.href = `SuperAdmin_Functions/tenant_suspend.html?tenantId=${tenantId}`;
                return;
                
            case 'restore':
                tenant.status = 'verified';
                showNotification('Tenant restored successfully', 'success');
                break;
                
            case 'close':
                window.location.href = `SuperAdmin_Functions/tenant_close.html?tenantId=${tenantId}`;
                return;
                
            default:
                throw new Error('Invalid action');
        }
        
        // Refresh the view after action
        filterAndRender();
        
    } catch (error) {
        alert('Action failed: ' + error.message);
    }
}

// Individual action functions
function verifyTenant(id) {
    performLifecycleAction(id, 'verify');
}

function rejectTenant(id) {
    if (confirm('Are you sure you want to reject this tenant?')) {
        performLifecycleAction(id, 'reject');
    }
}

function suspendTenant(id) {
    performLifecycleAction(id, 'suspend');
}

function restoreTenant(id) {
    if (confirm('Are you sure you want to restore this tenant?')) {
        performLifecycleAction(id, 'restore');
    }
}

function closeTenant(id) {
    performLifecycleAction(id, 'close');
}

// Bulk operations
function performBulkAction(action) {
    const selectedIds = getSelectedTenants();
    
    if (selectedIds.length === 0) {
        alert('No tenants selected');
        return;
    }
    
    const actionText = action.charAt(0).toUpperCase() + action.slice(1);
    if (!confirm(`Are you sure you want to ${actionText.toLowerCase()} ${selectedIds.length} tenant(s)?`)) {
        return;
    }
    
    let successCount = 0;
    let failCount = 0;
    
    selectedIds.forEach(tenantId => {
        try {
            performLifecycleAction(tenantId, action);
            successCount++;
        } catch (error) {
            failCount++;
            console.error(`Failed to ${action} tenant ${tenantId}:`, error);
        }
    });
    
    showNotification(
        `Bulk ${action}: ${successCount} succeeded, ${failCount} failed`,
        failCount > 0 ? 'warning' : 'success'
    );
    
    // Uncheck all checkboxes
    document.querySelectorAll('.tenant-checkbox:checked').forEach(cb => {
        cb.checked = false;
    });
    
    updateBulkActionsVisibility();
}

function verifySelected() {
    performBulkAction('verify');
}

function suspendSelected() {
    performBulkAction('suspend');
}

function closeSelected() {
    performBulkAction('close');
}

function exportSelected() {
    const selectedIds = getSelectedTenants();
    
    if (selectedIds.length === 0) {
        alert('No tenants selected for export');
        return;
    }
    
    const selectedTenants = tenants.filter(t => selectedIds.includes(t.id));
    
    // Create CSV content
    const headers = ['ID', 'Name', 'Subdomain', 'Industry', 'Business Type', 'Plan', 'Status', 'Contact', 'Created', 'Last Activity'];
    const rows = selectedTenants.map(t => [
        t.id,
        t.name,
        t.subdomain,
        formatIndustry(t.industry),
        formatBusinessType(t.businessType),
        t.plan,
        t.status,
        t.contact,
        t.created,
        t.lastActivity
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `tenants_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(`Exported ${selectedIds.length} tenants successfully`, 'success');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    const colors = {
        success: { bg: '#d1e7dd', color: '#0f5132', border: '#badbcc' },
        warning: { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' },
        error: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
        info: { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' }
    };
    
    const style = colors[type] || colors.info;
    notification.style.background = style.bg;
    notification.style.color = style.color;
    notification.style.border = `2px solid ${style.border}`;
    
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
