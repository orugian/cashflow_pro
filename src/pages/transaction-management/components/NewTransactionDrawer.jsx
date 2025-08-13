import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const NewTransactionDrawer = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    company: 'tech-solutions',
    account: '',
    type: 'expense',
    category: '',
    vendor: '',
    costCenter: '',
    competenceDate: '',
    dueDate: '',
    paymentDate: '',
    amount: '',
    paymentMethod: '',
    tags: '',
    notes: '',
    isRecurring: false,
    recurringFrequency: 'monthly',
    attachments: []
  });

  const [errors, setErrors] = useState({});

  const companyOptions = [
    { value: 'tech-solutions', label: 'Tech Solutions Ltda (12.345.678/0001-90)' },
    { value: 'consultoria-digital', label: 'Consultoria Digital ME (98.765.432/0001-10)' }
  ];

  const accountOptions = [
    { value: 'bb-checking', label: 'Banco do Brasil - Conta Corrente' },
    { value: 'bb-savings', label: 'Banco do Brasil - Poupança' },
    { value: 'itau-checking', label: 'Itaú - Conta Corrente' },
    { value: 'cash', label: 'Dinheiro em Espécie' },
    { value: 'credit-card', label: 'Cartão de Crédito Empresarial' }
  ];

  const categoryOptions = [
    { value: 'revenue-services', label: '💰 Prestação de Serviços' },
    { value: 'revenue-products', label: '💰 Venda de Produtos' },
    { value: 'expenses-operational', label: '💸 Despesas Operacionais' },
    { value: 'expenses-administrative', label: '💸 Despesas Administrativas' },
    { value: 'expenses-marketing', label: '💸 Marketing e Publicidade' },
    { value: 'expenses-utilities', label: '💸 Utilidades (Água, Luz, Internet)' },
    { value: 'expenses-rent', label: '💸 Aluguel e Condomínio' },
    { value: 'taxes-simples', label: '🏛️ Simples Nacional' },
    { value: 'taxes-municipal', label: '🏛️ Impostos Municipais' }
  ];

  const paymentMethodOptions = [
    { value: 'pix', label: 'PIX' },
    { value: 'ted', label: 'TED' },
    { value: 'boleto', label: 'Boleto' },
    { value: 'credit-card', label: 'Cartão de Crédito' },
    { value: 'debit-card', label: 'Cartão de Débito' },
    { value: 'cash', label: 'Dinheiro' },
    { value: 'check', label: 'Cheque' }
  ];

  const costCenterOptions = [
    { value: 'administration', label: 'Administração' },
    { value: 'sales', label: 'Vendas' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'operations', label: 'Operações' },
    { value: 'it', label: 'Tecnologia da Informação' }
  ];

  const recurringFrequencyOptions = [
    { value: 'daily', label: 'Diário' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensal' },
    { value: 'quarterly', label: 'Trimestral' },
    { value: 'annually', label: 'Anual' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event?.target?.files);
    const validFiles = files?.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.ms-excel', 'text/csv'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes?.includes(file?.type) && file?.size <= maxSize;
    });

    setFormData(prev => ({
      ...prev,
      attachments: [...prev?.attachments, ...validFiles]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev?.attachments?.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.account) newErrors.account = 'Conta é obrigatória';
    if (!formData?.category) newErrors.category = 'Categoria é obrigatória';
    if (!formData?.vendor) newErrors.vendor = 'Fornecedor/Cliente é obrigatório';
    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }
    if (!formData?.competenceDate) newErrors.competenceDate = 'Data de competência é obrigatória';
    if (!formData?.dueDate) newErrors.dueDate = 'Data de vencimento é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const transactionData = {
      ...formData,
      id: Date.now()?.toString(),
      createdAt: new Date()?.toISOString(),
      status: 'planned'
    };

    onSave(transactionData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      company: 'tech-solutions',
      account: '',
      type: 'expense',
      category: '',
      vendor: '',
      costCenter: '',
      competenceDate: '',
      dueDate: '',
      paymentDate: '',
      amount: '',
      paymentMethod: '',
      tags: '',
      notes: '',
      isRecurring: false,
      recurringFrequency: 'monthly',
      attachments: []
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-card border-l border-border shadow-pronounced overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Nova Transação</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Adicione uma nova transação financeira
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              iconName="X"
              iconSize={20}
              className="h-10 w-10 p-0"
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Company Selection */}
          <Select
            label="Empresa"
            options={companyOptions}
            value={formData?.company}
            onChange={(value) => handleInputChange('company', value)}
            required
          />

          {/* Account and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Conta"
              options={accountOptions}
              value={formData?.account}
              onChange={(value) => handleInputChange('account', value)}
              error={errors?.account}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo de Transação *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={formData?.type === 'expense'}
                    onChange={(e) => handleInputChange('type', e?.target?.value)}
                    className="text-primary"
                  />
                  <span className="text-sm text-foreground">💸 Despesa</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={formData?.type === 'income'}
                    onChange={(e) => handleInputChange('type', e?.target?.value)}
                    className="text-primary"
                  />
                  <span className="text-sm text-foreground">💰 Receita</span>
                </label>
              </div>
            </div>
          </div>

          {/* Category and Vendor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Categoria"
              options={categoryOptions}
              value={formData?.category}
              onChange={(value) => handleInputChange('category', value)}
              error={errors?.category}
              searchable
              required
            />
            
            <Input
              label="Fornecedor/Cliente"
              type="text"
              placeholder="Digite o nome..."
              value={formData?.vendor}
              onChange={(e) => handleInputChange('vendor', e?.target?.value)}
              error={errors?.vendor}
              required
            />
          </div>

          {/* Cost Center */}
          <Select
            label="Centro de Custo"
            options={costCenterOptions}
            value={formData?.costCenter}
            onChange={(value) => handleInputChange('costCenter', value)}
          />

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Data de Competência"
              type="date"
              value={formData?.competenceDate}
              onChange={(e) => handleInputChange('competenceDate', e?.target?.value)}
              error={errors?.competenceDate}
              required
            />
            
            <Input
              label="Data de Vencimento"
              type="date"
              value={formData?.dueDate}
              onChange={(e) => handleInputChange('dueDate', e?.target?.value)}
              error={errors?.dueDate}
              required
            />
            
            <Input
              label="Data de Pagamento"
              type="date"
              value={formData?.paymentDate}
              onChange={(e) => handleInputChange('paymentDate', e?.target?.value)}
            />
          </div>

          {/* Amount and Payment Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Valor (R$)"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={formData?.amount}
              onChange={(e) => handleInputChange('amount', e?.target?.value)}
              error={errors?.amount}
              required
            />
            
            <Select
              label="Método de Pagamento"
              options={paymentMethodOptions}
              value={formData?.paymentMethod}
              onChange={(value) => handleInputChange('paymentMethod', value)}
            />
          </div>

          {/* Tags */}
          <Input
            label="Tags"
            type="text"
            placeholder="Ex: urgente, recorrente, marketing"
            value={formData?.tags}
            onChange={(e) => handleInputChange('tags', e?.target?.value)}
            description="Separe as tags com vírgulas"
          />

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Observações
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={3}
              placeholder="Informações adicionais sobre a transação..."
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
            />
          </div>

          {/* Recurring Transaction */}
          <div className="space-y-4">
            <Checkbox
              label="Transação Recorrente"
              checked={formData?.isRecurring}
              onChange={(e) => handleInputChange('isRecurring', e?.target?.checked)}
              description="Criar automaticamente transações futuras"
            />

            {formData?.isRecurring && (
              <Select
                label="Frequência"
                options={recurringFrequencyOptions}
                value={formData?.recurringFrequency}
                onChange={(value) => handleInputChange('recurringFrequency', value)}
              />
            )}
          </div>

          {/* File Attachments */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Anexos
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.xls,.xlsx,.csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Icon name="Upload" size={32} color="var(--color-muted-foreground)" />
                <p className="text-sm text-muted-foreground mt-2">
                  Clique para adicionar arquivos ou arraste aqui
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, JPG, PNG, XLS, CSV (máx. 10MB cada)
                </p>
              </label>
            </div>

            {/* Attachment List */}
            {formData?.attachments?.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData?.attachments?.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center space-x-2">
                      <Icon name="File" size={16} color="var(--color-muted-foreground)" />
                      <span className="text-sm text-foreground">{file?.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file?.size / 1024 / 1024)?.toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      iconName="X"
                      iconSize={14}
                      className="h-6 w-6 p-0 text-error hover:text-error"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-6">
          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              iconName="Save"
              iconPosition="left"
            >
              Salvar Transação
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTransactionDrawer;