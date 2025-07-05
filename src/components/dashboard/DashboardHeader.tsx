
/**
 * Dashboard Header Component
 * Main header for admin dashboard with improved mobile responsiveness and company branding
 * Features search functionality, notifications, theme toggle, and user profile management
 */

import { Bell, Search, Menu, X, Bot } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from 'react';
import DashboardHeaderLogo from './DashboardHeaderLogo';
import DashboardHeaderSearch from './DashboardHeaderSearch';
import DashboardHeaderNotifications from './DashboardHeaderNotifications';
import DashboardHeaderProfile from './DashboardHeaderProfile';
import ThemeToggle from '@/components/ThemeToggle';
import AIChatbot from './AIChatbot';
import { getCompanySettings } from '@/services/companySettingsService';

/**
 * DashboardHeader Component
 * Responsive header with glassmorphism design and enhanced user interactions
 */
const DashboardHeader = () => {
  // State management for mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Company branding configuration
  const [companyName, setCompanyName] = useState('EMP SYNC');
  
  // Notification status indicator
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  
  // AI Chatbot visibility state
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  /**
   * Load company settings on component mount
   * Fetches company name from settings service for dynamic branding
   */
  useEffect(() => {
    const settings = getCompanySettings();
    if (settings?.name) {
      setCompanyName(settings.name);
    }
  }, []);

  return (
    <>
      <header className="
        glass backdrop-blur-md
        bg-white/80 dark:bg-gray-900/80 
        border-b border-white/20 dark:border-gray-700/30 
        sticky top-0 z-50
        transition-all duration-300
      ">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Company Name Section */}
            <div className="flex items-center space-x-4">
              <DashboardHeaderLogo />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white animate-fade-in">
                  {companyName}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 animate-fade-in stagger-1">
                  Admin Dashboard
                </p>
              </div>
            </div>

            {/* Desktop Navigation and Search Section */}
            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
              <div className="relative w-full group">
                {/* Search icon with color transition */}
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-blue-500 transition-colors duration-300" />
                
                {/* Search input with glassmorphism design */}
                <Input
                  placeholder="Search employees, reports..."
                  className="
                    pl-10 w-full
                    glass backdrop-blur-sm
                    bg-white/50 dark:bg-gray-800/50
                    border border-white/30 dark:border-gray-700/30
                    focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                    focus:shadow-lg focus:shadow-blue-500/20
                    transition-all duration-300
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                  "
                />
                
                {/* Glow effect on focus for enhanced visual feedback */}
                <div className="
                  absolute inset-0 rounded-md opacity-0 group-focus-within:opacity-100
                  bg-gradient-to-r from-blue-500/10 to-purple-500/10
                  transition-opacity duration-300 pointer-events-none
                " />
              </div>
            </div>

            {/* Right Side Actions Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Theme Toggle Button */}
              <ThemeToggle />
              
              {/* AI Chatbot Button */}
              <Button
                variant="ghost"
                size="icon"
                className="
                  relative hover:bg-white/20 dark:hover:bg-gray-800/20 
                  transition-all duration-300 hover:scale-110
                "
                onClick={() => setIsChatbotOpen(true)}
              >
                <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </Button>
              
              {/* Mobile Search Button - visible only on mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Enhanced Notifications with proper dropdown */}
              <div className="hidden sm:block">
                <DashboardHeaderNotifications />
              </div>

              {/* User Profile Section */}
              <DashboardHeaderProfile />

              {/* Mobile Menu Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu Section - collapsible navigation for smaller screens */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-white/20 dark:border-gray-700/30 py-4 animate-slide-down">
              <div className="space-y-4">
                {/* Company Name for Mobile - shown when menu is expanded */}
                <div className="sm:hidden px-2">
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    {companyName}
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Admin Dashboard
                  </p>
                </div>

                {/* Mobile Search with enhanced styling */}
                <div className="px-2 relative group">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-blue-500 transition-colors duration-300" />
                  <Input
                    placeholder="Search employees, reports..."
                    className="
                      pl-10 w-full
                      glass backdrop-blur-sm
                      bg-white/50 dark:bg-gray-800/50
                      border border-white/30 dark:border-gray-700/30
                      focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                      focus:shadow-lg focus:shadow-blue-500/20
                      transition-all duration-300
                    "
                  />
                </div>

                {/* Mobile AI Chatbot Button */}
                <div className="px-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-white/20 dark:hover:bg-gray-800/20"
                    onClick={() => setIsChatbotOpen(true)}
                  >
                    <Bot className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    AI Assistant
                  </Button>
                </div>

                {/* Mobile Notifications Button */}
                <div className="sm:hidden px-2">
                  <DashboardHeaderNotifications />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* AI Chatbot Modal */}
      <AIChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </>
  );
};

export default DashboardHeader;
