import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import CompanySwitcher from './CompanySwitcher';
import UserProfileMenu from './UserProfileMenu';
import AlertsIndicator from './AlertsIndicator';

const Header = ({ sidebarCollapsed = false, onToggleSidebar }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const primaryNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/overview-dashboard',
      icon: 'LayoutDashboard'
    },
    {
      id: 'transactions',
      label: 'Transações',
      path: '/transaction-management',
      icon: 'Receipt'
    },
    {
      id: 'analytics',
      label: 'Análises',
      path: '/analytics-forecasting',
      icon: 'TrendingUp'
    },
    {
      id: 'reports',
      label: 'Relatórios',
      path: '/reports-center',
      icon: 'FileText'
    }
  ];

  const secondaryNavItems = [
    {
      id: 'settings',
      label: 'Configurações',
      path: '/company-account-settings',
      icon: 'Settings'
    }
  ];

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef?.current && !mobileMenuRef?.current?.contains(event?.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <header className={`
      fixed top-0 right-0 h-16 bg-card border-b border-border z-100
      transition-all duration-300 ease-smooth
      ${sidebarCollapsed ? 'left-16' : 'left-60'}
      lg:left-60
    `}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section - Mobile Menu Toggle & Company Switcher */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors duration-200"
          >
            <Icon name="Menu" size={20} color="var(--color-text-secondary)" />
          </button>

          {/* Company Switcher */}
          <CompanySwitcher />
        </div>

        {/* Center Section - Primary Navigation (Desktop Only) */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryNavItems?.map((item) => {
            const isActive = isActiveRoute(item?.path);
            
            return (
              <Link
                key={item?.id}
                to={item?.path}
                className={`
                  flex items-center px-4 py-2 rounded-lg
                  transition-all duration-200 ease-smooth
                  hover:bg-muted hover-elevation
                  ${isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20' :'text-foreground hover:text-primary'
                  }
                `}
              >
                <Icon 
                  name={item?.icon} 
                  size={18} 
                  color={isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'} 
                />
                <span className="ml-2 font-medium text-sm">{item?.label}</span>
              </Link>
            );
          })}

          {/* More Menu for Secondary Items */}
          <div className="relative" ref={mobileMenuRef}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`
                flex items-center px-4 py-2 rounded-lg
                transition-all duration-200 ease-smooth
                hover:bg-muted hover-elevation
                text-foreground hover:text-primary
                ${mobileMenuOpen ? 'bg-muted' : ''}
              `}
            >
              <Icon name="MoreHorizontal" size={18} color="var(--color-text-secondary)" />
              <span className="ml-2 font-medium text-sm">Mais</span>
            </button>

            {/* Dropdown Menu */}
            {mobileMenuOpen && (
              <div className="
                absolute top-full right-0 mt-2 w-48
                bg-popover border border-border rounded-lg shadow-pronounced
                py-2 z-200
              ">
                {secondaryNavItems?.map((item) => {
                  const isActive = isActiveRoute(item?.path);
                  
                  return (
                    <Link
                      key={item?.id}
                      to={item?.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center px-4 py-2 mx-1 rounded-md
                        transition-colors duration-200
                        hover:bg-muted
                        ${isActive 
                          ? 'bg-primary/10 text-primary' :'text-popover-foreground hover:text-primary'
                        }
                      `}
                    >
                      <Icon 
                        name={item?.icon} 
                        size={16} 
                        color={isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'} 
                      />
                      <span className="ml-3 text-sm">{item?.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right Section - Alerts & User Menu */}
        <div className="flex items-center space-x-3">
          <AlertsIndicator />
          <UserProfileMenu />
        </div>
      </div>
      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-sm z-200">
          <nav className="p-4 space-y-2">
            {[...primaryNavItems, ...secondaryNavItems]?.map((item) => {
              const isActive = isActiveRoute(item?.path);
              
              return (
                <Link
                  key={item?.id}
                  to={item?.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center px-4 py-3 rounded-lg
                    transition-all duration-200 ease-smooth
                    hover:bg-muted hover-elevation
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-medium' 
                      : 'text-foreground hover:text-primary'
                    }
                  `}
                >
                  <Icon 
                    name={item?.icon} 
                    size={20} 
                    color={isActive ? 'currentColor' : 'var(--color-text-secondary)'} 
                  />
                  <span className="ml-3 font-medium">{item?.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;