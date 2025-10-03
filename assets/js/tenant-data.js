// Mock Tenant Data
const tenants = [
    {
        id: 1,
        name: "McDonald's Franchise",
        subdomain: "mcdonalds",
        industry: "food-beverage",
        businessType: "restaurant-fast-food",
        plan: "enterprise",
        status: "awaiting",
        paymentStatus: "paid",
        selfCreated: false,
        contact: "admin@mcdonalds.com",
        created: "2024-01-15",
        lastActivity: "2024-10-01",
        franchisees: [
            { id: 101, name: "McDonald's Downtown", status: "awaiting" },
            { id: 102, name: "McDonald's Airport", status: "awaiting" }
        ]
    },
    {
        id: 2,
        name: "Starbucks Coffee",
        subdomain: "starbucks",
        industry: "food-beverage",
        businessType: "cafe-coffee-shop",
        plan: "enterprise",
        status: "verified",
        paymentStatus: "paid",
        selfCreated: false,
        contact: "contact@starbucks.com",
        created: "2024-02-20",
        lastActivity: "2024-10-02",
        franchisees: [
            { id: 201, name: "Starbucks Central", status: "verified" },
            { id: 202, name: "Starbucks Mall", status: "verified" }
        ]
    },
    {
        id: 3,
        name: "Joe's Pizza",
        subdomain: "joespizza",
        industry: "food-beverage",
        businessType: "restaurant-casual",
        plan: "professional",
        status: "suspended",
        paymentStatus: "paid",
        selfCreated: false,
        contact: "joe@joespizza.com",
        created: "2024-03-10",
        lastActivity: "2024-09-15",
        franchisees: []
    },
    {
        id: 4,
        name: "BookStore Plus",
        subdomain: "bookstore",
        industry: "retail",
        businessType: "books-media",
        plan: "basic",
        status: "closed",
        paymentStatus: "paid",
        selfCreated: false,
        contact: "admin@bookstore.com",
        created: "2023-12-01",
        lastActivity: "2024-08-30",
        franchisees: []
    },
    {
        id: 5,
        name: "Pizza Hut Express",
        subdomain: "pizzahut",
        industry: "food-beverage",
        businessType: "restaurant-fast-food",
        plan: "professional",
        status: "inactive",
        paymentStatus: "unpaid",
        selfCreated: true,
        contact: "owner@pizzahut.com",
        created: "2024-09-15",
        lastActivity: "2024-09-20",
        franchisees: []
    },
    {
        id: 6,
        name: "TechSupport Co",
        subdomain: "techsupport",
        industry: "services",
        businessType: "consulting",
        plan: "basic",
        status: "inactive",
        paymentStatus: "failed",
        selfCreated: true,
        contact: "info@techsupport.com",
        created: "2024-09-18",
        lastActivity: "2024-09-25",
        franchisees: []
    }
];

// Business types mapping
const businessTypes = {
    'food-beverage': [
        { value: 'restaurant-fast-food', text: 'Fast Food Restaurant' },
        { value: 'restaurant-casual', text: 'Casual Dining Restaurant' },
        { value: 'restaurant-fine-dining', text: 'Fine Dining Restaurant' },
        { value: 'cafe-coffee-shop', text: 'Cafe & Coffee Shop' },
        { value: 'bar-pub', text: 'Bar & Pub' },
        { value: 'bakery-patisserie', text: 'Bakery & Patisserie' },
        { value: 'catering', text: 'Catering Services' }
    ],
    'retail': [
        { value: 'electronics', text: 'Electronics Store' },
        { value: 'books-media', text: 'Books & Media Store' },
        { value: 'toys-games', text: 'Toys & Games Store' },
        { value: 'apparel-fashion', text: 'Apparel & Fashion' },
        { value: 'grocery-supermarket', text: 'Grocery & Supermarket' },
        { value: 'convenience-store', text: 'Convenience Store' },
        { value: 'specialty-retail', text: 'Specialty Retail Store' }
    ],
    'services': [
        { value: 'childcare', text: 'Childcare Center' },
        { value: 'gym-fitness', text: 'Gym & Fitness Center' },
        { value: 'yoga-studio', text: 'Yoga Studio' },
        { value: 'spa-beauty', text: 'Spa & Beauty Salon' },
        { value: 'education-tutoring', text: 'Education & Tutoring' },
        { value: 'automotive-repair', text: 'Automotive Repair Shop' },
        { value: 'car-wash', text: 'Car Wash Service' },
        { value: 'accounting', text: 'Accounting Services' },
        { value: 'consulting', text: 'Consulting Services' },
        { value: 'real-estate', text: 'Real Estate Agency' }
    ],
    'hospitality': [
        { value: 'hotel-motel', text: 'Hotel & Motel' },
        { value: 'travel-agency', text: 'Travel Agency' },
        { value: 'bed-breakfast', text: 'Bed & Breakfast' },
        { value: 'hostel', text: 'Hostel' },
        { value: 'resort', text: 'Resort' }
    ],
    'health-medical': [
        { value: 'dental-clinic', text: 'Dental Clinic' },
        { value: 'medical-clinic', text: 'Medical Clinic' },
        { value: 'pharmacy', text: 'Pharmacy' },
        { value: 'home-care', text: 'Home Care Services' },
        { value: 'veterinary', text: 'Veterinary Clinic' },
        { value: 'mental-health', text: 'Mental Health Services' }
    ],
    'home-garden': [
        { value: 'home-improvement', text: 'Home Improvement & Repair' },
        { value: 'landscaping', text: 'Landscaping Services' },
        { value: 'cleaning-services', text: 'Cleaning Services' },
        { value: 'pest-control', text: 'Pest Control Services' },
        { value: 'pool-maintenance', text: 'Pool Maintenance' },
        { value: 'hvac-services', text: 'HVAC Services' }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tenants, businessTypes };
}
