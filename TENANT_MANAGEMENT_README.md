# Tenant Management System - File Structure

## 📁 Directory Structure

```
SuperAdmin_Functions/
├── assets/
│   ├── css/
│   │   ├── tenant-management-styles.css  # Main styles for tenant management
│   │   └── modal-styles.css              # Modal and popup styles
│   └── js/
│       ├── tenant-data.js                # Mock tenant data and business types
│       ├── tenant-utils.js               # Utility functions (status, format, filter)
│       ├── tenant-renderer.js            # Card rendering functions
│       ├── tenant-lifecycle.js           # Lifecycle actions (verify, suspend, close)
│       ├── modal-manager.js              # Modal management (audit log, bulk import)
│       └── tenant-app.js                 # Main application logic
├── super_admin_home.html                 # Dashboard home page
├── super_admin_accounts.html             # Super admin account management
├── tenant_create_account.html            # Tenant creation form
├── tenant_edit.html                      # Tenant editing form
├── tenant_suspend.html                   # Tenant suspension page
├── tenant_close.html                     # Tenant closure page
└── tenant_search.html                    # Advanced search page

Index.html                     # Main tenant management page (use this!)
```

## 🎯 Key Features

### 1. **Modular Architecture**
- Separated CSS for styles (tenant management + modals)
- Separated JavaScript by functionality (data, utils, rendering, lifecycle, modals, app)
- Easy to maintain and update individual components

### 2. **Main Files**

#### CSS Files
- **tenant-management-styles.css**: All styles for sidebar, cards, filters, badges, buttons
- **modal-styles.css**: All modal-related styles (audit log, bulk import)

#### JavaScript Files
- **tenant-data.js**: Mock data and business type mappings
- **tenant-utils.js**: Utility functions (status helpers, formatters, filters, admin checks)
- **tenant-renderer.js**: Rendering functions for cards, franchisees, drafts
- **tenant-lifecycle.js**: Lifecycle management (verify, reject, suspend, restore, close, bulk actions)
- **modal-manager.js**: Modal handling (show/hide audit log, bulk import, file upload)
- **tenant-app.js**: Main application initialization and coordination

### 3. **Main Entry Point**
**Index.html** - The main page that includes:
- Sidebar navigation
- Tenant management interface
- Tabs (All, Verified, Awaiting, Rejected, Inactive, Suspended, Closed, Draft)
- Filters (Search, Plan, Status)
- Bulk actions
- Modals (Audit Log, Bulk Import)

## 🚀 How to Use

### Basic Usage
1. Open `Index.html` in your browser
2. Use tabs to filter tenants by status
3. Use search and filter dropdowns to refine results
4. Click on tenant rows to expand franchisees (if any)
5. Use action buttons to manage tenants

### Admin Features
- Verify/Reject awaiting tenants
- Suspend/Restore active tenants
- Close any tenant (except already closed)
- Bulk operations on selected tenants

### Bulk Import
1. Click "Bulk Import" button
2. Download CSV template
3. Fill in tenant data
4. Upload CSV file
5. Start import process

## 🔧 Customization

### Adding New Tenant Statuses
1. Update `getStatusBadge()` in `tenant-utils.js`
2. Update `getStatusDot()` in `tenant-utils.js`
3. Update `getStatusText()` in `tenant-utils.js`
4. Add CSS classes in `tenant-management-styles.css`

### Adding New Actions
1. Create action function in `tenant-lifecycle.js`
2. Update `renderActionButtons()` in `tenant-renderer.js`
3. Add button handlers in `tenant-app.js` if needed

### Adding New Filters
1. Add filter dropdown in `Index.html`
2. Update `currentFilters` object in `tenant-app.js`
3. Add listener in `initFilterListeners()` in `tenant-app.js`
4. Update `filterTenants()` in `tenant-utils.js`

### Styling Changes
- Edit `tenant-management-styles.css` for main styles
- Edit `modal-styles.css` for modal styles
- All styles use CSS custom properties for easy theming

## 📊 Data Structure

### Tenant Object
```javascript
{
    id: 1,
    name: "McDonald's Franchise",
    subdomain: "mcdonalds",
    industry: "food-beverage",
    businessType: "restaurant-fast-food",
    plan: "enterprise",
    status: "verified",
    paymentStatus: "paid",
    selfCreated: false,
    contact: "admin@mcdonalds.com",
    created: "2024-01-15",
    lastActivity: "2024-10-01",
    franchisees: [
        { id: 101, name: "McDonald's Downtown", status: "verified" }
    ]
}
```

### Status Values
- `draft` - Not paid yet
- `awaiting` - Awaiting verification
- `verified` - Paid and verified
- `rejected` - Verification rejected
- `inactive` - Payment failed or expired
- `suspended` - Temporarily suspended
- `closed` - Permanently closed

## 🎨 Style Guide

### Colors
- Primary Blue: `#007bff`
- Success Green: `#28a745`
- Warning Yellow: `#ffc107`
- Danger Red: `#dc3545`
- Background: `#f5f7fa`
- White: `#ffffff`
- Text Dark: `#2c3e50`
- Text Muted: `#6c757d`

### Typography
- Font Family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Base Size: 14px
- Line Height: 1.6

## 📱 Responsive Design
- Desktop: Full sidebar (250px)
- Tablet: Reduced sidebar (200px)
- Mobile: Collapsible sidebar with toggle button

## 🔗 Integration Points

### Linking to Other Pages
- Home: `SuperAdmin_Functions/super_admin_home.html`
- Accounts: `SuperAdmin_Functions/super_admin_accounts.html`
- Create Tenant: `SuperAdmin_Functions/tenant_create_account.html`
- Edit Tenant: `SuperAdmin_Functions/tenant_edit.html?tenantId={id}`
- Suspend: `SuperAdmin_Functions/tenant_suspend.html?tenantId={id}`
- Close: `SuperAdmin_Functions/tenant_close.html?tenantId={id}`

### API Integration (Future)
Replace mock data in `tenant-data.js` with API calls:
```javascript
// Example:
async function fetchTenants() {
    const response = await fetch('/api/tenants');
    return await response.json();
}
```

## 🐛 Debugging

### Console Logs
The system logs initialization: `"Tenant Management System initialized"`

### Common Issues
1. **Tabs not working**: Check if all tab IDs match in HTML and JS
2. **Filters not applying**: Verify filter IDs in HTML match event listeners
3. **Modals not showing**: Check z-index and display properties
4. **Cards not rendering**: Verify tenants array is loaded and filterAndRender() is called

## 📝 Notes

- All JavaScript files are loaded in dependency order at the bottom of HTML
- CSS files are loaded in the `<head>` section
- Mobile sidebar toggle is automatically initialized on small screens
- Admin-only features check `isAdmin()` function
- Draft management uses localStorage
- All modals support ESC key to close

## 🔄 Version History

**Version 1.0** (October 2, 2025)
- Initial modular structure
- Separated CSS and JS files
- Complete tenant management functionality
- Bulk operations support
- Modal system (Audit Log, Bulk Import)
- Responsive design
- Draft management
