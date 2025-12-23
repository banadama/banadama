/**
 * PRICING API - TEST EXAMPLES
 * 
 * Examples for testing the /api/requests/[id]/quote endpoint
 */

// ============================================
// EXAMPLE 1: Small Order (Clothing)
// ============================================
const example1_SmallClothingOrder = {
    scenario: {
        product: "T-Shirts",
        unitPrice: 2000,
        quantity: 50,
        category: "Clothing",
        region: "Lagos",
        servicePlan: "BASIC"
    },

    request: {
        method: "POST",
        url: "/api/requests/REQUEST_ID/quote",
        headers: {
            "Authorization": "Bearer YOUR_TOKEN",
            "Content-Type": "application/json"
        },
        body: {
            hasAffiliate: false,
            hasSupplierReferral: false
        }
    },

    expectedBreakdown: {
        productTotal: 100000,          // 2000 × 50
        specialPackagingFeePerUnit: 1000,  // 1-100 tier
        specialPackagingTotal: 50000,  // 1000 × 50
        fulfillment: {
            rate: 0.052,
            amount: 5200                 // 100000 × 5.2%
        },
        affiliate: {
            perSignup: 50,
            perSalePercent: 0.01,        // SMALL order (< 50k... actually 100k so MEDIUM)
            perSupplierVerify: 0,
            estimatedSaleCommission: 1000,
            totalAffiliateCost: 1050
        },
        duty: {
            rate: 0.07,                  // CLOTHING = 7%
            amount: 7000                 // 100000 × 7%
        },
        delivery: {
            base: 2000,                  // LAGOS
            estimatedRange: [1500, 2500]
        },
        discounts: 0,
        grandTotal: 164200           // Sum of all
    }
};

// ============================================
// EXAMPLE 2: Medium Order (Electronics)
// ============================================
const example2_MediumElectronicsOrder = {
    scenario: {
        product: "Smartphones",
        unitPrice: 80000,
        quantity: 25,
        category: "Electronics",
        region: "Lagos",
        servicePlan: "PREMIUM"
    },

    request: {
        method: "POST",
        url: "/api/requests/REQUEST_ID/quote",
        headers: {
            "Authorization": "Bearer YOUR_TOKEN",
            "Content-Type": "application/json"
        },
        body: {
            hasAffiliate: true,
            hasSupplierReferral: false
        }
    },

    expectedBreakdown: {
        productTotal: 2000000,         // 80000 × 25
        specialPackagingFeePerUnit: 1000,
        specialPackagingTotal: 25000,  // 1000 × 25
        fulfillment: {
            rate: 0.052,
            amount: 104000               // 2000000 × 5.2%
        },
        affiliate: {
            perSignup: 50,
            perSalePercent: 0.03,        // LARGE order (> 300k)
            perSupplierVerify: 0,
            estimatedSaleCommission: 60000,  // 2000000 × 3%
            totalAffiliateCost: 60050
        },
        duty: {
            rate: 0.10,                  // ELECTRONICS = 10%
            amount: 200000               // 2000000 × 10%
        },
        delivery: {
            base: 2000,
            estimatedRange: [1500, 2500]
        },
        discounts: 0,
        grandTotal: 2331000
    }
};

// ============================================
// EXAMPLE 3: Large Order (Industrial)
// ============================================
const example3_LargeIndustrialOrder = {
    scenario: {
        product: "Industrial Machinery Parts",
        unitPrice: 50000,
        quantity: 500,
        category: "Industrial",
        region: "North",
        servicePlan: "BUSINESS"
    },

    request: {
        method: "POST",
        url: "/api/requests/REQUEST_ID/quote",
        headers: {
            "Authorization": "Bearer YOUR_TOKEN",
            "Content-Type": "application/json"
        },
        body: {
            hasAffiliate: true,
            hasSupplierReferral: true
        }
    },

    expectedBreakdown: {
        productTotal: 25000000,        // 50000 × 500
        specialPackagingFeePerUnit: 930,  // 301-500 tier
        specialPackagingTotal: 465000, // 930 × 500
        fulfillment: {
            rate: 0.052,
            amount: 1300000              // 25000000 × 5.2%
        },
        affiliate: {
            perSignup: 50,
            perSalePercent: 0.03,        // LARGE order
            perSupplierVerify: 100,
            estimatedSaleCommission: 750000,  // 25000000 × 3%
            totalAffiliateCost: 750150
        },
        duty: {
            rate: 0.15,                  // INDUSTRIAL = 15%
            amount: 3750000              // 25000000 × 15%
        },
        delivery: {
            base: 4000,                  // NORTH
            estimatedRange: [3000, 6000]
        },
        discounts: 0,
        grandTotal: 30519000
    }
};

// ============================================
// EXAMPLE 4: Bulk Order with Tiered Packaging
// ============================================
const example4_BulkOrderWithTiering = {
    scenario: {
        product: "Bags",
        unitPrice: 3000,
        quantity: 1200,
        category: "Bags",
        region: "South West",
        servicePlan: "BUSINESS"
    },

    request: {
        method: "POST",
        url: "/api/requests/REQUEST_ID/quote",
        headers: {
            "Authorization": "Bearer YOUR_TOKEN",
            "Content-Type": "application/json"
        },
        body: {
            hasAffiliate: false,
            hasSupplierReferral: false
        }
    },

    expectedBreakdown: {
        productTotal: 3600000,         // 3000 × 1200
        specialPackagingFeePerUnit: 880,  // 1001+ tier
        specialPackagingTotal: 1056000,   // 880 × 1200
        fulfillment: {
            rate: 0.052,
            amount: 187200               // 3600000 × 5.2%
        },
        affiliate: {
            perSignup: 50,
            perSalePercent: 0,
            perSupplierVerify: 0,
            estimatedSaleCommission: 0,
            totalAffiliateCost: 0
        },
        duty: {
            rate: 0.07,                  // BAGS = 7%
            amount: 252000               // 3600000 × 7%
        },
        delivery: {
            base: 2500,                  // SOUTH_WEST
            estimatedRange: [2000, 3500]
        },
        discounts: 0,
        grandTotal: 5097700
    }
};

// ============================================
// CURL COMMAND EXAMPLES
// ============================================

// Example 1: Basic request
const curl1 = `
curl -X POST http://localhost:3000/api/requests/clxxx123/quote \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "hasAffiliate": false,
    "hasSupplierReferral": false
  }'
`;

// Example 2: With affiliate
const curl2 = `
curl -X POST http://localhost:3000/api/requests/clxxx456/quote \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "hasAffiliate": true,
    "hasSupplierReferral": true
  }'
`;

// Example 3: Production URL
const curl3 = `
curl -X POST https://yourdomain.com/api/requests/clxxx789/quote \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "hasAffiliate": true,
    "hasSupplierReferral": false
  }'
`;

// ============================================
// JAVASCRIPT/FETCH EXAMPLES
// ============================================

async function getPricingQuote(requestId, options = {}) {
    try {
        const response = await fetch(`/api/requests/${requestId}/quote`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                hasAffiliate: options.hasAffiliate || false,
                hasSupplierReferral: options.hasSupplierReferral || false,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch quote');
        }

        const data = await response.json();
        console.log('Pricing Breakdown:', data.breakdown);
        console.log('Grand Total:', `₦${data.breakdown.grandTotal.toLocaleString()}`);

        return data;
    } catch (error) {
        console.error('Error fetching quote:', error);
        throw error;
    }
}

// Usage examples
async function examples() {
    // Example 1: Basic quote
    await getPricingQuote('clxxx123');

    // Example 2: With affiliate
    await getPricingQuote('clxxx456', {
        hasAffiliate: true
    });

    // Example 3: With both affiliate and supplier referral
    await getPricingQuote('clxxx789', {
        hasAffiliate: true,
        hasSupplierReferral: true
    });
}

// ============================================
// RESPONSE VALIDATION
// ============================================

