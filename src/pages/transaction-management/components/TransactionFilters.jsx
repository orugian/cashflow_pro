import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const TransactionFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const accountOptions = [
    { value: 'all', label: 'Todas as Contas' },
    { value: 'bb-checking', label: 'Banco do Brasil - Conta Corrente' },
    { value: 'bb-savings', label: 'Banco do Brasil - Poupança' },
    { value: 'itau-checking', label: 'Itaú - Conta Corrente' },
    { value: 'cash', label: 'Dinheiro em Espécie' },
    { value: 'credit-card', label: 'Cartão de Crédito Empresarial' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'planned', label: 'Planejado' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'paid', label: 'Pago/Recebido' },
    { value: 'partially-paid', label: 'Parcialmente Pago' },
    { value: 'overdue', label: 'Em Atraso' },
    { value: 'canceled', label: 'Cancelado' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'revenue', label: '💰 Receitas' },
    { value: 'revenue-services', label: '  └ Prestação de Serviços' },
    { value: 'revenue-products', label: '  └ Venda de Produtos' },
    { value: 'expenses', label: '💸 Despesas' },
    { value: 'expenses-operational', label: '  └ Despesas Operacionais' },
    { value: 'expenses-administrative', label: '  └ Despesas Administrativas' },
    { value: 'expenses-marketing', label: '  └ Marketing e Publicidade' },
    { value: 'expenses-utilities', label: '  └ Utilidades (Água, Luz, Internet)' },
    { value: 'expenses-rent', label: '  └ Aluguel e Condomínio' },
    { value: 'taxes', label: '🏛️ Impostos e Taxas' },
    { value: 'taxes-simples', label: '  └ Simples Nacional' },
    { value: 'taxes-municipal', label: '  └ Impostos Municipais' }
  ];

  const paymentMethods = [
    { id: 'pix', label: 'PIX', checked: filters?.paymentMethods?.includes('pix') || false },
    { id: 'ted', label: 'TED', checked: filters?.paymentMethods?.includes('ted') || false },
    { id: 'boleto', label: 'Boleto', checked: filters?.paymentMethods?.includes('boleto') || false },
    { id: 'credit-card', label: 'Cartão de Crédito', checked: filters?.paymentMethods?.includes('credit-card') || false },
    { id: 'debit-card', label: 'Cartão de Débito', checked: filters?.paymentMethods?.includes('debit-card') || false },
    { id: 'cash', label: 'Dinheiro', checked: filters?.paymentMethods?.includes('cash') || false },
    { id: 'check', label: 'Cheque', checked: filters?.paymentMethods?.includes('check') || false }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handlePaymentMethodChange = (methodId, checked) => {
    const currentMethods = filters?.paymentMethods || [];
    const updatedMethods = checked
      ? [...currentMethods, methodId]
      : currentMethods?.filter(id => id !== methodId);
    
    handleFilterChange('paymentMethods', updatedMethods);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.dateRange && (filters?.dateRange?.start || filters?.dateRange?.end)) count++;
    if (filters?.account && filters?.account !== 'all') count++;
    if (filters?.status && filters?.status !== 'all') count++;
    if (filters?.category && filters?.category !== 'all') count++;
    if (filters?.vendor && filters?.vendor?.trim()) count++;
    if (filters?.tags && filters?.tags?.trim()) count++;
    if (filters?.paymentMethods && filters?.paymentMethods?.length > 0) count++;
    if (filters?.amountRange && (filters?.amountRange?.min || filters?.amountRange?.max)) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-card border border-border rounded-lg shadow-base">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} color="var(--color-primary)" />
          <h3 className="font-semibold text-foreground">Filtros</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconSize={14}
            >
              Limpar
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            iconName={isCollapsed ? "ChevronDown" : "ChevronUp"}
            iconSize={16}
          />
        </div>
      </div>
      {/* Filter Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-4">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Data Inicial"
              type="date"
              value={filters?.dateRange?.start || ''}
              onChange={(e) => handleFilterChange('dateRange', {
                ...filters?.dateRange,
                start: e?.target?.value
              })}
              className="w-full"
            />
            <Input
              label="Data Final"
              type="date"
              value={filters?.dateRange?.end || ''}
              onChange={(e) => handleFilterChange('dateRange', {
                ...filters?.dateRange,
                end: e?.target?.value
              })}
              className="w-full"
            />
          </div>

          {/* Account and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Select
              label="Conta"
              options={accountOptions}
              value={filters?.account || 'all'}
              onChange={(value) => handleFilterChange('account', value)}
            />
            <Select
              label="Status"
              options={statusOptions}
              value={filters?.status || 'all'}
              onChange={(value) => handleFilterChange('status', value)}
            />
          </div>

          {/* Category */}
          <Select
            label="Categoria"
            options={categoryOptions}
            value={filters?.category || 'all'}
            onChange={(value) => handleFilterChange('category', value)}
            searchable
          />

          {/* Vendor and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Fornecedor/Cliente"
              type="text"
              placeholder="Digite para buscar..."
              value={filters?.vendor || ''}
              onChange={(e) => handleFilterChange('vendor', e?.target?.value)}
            />
            <Input
              label="Tags"
              type="text"
              placeholder="Ex: urgente, recorrente"
              value={filters?.tags || ''}
              onChange={(e) => handleFilterChange('tags', e?.target?.value)}
            />
          </div>

          {/* Payment Methods */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Métodos de Pagamento
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {paymentMethods?.map((method) => (
                <Checkbox
                  key={method?.id}
                  label={method?.label}
                  checked={method?.checked}
                  onChange={(e) => handlePaymentMethodChange(method?.id, e?.target?.checked)}
                  size="sm"
                />
              ))}
            </div>
          </div>

          {/* Amount Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Faixa de Valor (R$)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Valor mínimo"
                value={filters?.amountRange?.min || ''}
                onChange={(e) => handleFilterChange('amountRange', {
                  ...filters?.amountRange,
                  min: e?.target?.value
                })}
              />
              <Input
                type="number"
                placeholder="Valor máximo"
                value={filters?.amountRange?.max || ''}
                onChange={(e) => handleFilterChange('amountRange', {
                  ...filters?.amountRange,
                  max: e?.target?.value
                })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;