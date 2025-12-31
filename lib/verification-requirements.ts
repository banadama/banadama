export interface VerificationRequirement {
  id: string;
  name: string;
  description: string;
  category: 'document' | 'certification' | 'identification';
}

export const verificationRequirements: Record<string, Record<string, VerificationRequirement[]>> = {
  NIGERIA: {
    FACTORY: [
      {
        id: 'cac_cert',
        name: 'CAC Registration Certificate',
        description: 'Corporate Affairs Commission registration certificate',
        category: 'certification',
      },
      {
        id: 'tax_id',
        name: 'Tax Identification Number (TIN)',
        description: 'Federal Inland Revenue Service TIN',
        category: 'identification',
      },
      {
        id: 'factory_license',
        name: 'Factory License',
        description: 'Valid factory operation license from regulatory authority',
        category: 'certification',
      },
      {
        id: 'son_cert',
        name: 'SON Certificate',
        description: 'Standards Organisation of Nigeria compliance certificate',
        category: 'certification',
      },
    ],
    WHOLESALER: [
      {
        id: 'cac_cert',
        name: 'CAC Registration Certificate',
        description: 'Corporate Affairs Commission registration certificate',
        category: 'certification',
      },
      {
        id: 'tax_id',
        name: 'Tax Identification Number (TIN)',
        description: 'Federal Inland Revenue Service TIN',
        category: 'identification',
      },
      {
        id: 'warehouse_license',
        name: 'Warehouse License',
        description: 'Valid warehouse operation license',
        category: 'certification',
      },
    ],
    RETAILER: [
      {
        id: 'cac_cert',
        name: 'CAC Registration Certificate',
        description: 'Corporate Affairs Commission registration certificate',
        category: 'certification',
      },
      {
        id: 'tax_id',
        name: 'Tax Identification Number (TIN)',
        description: 'Federal Inland Revenue Service TIN',
        category: 'identification',
      },
      {
        id: 'business_premises',
        name: 'Business Premises Proof',
        description: 'Proof of business location (lease agreement or ownership)',
        category: 'document',
      },
    ],
  },
  BANGLADESH: {
    FACTORY: [
      {
        id: 'trade_license',
        name: 'Trade License',
        description: 'Dhaka Chamber of Commerce or local trade license',
        category: 'certification',
      },
      {
        id: 'tin_cert',
        name: 'TIN Certificate',
        description: 'Tax Identification Number from Bangladesh Revenue Board',
        category: 'identification',
      },
      {
        id: 'factory_inspection',
        name: 'Factory Inspection Report',
        description: 'Department of Factories & Establishments inspection certificate',
        category: 'certification',
      },
      {
        id: 'export_license',
        name: 'Export License',
        description: 'Bangladesh Export Processing Zones Authority (BEPZA) clearance',
        category: 'certification',
      },
    ],
    WHOLESALER: [
      {
        id: 'trade_license',
        name: 'Trade License',
        description: 'Local trade license or chamber registration',
        category: 'certification',
      },
      {
        id: 'tin_cert',
        name: 'TIN Certificate',
        description: 'Tax Identification Number from Bangladesh Revenue Board',
        category: 'identification',
      },
      {
        id: 'warehouse_registration',
        name: 'Warehouse Registration',
        description: 'Warehouse registration with local authority',
        category: 'certification',
      },
    ],
  },
  GLOBAL: {
    CREATOR: [
      {
        id: 'portfolio',
        name: 'Portfolio Samples',
        description: 'Link to portfolio or samples of your creative work',
        category: 'document',
      },
      {
        id: 'id_verification',
        name: 'ID Verification',
        description: 'Government-issued ID (Passport, Driver License, etc.)',
        category: 'identification',
      },
      {
        id: 'tax_info',
        name: 'Tax Information',
        description: 'Tax ID or registration from your country',
        category: 'identification',
      },
    ],
    AFFILIATE: [
      {
        id: 'id_verification',
        name: 'ID Verification',
        description: 'Government-issued ID for identity confirmation',
        category: 'identification',
      },
      {
        id: 'marketing_plan',
        name: 'Marketing Plan',
        description: 'Your strategy for promoting Banadama',
        category: 'document',
      },
      {
        id: 'social_media',
        name: 'Website or Social Media',
        description: 'Link to your website, blog, or social media presence',
        category: 'document',
      },
    ],
  },
};

export function getRequirements(country: string, role: string): VerificationRequirement[] {
  return verificationRequirements[country]?.[role] || [];
}

export function getCountryForRegion(region: 'NG' | 'BD' | 'GLOBAL'): string {
  return {
    NG: 'NIGERIA',
    BD: 'BANGLADESH',
    GLOBAL: 'GLOBAL',
  }[region];
}
