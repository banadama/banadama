'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// SVG Icons - Production Ready (Zero Emojis)
const HamburgerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const DeliveryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const StarIcon = ({ filled = false }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polygon points="12 2 15.09 10.26 23.77 11.25 17.77 17.25 19.16 25.75 12 21.27 4.84 25.75 6.23 17.25 0.23 11.25 8.91 10.26 12 2"></polygon>
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const HeartIcon = ({ filled = false }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="2" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const StoreIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M6 9V3h12v6M3 9h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
    <path d="M9 13h6M9 17h6" strokeLinecap="round"></path>
  </svg>
);

// Country Flags with Size Support
interface FlagProps {
  size?: 'sm' | 'md' | 'lg';
}

const getSizeValues = (size?: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm': return { width: 16, height: 10 };
    case 'lg': return { width: 28, height: 18 };
    default: return { width: 20, height: 12 }; // md
  }
};

const BangladeshFlag = ({ size = 'md' }: FlagProps) => {
  const { width, height } = getSizeValues(size);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 12" width={width} height={height} style={{ borderRadius: '2px', display: 'inline-block' }} title="Bangladesh">
      <rect width="20" height="12" fill="#006a4e"/>
      <circle cx="10" cy="6" r="4" fill="#f42a41"/>
    </svg>
  );
};

const NigeriaFlag = ({ size = 'md' }: FlagProps) => {
  const { width, height } = getSizeValues(size);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 12" width={width} height={height} style={{ borderRadius: '2px', display: 'inline-block' }} title="Nigeria">
      <rect width="20" height="12" fill="#008751"/>
      <rect x="6.67" width="6.67" height="12" fill="white"/>
    </svg>
  );
};

const GlobalFlag = ({ size = 'md' }: FlagProps) => {
  const sizeMap = {
    sm: 14,
    md: 18,
    lg: 24
  };
  const iconSize = sizeMap[size || 'md'];
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#5bc5cf" strokeWidth="1.5" width={iconSize} height={iconSize} style={{ flexShrink: 0, display: 'inline-block' }} title="Global">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  );
};

// Verification Badge Color Helper
const getVerificationColor = (supplierType?: string) => {
  switch (supplierType?.toLowerCase()) {
    case 'factory':
      return '#2ecc71'; // Green
    case 'wholesaler':
      return '#5bc5cf'; // Teal/Greenish Blue
    case 'retail':
      return '#1a3a52'; // Dark Blue/Navy
    case 'company':
    case 'admin':
      return '#f39c12'; // Gold
    default:
      return '#4caf50'; // Default Green
  }
};

