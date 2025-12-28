// components/onboarding/OnboardingHub.tsx
// Step-based onboarding hub for unverified users
'use client';

import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

// Icon Components
const CheckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20,6 9,17 4,12" />
    </svg>
);

const SpinnerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

const LockIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const AlertIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" x2="12" y1="9" y2="13" />
        <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
);

export type OnboardingStepStatus = 'completed' | 'current' | 'locked' | 'needs_action';

export interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    status: OnboardingStepStatus;
    href?: string;
    subSteps?: {
        label: string;
        completed: boolean;
    }[];
}

interface OnboardingHubProps {
    userName?: string;
    userRole?: string;
    steps: OnboardingStep[];
    overallStatus?: 'draft' | 'submitted' | 'needs_review' | 'verified' | 'restricted';
}

const statusMessages = {
    draft: 'Complete all steps below to submit your profile for verification.',
    submitted: 'Your profile is under review. We will notify you once it is verified.',
    needs_review: 'Your submission requires attention. Please review the flagged items.',
    verified: 'Congratulations! Your profile is verified. You have full platform access.',
    restricted: 'Your account has been restricted. Please contact support.',
};


export function OnboardingHub({
    userName = 'there',
    userRole = 'Supplier',
    steps,
    overallStatus = 'draft',
}: OnboardingHubProps) {
    const getStepIcon = (status: OnboardingStepStatus) => {
        switch (status) {
            case 'completed':
                return <CheckIcon />;
            case 'current':
                return <SpinnerIcon />;
            case 'needs_action':
                return <AlertIcon />;
            case 'locked':
            default:
                return <LockIcon />;
        }
    };

    const getStepIconClass = (status: OnboardingStepStatus) => {
        switch (status) {
            case 'completed':
                return 'completed';
            case 'current':
                return 'current';
            case 'needs_action':
                return 'current'; // Same styling as needs attention
            case 'locked':
            default:
                return 'locked';
        }
    };

    return (
        <div className="mp-onboarding-hub">
            {/* Header */}
            <div className="mp-onboarding-header">
                <h1 className="mp-onboarding-title">Welcome, {userName}!</h1>
                <p className="mp-onboarding-subtitle">
                    {statusMessages[overallStatus]}
                </p>
            </div>

            {/* Status Banner (for non-draft states) */}
            {overallStatus !== 'draft' && overallStatus !== 'verified' && (
                <div
                    className={clsx(
                        'mb-6 p-4 rounded-lg border text-sm',
                        overallStatus === 'submitted' && 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
                        overallStatus === 'needs_review' && 'bg-red-500/10 border-red-500/30 text-red-300',
                        overallStatus === 'restricted' && 'bg-red-500/10 border-red-500/30 text-red-300'
                    )}
                >
                    <div className="flex items-center gap-2">
                        {overallStatus === 'submitted' && <SpinnerIcon />}
                        {(overallStatus === 'needs_review' || overallStatus === 'restricted') && <AlertIcon />}
                        <span>
                            {overallStatus === 'submitted' && 'Your verification is being processed...'}
                            {overallStatus === 'needs_review' && 'Some items need your attention. Please review below.'}
                            {overallStatus === 'restricted' && 'Account restricted. Contact support for assistance.'}
                        </span>
                    </div>
                </div>
            )}

            {/* Steps */}
            <div className="mp-onboarding-steps">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={clsx('mp-onboarding-step', {
                            completed: step.status === 'completed',
                            current: step.status === 'current' || step.status === 'needs_action',
                            locked: step.status === 'locked',
                        })}
                    >
                        {/* Step Icon */}
                        <div
                            className={clsx(
                                'mp-onboarding-step-icon',
                                getStepIconClass(step.status)
                            )}
                        >
                            {getStepIcon(step.status)}
                        </div>

                        {/* Step Content */}
                        <div className="mp-onboarding-step-content">
                            <div className="mp-onboarding-step-title">
                                Step {index + 1}: {step.title}
                            </div>
                            <div className="mp-onboarding-step-desc">{step.description}</div>

                            {/* Sub-steps if any */}
                            {step.subSteps && step.subSteps.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    {step.subSteps.map((sub, i) => (
                                        <div
                                            key={i}
                                            className={clsx(
                                                'text-sm flex items-center gap-2',
                                                sub.completed ? 'text-green-400' : 'text-slate-400'
                                            )}
                                        >
                                            {sub.completed ? (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                    <polyline points="20,6 9,17 4,12" />
                                                </svg>
                                            ) : (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                </svg>
                                            )}
                                            <span>{sub.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Button */}
                        {step.status !== 'locked' && step.status !== 'completed' && step.href && (
                            <Link href={step.href} className="mp-onboarding-step-action">
                                {step.status === 'needs_action' ? 'Review' : 'Continue'}
                            </Link>
                        )}

                        {step.status === 'completed' && (
                            <span className="text-green-400 text-sm font-medium">
                                ✅ Complete
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Help Section */}
            <div className="mt-8 text-center">
                <p className="text-sm text-slate-400">
                    Need help? <a href="/help" className="text-orange-400 hover:underline">Contact Support</a>
                </p>
            </div>
        </div>
    );
}

export default OnboardingHub;
