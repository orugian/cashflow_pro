import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DemoCredentials = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const credentials = [
    {
      role: 'Administrador',
      company: 'Tech Solutions Ltda',
      email: 'admin@techsolutions.com.br',
      password: 'Admin123!',
      description: 'Acesso completo a todas as funcionalidades'
    },
    {
      role: 'Administrador',
      company: 'Consultoria Digital ME',
      email: 'maria.santos@consultoria.com.br',
      password: 'Maria2024@',
      description: 'Gestão financeira completa'
    },
    {
      role: 'Visualizador',
      company: 'Inovação Empresarial SA',
      email: 'viewer@inovacao.com.br',
      password: 'Viewer123#',
      description: 'Acesso somente leitura aos relatórios'
    }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    // In real app, show toast notification
  };

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center space-x-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
      >
        <Icon name="Info" size={16} color="var(--color-primary)" />
        <span className="text-sm text-primary font-medium">
          Credenciais de Demonstração
        </span>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          color="var(--color-primary)" 
        />
      </button>
      {isExpanded && (
        <div className="mt-4 space-y-3">
          {credentials?.map((cred, index) => (
            <div key={index} className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-sm font-medium text-foreground">{cred?.role}</h4>
                  <p className="text-xs text-muted-foreground">{cred?.company}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => copyToClipboard(cred?.email)}
                    className="p-1 rounded hover:bg-muted transition-colors"
                    title="Copiar e-mail"
                  >
                    <Icon name="Copy" size={12} color="var(--color-text-secondary)" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={12} color="var(--color-text-secondary)" />
                  <span className="text-xs font-mono text-foreground">{cred?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Key" size={12} color="var(--color-text-secondary)" />
                  <span className="text-xs font-mono text-foreground">{cred?.password}</span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">{cred?.description}</p>
            </div>
          ))}
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              💡 Use qualquer uma das credenciais acima para acessar o sistema
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoCredentials;