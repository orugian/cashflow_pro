import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import Header from '../../components/ui/Header';
import SettingsNavigation from './components/SettingsNavigation';
import CompanyProfileSection from './components/CompanyProfileSection';
import BankAccountsSection from './components/BankAccountsSection';
import CategoriesSection from './components/CategoriesSection';
import UsersPermissionsSection from './components/UsersPermissionsSection';
import SystemPreferencesSection from './components/SystemPreferencesSection';
import {
  selectSettings,
  selectCanEdit,
  selectCurrentUser,
} from '../../store/selectors';

const CompanyAccountSettings = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Redux selectors
  const settings = useSelector(selectSettings);
  const canEdit = useSelector(selectCanEdit);
  const currentUser = useSelector(selectCurrentUser);
  
  // Get active tab from URL params
  const activeTab = searchParams?.get('tab') || 'company';

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const settingsNavItems = [
    { id: 'company', label: 'Perfil da Empresa', icon: 'Building2' },
    { id: 'accounts', label: 'Contas Bancárias', icon: 'CreditCard' },
    { id: 'categories', label: 'Categorias', icon: 'Tags' },
    { id: 'users', label: 'Usuários e Permissões', icon: 'Users' },
    { id: 'system', label: 'Preferências', icon: 'Settings' },
    { id: 'tax', label: 'Impostos', icon: 'Receipt' },
    { id: 'backup', label: 'Backup e Exportação', icon: 'Download' },
  ];

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'company':
        return <CompanyProfileSection />;
      case 'accounts':
        return <BankAccountsSection />;
      case 'categories':
        return <CategoriesSection />;
      case 'users':
        return <UsersPermissionsSection />;
      case 'system':
        return <SystemPreferencesSection />;
      case 'tax':
        return <SystemPreferencesSection activeSubSection="tax" />;
      case 'backup':
        return <SystemPreferencesSection activeSubSection="backup" />;
      default:
        return <CompanyProfileSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Sidebar */}
      <NavigationSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      
      {/* Header */}
      <Header 
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />
      
      {/* Main Content */}
      <main className={`
        transition-all duration-300 ease-smooth
        ${sidebarCollapsed ? 'ml-16' : 'ml-60'}
        mt-16 p-6
      `}>
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Configurações
            </h1>
            <p className="text-muted-foreground">
              Gerencie perfil da empresa, contas, categorias e preferências do sistema
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <SettingsNavigation
                activeSection={activeTab}
                onSectionChange={handleTabChange}
                navItems={settingsNavItems}
              />
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyAccountSettings;