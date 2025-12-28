'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type OnboardingStep = 'role' | 'profile' | 'business' | 'logistics' | 'complete';

const ROLES = [
  {
    id: 'supplier',
    name: 'Supplier',
    description: 'Import and resell products',
    icon: '📦',
  },
  {
    id: 'factory',
    name: 'Factory',
    description: 'Manufacture and sell products',
    icon: '🏭',
  },
  {
    id: 'wholesaler',
    name: 'Wholesaler',
    description: 'Distribute products in bulk',
    icon: '🚛',
  },
  {
    id: 'creator',
    name: 'Creator',
    description: 'Sell digital products or services',
    icon: '🎨',
  },
  {
    id: 'affiliate',
    name: 'Affiliate',
    description: 'Earn commissions on referrals',
    icon: '🤝',
  },
];

const LOGISTICS_OPTIONS = [
  { id: 'local', label: 'Local Only (NG/BD)', description: 'Ship within Nigeria and Bangladesh' },
  { id: 'international', label: 'International', description: 'Ship globally' },
  { id: 'both', label: 'Both Local & International', description: 'Flexible shipping' },
];

export default function SupplierOnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>('role');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    email: '',
    phone: '',
    country: 'Nigeria',
    logistics: '',
  });

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setStep('profile');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogisticsSelect = (logisticsId: string) => {
    setFormData((prev) => ({ ...prev, logistics: logisticsId }));
  };

  const handleNext = () => {
    if (step === 'profile' && !formData.companyName) {
      alert('Please enter company name');
      return;
    }
    if (step === 'business' && !formData.description) {
      alert('Please enter business description');
      return;
    }
    if (step === 'logistics' && !formData.logistics) {
      alert('Please select logistics option');
      return;
    }

    if (step === 'profile') setStep('business');
    else if (step === 'business') setStep('logistics');
    else if (step === 'logistics') setStep('complete');
  };

  const handleBack = () => {
    if (step === 'profile') setStep('role');
    else if (step === 'business') setStep('profile');
    else if (step === 'logistics') setStep('business');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          Welcome to Banadama
        </h1>
        <p style={{ color: '#9ca3af' }}>Complete your onboarding in 4 steps</p>
        
        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'center' }}>
          {(['role', 'profile', 'business', 'logistics'] as const).map((s) => (
            <div
              key={s}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: ['role', 'profile', 'business', 'logistics'].indexOf(s) <= ['role', 'profile', 'business', 'logistics'].indexOf(step) ? '#5bc5cf' : '#4b5563',
              }}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Select Role */}
      {step === 'role' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>
            What describes you best?
          </h2>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                style={{
                  padding: '1.5rem',
                  border: selectedRole === role.id ? '2px solid #5bc5cf' : '1px solid #4b5563',
                  borderRadius: 8,
                  backgroundColor: selectedRole === role.id ? 'rgba(91, 197, 207, 0.1)' : '#0f1b16',
                  cursor: 'pointer',
                  color: '#fff',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{role.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{role.name}</div>
                <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{role.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Profile Info */}
      {step === 'profile' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>
            Business Profile
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#cfeee6', marginBottom: '0.5rem', fontWeight: 500 }}>
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Enter your company name"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 6,
                  border: '1px solid #4b5563',
                  backgroundColor: '#1a2622',
                  color: '#fff',
                  fontSize: '1rem',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#cfeee6', marginBottom: '0.5rem', fontWeight: 500 }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 6,
                  border: '1px solid #4b5563',
                  backgroundColor: '#1a2622',
                  color: '#fff',
                  fontSize: '1rem',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#cfeee6', marginBottom: '0.5rem', fontWeight: 500 }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+234 or +880"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 6,
                  border: '1px solid #4b5563',
                  backgroundColor: '#1a2622',
                  color: '#fff',
                  fontSize: '1rem',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Business Details */}
      {step === 'business' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>
            Business Information
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#cfeee6', marginBottom: '0.5rem', fontWeight: 500 }}>
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 6,
                  border: '1px solid #4b5563',
                  backgroundColor: '#1a2622',
                  color: '#fff',
                  fontSize: '1rem',
                }}
              >
                <option value="Nigeria">Nigeria</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: '#cfeee6', marginBottom: '0.5rem', fontWeight: 500 }}>
                Business Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell us about your business..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 6,
                  border: '1px solid #4b5563',
                  backgroundColor: '#1a2622',
                  color: '#fff',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Logistics */}
      {step === 'logistics' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>
            Shipping & Logistics
          </h2>
          <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
            Choose how you want to serve your customers
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {LOGISTICS_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => handleLogisticsSelect(option.id)}
                style={{
                  padding: '1.5rem',
                  border: formData.logistics === option.id ? '2px solid #5bc5cf' : '1px solid #4b5563',
                  borderRadius: 8,
                  backgroundColor: formData.logistics === option.id ? 'rgba(91, 197, 207, 0.1)' : '#0f1b16',
                  cursor: 'pointer',
                  color: '#fff',
                  textAlign: 'left',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{option.label}</div>
                <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{option.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Complete */}
      {step === 'complete' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            Welcome, {formData.companyName}!
          </h2>
          <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
            Your account is ready. Let's get your products live.
          </p>
          <Link
            href="/supplier/studio"
            style={{
              display: 'inline-block',
              backgroundColor: '#5bc5cf',
              color: '#042017',
              padding: '0.85rem 1.4rem',
              borderRadius: 8,
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.3s',
            }}
          >
            Go to Dashboard
          </Link>
        </div>
      )}

      {/* Navigation Buttons */}
      {step !== 'complete' && (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'space-between' }}>
          <button
            onClick={handleBack}
            disabled={step === 'role'}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: step === 'role' ? '#4b5563' : '#3d5c4f',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: step === 'role' ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              opacity: step === 'role' ? 0.5 : 1,
            }}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#5bc5cf',
              color: '#042017',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {step === 'logistics' ? 'Complete' : 'Next'}
          </button>
        </div>
      )}
    </div>
  );
}
