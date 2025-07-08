
/**
 * Landing Page - Main Entry Point
 * Enhanced with modern animations and interactive effects
 */

import { useState } from 'react';
import AdminAuthModal from '@/components/AdminAuthModal';
import EmployeeAuthModal from '@/components/EmployeeAuthModal';
import LandingNavigation from '@/components/landing/LandingNavigation';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingStats from '@/components/landing/LandingStats';
import LandingFooter from '@/components/landing/LandingFooter';
import AnimatedBackground from '@/components/ui/animated-background';

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showEmployeeAuth, setShowEmployeeAuth] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Global animated background */}
      <AnimatedBackground className="fixed inset-0 z-0" />
      
      {/* Main content with relative positioning */}
      <div className="relative z-10">
        <LandingNavigation 
          onShowAuth={() => setShowAuth(true)}
          onShowEmployeeAuth={() => setShowEmployeeAuth(true)}
        />
        
        <LandingHero 
          onShowAuth={() => setShowAuth(true)}
          onShowEmployeeAuth={() => setShowEmployeeAuth(true)}
        />
        
        <LandingFeatures />
        
        <LandingStats />
        
        <LandingFooter />
      </div>

      {/* Auth Modals */}
      <AdminAuthModal open={showAuth} onClose={() => setShowAuth(false)} />
      <EmployeeAuthModal open={showEmployeeAuth} onClose={() => setShowEmployeeAuth(false)} />
    </div>
  );
};

export default Index;
