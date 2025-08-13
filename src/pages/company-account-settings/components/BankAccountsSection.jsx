import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BankAccountsSection = () => {
  const [accounts, setAccounts] = useState([
    {
      id: '1',
      banco: 'Banco do Brasil',
      agencia: '1234-5',
      conta: '12345-6',
      tipo: 'corrente',
      saldoAtual: 25000.00,
      metaSaldo: 50000.00,
      pixHabilitado: true,
      boletoHabilitado: true,
      reconciliacaoAutomatica: false,
      status: 'ativa'
    },
    {
      id: '2',
      banco: 'Itaú Unibanco',
      agencia: '5678',
      conta: '67890-1',
      tipo: 'poupanca',
      saldoAtual: 75000.00,
      metaSaldo: 100000.00,
      pixHabilitado: true,
      boletoHabilitado: false,
      reconciliacaoAutomatica: true,
      status: 'ativa'
    },
    {
      id: '3',
      banco: 'Nubank',
      agencia: '0001',
      conta: '98765-4',
      tipo: 'corrente',
      saldoAtual: 12500.00,
      metaSaldo: 30000.00,
      pixHabilitado: true,
      boletoHabilitado: false,
      reconciliacaoAutomatica: false,
      status: 'inativa'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({
    banco: '',
    agencia: '',
    conta: '',
    tipo: 'corrente',
    saldoAtual: 0,
    metaSaldo: 0,
    pixHabilitado: false,
    boletoHabilitado: false,
    reconciliacaoAutomatica: false
  });

  const bancoOptions = [
    { value: 'banco-do-brasil', label: 'Banco do Brasil' },
    { value: 'itau', label: 'Itaú Unibanco' },
    { value: 'bradesco', label: 'Bradesco' },
    { value: 'santander', label: 'Santander' },
    { value: 'caixa', label: 'Caixa Econômica Federal' },
    { value: 'nubank', label: 'Nubank' },
    { value: 'inter', label: 'Banco Inter' },
    { value: 'c6', label: 'C6 Bank' },
    { value: 'outros', label: 'Outros' }
  ];

  const tipoContaOptions = [
    { value: 'corrente', label: 'Conta Corrente' },
    { value: 'poupanca', label: 'Conta Poupança' },
    { value: 'investimento', label: 'Conta Investimento' }
  ];

  const handleAddAccount = () => {
    const account = {
      id: Date.now()?.toString(),
      ...newAccount,
      status: 'ativa'
    };
    
    setAccounts(prev => [...prev, account]);
    setNewAccount({
      banco: '',
      agencia: '',
      conta: '',
      tipo: 'corrente',
      saldoAtual: 0,
      metaSaldo: 0,
      pixHabilitado: false,
      boletoHabilitado: false,
      reconciliacaoAutomatica: false
    });
    setShowAddForm(false);
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
  };

  const handleSaveEdit = () => {
    setAccounts(prev => prev?.map(acc => 
      acc?.id === editingAccount?.id ? editingAccount : acc
    ));
    setEditingAccount(null);
  };

  const handleToggleStatus = (accountId) => {
    setAccounts(prev => prev?.map(acc => 
      acc?.id === accountId 
        ? { ...acc, status: acc?.status === 'ativa' ? 'inativa' : 'ativa' }
        : acc
    ));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value);
  };

  const getStatusColor = (status) => {
    return status === 'ativa' ? 'text-success' : 'text-muted-foreground';
  };

  const getProgressPercentage = (atual, meta) => {
    if (meta === 0) return 0;
    return Math.min((atual / meta) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Contas Bancárias</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie suas contas bancárias e metas de saldo
          </p>
        </div>
        
        <Button 
          variant="default" 
          iconName="Plus" 
          onClick={() => setShowAddForm(true)}
        >
          Nova Conta
        </Button>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="CreditCard" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Contas</p>
              <p className="text-2xl font-semibold text-foreground">{accounts?.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} color="var(--color-success)" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo Total</p>
              <p className="text-2xl font-semibold text-foreground">
                {formatCurrency(accounts?.reduce((sum, acc) => sum + acc?.saldoAtual, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Target" size={20} color="var(--color-warning)" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Meta Total</p>
              <p className="text-2xl font-semibold text-foreground">
                {formatCurrency(accounts?.reduce((sum, acc) => sum + acc?.metaSaldo, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Accounts List */}
      <div className="space-y-4">
        {accounts?.map((account) => (
          <div key={account?.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Building2" size={20} color="var(--color-primary)" />
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-foreground">{account?.banco}</h4>
                  <p className="text-sm text-muted-foreground">
                    Ag: {account?.agencia} • Conta: {account?.conta}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-sm ${getStatusColor(account?.status)}`}>
                      {account?.status === 'ativa' ? 'Ativa' : 'Inativa'}
                    </span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground capitalize">
                      {account?.tipo?.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  iconName="Edit"
                  onClick={() => handleEditAccount(account)}
                >
                  Editar
                </Button>
                
                <Button 
                  variant={account?.status === 'ativa' ? 'destructive' : 'default'}
                  size="sm"
                  onClick={() => handleToggleStatus(account?.id)}
                >
                  {account?.status === 'ativa' ? 'Desativar' : 'Ativar'}
                </Button>
              </div>
            </div>

            {/* Account Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Saldo Atual</p>
                <p className="text-xl font-semibold text-foreground">
                  {formatCurrency(account?.saldoAtual)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Meta de Saldo</p>
                <p className="text-xl font-semibold text-foreground">
                  {formatCurrency(account?.metaSaldo)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Progresso da Meta</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${getProgressPercentage(account?.saldoAtual, account?.metaSaldo)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {Math.round(getProgressPercentage(account?.saldoAtual, account?.metaSaldo))}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Integrações</p>
                <div className="flex items-center space-x-2 mt-1">
                  {account?.pixHabilitado && (
                    <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                      PIX
                    </span>
                  )}
                  {account?.boletoHabilitado && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      Boleto
                    </span>
                  )}
                  {account?.reconciliacaoAutomatica && (
                    <span className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">
                      Auto Reconciliação
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Add Account Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-pronounced w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Nova Conta Bancária</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Adicione uma nova conta bancária ao sistema
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Banco"
                  options={bancoOptions}
                  value={newAccount?.banco}
                  onChange={(value) => setNewAccount(prev => ({ ...prev, banco: value }))}
                  required
                />

                <Select
                  label="Tipo de Conta"
                  options={tipoContaOptions}
                  value={newAccount?.tipo}
                  onChange={(value) => setNewAccount(prev => ({ ...prev, tipo: value }))}
                  required
                />

                <Input
                  label="Agência"
                  type="text"
                  value={newAccount?.agencia}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, agencia: e?.target?.value }))}
                  required
                />

                <Input
                  label="Conta"
                  type="text"
                  value={newAccount?.conta}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, conta: e?.target?.value }))}
                  required
                />

                <Input
                  label="Saldo Atual"
                  type="number"
                  value={newAccount?.saldoAtual}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, saldoAtual: parseFloat(e?.target?.value) || 0 }))}
                  required
                />

                <Input
                  label="Meta de Saldo"
                  type="number"
                  value={newAccount?.metaSaldo}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, metaSaldo: parseFloat(e?.target?.value) || 0 }))}
                />
              </div>
            </div>

            <div className="p-6 border-t border-border flex items-center justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
              <Button variant="default" onClick={handleAddAccount}>
                Adicionar Conta
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Account Modal */}
      {editingAccount && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-pronounced w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Editar Conta Bancária</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Atualize as informações da conta
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Banco"
                  type="text"
                  value={editingAccount?.banco}
                  onChange={(e) => setEditingAccount(prev => ({ ...prev, banco: e?.target?.value }))}
                  required
                />

                <Select
                  label="Tipo de Conta"
                  options={tipoContaOptions}
                  value={editingAccount?.tipo}
                  onChange={(value) => setEditingAccount(prev => ({ ...prev, tipo: value }))}
                  required
                />

                <Input
                  label="Agência"
                  type="text"
                  value={editingAccount?.agencia}
                  onChange={(e) => setEditingAccount(prev => ({ ...prev, agencia: e?.target?.value }))}
                  required
                />

                <Input
                  label="Conta"
                  type="text"
                  value={editingAccount?.conta}
                  onChange={(e) => setEditingAccount(prev => ({ ...prev, conta: e?.target?.value }))}
                  required
                />

                <Input
                  label="Saldo Atual"
                  type="number"
                  value={editingAccount?.saldoAtual}
                  onChange={(e) => setEditingAccount(prev => ({ ...prev, saldoAtual: parseFloat(e?.target?.value) || 0 }))}
                  required
                />

                <Input
                  label="Meta de Saldo"
                  type="number"
                  value={editingAccount?.metaSaldo}
                  onChange={(e) => setEditingAccount(prev => ({ ...prev, metaSaldo: parseFloat(e?.target?.value) || 0 }))}
                />
              </div>
            </div>

            <div className="p-6 border-t border-border flex items-center justify-end space-x-3">
              <Button variant="outline" onClick={() => setEditingAccount(null)}>
                Cancelar
              </Button>
              <Button variant="default" onClick={handleSaveEdit}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankAccountsSection;