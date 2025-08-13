import React, { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import CompanySwitcher from './CompanySwitcher';
import AlertsIndicator from './AlertsIndicator';
import UserProfileMenu from './UserProfileMenu';

const Header = ({ sidebarCollapsed, onToggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className={`
      fixed top-0 right-0 z-30
      bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
      border-b border-border
      transition-all duration-300 ease-smooth theme-transition
      ${sidebarCollapsed ? 'left-16' : 'left-60'}
      h-16
    `}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu toggle */}
          <button
            onClick={onToggleSidebar}
            className="
              lg:hidden p-2 rounded-lg
              text-muted-foreground hover:text-foreground
              hover:bg-muted transition-colors
              focus:outline-none focus:ring-2 focus:ring-ring
            "
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Company Switcher */}
          <CompanySwitcher />
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar transações, fornecedores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="
                w-full pl-10 pr-4 py-2 rounded-lg
                bg-muted border border-transparent
                text-foreground placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                transition-colors theme-transition
              "
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Alerts Indicator */}
          <AlertsIndicator />

          {/* User Profile Menu */}
          <UserProfileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;