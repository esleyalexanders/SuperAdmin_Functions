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
                        <span class="${getStatusBadge(tenant.status)}">${getGroupedStatusText(tenant.status)}</span>
                        ${Array.isArray(tenant.franchisees) && tenant.franchisees.length > 0
                            ? '<span class="badge type-franchisor">Franchisor</span>'
                            : '<span class="badge type-single">Single Store</span>'}
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
                <a class="btn btn-outline" href="tenant_edit.html?tenantId=${tenant.id}">
                    <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9" stroke="#6c757d" stroke-width="2" stroke-linecap="round"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke="#6c757d" stroke-width="2" stroke-linejoin="round"/></svg></span> Edit
                </a>
                <button class="btn btn-outline" onclick="showAuditLogModal(${tenant.id})">
                    <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="16" rx="2" ry="2" stroke="#6c757d" stroke-width="2"/><path d="M7 8h10M7 12h10M7 16h6" stroke="#6c757d" stroke-width="2" stroke-linecap="round"/></svg></span> Audit Log
                </button>
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
                <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span> Verify
            </button>
            <button class="btn btn-danger" onclick="rejectTenant(${tenant.id})">
                <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/></svg></span> Reject
            </button>
        `);
    }
    
    // Suspend for active group (verified)
    if (tenant.status === 'verified') {
        buttons.push(`
            <button class="btn btn-warning" onclick="suspendTenant(${tenant.id})">
                <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 4h2v16h-2zM14 4h2v16h-2z" fill="#212529"/></svg></span> Suspend
            </button>
        `);
    }
    
    // Restore for suspended only
    if (tenant.status === 'suspended') {
        buttons.push(`
            <button class="btn btn-success" onclick="restoreTenant(${tenant.id})">
                <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12a9 9 0 1 1-2.64-6.36" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/><path d="M21 3v6h-6" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span> Restore
            </button>
        `);
    }
    
    // Close for all except closed
    if (tenant.status !== 'closed') {
        buttons.push(`
            <button class="btn btn-danger" onclick="closeTenant(${tenant.id})">
                <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#ffffff" stroke-width="2"/><path d="M15 9l-6 6M9 9l6 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/></svg></span> Close
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
                    <span class="${getStatusBadge(f.status)}" style="margin-left:8px;">${getGroupedStatusText(f.status)}</span>
                </div>
                <div style="display:flex; gap:8px;">
                    <a class="btn btn-outline" href="tenant_edit.html?franchiseeId=${f.id}" style="font-size:13px; padding:6px 12px;">
                        Edit
                    </a>
                </div>
            </div>
        </div>
    `).join('');
    
    const createBtn = `
        <div style="padding: 8px 0; margin-top:12px;">
            <a class="btn btn-primary" href="tenant_create_account.html?franchisorId=${tenant.id}">
                <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/></svg></span> Create Franchisee
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
                <div class="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="7" stroke="#6c757d" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="#6c757d" stroke-width="2" stroke-linecap="round"/></svg></div>
                <div class="empty-state-title">No Tenants Found</div>
                <div class="empty-state-text">Try adjusting your filters or create a new tenant.</div>
            </div>
        `;
        return;
    }
    
    const table = document.createElement('table');
    table.className = 'tenant-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th style="width:36px;"><input type="checkbox" id="selectAllTenants"></th>
                <th>Brand Name</th>
                <th>Contact</th>
                <th>Type</th>
                <th>Franchisees</th>
                <th>Staff</th>
                <th>System Status</th>
                <th>Subscription Plan</th>
                <th style="min-width:160px;">Last Activity</th>
                <th>Created</th>
                <th style="width:84px; text-align:center;">Actions</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');
    
    tenants.forEach(tenant => {
        const isFranchisor = Array.isArray(tenant.franchisees) && tenant.franchisees.length > 0;
        const row = document.createElement('tr');
        const staffCount = (tenant.staffTotal || (isFranchisor ? (tenant.franchisees || []).reduce((a) => a, 0) : (tenant.staffTotal || 0))); // placeholder if not provided
        const derived = deriveContactInfo(tenant);
        const contactName = derived.name;
        const contactEmail = derived.email;
        const contactPhone = derived.phone;
        row.innerHTML = `
            <td><input type=\"checkbox\" class=\"tenant-checkbox\" value=\"${tenant.id}\"></td>
            <td>
                <div style=\"display:flex; align-items:center; gap:8px;\">
                    <strong>${tenant.name}</strong>
                </div>
                <div style=\"font-size:12px; color:#6c757d; margin-top:2px;\">${tenant.subdomain}.franchise.com</div>
            </td>
            <td>
                <div style=\"display:flex; flex-direction:column; gap:2px;\">
                    <strong>${contactName || '—'}</strong>
                    <span style=\"color:#6c757d;\">${contactEmail || '—'}</span>
                    <span style=\"color:#6c757d;\">${contactPhone || '—'}</span>
                </div>
            </td>
            <td>
                <span class=\"badge ${isFranchisor ? 'type-franchisor' : 'type-single'}\">${isFranchisor ? 'Franchisor' : 'Single Store'}</span>
            </td>
            <td style=\"text-align:center;\">
                ${isFranchisor ? (tenant.franchisees || []).length : '--'}
                <div style=\"font-size:11px; color:#6c757d;\">Total</div>
            </td>
            <td style=\"text-align:center;\">
                ${tenant.staffTotal || (isFranchisor ? '--' : (tenant.staffTotal || 0))}
                <div style=\"font-size:11px; color:#6c757d;\">Total</div>
            </td>
            <td>
                <span class=\"${getStatusBadge(tenant.status)}\">${getStatusGroup(tenant.status)}</span>
                <div style=\"font-size:12px; color:#6c757d; margin-top:4px;\">${getStatusText(tenant.status)}</div>
            </td>
            <td>
                ${tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)}
                <div style=\"font-size:12px; color:#6c757d;\">${tenant.paymentStatus === 'paid' ? 'Active' : (tenant.paymentStatus === 'failed' ? 'Failed' : 'Expired')}</div>
            </td>
            <td style="white-space:nowrap;">
                ${formatRelative(tenant.lastActivity)}
                <div style="font-size:12px; color:#6c757d;">Login</div>
            </td>
            <td>${formatDate(tenant.created)}</td>
            <td>
                <div style="display:flex; gap:6px; justify-content:center;">
                    <a class="btn btn-outline btn-icon" href="tenant_edit.html?tenantId=${tenant.id}" title="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9" stroke="#6c757d" stroke-width="2" stroke-linecap="round"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke="#6c757d" stroke-width="2" stroke-linejoin="round"/></svg>
                    </a>
                    <button class="btn btn-outline btn-icon" onclick="showAuditLogModal(${tenant.id})" title="Audit Log">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="16" rx="2" ry="2" stroke="#6c757d" stroke-width="2"/><path d="M7 8h10M7 12h10M7 16h6" stroke="#6c757d" stroke-width="2" stroke-linecap="round"/></svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    container.appendChild(table);
    
    // Hook up select all
    const selectAll = table.querySelector('#selectAllTenants');
    if (selectAll) {
        selectAll.addEventListener('change', () => {
            const checks = table.querySelectorAll('.tenant-checkbox');
            checks.forEach(cb => { cb.checked = selectAll.checked; });
            updateBulkActionsVisibility();
        });
    }
}

// Draft rendering removed
