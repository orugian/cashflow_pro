import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Image from '../AppImage';

const UserProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mock user data - in real app this would come from context/API
  const user = {
    id: '1',
    name: 'Maria Silva Santos',
    email: 'maria.santos@techsolutions.com.br',
    role: 'Administrador',
    avatar: '/assets/images/user-avatar.jpg',
    company: 'Tech Solutions Ltda',
    lastLogin: '2025-08-13T19:30:00Z'
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    // In real app, this would clear auth tokens and redirect to login
    console.log('Logging out...');
    setIsOpen(false);
  };

  const menuItems = [
    {
      id: 'profile',
      label: 'Meu Perfil',
      icon: 'User',
      action: () => {
        console.log('Navigate to profile');
        setIsOpen(false);
      }
    },
    {
      id: 'preferences',
      label: 'Preferências',
      icon: 'Settings',
      action: () => {
        console.log('Navigate to preferences');
        setIsOpen(false);
      }
    },
    {
      id: 'help',
      label: 'Ajuda & Suporte',
      icon: 'HelpCircle',
      action: () => {
        console.log('Navigate to help');
        setIsOpen(false);
      }
    },
    {
      id: 'divider',
      type: 'divider'
    },
    {
      id: 'logout',
      label: 'Sair',
      icon: 'LogOut',
      action: handleLogout,
      variant: 'destructive'
    }
  ];

  const formatLastLogin = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Agora mesmo';
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      return date?.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-3 px-2 py-2 rounded-lg
          transition-all duration-200 ease-smooth
          hover:bg-muted hover-elevation
          ${isOpen ? 'bg-muted shadow-medium' : 'bg-transparent'}
        `}
      >
        {/* User Avatar */}
        <div className="relative">
          <Image
            src={user?.avatar}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-border"
          />
          {/* Online Status Indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-card rounded-full"></div>
        </div>

        {/* User Info (Hidden on mobile) */}
        <div className="hidden md:flex flex-col items-start min-w-0">
          <span className="font-medium text-sm text-foreground truncate max-w-32">
            {user?.name?.split(' ')?.[0]} {user?.name?.split(' ')?.[1]}
          </span>
          <span className="text-xs text-muted-foreground">
            {user?.role}
          </span>
        </div>

        {/* Dropdown Arrow */}
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          color="var(--color-text-secondary)" 
          className="hidden md:block transition-transform duration-200"
        />
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="
          absolute top-full right-0 mt-2 w-72
          bg-popover border border-border rounded-lg shadow-pronounced
          py-2 z-200
        ">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              <Image
                src={user?.avatar}
                alt={user?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-popover-foreground truncate">
                  {user?.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                    {user?.role}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatLastLogin(user?.lastLogin)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems?.map((item) => {
              if (item?.type === 'divider') {
                return (<div key={item?.id} className="my-2 border-t border-border"></div>);
              }

              return (
                <button
                  key={item?.id}
                  onClick={item?.action}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-2
                    transition-colors duration-200
                    hover:bg-muted
                    ${item?.variant === 'destructive' ?'text-destructive hover:bg-destructive/10' :'text-popover-foreground'
                    }
                  `}
                >
                  <Icon 
                    name={item?.icon} 
                    size={16} 
                    color={item?.variant === 'destructive' ? 'var(--color-destructive)' : 'var(--color-text-secondary)'} 
                  />
                  <span className="text-sm">{item?.label}</span>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>CashFlow Pro v2.1.0</span>
              <span>{user?.company}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;