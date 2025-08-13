import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      text: 'Conexão SSL Segura'
    },
    {
      icon: 'Lock',
      text: 'Dados Criptografados'
    },
    {
      icon: 'CheckCircle',
      text: 'Conformidade LGPD'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex flex-wrap justify-center gap-4">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name={feature?.icon} size={14} color="var(--color-success)" />
            <span>{feature?.text}</span>
          </div>
        ))}
      </div>
      {/* Brazilian Compliance Indicator */}
      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground">
          Sistema desenvolvido para empresas brasileiras • CNPJ validado • Simples Nacional
        </p>
      </div>
    </div>
  );
};

export default SecurityBadges;