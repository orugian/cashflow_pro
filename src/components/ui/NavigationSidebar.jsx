import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationSidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/overview-dashboard',
      icon: 'LayoutDashboard',
      description: 'Visão geral financeira'
    },
    {
      id: 'transactions',
      label: 'Transações',
      path: '/transaction-management',
      icon: 'Receipt',
      description: 'Gestão de transações'
    },
    {
      id: 'analytics',
      label: 'Análises',
      path: '/analytics-forecasting',
      icon: 'TrendingUp',
      description: 'Análises e previsões'
    },
    {
      id: 'reports',
      label: 'Relatórios',
      path: '/reports-center',
      icon: 'FileText',
      description: 'Centro de relatórios'
    },
    {
      id: 'settings',
      label: 'Configurações',
      path: '/company-account-settings',
      icon: 'Settings',
      description: 'Configurações da empresa'
    }
  ];

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  return (
    <nav className={`
      fixed left-0 top-0 h-full bg-card border-r border-border z-100
      transition-all duration-300 ease-smooth
      ${isCollapsed ? 'w-16' : 'w-60'}
      lg:translate-x-0
    `}>
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={20} color="white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">CashFlow Pro</h1>
            </div>
          </div>
        )}
        
        {isCollapsed && (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <Icon name="DollarSign" size={20} color="white" />
          </div>
        )}
        
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md hover:bg-muted transition-colors duration-200"
          >
            <Icon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              size={16} 
              color="var(--color-text-secondary)" 
            />
          </button>
        )}
      </div>
      {/* Navigation Items */}
      <div className="flex flex-col py-4">
        {navigationItems?.map((item) => {
          const isActive = isActiveRoute(item?.path);
          
          return (
            <div
              key={item?.id}
              className="relative"
              onMouseEnter={() => setHoveredItem(item?.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                to={item?.path}
                className={`
                  flex items-center px-4 py-3 mx-2 rounded-lg
                  transition-all duration-200 ease-smooth
                  hover:bg-muted hover-elevation
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-medium' 
                    : 'text-foreground hover:text-primary'
                  }
                  ${isCollapsed ? 'justify-center' : 'justify-start'}
                `}
              >
                <Icon 
                  name={item?.icon} 
                  size={20} 
                  color={isActive ? 'currentColor' : 'var(--color-text-secondary)'} 
                />
                
                {!isCollapsed && (
                  <span className="ml-3 font-medium">{item?.label}</span>
                )}
              </Link>
              {/* Tooltip for collapsed state */}
              {isCollapsed && hoveredItem === item?.id && (
                <div className="
                  absolute left-full top-1/2 transform -translate-y-1/2 ml-2
                  bg-popover text-popover-foreground px-3 py-2 rounded-md
                  shadow-pronounced border border-border
                  whitespace-nowrap z-200
                  transition-opacity duration-150
                ">
                  <div className="font-medium">{item?.label}</div>
                  <div className="text-sm text-muted-foreground">{item?.description}</div>
                  
                  {/* Arrow */}
                  <div className="
                    absolute right-full top-1/2 transform -translate-y-1/2
                    border-4 border-transparent border-r-popover
                  "></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        {!isCollapsed ? (
          <div className="text-xs text-muted-foreground text-center">
            CashFlow Pro v2.1.0
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-success rounded-full"></div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationSidebar;