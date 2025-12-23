/**
 * VERIFICATION SYSTEM - API EXAMPLES
 * 
 * This file contains example requests/responses for testing the verification system.
 * Use these examples with tools like Postman, Thunder Client, or your frontend.
 */

// ============================================
// USER ENDPOINTS
// ============================================

/**
 * 1. CHECK VERIFICATION STATUS
 * GET /api/verification
 * Authentication: Required (any authenticated user)
 */
const exampleGetVerificationStatus = {
    method: 'GET',
    endpoint: '/api/verification',
    headers: {
        'Authorization': 'Bearer <your-token>',
        'Content-Type': 'application/json'
    },

    // Response when NO verification exists
    response_unverified: {
        status: "UNVERIFIED",
        role: "BUYER",
        verification: null
    },

    // Response when verification exists
    response_verified: {
        status: "PENDING",
        role: "BUYER",
        verification: {
            id: "clxxxx",
            userId: "clyyyy",
            role: "BUYER",
            status: "PENDING",
            documents: {
                businessRegistration: "https://storage.example.com/doc1.pdf",
                taxId: "https://storage.example.com/doc2.pdf",
                addressProof: "https://storage.example.com/doc3.pdf"
            },
            notes: null,
            rejectionReason: null,
            createdAt: "2024-01-15T10:30:00.000Z",
            updatedAt: "2024-01-15T10:30:00.000Z",
            reviewedAt: null,
            reviewedById: null
        }
    }
};

/**
 * 2. SUBMIT/UPDATE VERIFICATION
 * POST /api/verification
 * Authentication: Required (any authenticated user)
 */
const exampleSubmitVerification = {
    method: 'POST',
    endpoint: '/api/verification',
    headers: {
        'Authorization': 'Bearer <your-token>',
        'Content-Type': 'application/json'
    },

    // Request body - must include documents object
    body: {
        documents: {
            businessRegistration: "https://storage.example.com/business-cert.pdf",
            taxId: "TAX-2024-123456",
            addressProof: "https://storage.example.com/utility-bill.pdf",
            // Additional fields based on role
            factoryLicense: "https://storage.example.com/factory-license.pdf", // For FACTORY
            productCatalog: "https://storage.example.com/catalog.pdf", // For WHOLESALER
        }
    },

    response: {
        message: "Verification submitted",
        verification: {
            id: "clxxxx",
            userId: "clyyyy",
            role: "BUYER",
            status: "PENDING",
            documents: {
                businessRegistration: "https://storage.example.com/business-cert.pdf",
                taxId: "TAX-2024-123456",
                addressProof: "https://storage.example.com/utility-bill.pdf"
            },
            notes: null,
            rejectionReason: null,
            createdAt: "2024-01-15T10:30:00.000Z",
            updatedAt: "2024-01-15T10:30:00.000Z",
            reviewedAt: null,
            reviewedById: null
        }
    }
};

// ============================================
// ADMIN/OPS ENDPOINTS
// ============================================

/**
 * 3. LIST ALL VERIFICATIONS (Admin Dashboard)
 * GET /api/admin/verifications
 * Authentication: Required (ADMIN or OPS role only)
 */
const exampleListVerifications = {
    method: 'GET',
    endpoint: '/api/admin/verifications',
    headers: {
        'Authorization': 'Bearer <admin-token>',
        'Content-Type': 'application/json'
    },

    // Query parameters
    queryParams: {
        // Filter by status
        status: 'PENDING', // UNVERIFIED | PENDING | APPROVED | REJECTED

        // Filter by role
        role: 'BUYER', // BUYER | FACTORY | WHOLESALER | CREATOR

        // Pagination
        page: '1',
        pageSize: '20'
    },

    // Full URL example
    fullUrl: '/api/admin/verifications?status=PENDING&role=BUYER&page=1&pageSize=20',

    response: {
        data: [
            {
                id: "clxxxx1",
                userId: "user1",
                role: "BUYER",
                status: "PENDING",
                documents: { /* ... */ },
                notes: null,
                rejectionReason: null,
                createdAt: "2024-01-15T10:30:00.000Z",
                updatedAt: "2024-01-15T10:30:00.000Z",
                reviewedAt: null,
                reviewedById: null,
                user: {
                    id: "user1",
                    email: "buyer@example.com",
                    role: "BUYER"
                },
                reviewedBy: null
            },
            {
                id: "clxxxx2",
                userId: "user2",
                role: "FACTORY",
                status: "PENDING",
                documents: { /* ... */ },
                notes: null,
                rejectionReason: null,
                createdAt: "2024-01-14T09:20:00.000Z",
                updatedAt: "2024-01-14T09:20:00.000Z",
                reviewedAt: null,
                reviewedById: null,
                user: {
                    id: "user2",
                    email: "factory@example.com",
                    role: "FACTORY"
                },
                reviewedBy: null
            }
        ],
        meta: {
            page: 1,
            pageSize: 20,
            total: 45,
            totalPages: 3
        }
    }
};

/**
 * 4. APPROVE VERIFICATION
 * PATCH /api/verification/[id]
 * Authentication: Required (ADMIN or OPS role only)
 */
