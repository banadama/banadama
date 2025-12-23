// prisma/seed.ts
// Comprehensive seed script for Banadama MVP testing

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // ============================================
    // 1. SERVICE PLANS
    // ============================================
    console.log('📋 Creating service plans...');

    const basicPlan = await prisma.servicePlan.upsert({
        where: { tier: 'BASIC' },
        update: {},
        create: {
            tier: 'BASIC',
            name: 'Basic Plan',
            price: 0,
            description: 'Standard fulfillment service',
            features: ['Standard support', 'Basic tracking', '5% escrow fee'],
        },
    });

    const premiumPlan = await prisma.servicePlan.upsert({
        where: { tier: 'PREMIUM' },
        update: {},
        create: {
            tier: 'PREMIUM',
            name: 'Premium Plan',
            price: 500000, // ₦5,000/month
            description: 'Priority fulfillment and support',
            features: ['Priority support', 'Real-time tracking', '3% escrow fee', 'Dedicated account manager'],
        },
    });

    const businessPlan = await prisma.servicePlan.upsert({
        where: { tier: 'BUSINESS' },
        update: {},
        create: {
            tier: 'BUSINESS',
            name: 'Business Plan',
            price: 2000000, // ₦20,000/month
            description: 'Enterprise-grade service',
            features: ['24/7 VIP support', 'Real-time tracking', '2% escrow fee', 'Dedicated team', 'Custom pricing'],
        },
    });

    // ============================================
    // 2. USERS
    // ============================================
    console.log('👥 Creating users...');

    // Admin
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@banadama.com' },
        update: {},
        create: {
            email: 'admin@banadama.com',
            role: 'ADMIN',
            country: 'NG',
            isActive: true,
        },
    });

    // Ops
    const opsUser = await prisma.user.upsert({
        where: { email: 'ops@banadama.com' },
        update: {},
        create: {
            email: 'ops@banadama.com',
            role: 'OPS',
            country: 'NG',
            isActive: true,
        },
    });

    // Buyer 1 (Nigeria)
    const buyer1User = await prisma.user.upsert({
        where: { email: 'john@example.com' },
        update: {},
        create: {
            email: 'john@example.com',
            role: 'BUYER',
            country: 'NG',
            isActive: true,
        },
    });

    const buyer1Profile = await prisma.buyerProfile.upsert({
        where: { userId: buyer1User.id },
        update: {},
        create: {
            userId: buyer1User.id,
            companyName: 'John\'s Fashion Store',
            phoneNumber: '+234 800 000 0001',
            defaultAddress: '123 Main Street',
            defaultCity: 'Lagos',
            defaultCountry: 'NG',
        },
    });

    // Buyer 2 (Bangladesh)
    const buyer2User = await prisma.user.upsert({
        where: { email: 'amina@bdstore.bd' },
        update: {},
        create: {
            email: 'amina@bdstore.bd',
            role: 'BUYER',
            country: 'BD',
            isActive: true,
        },
    });

    const buyer2Profile = await prisma.buyerProfile.upsert({
        where: { userId: buyer2User.id },
        update: {},
        create: {
            userId: buyer2User.id,
            companyName: 'BD Fashion Hub',
            phoneNumber: '+880 1234 567890',
            defaultAddress: 'Dhaka Central',
            defaultCity: 'Dhaka',
            defaultCountry: 'BD',
        },
    });

    // Buyer 3 (Global)
    const buyer3User = await prisma.user.upsert({
        where: { email: 'sarah@globalshop.com' },
        update: {},
        create: {
            email: 'sarah@globalshop.com',
            role: 'BUYER',
            country: 'US',
            isActive: true,
        },
    });

    const buyer3Profile = await prisma.buyerProfile.upsert({
        where: { userId: buyer3User.id },
        update: {},
        create: {
            userId: buyer3User.id,
            companyName: 'Global Fashion Inc',
            phoneNumber: '+1 555 123 4567',
            defaultAddress: 'New York',
            defaultCity: 'New York',
            defaultCountry: 'US',
        },
    });

    // Supplier 1 (Factory - Nigeria)
    const supplier1User = await prisma.user.upsert({
        where: { email: 'factory@lagostextiles.ng' },
        update: {},
        create: {
            email: 'factory@lagostextiles.ng',
            role: 'SUPPLIER',
            country: 'NG',
            isActive: true,
        },
    });

    const supplier1Profile = await prisma.supplierProfile.upsert({
        where: { userId: supplier1User.id },
        update: {},
        create: {
            userId: supplier1User.id,
            businessName: 'Lagos Textiles Factory',
            type: 'FACTORY',
            phoneNumber: '+234 800 111 2222',
            address: 'Industrial Area, Ikeja',
            city: 'Lagos',
            isVerified: true,
            verifiedAt: new Date(),
        },
    });

    // Supplier 2 (Wholesaler - Bangladesh)
    const supplier2User = await prisma.user.upsert({
        where: { email: 'wholesale@dhakatex.bd' },
        update: {},
        create: {
            email: 'wholesale@dhakatex.bd',
            role: 'SUPPLIER',
            country: 'BD',
            isActive: true,
        },
    });

    const supplier2Profile = await prisma.supplierProfile.upsert({
        where: { userId: supplier2User.id },
        update: {},
        create: {
            userId: supplier2User.id,
            businessName: 'Dhaka Textiles Wholesale',
            type: 'WHOLESALER',
            phoneNumber: '+880 1234 999888',
            address: 'Trade Center, Dhaka',
            city: 'Dhaka',
            isVerified: true,
            verifiedAt: new Date(),
        },
    });

    // Creator 1 (Digital - Graphic Designer)
    const creator1User = await prisma.user.upsert({
        where: { email: 'designer@creative.ng' },
        update: {},
        create: {
            email: 'designer@creative.ng',
            role: 'CREATOR',
            country: 'NG',
            isActive: true,
        },
    });

    const creator1Profile = await prisma.creatorProfile.upsert({
        where: { userId: creator1User.id },
        update: {},
        create: {
            userId: creator1User.id,
            displayName: 'Creative Designs NG',
            creatorType: 'GRAPHIC_DESIGNER',
            bio: 'Professional logo and brand identity designer',
            portfolio: 'https://behance.net/creativedesigns',
            isVerified: true,
            verifiedAt: new Date(),
        },
    });

    // Creator 2 (Local - Photographer)
    const creator2User = await prisma.user.upsert({
        where: { email: 'photo@snapbd.bd' },
        update: {},
        create: {
            email: 'photo@snapbd.bd',
            role: 'CREATOR',
            country: 'BD',
            isActive: true,
        },
    });

    const creator2Profile = await prisma.creatorProfile.upsert({
        where: { userId: creator2User.id },
        update: {},
        create: {
            userId: creator2User.id,
            displayName: 'Snap Photography BD',
            creatorType: 'PHOTOGRAPHER',
            bio: 'Product photography specialist',
            hourlyRate: 5000000, // ₦50,000/hour
            isVerified: true,
            verifiedAt: new Date(),
        },
    });

    // Affiliate
    const affiliateUser = await prisma.user.upsert({
        where: { email: 'affiliate@marketer.com' },
        update: {},
        create: {
            email: 'affiliate@marketer.com',
            role: 'AFFILIATE',
            country: 'NG',
            isActive: true,
        },
    });

    const affiliateProfile = await prisma.affiliateProfile.upsert({
        where: { userId: affiliateUser.id },
        update: {},
        create: {
            userId: affiliateUser.id,
            displayName: 'Pro Marketer',
            bio: 'B2B marketplace specialist',
            totalClicks: 1234,
            totalSales: 56,
            totalEarnings: 4060000, // ₦40,600
        },
    });

    // ============================================
    // 3. PRODUCTS
    // ============================================
    console.log('📦 Creating products...');

    const product1 = await prisma.product.create({
        data: {
            name: 'Custom T-Shirts (Plain Cotton)',
            description: 'High-quality cotton t-shirts for bulk orders',
            categorySlug: 'clothing',
            categoryName: 'Clothing & Textiles',
            unitPrice: 1500,
            moq: 100,
            stockQuantity: 5000,
            countryOfOrigin: 'NG',
            images: ['https://example.com/tshirt1.jpg'],
            supplierId: supplier1Profile.id,
            allowRfq: true,
            allowBuyNow: true,
            allowGroupBuy: true,
        },
    });

    const product2 = await prisma.product.create({
        data: {
            name: 'Cotton Fabric Rolls',
            description: 'Premium cotton fabric for manufacturing',
            categorySlug: 'textiles',
            categoryName: 'Raw Materials',
            unitPrice: 4500,
            moq: 50,
            stockQuantity: 500,
            countryOfOrigin: 'BD',
            images: ['https://example.com/fabric1.jpg'],
            supplierId: supplier2Profile.id,
            allowRfq: true,
            allowBuyNow: true,
            allowGroupBuy: false,
        },
    });

    const product3 = await prisma.product.create({
        data: {
            name: 'Professional Logo Design',
            description: 'Custom logo design with 3 revisions',
            categorySlug: 'design',
            categoryName: 'Digital Services',
            unitPrice: 25000,
            stockQuantity: null,
            countryOfOrigin: 'NG',
            images: ['https://example.com/logo-portfolio.jpg'],
            creatorId: creator1Profile.id,
            allowRfq: false,
            allowBuyNow: true,
            allowGroupBuy: false,
        },
    });

    // ============================================
    // 4. WALLETS
    // ============================================
    console.log('💰 Creating wallets...');

    await prisma.wallet.create({
        data: {
            userId: buyer1User.id,
            balance: 500000, // ₦5,000
            lockedBalance: 150000, // ₦1,500 in escrow
            currency: 'NGN',
            status: 'ACTIVE',
        },
    });

    await prisma.wallet.create({
        data: {
            userId: supplier1User.id,
            balance: 2500000, // ₦25,000
            lockedBalance: 0,
            currency: 'NGN',
            status: 'ACTIVE',
        },
    });

    await prisma.wallet.create({
        data: {
            userId: creator1User.id,
            balance: 1000000, // ₦10,000
            lockedBalance: 0,
            currency: 'NGN',
            status: 'ACTIVE',
        },
    });

    // ============================================
    // 5. REQUESTS (RFQs)
    // ============================================
    console.log('📝 Creating RFQs...');

    const request1 = await prisma.request.create({
        data: {
            buyerId: buyer1Profile.id,
            productId: product1.id,
            productName: 'Custom T-Shirts with Logo Print',
            quantity: 500,
            targetPrice: 1200,
            description: 'Need custom printed t-shirts for company event',
            specifications: JSON.stringify({ color: 'White', sizes: 'M, L, XL' }),
            categorySlug: 'clothing',
            deliveryAddress: '123 Main Street, Lagos',
            deliveryCity: 'Lagos',
            deliveryCountry: 'NG',
            serviceTier: 'BASIC',
            supplierId: supplier1Profile.id,
            status: 'QUOTED',
            quotedPrice: 1500,
            estimatedTotal: 825000, // Including fees
        },
    });

    const request2 = await prisma.request.create({
        data: {
            buyerId: buyer2Profile.id,
            productName: 'Bulk Cotton Fabric',
            quantity: 200,
            targetPrice: 4000,
            description: 'High-quality cotton fabric for t-shirt production',
            categorySlug: 'textiles',
            deliveryAddress: 'Dhaka Central',
            deliveryCity: 'Dhaka',
            deliveryCountry: 'BD',
            serviceTier: 'PREMIUM',
            supplierId: supplier2Profile.id,
            status: 'PENDING',
        },
    });

    // ============================================
    // 6. ORDERS
    // ============================================
    console.log('🛒 Creating orders...');

    const order1 = await prisma.order.create({
        data: {
            requestId: request1.id,
            buyerId: buyer1Profile.id,
            supplierId: supplier1Profile.id,
            productId: product1.id,
            productName: 'Custom T-Shirts',
            quantity: 500,
            totalPrice: 825000,
            currency: 'NGN',
            pricingSnapshot: JSON.stringify({
                unitPrice: 1500,
                quantity: 500,
                subtotal: 750000,
                fulfillmentFee: 39000,
                shipping: 36000,
                total: 825000,
            }),
            deliveryAddress: '123 Main Street, Lagos',
            deliveryCity: 'Lagos',
            deliveryCountry: 'NG',
            status: 'PROCESSING',
        },
    });

    const order2 = await prisma.order.create({
        data: {
            buyerId: buyer3Profile.id,
            supplierId: supplier1Profile.id,
            productId: product1.id,
            productName: 'T-Shirts Bulk Order',
            quantity: 1000,
            totalPrice: 1578000,
            currency: 'NGN',
            pricingSnapshot: JSON.stringify({
                unitPrice: 1500,
                quantity: 1000,
                subtotal: 1500000,
                fulfillmentFee: 78000,
                total: 1578000,
            }),
            deliveryAddress: 'New York, USA',
            deliveryCity: 'New York',
            deliveryCountry: 'US',
            status: 'SHIPPED',
            trackingNumber: 'NG1234567890',
            shippedAt: new Date('2024-12-10'),
        },
    });

    // ============================================
    // 7. AFFILIATE SYSTEM
    // ============================================
    console.log('🔗 Creating affiliate links...');

    const affiliateLink = await prisma.affiliateLink.create({
        data: {
            affiliateId: affiliateProfile.id,
            slug: 'promarketer-main',
            targetUrl: 'https://banadama.com',
            campaign: 'Main Referral Campaign',
            clicks: 1234,
            sales: 56,
        },
    });

    // Create some conversions
    await prisma.affiliateConversion.create({
        data: {
            affiliateId: affiliateProfile.id,
            linkId: affiliateLink.id,
            type: 'SALE',
            orderId: order1.id,
            commissionAmount: 16500, // 2% of ₦825,000
            commissionRate: 0.02,
            currency: 'NGN',
            paid: false,
        },
    });

    await prisma.affiliateConversion.create({
        data: {
            affiliateId: affiliateProfile.id,
            linkId: affiliateLink.id,
            type: 'VERIFIED_SUPPLIER',
            supplierId: supplier1Profile.id,
            commissionAmount: 500000, // ₦5,000 flat
            currency: 'NGN',
            paid: true,
            paidAt: new Date(),
        },
    });

    // ============================================
    // 8. VERIFICATION REQUESTS
    // ============================================
    console.log('✅ Creating verification requests...');

    await prisma.verificationRequest.create({
        data: {
            userId: supplier1User.id,
            type: 'SUPPLIER',
            status: 'APPROVED',
            supplierId: supplier1Profile.id,
            data: JSON.stringify({
                businessName: 'Lagos Textiles Factory',
                registrationNumber: 'RC-123456',
                taxId: 'TIN-987654',
            }),
            documentUrls: ['https://example.com/cac-doc.pdf', 'https://example.com/tax-cert.pdf'],
            reviewedById: opsUser.id,
            reviewedAt: new Date(),
        },
    });

    await prisma.verificationRequest.create({
        data: {
            userId: creator1User.id,
            type: 'CREATOR',
            status: 'APPROVED',
            creatorId: creator1Profile.id,
            data: JSON.stringify({
                portfolioUrl: 'https://behance.net/creativedesigns',
                specialization: 'Logo & Brand Identity',
            }),
            documentUrls: ['https://example.com/portfolio.pdf'],
            reviewedById: opsUser.id,
            reviewedAt: new Date(),
        },
    });

    // Pending verification
    const supplier3User = await prisma.user.create({
        data: {
            email: 'newvendor@example.com',
            role: 'SUPPLIER',
            country: 'NG',
        },
    });

    const supplier3Profile = await prisma.supplierProfile.create({
        data: {
            userId: supplier3User.id,
            businessName: 'New Wholesale Supplier',
            type: 'WHOLESALER',
            isVerified: false,
        },
    });

    await prisma.verificationRequest.create({
        data: {
            userId: supplier3User.id,
            type: 'SUPPLIER',
            status: 'PENDING',
            supplierId: supplier3Profile.id,
            data: JSON.stringify({
                businessName: 'New Wholesale Supplier',
                registrationNumber: 'RC-999999',
            }),
            documentUrls: ['https://example.com/pending-cac.pdf'],
        },
    });

    // ============================================
    // 9. SYSTEM CONFIG
    // ============================================
    console.log('⚙️ Creating system config...');

    await prisma.systemConfig.upsert({
        where: { key: 'default_currency' },
        update: {},
        create: {
            key: 'default_currency',
            value: JSON.stringify({ code: 'NGN', symbol: '₦' }),
            category: 'currency',
            description: 'Default platform currency',
        },
    });

    await prisma.systemConfig.upsert({
        where: { key: 'fulfillment_rate' },
        update: {},
        create: {
            key: 'fulfillment_rate',
            value: JSON.stringify({ rate: 0.052 }),
            category: 'pricing',
            description: 'Default fulfillment fee (5.2%)',
        },
    });

    await prisma.systemConfig.upsert({
        where: { key: 'affiliate_commission_rate_sale' },
        update: {},
        create: {
            key: 'affiliate_commission_rate_sale',
            value: JSON.stringify({ rate: 0.02 }),
            category: 'affiliate',
            description: 'Commission rate for sales (2%)',
        },
    });

    await prisma.systemConfig.upsert({
        where: { key: 'affiliate_commission_supplier_verification' },
        update: {},
        create: {
            key: 'affiliate_commission_supplier_verification',
            value: JSON.stringify({ amount: 500000 }),
            category: 'affiliate',
            description: 'Flat commission for supplier verification (₦5,000)',
        },
    });

    // ============================================
    // 10. FEATURE FLAGS
    // ============================================
    console.log('🚩 Creating feature flags...');

    await prisma.featureFlag.upsert({
        where: { key: 'enable_group_buy' },
        update: {},
        create: {
            key: 'enable_group_buy',
            enabled: true,
            rolloutPercentage: 100,
            allowedRoles: ['BUYER', 'SUPPLIER'],
            name: 'Enable Group Buy',
            description: 'Allow buyers to participate in group buying',
            category: 'marketplace',
        },
    });

    await prisma.featureFlag.upsert({
        where: { key: 'enable_affiliate_system' },
        update: {},
        create: {
            key: 'enable_affiliate_system',
            enabled: true,
            rolloutPercentage: 100,
            allowedRoles: ['AFFILIATE'],
            name: 'Enable Affiliate System',
            description: 'Allow affiliate marketing features',
            category: 'affiliate',
        },
    });

    console.log('✅ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- Users: 9 (1 Admin, 1 Ops, 3 Buyers, 2 Suppliers, 2 Creators, 1 Affiliate)');
    console.log('- Products: 3 (2 Supplier, 1 Creator)');
    console.log('- RFQs: 2 (1 Quoted, 1 Pending)');
    console.log('- Orders: 2 (1 Processing, 1 Shipped)');
    console.log('- Wallets: 3');
    console.log('- Verifications: 3 (2 Approved, 1 Pending)');
    console.log('- Affiliate Links: 1');
    console.log('- System Configs: 4');
    console.log('- Feature Flags: 2');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Seed failed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