// Data
const CATEGORIES = [
  { id: 'industrial', label: 'Industrial' },
  { id: 'retail', label: 'Retail' },
  { id: 'suppliers', label: 'Suppliers' },
];

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Premium Cotton Fabric',
    supplier: 'TextileCo Ltd',
    supplierUsername: 'textileco-ng',
    supplierType: 'factory', // Factory - Green
    verified: true,
    itemNumber: '97760-21',
    brand: 'JIN SHEN RUN',
    price: 45.99,
    rating: 4.8,
    reviews: 234,
    category: 'textiles',
    image: 'https://via.placeholder.com/240x160?text=Cotton+Fabric',
    attributes: {
      fabric: 'Cotton',
      composition: 'Cotton / Polyester',
      style: 'Denim',
      color: 'Navy Blue',
      elasticity: 'Medium',
      season: 'All Season',
      marketRegions: ['Nigeria', 'Bangladesh', 'Global']
    }
  },
  {
    id: 2,
    name: 'Polyester Blend',
    supplier: 'FabricHub International',
    supplierUsername: 'fabrichub-global',
    supplierType: 'wholesaler', // Wholesaler - Teal
    verified: true,
    itemNumber: '75420-15',
    brand: 'HYBRID TEXTILES',
    price: 32.50,
    rating: 4.6,
    reviews: 156,
    category: 'textiles',
    image: 'https://via.placeholder.com/240x160?text=Polyester',
    attributes: {
      fabric: 'Polyester Blend',
      composition: 'Polyester 60% / Cotton 40%',
      style: 'Casual Wear',
      color: 'Multiple',
      elasticity: 'High',
      season: 'Summer',
      marketRegions: ['Nigeria', 'Global']
    }
  },
  {
    id: 3,
    name: 'Silk Premium',
    supplier: 'LuxeTextiles',
    supplierUsername: 'luxetextiles-bd',
    supplierType: 'retail', // Retail - Navy Blue
    verified: true,
    itemNumber: '88903-42',
    brand: 'ELEGANCE SILK',
    price: 78.00,
    rating: 4.9,
    reviews: 89,
    category: 'textiles',
    image: 'https://via.placeholder.com/240x160?text=Silk',
    attributes: {
      fabric: 'Pure Silk',
      composition: '100% Mulberry Silk',
      style: 'Premium',
      color: 'Champagne',
      elasticity: 'Low',
      season: 'All Season',
      marketRegions: ['Bangladesh', 'Global']
    }
  },
  {
    id: 4,
    name: 'Dyed Materials',
    supplier: 'PolyMaterial Corp',
    supplierUsername: 'polymaterial-ng',
    supplierType: 'company', // Company - Gold
    verified: false,
    itemNumber: '54210-08',
    brand: 'VIBRANT COLOR',
    price: 28.99,
    rating: 4.5,
    reviews: 342,
    category: 'textiles',
    image: 'https://via.placeholder.com/240x160?text=Dyed',
    attributes: {
      fabric: 'Mixed',
      composition: 'Cotton/Polyester Blend',
      style: 'Colorful',
      color: 'Various',
      elasticity: 'Medium',
      season: 'All Season',
      marketRegions: ['Nigeria']
    }
  },
  {
    id: 5,
    name: 'Organic Linen',
    supplier: 'EcoFabrics Ltd',
    supplierUsername: 'ecofabrics-global',
    supplierType: 'factory', // Factory - Green
    verified: true,
    itemNumber: '66780-19',
    brand: 'ECO PURE',
    price: 56.00,
    rating: 4.7,
    reviews: 178,
    category: 'textiles',
    image: 'https://via.placeholder.com/240x160?text=Linen',
    attributes: {
      fabric: 'Organic Linen',
      composition: '100% Organic Flax',
      style: 'Natural',
      color: 'Beige',
      elasticity: 'Low',
      season: 'Summer',
      marketRegions: ['Global']
    }
  },
  {
    id: 6,
    name: 'Stretch Jersey',
    supplier: 'KnitMasters Pro',
    supplierUsername: 'knitmasters-bd',
    supplierType: 'wholesaler', // Wholesaler - Teal
    verified: true,
    itemNumber: '33445-67',
    brand: 'COMFORT KNIT',
    price: 42.75,
    rating: 4.8,
    reviews: 267,
    category: 'textiles',
    image: 'https://via.placeholder.com/240x160?text=Jersey',
    attributes: {
      fabric: 'Jersey',
      composition: 'Cotton 85% / Elastane 15%',
      style: 'Stretch',
      color: 'White',
      elasticity: 'Very High',
      season: 'All Season',
      marketRegions: ['Bangladesh', 'Global']
    }
  },
  {
    id: 7,
    name: 'Canvas Heavy Duty',
    supplier: 'IndustrialFab',
    supplierUsername: 'industrialfab-ng',
    supplierType: 'factory', // Factory - Green
    verified: true,
    itemNumber: '99887-51',
    brand: 'INDUSTRIAL PRO',
    price: 51.25,
    rating: 4.6,
    reviews: 145,
    category: 'industrial',
    image: 'https://via.placeholder.com/240x160?text=Canvas',
    attributes: {
      fabric: 'Canvas',
      composition: 'Cotton 100%',
      style: 'Heavy Duty',
      color: 'Khaki',
      elasticity: 'None',
      season: 'All Season',
      marketRegions: ['Nigeria', 'Global']
    }
  },
  {
    id: 8,
    name: 'Satin Grade A',
    supplier: 'SatinCo Premium',
    supplierUsername: 'satinco-bd',
    supplierType: 'retail', // Retail - Navy Blue
    verified: true,
    itemNumber: '44556-93',
    brand: 'PREMIUM SATIN',
    price: 68.50,
    rating: 4.9,
    reviews: 91,
    category: 'textiles',
    image: 'https://via.placeholder.com/240x160?text=Satin',
    attributes: {
      fabric: 'Satin',
      composition: '100% Polyester Satin',
      style: 'Premium',
      color: 'Silver',
      elasticity: 'Low',
      season: 'All Season',
      marketRegions: ['Bangladesh', 'Global']
    }
  },
  {
    id: 9,
    name: 'Banadama Gold',
    supplier: 'Banadama Textiles',
    supplierUsername: 'banadama-gold',
    supplierType: 'company', // Company - Gold
    verified: true,
    itemNumber: '55667-04',
    brand: 'BANADAMA GOLD',
    price: 95.00,
    rating: 4.95,
    reviews: 156,
    category: 'textiles',
    image: 'https://via.placeholder.com/240x160?text=Banadama+Gold',
    attributes: {
      fabric: 'Banadama Cotton Blend',
      composition: '85% Cotton, 15% Gold Metallic',
      style: 'Luxury',
      color: 'Gold',
      elasticity: 'Medium',
      season: 'All Season',
      marketRegions: ['Bangladesh', 'Nigeria', 'Global']
    }
  },
];

export default function MarketplacePage() {
  const router = useRouter();
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // State Management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(3);
  const [selectedLocation, setSelectedLocation] = useState('Nigeria');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [searchCategory, setSearchCategory] = useState('all');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English – EN');
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('NGN - Nigerian Naira');
  
  // Cart items state
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Premium T-Shirt', size: 'M', quantity: 1, price: 5200, image: '' },
    { id: 2, name: 'Classic Jeans', size: '32', quantity: 1, price: 8500, image: '' },
    { id: 3, name: 'Leather Shoes', size: '10', quantity: 1, price: 12000, image: '' },
  ]);

  // Refs for click-outside detection
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(target)) {
        setShowLocationDropdown(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(target)) {
        setShowAccountDropdown(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(target)) {
        setShowCategoryDropdown(false);
      }
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(target)) {
        setShowSettingsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Product Filtering Logic
  const filteredProducts = SAMPLE_PRODUCTS.filter(product => {
    const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSidebarOpen(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} style={{ color: star <= Math.round(rating) ? '#ff9800' : '#ddd' }}>
            <StarIcon filled={star <= Math.round(rating)} />
          </span>
        ))}
        <span style={{ fontSize: '11px', color: '#666', marginLeft: '4px' }}>
          ({rating})
        </span>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#3d5c4f' }}>
      {/* Sticky Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: '#3d5c4f',
          color: 'white',
          padding: '12px 20px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
          borderBottom: '2px solid #3d5c4f',
        }}
        role="banner"
      >
        {/* Hamburger Menu */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease',
            minWidth: '44px',
            minHeight: '44px',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#232f3e')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          aria-label="Toggle sidebar"
          aria-expanded={sidebarOpen}
          aria-controls="sidebar"
        >
          {sidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
        </button>
        {/* Location Selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
              fontSize: '12px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#232f3e')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            aria-label="Select delivery location"
            aria-haspopup="listbox"
            aria-expanded={showLocationDropdown}
          >
            <DeliveryIcon />
            <span>Ship to {selectedLocation}</span>
            <ChevronDownIcon />
          </button>

          {/* Location Dropdown */}
          {showLocationDropdown && (
            <div
              ref={locationDropdownRef}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: 'white',
                color: '#333',
                borderRadius: '8px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                zIndex: 1000,
                minWidth: '220px',
                marginTop: '8px',
                overflow: 'hidden'
              }}
              role="listbox"
            >
              {/* Header - Styled like Join Banadama */}
              <div style={{
                background: 'linear-gradient(135deg, #5bc5cf 0%, #4ab8c2 100%)',
                padding: '2rem',
                textAlign: 'center',
                color: 'white'
              }}>
                <h3 style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem'
                }}>
                  Ship to
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'rgba(255,255,255,0.9)'
                }}>
                  Select Your Region
                </p>
              </div>

              {/* Options */}
              <div style={{ borderTop: '1px solid #3d5c4f' }}>
                {['All', 'Nigeria', 'Ghana', 'Kenya', 'South Africa'].map(location => (
                  <button
                    key={location}
                    onClick={() => {
                      if (location !== 'All') {
                        setSelectedLocation(location);
                      }
                      setShowLocationDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: selectedLocation === location ? 'rgba(91, 197, 207, 0.1)' : 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: selectedLocation === location ? 600 : 500,
                      color: selectedLocation === location ? '#5bc5cf' : '#333',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      if (selectedLocation !== location) {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = selectedLocation === location ? 'rgba(91, 197, 207, 0.1)' : 'transparent';
                    }}
                    role="option"
                    aria-selected={selectedLocation === location}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Bar with Category Dropdown */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            minWidth: '200px',
            height: '44px',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {/* Category Dropdown in Search */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              style={{
                backgroundColor: '#f5f5f5',
                border: 'none',
                color: '#333',
                padding: '0 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '500',
                minWidth: '120px',
              }}
              aria-label="Select search category"
              aria-haspopup="listbox"
              aria-expanded={showCategoryDropdown}
            >
              {CATEGORIES.find(cat => cat.id === searchCategory)?.label || 'All'}
              <ChevronDownIcon />
            </button>

            {/* Category Dropdown Menu */}
            {showCategoryDropdown && (
              <div
                ref={categoryDropdownRef}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: 'white',
                  color: '#333',
                  borderRadius: '8px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  zIndex: 1000,
                  minWidth: '200px',
                  marginTop: '8px',
                  overflow: 'hidden'
                }}
                role="listbox"
              >
                {/* Dropdown Header with Teal Gradient */}
                <div style={{
                  background: 'linear-gradient(135deg, #5bc5cf 0%, #4ab8c2 100%)',
                  padding: '2rem',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <h3 style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem'
                  }}>
                    Browse Products
                  </h3>
                  <p style={{
                    fontSize: '0.95rem',
                    color: 'rgba(255,255,255,0.9)',
                    marginBottom: '1.5rem'
                  }}>
                    All Categories
                  </p>

                  {/* Category Search Bar */}
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={categorySearchQuery || ''}
                    onChange={(e) => setCategorySearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 1rem',
                      marginBottom: '1rem',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '6px',
                      fontSize: '0.95rem',
                      background: 'rgba(255,255,255,0.15)',
                      color: 'white',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                    }}
                  />
                  
                  {/* Quick Category Tags */}
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}>
                    {['All Products', 'T-Shirt', 'Jeans', 'Shoes', 'Fabrics'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          const categoryMap: Record<string, string> = {
                            'All Products': 'all',
                            'T-Shirt': 'tshirts',
                            'Jeans': 'jeans',
                            'Shoes': 'shoes',
                            'Fabrics': 'textiles'
                          };
                          setSearchCategory(categoryMap[cat] || 'all');
                          setCategorySearchQuery('');
                          setShowCategoryDropdown(false);
                        }}
                        style={{
                          padding: '0.4rem 0.8rem',
                          background: 'rgba(255,255,255,0.2)',
                          border: '1px solid rgba(255,255,255,0.3)',
                          borderRadius: '16px',
                          color: 'white',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.35)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  key="all"
                  onClick={() => {
                    setSearchCategory('all');
                    setShowCategoryDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '13px',
                    transition: 'background-color 0.2s ease',
                    fontWeight: 500,
                    color: '#333',
                    borderBottom: '1px solid #3d5c4f'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  role="option"
                  aria-selected={searchCategory === 'all'}
                >
                  All Products
                </button>
                <div style={{ padding: '0 8px' }}>
                  <div style={{ fontSize: '12px', color: '#888', margin: '8px 0 4px 0', fontWeight: 600 }}>Popular Categories</div>
                  <button
                    key="textiles"
                    onClick={() => {
                      setSearchCategory('textiles');
                      setShowCategoryDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '13px',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    role="option"
                    aria-selected={searchCategory === 'textiles'}
                  >
                    Textiles
                  </button>
                  <button
                    key="electronics"
                    onClick={() => {
                      setSearchCategory('electronics');
                      setShowCategoryDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '13px',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    role="option"
                    aria-selected={searchCategory === 'electronics'}
                  >
                    Electronics
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              padding: '0 12px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'white',
            }}
            aria-label="Search for products"
          />

          {/* Search Button */}
          <button
            style={{
              backgroundColor: '#febd69',
              border: 'none',
              color: '#131921',
              padding: '0 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0ad4e')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#febd69')}
            aria-label="Search"
          >
            <SearchIcon />
          </button>
        </div>



        {/* Account Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
              fontSize: '12px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#232f3e')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            aria-label="Account menu"
            aria-haspopup="menu"
            aria-expanded={showAccountDropdown}
          >
            <UserIcon />
            <span>Account</span>
            <ChevronDownIcon />
          </button>

          {/* Account Dropdown */}
          {showAccountDropdown && (
            <div
              ref={accountDropdownRef}
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                color: '#333',
                borderRadius: '8px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                zIndex: 1000,
                minWidth: '220px',
                marginTop: '8px',
                overflow: 'hidden'
              }}
              role="menu"
            >
              {/* Header - Styled like Join Banadama */}
              <div style={{
                background: 'linear-gradient(135deg, #5bc5cf 0%, #4ab8c2 100%)',
                padding: '2rem',
                textAlign: 'center',
                color: 'white'
              }}>
                <h3 style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem'
                }}>
                  My Account
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'rgba(255,255,255,0.9)',
                  marginBottom: '1.5rem'
                }}>
                  Account Options
                </p>
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  <button onClick={() => {
                    router.push('/auth/login');
                    setShowAccountDropdown(false);
                  }} style={{
                    padding: '0.625rem 1.25rem',
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'inline-block'
                  }} onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  }}>
                    Sign In
                  </button>
                  <button onClick={() => setShowAccountDropdown(false)} style={{
                    padding: '0.625rem 1.25rem',
                    background: 'white',
                    color: '#5bc5cf',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'inline-block'
                  }} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    Create Account
                  </button>
                </div>
              </div>

              {/* Menu Items */}
              <div style={{ borderTop: '1px solid #3d5c4f' }}>
                {['Orders', 'Account Settings', 'Help', 'Sign Out'].map(item => (
                  <button
                    key={item}
                    onClick={() => setShowAccountDropdown(false)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#333',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    role="menuitem"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
              fontSize: '12px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#232f3e')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            aria-label="Settings menu"
            aria-haspopup="menu"
            aria-expanded={showSettingsDropdown}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.12 2.12l4.24 4.24M1 12h6m6 0h6m-16.78 7.78l4.24-4.24m2.12-2.12l4.24-4.24"></path>
            </svg>
            <span>Settings</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {/* Settings Dropdown */}
          {showSettingsDropdown && (
            <div
              ref={settingsDropdownRef}
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                color: '#333',
                borderRadius: '8px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                zIndex: 1000,
                minWidth: '320px',
                marginTop: '8px',
                overflow: 'hidden'
              }}
            >
              {/* Header - Styled like Join Banadama */}
              <div style={{
                background: 'linear-gradient(135deg, #5bc5cf 0%, #4ab8c2 100%)',
                padding: '2rem',
                textAlign: 'center',
                color: 'white'
              }}>
                <h3 style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem'
                }}>
                  Banadama
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'rgba(255,255,255,0.9)',
                  marginBottom: 0
                }}>
                  Preferences
                </p>
              </div>

              {/* Settings Content */}
              <div style={{ padding: '1.5rem' }}>
                {/* Language Settings */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#333',
                    marginBottom: '0.5rem'
                  }}>
                    Language Settings
                  </h4>
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#666',
                    marginBottom: '0.8rem',
                    lineHeight: 1.4
                  }}>
                    Select the language you prefer for browsing, shopping, and communications.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {['English – EN', 'French – FR', 'Hausa – HA', 'Bangla – BN', 'Arabic – AR'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => {
                          setSelectedLanguage(lang);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.9rem',
                          border: selectedLanguage === lang ? '2px solid #5bc5cf' : '1px solid #ddd',
                          background: selectedLanguage === lang ? 'rgba(91, 197, 207, 0.1)' : 'white',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '0.9rem',
                          fontWeight: selectedLanguage === lang ? 600 : 500,
                          color: selectedLanguage === lang ? '#5bc5cf' : '#333',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => {
                          if (selectedLanguage !== lang) {
                            e.currentTarget.style.backgroundColor = '#f5f5f5';
                            e.currentTarget.style.borderColor = '#5bc5cf';
                          }
                        }}
                        onMouseLeave={e => {
                          if (selectedLanguage !== lang) {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.borderColor = '#ddd';
                          }
                        }}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: '#eee',
                  margin: '1.5rem 0'
                }}></div>

                {/* Currency Settings */}
                <div>
                  <h4 style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#333',
                    marginBottom: '0.5rem'
                  }}>
                    Currency Settings
                  </h4>
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#666',
                    marginBottom: '0.8rem',
                    lineHeight: 1.4
                  }}>
                    Select the currency you want to shop with.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCurrency('NGN - Nigerian Naira');
                    }}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      border: selectedCurrency === 'NGN - Nigerian Naira' ? '2px solid #5bc5cf' : '1px solid #ddd',
                      background: selectedCurrency === 'NGN - Nigerian Naira' ? 'rgba(91, 197, 207, 0.1)' : 'white',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      fontWeight: selectedCurrency === 'NGN - Nigerian Naira' ? 600 : 500,
                      color: selectedCurrency === 'NGN - Nigerian Naira' ? '#5bc5cf' : '#333',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      if (selectedCurrency !== 'NGN - Nigerian Naira') {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                        e.currentTarget.style.borderColor = '#5bc5cf';
                      }
                    }}
                    onMouseLeave={e => {
                      if (selectedCurrency !== 'NGN - Nigerian Naira') {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.borderColor = '#ddd';
                      }
                    }}
                  >
                    NGN - Nigerian Naira
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cart Icon with Badge */}
        <button
          onClick={() => setCartSidebarOpen(!cartSidebarOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            position: 'relative',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease',
            minWidth: '44px',
            minHeight: '44px',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#232f3e')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          aria-label={`Shopping cart with ${cartCount} items`}
        >
          <CartIcon />
          {cartCount > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '22px',
                height: '22px',
                backgroundColor: '#ff9800',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 'bold',
              }}
              aria-label={`${cartCount} items in cart`}
            >
              {cartCount}
            </div>
          )}
        </button>
      </header>

      {/* Category Navigation Bar */}
      <nav
        style={{
          backgroundColor: '#3d5c4f',
          borderTop: '2px solid #3d5c4f',
          borderBottom: '1px solid #3d5c4f',
          boxShadow: '0 2px 8px rgba(61, 92, 79, 0.15)',
          overflow: 'hidden',
          position: 'sticky',
          top: '68px',
          zIndex: 99,
        }}
        role="navigation"
        aria-label="Product categories"
      >
        <div
          ref={categoryScrollRef}
          style={{
            backgroundColor: '#3b2f2f',
            display: 'flex',
            gap: '4px',
            padding: '12px 20px',
            maxWidth: '1400px',
            margin: '0 auto',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            alignItems: 'center',
            borderBottom: '2px solid #3d5c4f',
          }}
        >
          {/* CreatorSmart Logo in Category Bar */}
          <div
            onClick={() => router.push('/creators')}
            style={{
              cursor: 'pointer',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingRight: '16px',
              borderRight: '1px solid #3d5c4f',
              marginRight: '8px',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#ff9800', flexShrink: 0, backgroundColor: '#3d5c4f', padding: '4px', borderRadius: '50%' }} aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"></path>
            </svg>
            <span style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#ff9800',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap'
            }}>
              CreatorSmart
            </span>
          </div>
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              style={{
                padding: '8px 16px',
                border: 'none',
                backgroundColor: selectedCategory === category.id ? '#5bc5cf' : 'transparent',
                color: selectedCategory === category.id ? 'white' : '#fff',
                cursor: 'pointer',
                fontWeight: selectedCategory === category.id ? '600' : '500',
                fontSize: '14px',
                borderRadius: '0',
                borderBottom: selectedCategory === category.id ? '3px solid #3d5c4f' : 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                if (selectedCategory !== category.id) {
                  e.currentTarget.style.opacity = '0.8';
                }
              }}
              onMouseLeave={e => {
                if (selectedCategory !== category.id) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
              role="tab"
              aria-selected={selectedCategory === category.id}
              aria-label={`View ${category.label}`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
          }}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '280px',
          height: '100vh',
          backgroundColor: '#f5f5f5',
          zIndex: 999,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-out',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
        role="navigation"
        aria-label="Sidebar navigation"
      >
        {/* Sidebar Header with Logo */}
        <div
          style={{
            backgroundColor: '#131921',
            color: 'white',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff9800' }}>Banadama</div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Close sidebar"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Sidebar Categories */}
        <div style={{ padding: '16px', flex: 1 }}>
          <h3 style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', marginBottom: '12px', fontWeight: '600' }}>
            Shop by Category
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                style={{
                  padding: '12px',
                  border: 'none',
                  backgroundColor: selectedCategory === category.id ? '#f0f0f0' : 'transparent',
                  color: selectedCategory === category.id ? '#ff9800' : '#333',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: selectedCategory === category.id ? '600' : '500',
                  borderLeft: selectedCategory === category.id ? '3px solid #ff9800' : '3px solid transparent',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => !sidebarOpen || (e.currentTarget.style.backgroundColor = '#f8f8f8')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = selectedCategory === category.id ? '#f0f0f0' : 'transparent')}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Quick Links */}
          <h3 style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', marginTop: '24px', marginBottom: '12px', fontWeight: '600' }}>
            Quick Links
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { label: "Today's Deals", href: null },
              { label: 'Membership', href: null },
              { label: 'Become a Seller', href: '/supplier' },
              { label: 'Help Center', href: '/help' },
              { label: 'About Us', href: '/about' }
            ].map(link => (
              <button
                key={link.label}
                onClick={() => {
                  setSidebarOpen(false);
                  if (link.href) {
                    router.push(link.href);
                  }
                }}
                style={{
                  padding: '12px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#333',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Hero Section */}
        <section
          style={{
            background: 'linear-gradient(135deg, #131921 0%, #232f3e 100%)',
            color: 'white',
            padding: '40px 20px',
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          <h1 style={{ fontSize: '32px', marginBottom: '12px', color: '#3d5c4f' }}>Welcome to Banadama Marketplace</h1>
          <p style={{ fontSize: '16px', color: '#3d5c4f' }}>
            Discover premium products from trusted suppliers across Africa
          </p>
        </section>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredProducts.map(product => (
              <div
                key={product.id}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(31, 38, 135, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  transition: 'all 0.3s ease',
                  transform: hoveredProduct === product.id ? 'translateY(-6px)' : 'translateY(0)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={e => {
                  setHoveredProduct(product.id);
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 28px rgba(91, 197, 207, 0.2)';
                }}
                onMouseLeave={e => {
                  setHoveredProduct(null);
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(31, 38, 135, 0.12)';
                }}
              >
                {/* Product Image Container */}
                <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      transform: hoveredProduct === product.id ? 'scale(1.05)' : 'scale(1)',
                    }}
                  />
                  
                  {/* Verification Badge */}
                  {product.verified && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: getVerificationColor(product.supplierType),
                      color: 'white',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      border: '2px solid white',
                      title: 'Verified Seller'
                    }}>
                      <CheckIcon />
                    </div>
                  )}

                  {/* Favorite & Share Buttons */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    display: 'flex',
                    gap: '6px',
                    opacity: hoveredProduct === product.id ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                  }}>
                    <button
                      onClick={() => {
                        const newFavorites = new Set(favorites);
                        if (newFavorites.has(product.id)) {
                          newFavorites.delete(product.id);
                        } else {
                          newFavorites.add(product.id);
                        }
                        setFavorites(newFavorites);
                      }}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: favorites.has(product.id) ? '#ff4444' : 'white',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s ease',
                        color: favorites.has(product.id) ? 'white' : '#333',
                      }}
                      onMouseEnter={(e) => {
                        if (!favorites.has(product.id)) {
                          e.currentTarget.style.background = '#f5f5f5';
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!favorites.has(product.id)) {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.transform = 'scale(1)';
                        }
                      }}
                      title="Add to favorites"
                    >
                      <HeartIcon filled={favorites.has(product.id)} />
                    </button>
                    <button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/marketplace?product=${product.id}`;
                        const shareText = `Check out ${product.name} by ${product.supplier} on Banadama`;
                        
                        if (navigator.share) {
                          navigator.share({ 
                            title: product.name,
                            text: shareText,
                            url: shareUrl
                          }).catch(() => {
                            // Share was cancelled, do nothing
                          });
                        } else {
                          // Fallback: Copy to clipboard
                          const textToCopy = `${shareText}\n${shareUrl}`;
                          navigator.clipboard.writeText(textToCopy).then(() => {
                            // Show feedback
                            const btn = event.currentTarget as HTMLButtonElement;
                            const originalTitle = btn.title;
                            btn.title = 'Link copied to clipboard!';
                            setTimeout(() => {
                              btn.title = originalTitle;
                            }, 2000);
                          }).catch(() => {
                            // Fallback: alert if clipboard fails
                            alert(`Share this product:\n${shareUrl}`);
                          });
                        }
                      }}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'white',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s ease',
                        color: '#333',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#5bc5cf';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.color = '#333';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      title="Share product (copy link or open native share)"
                    >
                      <ShareIcon />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Item Number & Brand */}
                  <div style={{ fontSize: '10px', color: '#999', marginBottom: '4px', fontWeight: '500' }}>
                    Item #{product.itemNumber} • {product.brand}
                  </div>

                  {/* Seller Profile Card - Standard Marketplace Style */}
                  <button
                    onClick={() => router.push(`/supplier/studio/${product.supplierUsername}`)}
                    style={{
                      background: 'linear-gradient(135deg, rgba(91, 197, 207, 0.1) 0%, rgba(91, 197, 207, 0.05) 100%)',
                      border: '1px solid rgba(91, 197, 207, 0.2)',
                      padding: '10px',
                      marginBottom: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      borderRadius: '8px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(91, 197, 207, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(91, 197, 207, 0.4)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(91, 197, 207, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(91, 197, 207, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(91, 197, 207, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    title="Click to visit seller store"
                  >
                    {/* Header: Seller Name + Avatar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* Profile Avatar */}
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #5bc5cf 0%, #4ab8c2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: 'white',
                        border: '2px solid rgba(255,255,255,0.4)',
                      }}>
                        {product.supplier.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* Seller Name */}
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#333', marginBottom: '2px' }}>
                          {product.supplier}
                        </div>
                        {product.verified && (
                          <div style={{ fontSize: '10px', color: getVerificationColor(product.supplierType), fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <span>✓</span> Verified Seller
                          </div>
                        )}
                      </div>
                      
                      {/* Arrow Icon */}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0, color: '#5bc5cf' }} aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                      </svg>
                    </div>

                    {/* Store Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                      {/* Rating */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#666' }}>
                        <span style={{ fontSize: '12px', color: '#ff9800', fontWeight: '600' }}>★</span>
                        <span>{product.rating}</span>
                      </div>
                      
                      {/* Reviews Count */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#666' }}>
                        <span style={{ fontSize: '10px' }}>📝</span>
                        <span>{product.reviews} reviews</span>
                      </div>
                    </div>

                    {/* Store Description */}
                    <div style={{
                      fontSize: '10px',
                      color: '#888',
                      lineHeight: '1.3',
                      padding: '6px 0',
                      borderTop: '1px solid rgba(91, 197, 207, 0.1)',
                      paddingTop: '6px'
                    }}>
                      Premium textile supplier with years of experience in quality fabrics and materials for wholesale and retail buyers.
                    </div>

                    {/* Call to Action */}
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#5bc5cf',
                      textAlign: 'center',
                      padding: '6px 0',
                      borderTop: '1px solid rgba(91, 197, 207, 0.1)',
                      paddingTop: '6px'
                    }}>
                      View Store →
                    </div>
                  </button>

                  {/* Product Name */}
                  <h3 style={{ 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    marginBottom: '8px',
                    lineHeight: 1.3,
                    color: '#333',
                    height: '32px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {product.name}
                  </h3>

                  {/* Market Regions / Country Badges */}
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                    paddingBottom: '8px',
                    borderBottom: '1px solid #f0f0f0',
                  }}>
                    {product.attributes?.marketRegions?.map((region: string) => {
                      if (region.includes('Bangladesh')) return <BangladeshFlag key="bd" />;
                      if (region.includes('Nigeria')) return <NigeriaFlag key="ng" />;
                      if (region.includes('Global')) return <GlobalFlag key="global" />;
                      return null;
                    })}
                    <span style={{ fontSize: '9px', color: '#999', fontWeight: '500' }}>
                      {product.attributes?.marketRegions?.slice(0, 2).join(' • ')}
                    </span>
                  </div>

                  {/* Product Attributes */}
                  <div style={{ 
                    fontSize: '10px', 
                    color: '#888', 
                    marginBottom: '8px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '4px 8px',
                    lineHeight: 1.4
                  }}>
                    <div>Fabric: {product.attributes.fabric}</div>
                    <div>Style: {product.attributes.style}</div>
                    <div>Color: {product.attributes.color}</div>
                    <div>Elasticity: {product.attributes.elasticity}</div>
                  </div>

                  {/* Rating & Reviews */}
                  <div style={{ marginBottom: '8px', fontSize: '11px' }}>
                    {renderStars(product.rating)}
                    <span style={{ color: '#999', marginLeft: '4px' }}>({product.reviews} reviews)</span>
                  </div>

                  {/* Price */}
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#5bc5cf', marginBottom: '10px' }}>
                    ${product.price.toFixed(2)}
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                    <button
                      onClick={() => {
                        setCartCount(c => c + 1);
                        setCartItems(prev => {
                          const existingItem = prev.find(item => item.name === product.name);
                          if (existingItem) {
                            return prev.map(item =>
                              item.name === product.name
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                            );
                          }
                          return [...prev, {
                            id: prev.length + 1,
                            name: product.name,
                            size: 'M',
                            quantity: 1,
                            price: Math.round(product.price * 260),
                            image: ''
                          }];
                        });
                        setCartSidebarOpen(true);
                      }}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: '#5bc5cf',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#4ab8c2')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#5bc5cf')}
                      title="Add to cart"
                    >
                      <ShoppingBagIcon />
                      Cart
                    </button>
                    <button
                      onClick={() => router.push(`/supplier/studio/${product.supplierUsername}`)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: 'white',
                        color: '#5bc5cf',
                        border: '1.5px solid #5bc5cf',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '11px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#5bc5cf';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#5bc5cf';
                      }}
                      title="Visit store"
                    >
                      Store
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#666',
            }}
          >
            <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>No products found</h2>
            <p>Try adjusting your search or category filters</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#131921',
          color: '#ccc',
          padding: '40px 20px',
          marginTop: '60px',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          <div>
            <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>About Banadama</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['About Us', 'Careers', 'Blog', 'Press'].map(item => (
                <li key={item} style={{ marginBottom: '8px' }}>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ccc',
                      cursor: 'pointer',
                      fontSize: '13px',
                      padding: 0,
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ff9800')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#ccc')}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['Contact Us', 'Help Center', 'FAQs', 'Shipping'].map(item => (
                <li key={item} style={{ marginBottom: '8px' }}>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ccc',
                      cursor: 'pointer',
                      fontSize: '13px',
                      padding: 0,
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ff9800')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#ccc')}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['Privacy', 'Terms', 'Cookies', 'Accessibility'].map(item => (
                <li key={item} style={{ marginBottom: '8px' }}>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ccc',
                      cursor: 'pointer',
                      fontSize: '13px',
                      padding: 0,
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ff9800')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#ccc')}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>For Sellers</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['Become a Seller', 'Seller Center', 'Advertising', 'Seller Support'].map(item => (
                <li key={item} style={{ marginBottom: '8px' }}>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ccc',
                      cursor: 'pointer',
                      fontSize: '13px',
                      padding: 0,
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ff9800')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#ccc')}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #333', paddingTop: '20px', textAlign: 'center', fontSize: '12px' }}>
          <p>&copy; 2024 Banadama Marketplace. All rights reserved.</p>
        </div>
      </footer>

      {/* Checkout Sidebar - Cart & Order Summary */}
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          width: '380px',
          height: '100vh',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '-8px 0 32px rgba(31, 38, 135, 0.15)',
          zIndex: 1000,
          transform: cartSidebarOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #5bc5cf 0%, #4ab8c2 100%)',
            color: 'white',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Order Summary</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>Items in cart: {cartItems.length}</p>
          </div>
          <button
            onClick={() => setCartSidebarOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '16px',
              transition: 'background-color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ fontSize: '13px', color: '#666', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Cart Items ({cartItems.length})</h3>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
              <p style={{ fontSize: '14px', marginBottom: '12px' }}>Your cart is empty</p>
              <button
                onClick={() => setCartSidebarOpen(false)}
                style={{
                  padding: '8px 16px',
                  background: '#5bc5cf',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#4ab8c2')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#5bc5cf')}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    background: 'rgba(91, 197, 207, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(91, 197, 207, 0.1)',
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '8px',
                      flexShrink: 0,
                      background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                      fontSize: '24px',
                    }}
                  >
                    📦
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#333' }}>
                      {item.name}
                    </p>
                    <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#999' }}>Size: {item.size} | Qty: {item.quantity}</p>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#5bc5cf' }}>₦{item.price.toLocaleString()}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                    <button
                      onClick={() => {
                        setCartItems(prev => prev.map(i =>
                          i.id === item.id && i.quantity > 1
                            ? { ...i, quantity: i.quantity - 1 }
                            : i
                        ));
                        if (item.quantity === 1) {
                          setCartCount(c => Math.max(0, c - 1));
                        }
                      }}
                      style={{
                        background: '#f0f0f0',
                        border: 'none',
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <button
                      onClick={() => {
                        setCartItems(prev =>
                          prev.filter(i => i.id !== item.id)
                        );
                        setCartCount(c => Math.max(0, c - item.quantity));
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff6b6b',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '0',
                        transition: 'opacity 0.2s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div style={{ padding: '20px', backgroundColor: 'rgba(91, 197, 207, 0.05)', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
          {(() => {
            const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = cartItems.length > 0 ? 1000 : 0;
            const tax = Math.round(subtotal * 0.075);
            const total = subtotal + shipping + tax;

            return (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Subtotal:</span>
                  <span style={{ fontWeight: '600', color: '#333' }}>₦{subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Shipping:</span>
                  <span style={{ fontWeight: '600', color: '#333' }}>₦{shipping.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Tax:</span>
                  <span style={{ fontWeight: '600', color: '#333' }}>₦{tax.toLocaleString()}</span>
                </div>
                <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#333' }}>Total:</span>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#5bc5cf' }}>₦{total.toLocaleString()}</span>
                </div>
              </>
            );
          })()}
        </div>

        {/* Action Buttons */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
          <button
            onClick={() => {
              if (cartItems.length > 0) {
                alert('Redirecting to checkout...');
                // router.push('/checkout');
              }
            }}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #5bc5cf 0%, #4ab8c2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: cartItems.length > 0 ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(91, 197, 207, 0.3)',
              opacity: cartItems.length > 0 ? 1 : 0.5,
            }}
            onMouseEnter={e => {
              if (cartItems.length > 0) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(91, 197, 207, 0.4)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(91, 197, 207, 0.3)';
            }}
          >
            {cartItems.length > 0 ? 'Proceed to Checkout' : 'Add Items to Checkout'}
          </button>
          <button
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(91, 197, 207, 0.1)',
              color: '#5bc5cf',
              border: '2px solid rgba(91, 197, 207, 0.3)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(91, 197, 207, 0.15)';
              e.currentTarget.style.borderColor = '#5bc5cf';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'rgba(91, 197, 207, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(91, 197, 207, 0.3)';
            }}
            onClick={() => setCartSidebarOpen(false)}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Overlay */}
      {cartSidebarOpen && (
        <div
          onClick={() => setCartSidebarOpen(false)}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 999,
            animation: 'fadeIn 0.3s ease',
          }}
        />
      )}
    </div>
  );
}

const LanguageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const TrophyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1m0 0h8m0 0h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-1m0 0V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4m6 0v10m-6-10V9m6 10H6"></path>
  </svg>
);
