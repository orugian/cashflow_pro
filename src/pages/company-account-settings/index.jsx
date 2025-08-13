import React, { useState } from 'react';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import Header from '../../components/ui/Header';
import SettingsNavigation from './components/SettingsNavigation';
import CompanyProfileSection from './components/CompanyProfileSection';
import BankAccountsSection from './components/BankAccountsSection';
import CategoriesSection from './components/CategoriesSection';
import UsersPermissionsSection from './components/UsersPermissionsSection';
import SystemPreferencesSection from './components/SystemPreferencesSection';

const CompanyAccountSettings = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('company-profile');

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'company-profile':
        return <CompanyProfileSection />;
      case 'bank-accounts':
        return <BankAccountsSection />;
      case 'categories':
        return <CategoriesSection />;
      case 'vendors-customers':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Fornecedores & Clientes</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Gerencie seu cadastro de parceiros comerciais
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground">Seção em desenvolvimento</p>
            </div>
          </div>
        );
      case 'cost-centers':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Centros de Custo</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Configure projetos e alocação de custos
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground">Seção em desenvolvimento</p>
            </div>
          </div>
        );
      case 'budgets':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Orçamentos</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Planejamento financeiro mensal por categoria
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground">Seção em desenvolvimento</p>
            </div>
          </div>
        );
      case 'users-permissions':
        return <UsersPermissionsSection />;
      case 'alerts':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Alertas</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Configure notificações e lembretes
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground">Seção em desenvolvimento</p>
            </div>
          </div>
        );
      case 'tax-configuration':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Configuração Fiscal</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Simples Nacional e configurações tributárias
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground">Seção em desenvolvimento</p>
            </div>
          </div>
        );
      case 'system-preferences':
        return <SystemPreferencesSection />;
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
        mt-16 min-h-[calc(100vh-4rem)]
      `}>
        <div className="flex h-full">
          {/* Settings Navigation */}
          <SettingsNavigation 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyAccountSettings;