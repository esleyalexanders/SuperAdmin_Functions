// Tenant Card Rendering Functions

function renderTenantCard(tenant) {
    const hasChildren = Array.isArray(tenant.franchisees) && tenant.franchisees.length > 0;
    const caret = hasChildren ? '<span class="dropdown-icon" style="display:inline-block; transition: transform 0.2s; margin-right:8px;">▶</span>' : '';
    
    const card = document.createElement('div');
    card.className = 'tenant-card';
    card.dataset.tenantId = tenant.id;
    
    card.innerHTML = `
        <div class="tenant-header">
            <label style="display:flex; align-items:flex-start; gap:12px; cursor:pointer; flex: 1;" onclick="event.stopPropagation()">
                <input type="checkbox" class="tenant-checkbox" value="${tenant.id}" style="margin-top:4px;">
                <div class="tenant-info">
                    <div class="tenant-name">
                        ${caret}
                        <span>${tenant.name}</span>
                        <span class="${getStatusBadge(tenant.status)}">${getStatusText(tenant.status)}</span>
                        <span class="status-indicator">
                            <span class="${getStatusDot(tenant.status)}"></span>
                        </span>
                    </div>
                    <div class="tenant-meta">
                        <strong>${tenant.subdomain}.franchise.com</strong> • 
                        ${formatIndustry(tenant.industry)} • 
                        ${formatBusinessType(tenant.businessType)}
                    </div>
                    <div class="tenant-meta">
                        Contact: ${tenant.contact} • 
                        Plan: ${tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)} • 
                        Created: ${formatDate(tenant.created)}
                    </div>
                </div>
            </label>
            <div class="tenant-actions">
                <a class="btn btn-outline" href="SuperAdmin_Functions/tenant_edit.html?tenantId=${tenant.id}">
                    <span>✏️</span> Edit
                </a>
                <button class="btn btn-outline" onclick="showAuditLogModal(${tenant.id})">
                    <span>📋</span> Audit Log
                </button>
                ${renderActionButtons(tenant)}
            </div>
        </div>
        ${hasChildren ? `<div class="franchisee-list" id="fr-list-${tenant.id}" style="display:none; margin-top:16px; padding-left:24px;"></div>` : ''}
    `;
    
    if (hasChildren) {
        setupFranchiseeToggle(card, tenant);
    }
    
    // Add checkbox change listener
    const checkbox = card.querySelector('.tenant-checkbox');
    checkbox.addEventListener('change', updateBulkActionsVisibility);
    
    return card;
}

function renderActionButtons(tenant) {
    const isAdminUser = isAdmin();
    const buttons = [];
    
    // Verify/Reject for awaiting verification
    if (isAdminUser && tenant.status === 'awaiting') {
        buttons.push(`
            <button class="btn btn-success" onclick="verifyTenant(${tenant.id})">
                <span>✓</span> Verify
            </button>
            <button class="btn btn-danger" onclick="rejectTenant(${tenant.id})">
                <span>✗</span> Reject
            </button>
        `);
    }
    
    // Suspend for verified/inactive
    if (tenant.status === 'verified' || tenant.status === 'inactive') {
        buttons.push(`
            <button class="btn btn-warning" onclick="suspendTenant(${tenant.id})">
                <span>⏸</span> Suspend
            </button>
        `);
    }
    
    // Restore for suspended
    if (tenant.status === 'suspended') {
        buttons.push(`
            <button class="btn btn-success" onclick="restoreTenant(${tenant.id})">
                <span>↻</span> Restore
            </button>
        `);
    }
    
    // Close for all except closed
    if (tenant.status !== 'closed') {
        buttons.push(`
            <button class="btn btn-danger" onclick="closeTenant(${tenant.id})">
                <span>🚫</span> Close
            </button>
        `);
    }
    
    return buttons.join('');
}

