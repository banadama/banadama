'use client';

import React, { useState } from 'react';
import { Icons } from '@/components/icons/icons';

export default function OrdersPage() {
    const [selectedFilter, setSelectedFilter] = useState('all');

    // Sample orders data
    const orders = [
        {
            id: '12347',
            product: 'Premium Woven Fabric',
            supplier: 'TextileCo',
            price: '$45.99',
            quantity: 50,
            total: '$2,299.50',
            status: 'Delivered',
            date: 'Dec 20, 2025',
            estimatedDelivery: 'Dec 20, 2025',
            tracking: 'TRK12347890'
        },
        {
            id: '12346',
            product: 'Cotton Blend Textile',
            supplier: 'FabricHub',
            price: '$32.50',
            quantity: 75,
            total: '$2,437.50',
            status: 'In Transit',
            date: 'Dec 15, 2025',
            estimatedDelivery: 'Dec 28, 2025',
            tracking: 'TRK12346789'
        },
        {
            id: '12345',
            product: 'Silk Finishing Material',
            supplier: 'LuxeTextiles',
            price: '$78.00',
            quantity: 30,
            total: '$2,340.00',
            status: 'Processing',
            date: 'Dec 10, 2025',
            estimatedDelivery: 'Dec 25, 2025',
            tracking: 'TRK12345678'
        },
        {
            id: '12344',
            product: 'Dyed Polyester Blend',
            supplier: 'PolyMaterial',
            price: '$28.99',
            quantity: 100,
            total: '$2,899.00',
            status: 'Cancelled',
            date: 'Dec 5, 2025',
            estimatedDelivery: 'Dec 22, 2025',
            tracking: 'TRK12344567'
        },
        {
            id: '12343',
            product: 'Organic Linen Cloth',
            supplier: 'EcoFabrics',
            price: '$56.00',
            quantity: 40,
            total: '$2,240.00',
            status: 'Delivered',
            date: 'Nov 28, 2025',
            estimatedDelivery: 'Nov 28, 2025',
            tracking: 'TRK12343456'
        },
    ];

    const filteredOrders = selectedFilter === 'all' 
        ? orders 
        : orders.filter(order => order.status.toLowerCase() === selectedFilter.toLowerCase());

    const getStatusColor = (status) => {
        switch(status) {
            case 'Delivered': return '#10b981';
            case 'In Transit': return '#3b82f6';
            case 'Processing': return '#f59e0b';
            case 'Cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const BackIcon = Icons.get('ArrowLeft');
    const SearchIcon = Icons.get('Search');

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#5bc5cf' }}>
            {/* ============ HEADER ============ */}
            <header className="mp-header">
                <div className="mp-header-top">
                    {/* Back Button */}
                    <div className="mp-header-left">
                        <a 
                                href="/marketplace"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    textDecoration: 'none',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    transition: 'background 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                            {BackIcon && <BackIcon size={20} />}
                            <span>Back</span>
                        </a>
                    </div>

                    {/* Title */}
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#ffffff' }}>
                            Your Orders
                        </h1>
                    </div>

                    {/* Spacer */}
                    <div className="mp-header-left" />
                </div>
            </header>

            {/* ============ MAIN CONTENT ============ */}
            <main style={{ padding: '2rem 1.5rem', backgroundColor: '#5bc5cf' }}>
                <div className="max-w-7xl mx-auto">
                    {/* Filters */}
                    <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {['All', 'Delivered', 'In Transit', 'Processing', 'Cancelled'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter.toLowerCase())}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: selectedFilter === filter.toLowerCase() ? '#2b3d2d' : 'transparent',
                                    color: 'white',
                                    border: selectedFilter === filter.toLowerCase() ? 'none' : '2px solid rgba(255,255,255,0.12)',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontSize: '0.875rem'
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedFilter !== filter.toLowerCase()) {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedFilter !== filter.toLowerCase()) {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                                    }
                                }}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Orders List */}
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map(order => (
                                <div
                                    key={order.id}
                                    style={{
                                        background: 'white',
                                        borderRadius: '12px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        border: '1px solid #e5e7eb',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {/* Order Header */}
                                    <div style={{
                                        padding: '1.5rem',
                                        borderBottom: '1px solid #e5e7eb',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>
                                                Order #{order.id}
                                            </p>
                                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#1f2937' }}>
                                                {order.product}
                                            </h3>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{
                                                margin: '0 0 0.5rem 0',
                                                fontSize: '0.875rem',
                                                fontWeight: 600,
                                                color: getStatusColor(order.status),
                                                background: `${getStatusColor(order.status)}20`,
                                                padding: '0.5rem 1rem',
                                                borderRadius: '6px',
                                                display: 'inline-block'
                                            }}>
                                                {order.status}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Details */}
                                    <div style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                            {/* Supplier */}
                                            <div>
                                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                                                    Supplier
                                                </p>
                                                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#1f2937' }}>
                                                    {order.supplier}
                                                </p>
                                            </div>

                                            {/* Order Date */}
                                            <div>
                                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                                                    Order Date
                                                </p>
                                                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#1f2937' }}>
                                                    {order.date}
                                                </p>
                                            </div>

                                            {/* Estimated Delivery */}
                                            <div>
                                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                                                    Est. Delivery
                                                </p>
                                                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#1f2937' }}>
                                                    {order.estimatedDelivery}
                                                </p>
                                            </div>

                                            {/* Tracking */}
                                            <div>
                                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                                                    Tracking
                                                </p>
                                                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#5bc5cf', fontFamily: 'monospace' }}>
                                                    {order.tracking}
                                                </p>
                                            </div>

                                            {/* Quantity */}
                                            <div>
                                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                                                    Quantity
                                                </p>
                                                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#1f2937' }}>
                                                    {order.quantity} units @ {order.price}
                                                </p>
                                            </div>

                                            {/* Total */}
                                            <div>
                                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                                                    Total
                                                </p>
                                                <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#1f2937' }}>
                                                    {order.total}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                                            <button style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                background: 'linear-gradient(135deg, #5bc5cf 0%, #4ab8c2 100%)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'background 0.2s ease',
                                                fontSize: '0.875rem'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#4ab8c2'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #5bc5cf 0%, #4ab8c2 100%)'}
                                            >
                                                View Details
                                            </button>
                                            <button style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                background: 'white',
                                                color: '#5bc5cf',
                                                border: '2px solid #5bc5cf',
                                                borderRadius: '6px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                fontSize: '0.875rem'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(74,184,194,0.06)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                            >
                                                Track Order
                                            </button>
                                            {order.status === 'Delivered' && (
                                                <button style={{
                                                    flex: 1,
                                                    padding: '0.75rem',
                                                    background: 'white',
                                                    color: '#1f2937',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '6px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    fontSize: '0.875rem'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#5bc5cf'}
                                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                                                >
                                                    Reorder
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '3rem',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '1rem' }}>
                                    No orders found
                                </p>
                                <a
                                    href="/marketplace"
                                    style={{
                                        display: 'inline-block',
                                        padding: '0.75rem 1.5rem',
                                        background: 'linear-gradient(135deg, #5bc5cf 0%, #4ab8c2 100%)',
                                        color: 'white',
                                        textDecoration: 'none',
                                        borderRadius: '6px',
                                        fontWeight: 600,
                                        transition: 'background 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#4ab8c2'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #5bc5cf 0%, #4ab8c2 100%)'}
                                >
                                    Continue Shopping
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