function validatePricingBreakdown(breakdown) {
    const required = [
        'productTotal',
        'specialPackagingFeePerUnit',
        'specialPackagingTotal',
        'fulfillment',
        'affiliate',
        'duty',
        'delivery',
        'discounts',
        'grandTotal'
    ];

    for (const field of required) {
        if (!(field in breakdown)) {
            throw new Error(`Missing required field: ${field}`);
        }
    }

    // Validate fulfillment
    if (breakdown.fulfillment.rate !== 0.052) {
        console.warn('Unexpected fulfillment rate');
    }

    // Validate special packaging tiers
    const qty = breakdown.specialPackagingTotal / breakdown.specialPackagingFeePerUnit;
    const expectedFee = getExpectedPackagingFee(qty);
    if (breakdown.specialPackagingFeePerUnit !== expectedFee) {
        console.warn('Special packaging fee might be incorrect');
    }

    // Validate total calculation
    const calculatedTotal =
        breakdown.productTotal +
        breakdown.specialPackagingTotal +
        breakdown.fulfillment.amount +
        breakdown.duty.amount +
        breakdown.delivery.base -
        breakdown.discounts;

    if (Math.abs(calculatedTotal - breakdown.grandTotal) > 1) {
        console.error('Grand total calculation mismatch');
    }

    return true;
}

function getExpectedPackagingFee(quantity) {
    if (quantity <= 100) return 1000;
    if (quantity <= 200) return 980;
    if (quantity <= 300) return 950;
    if (quantity <= 500) return 930;
    if (quantity <= 1000) return 900;
    return 880;
}

// ============================================
// ERROR HANDLING EXAMPLES
// ============================================

// Error: Unauthorized
const error401 = {
    status: 401,
    body: { error: "Unauthorized" }
};

// Error: Forbidden (not owner or admin)
const error403 = {
    status: 403,
    body: { error: "Forbidden" }
};

// Error: Request not found
const error404 = {
    status: 404,
    body: { error: "Request not found" }
};

// Error: Server error
const error500 = {
    status: 500,
    body: { error: "Internal server error" }
};

// ============================================
// INTEGRATION TEST EXAMPLE
// ============================================

async function integrationTest() {
    console.log('🧪 Running Pricing API Integration Test...\n');

    // Test 1: Small order
    console.log('Test 1: Small Clothing Order');
    try {
        const result1 = await getPricingQuote('test_request_1');
        console.log('✅ Small order test passed');
        console.log(`   Total: ₦${result1.breakdown.grandTotal.toLocaleString()}\n`);
    } catch (err) {
        console.error('❌ Small order test failed:', err.message, '\n');
    }

    // Test 2: Large order with affiliate
    console.log('Test 2: Large Order with Affiliate');
    try {
        const result2 = await getPricingQuote('test_request_2', {
            hasAffiliate: true,
            hasSupplierReferral: true
        });
        console.log('✅ Large order test passed');
        console.log(`   Total: ₦${result2.breakdown.grandTotal.toLocaleString()}`);
        console.log(`   Affiliate Cost: ₦${result2.breakdown.affiliate.totalAffiliateCost.toLocaleString()}\n`);
    } catch (err) {
        console.error('❌ Large order test failed:', err.message, '\n');
    }

    // Test 3: Unauthorized access
    console.log('Test 3: Unauthorized Access');
    try {
        // Remove auth token temporarily
        const result3 = await fetch('/api/requests/test_request_3/quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        if (result3.status === 401) {
            console.log('✅ Unauthorized access correctly blocked\n');
        } else {
            console.error('❌ Unauthorized access test failed\n');
        }
    } catch (err) {
        console.error('❌ Unauthorized access test error:', err.message, '\n');
    }

    console.log('🎉 Integration tests complete!');
}

// Export examples
module.exports = {
    example1_SmallClothingOrder,
    example2_MediumElectronicsOrder,
    example3_LargeIndustrialOrder,
    example4_BulkOrderWithTiering,
    getPricingQuote,
    validatePricingBreakdown,
    integrationTest,
};