function setupFranchiseeToggle(card, tenant) {
    const header = card.querySelector('.tenant-header');
    const list = card.querySelector(`#fr-list-${tenant.id}`);
    const icon = card.querySelector('.dropdown-icon');
    
    if (!list) return;
    
    const toggleFranchisees = (e) => {
        // Don't toggle if clicking on buttons or checkbox
        if (e.target.closest('.tenant-actions') || 
            e.target.closest('.tenant-checkbox') ||
            e.target.tagName === 'BUTTON' ||
            e.target.tagName === 'A') {
            return;
        }
        
        const isShowing = list.style.display === 'block';
        
        if (isShowing) {
            list.style.display = 'none';
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
            list.innerHTML = '';
        } else {
            list.style.display = 'block';
            if (icon) {
                icon.style.transform = 'rotate(90deg)';
            }
            renderFranchiseeList(list, tenant);
        }
    };
    
    header.addEventListener('click', toggleFranchisees);
}

function renderFranchiseeList(listElement, tenant) {
    const franchisees = tenant.franchisees.map(f => `
        <div style="border:2px dashed #e9ecef; border-radius:8px; padding:12px; margin-bottom:8px; background:white; transition:all 0.3s ease;" 
             onmouseover="this.style.borderColor='#28a745'; this.style.background='#f8fff9';" 
             onmouseout="this.style.borderColor='#e9ecef'; this.style.background='white';">
            <div style="display:flex; align-items:center; justify-content:space-between;">
                <div>
                    <strong>${f.name}</strong>
                    <span class="${getStatusBadge(f.status)}" style="margin-left:8px;">${getStatusText(f.status)}</span>
                </div>
                <div style="display:flex; gap:8px;">
                    <a class="btn btn-outline" href="SuperAdmin_Functions/tenant_edit.html?franchiseeId=${f.id}" style="font-size:13px; padding:6px 12px;">
                        Edit
                    </a>
                </div>
            </div>
        </div>
    `).join('');
    
    const createBtn = `
        <div style="padding: 8px 0; margin-top:12px;">
            <a class="btn btn-primary" href="SuperAdmin_Functions/tenant_create_account.html?franchisorId=${tenant.id}">
                <span>+</span> Create Franchisee
            </a>
        </div>
    `;
    
    listElement.innerHTML = franchisees + createBtn;
}

function renderAllTenants(tenants, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (tenants.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <div class="empty-state-title">No Tenants Found</div>
                <div class="empty-state-text">Try adjusting your filters or create a new tenant.</div>
            </div>
        `;
        return;
    }
    
    tenants.forEach(tenant => {
        const card = renderTenantCard(tenant);
        container.appendChild(card);
    });
}

function renderDrafts(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const drafts = getDrafts();
    container.innerHTML = '';
    
    if (drafts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-title">No Drafts</div>
                <div class="empty-state-text">All tenant accounts have been completed or no drafts exist.</div>
            </div>
        `;
        return;
    }
    
    drafts.forEach(draft => {
        const name = (draft.data && (draft.data.franchisorName || draft.data.contactName || draft.data.subdomain)) || 'Untitled Tenant';
        const type = draft.data && draft.data.tenantType ? draft.data.tenantType : 'single';
        const when = new Date(draft.updatedAt || Date.now()).toLocaleString();
        
        const card = document.createElement('div');
        card.style.cssText = 'border:2px dashed #c7d3ff; background:#f6f9ff; border-radius:12px; padding:16px; display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;';
        card.innerHTML = `
            <div>
                <div style="margin-bottom:6px;">
                    <strong style="color:#2c3e50; font-size:15px;">${name}</strong>
                    <span class="badge draft" style="margin-left:8px;">Draft</span>
                </div>
                <div style="color:#6c757d; font-size:13px;">
                    Updated ${when} • Type: ${type === 'franchisor' ? 'Franchisor' : 'Single Store'}
                </div>
            </div>
            <div style="display:flex; gap:8px;">
                <a class="btn btn-primary" href="SuperAdmin_Functions/tenant_create_account.html?draftId=${draft.id}">
                    Continue
                </a>
                <button class="btn btn-danger" onclick="handleDeleteDraft('${draft.id}')">
                    Delete
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function handleDeleteDraft(draftId) {
    if (confirm('Are you sure you want to delete this draft?')) {
        deleteDraft(draftId);
        renderDrafts('draftCards');
    }
}
