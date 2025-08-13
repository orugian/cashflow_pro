import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-medium">
            <Icon name="DollarSign" size={28} color="white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-foreground">CashFlow Pro</h1>
            <p className="text-sm text-muted-foreground">Gestão Financeira Empresarial</p>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Bem-vindo de volta
        </h2>
        <p className="text-muted-foreground">
          Acesse sua conta para gerenciar o fluxo de caixa da sua empresa
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;