const exampleApproveVerification = {
    method: 'PATCH',
    endpoint: '/api/verification/clxxxx1',
    headers: {
        'Authorization': 'Bearer <admin-token>',
        'Content-Type': 'application/json'
    },

    body: {
        status: 'APPROVED',
        notes: 'All documents verified. Business registration and tax ID confirmed.'
    },

    response: {
        id: "clxxxx1",
        userId: "user1",
        role: "BUYER",
        status: "APPROVED",
        documents: { /* ... */ },
        notes: "All documents verified. Business registration and tax ID confirmed.",
        rejectionReason: null,
        createdAt: "2024-01-15T10:30:00.000Z",
        updatedAt: "2024-01-15T14:20:00.000Z",
        reviewedAt: "2024-01-15T14:20:00.000Z",
        reviewedById: "admin1",
        user: {
            id: "user1",
            email: "buyer@example.com",
            role: "BUYER"
        },
        reviewedBy: {
            id: "admin1",
            email: "admin@banadama.com",
            role: "ADMIN"
        }
    }
};

/**
 * 5. REJECT VERIFICATION
 * PATCH /api/verification/[id]
 * Authentication: Required (ADMIN or OPS role only)
 */
const exampleRejectVerification = {
    method: 'PATCH',
    endpoint: '/api/verification/clxxxx2',
    headers: {
        'Authorization': 'Bearer <admin-token>',
        'Content-Type': 'application/json'
    },

    body: {
        status: 'REJECTED',
        rejectionReason: 'Business registration document is unclear. Please provide a clearer scan or photo.',
        notes: 'User contacted via email with instructions to resubmit.'
    },

    response: {
        id: "clxxxx2",
        userId: "user2",
        role: "FACTORY",
        status: "REJECTED",
        documents: { /* ... */ },
        notes: "User contacted via email with instructions to resubmit.",
        rejectionReason: "Business registration document is unclear. Please provide a clearer scan or photo.",
        createdAt: "2024-01-14T09:20:00.000Z",
        updatedAt: "2024-01-15T14:25:00.000Z",
        reviewedAt: "2024-01-15T14:25:00.000Z",
        reviewedById: "admin1",
        user: {
            id: "user2",
            email: "factory@example.com",
            role: "FACTORY"
        },
        reviewedBy: {
            id: "admin1",
            email: "admin@banadama.com",
            role: "ADMIN"
        }
    }
};

// ============================================
// FRONTEND HOOK USAGE EXAMPLES
// ============================================

/**
 * Example: User submitting verification
 */
function UserVerificationPage() {
    const { status, verification, isLoading, error, submitVerification } = useVerification();

    const handleSubmit = async (documents) => {
        try {
            await submitVerification(documents);
            // Show success message
            toast.success('Verification submitted successfully!');
        } catch (err) {
            // Show error message
            toast.error(err.message);
        }
    };

    // Render UI based on status
    if (status === 'UNVERIFIED') {
        return <VerificationForm onSubmit={ handleSubmit } />;
    }

    if (status === 'PENDING') {
        return <PendingVerification verification={ verification } />;
    }

    if (status === 'APPROVED') {
        return <ApprovedBadge />;
    }

    if (status === 'REJECTED') {
        return <RejectionNotice reason={ verification.rejectionReason } />;
    }
}

/**
 * Example: Admin reviewing verifications
 */
function AdminVerificationsPage() {
    const {
        verifications,
        total,
        isLoading,
        page,
        setPage,
        filters,
        setFilters,
        reviewVerification
    } = useAdminVerifications();

    const handleApprove = async (id) => {
        try {
            await reviewVerification(id, {
                status: 'APPROVED',
                notes: 'Verified by admin'
            });
            toast.success('Verification approved!');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleReject = async (id, reason) => {
        try {
            await reviewVerification(id, {
                status: 'REJECTED',
                rejectionReason: reason,
                notes: 'Rejected - see reason'
            });
            toast.success('Verification rejected');
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <VerificationTable 
      data= { verifications }
    onApprove = { handleApprove }
    onReject = { handleReject }
    pagination = {{ page, total, onChange: setPage }
}
filters = { filters }
onFilterChange = { setFilters }
    />
  );
}

// ============================================
// ERROR RESPONSES
// ============================================

const errorResponses = {
    // Not authenticated
    unauthorized: {
        status: 401,
        body: { error: "Unauthorized" }
    },

    // Not ADMIN or OPS (for admin endpoints)
    forbidden: {
        status: 403,
        body: { error: "Forbidden" }
    },

    // Missing documents in POST request
    missingDocuments: {
        status: 400,
        body: { error: "Missing documents payload" }
    },

    // Invalid status in PATCH request
    invalidStatus: {
        status: 400,
        body: { error: "status must be APPROVED or REJECTED" }
    },

    // Verification not found
    notFound: {
        status: 404,
        body: { error: "Verification not found" }
    },

    // Server error
    serverError: {
        status: 500,
        body: { error: "Internal server error" }
    }
};

export {
    exampleGetVerificationStatus,
    exampleSubmitVerification,
    exampleListVerifications,
    exampleApproveVerification,
    exampleRejectVerification,
    errorResponses
};
