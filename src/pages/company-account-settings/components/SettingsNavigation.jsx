import React from 'react';
import Icon from '../../../components/AppIcon';

const SettingsNavigation = ({ activeSection, onSectionChange }) => {
  const navigationSections = [
    {
      id: 'company-profile',
      label: 'Perfil da Empresa',
      icon: 'Building2',
      description: 'CNPJ, dados empresariais e configurações'
    },
    {
      id: 'bank-accounts',
      label: 'Contas Bancárias',
      icon: 'CreditCard',
      description: 'Gestão de contas e metas de saldo'
    },
    {
      id: 'categories',
      label: 'Categorias',
      icon: 'FolderTree',
      description: 'Estrutura hierárquica de categorias'
    },
    {
      id: 'vendors-customers',
      label: 'Fornecedores & Clientes',
      icon: 'Users',
      description: 'Cadastro de parceiros comerciais'
    },
    {
      id: 'cost-centers',
      label: 'Centros de Custo',
      icon: 'Target',
      description: 'Projetos e alocação de custos'
    },
    {
      id: 'budgets',
      label: 'Orçamentos',
      icon: 'PieChart',
      description: 'Planejamento financeiro mensal'
    },
    {
      id: 'users-permissions',
      label: 'Usuários & Permissões',
      icon: 'Shield',
      description: 'Controle de acesso e funções'
    },
    {
      id: 'alerts',
      label: 'Alertas',
      icon: 'Bell',
      description: 'Configuração de notificações'
    },
    {
      id: 'tax-configuration',
      label: 'Configuração Fiscal',
      icon: 'Calculator',
      description: 'Simples Nacional e tributação'
    },
    {
      id: 'system-preferences',
      label: 'Preferências do Sistema',
      icon: 'Settings',
      description: 'Tema, idioma e personalização'
    }
  ];

  return (
    <nav className="w-80 bg-card border-r border-border h-full overflow-y-auto">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Configurações</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie suas configurações empresariais
        </p>
      </div>
      <div className="p-4 space-y-2">
        {navigationSections?.map((section) => {
          const isActive = activeSection === section?.id;
          
          return (
            <button
              key={section?.id}
              onClick={() => onSectionChange(section?.id)}
              className={`
                w-full flex items-start space-x-3 p-3 rounded-lg text-left
                transition-all duration-200 ease-smooth
                hover:bg-muted hover-elevation
                ${isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20' :'text-foreground hover:text-primary'
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'}
              `}>
                <Icon 
                  name={section?.icon} 
                  size={18} 
                  color={isActive ? 'currentColor' : 'var(--color-text-secondary)'} 
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{section?.label}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {section?.description}
                </p>
              </div>
              {isActive && (
                <Icon name="ChevronRight" size={16} color="var(--color-primary)" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default SettingsNavigation;