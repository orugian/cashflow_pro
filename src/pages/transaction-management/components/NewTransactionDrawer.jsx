import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { 
  selectScopedAccounts, 
  selectCategories, 
  selectVendorsByCompany, 
  selectCustomersByCompany,
  selectCurrentUser,
  selectActiveCompanyId,
  selectCanEdit,
} from '../../../store/selectors';
import { 
  addTransaction, 
  createTransfer, 
  editTransaction 
} from '../../../store/slices/transactionsSlice';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';



const NewTransactionDrawer = ({ 
  isOpen, 
  onClose, 
  transaction = null,
  mode = 'create' // 'create' | 'edit'
}) => {
  const dispatch = useDispatch();
  const scopedAccounts = useSelector(selectScopedAccounts);
  const categories = useSelector(selectCategories);
  const currentUser = useSelector(selectCurrentUser);
  const activeCompanyId = useSelector(selectActiveCompanyId);
  const canEdit = useSelector(selectCanEdit);

  const [formData, setFormData] = useState({
    type: 'exit',
    companyId: activeCompanyId,
    accountId: '',
    categoryId: '',
    vendorId: '',
    customerId: '',
    competenciaDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    description: '',
    paymentMethod: 'pix',
    status: 'planned',
    notes: '',
    tags: '',
    attachments: [],
    isRecurring: false,
    recurringFrequency: '',
  });

  const [transferData, setTransferData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const [isTransfer, setIsTransfer] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vendors = useSelector((state) => selectVendorsByCompany(state, activeCompanyId));
  const customers = useSelector((state) => selectCustomersByCompany(state, activeCompanyId));

  const handleClose = () => {
    onClose();
  };

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

    if (isTransfer) {
      if (!transferData?.fromAccountId) newErrors.fromAccountId = 'Conta de origem é obrigatória';
      if (!transferData?.toAccountId) newErrors.toAccountId = 'Conta de destino é obrigatória';
      if (transferData?.fromAccountId === transferData?.toAccountId) {
        newErrors.toAccountId = 'Conta de destino deve ser diferente da origem';
      }
      if (!transferData?.amount || parseFloat(transferData?.amount) <= 0) {
        newErrors.amount = 'Valor deve ser maior que zero';
      }
      if (!transferData?.date) newErrors.date = 'Data é obrigatória';
    } else {
      if (!formData?.accountId) newErrors.accountId = 'Conta é obrigatória';
      if (!formData?.categoryId) newErrors.categoryId = 'Categoria é obrigatória';
      if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
        newErrors.amount = 'Valor deve ser maior que zero';
      }
      if (!formData?.description?.trim()) newErrors.description = 'Descrição é obrigatória';
      if (!formData?.dueDate) newErrors.dueDate = 'Data de vencimento é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!canEdit) {
      alert('Você não tem permissão para realizar esta ação');
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (isTransfer) {
        // Create transfer
        dispatch(createTransfer({
          companyId: activeCompanyId,
          fromAccountId: transferData?.fromAccountId,
          toAccountId: transferData?.toAccountId,
          amount: parseFloat(transferData?.amount),
          date: transferData?.date,
          notes: transferData?.description,
          currentUserId: currentUser?.id,
        }));
      } else if (mode === 'edit' && transaction) {
        // Edit existing transaction
        dispatch(editTransaction({
          id: transaction?.id,
          ...formData,
          amount: parseFloat(formData?.amount),
          tags: formData?.tags ? formData?.tags?.split(',')?.map(tag => tag?.trim()) : [],
          currentUserId: currentUser?.id,
        }));
      } else {
        // Create new transaction
        dispatch(addTransaction({
          ...formData,
          amount: parseFloat(formData?.amount),
          tags: formData?.tags ? formData?.tags?.split(',')?.map(tag => tag?.trim()) : [],
          currentUserId: currentUser?.id,
        }));
      }

      onClose();
      
      // Reset form
      setFormData({
        type: 'exit',
        companyId: activeCompanyId,
        accountId: '',
        categoryId: '',
        vendorId: '',
        customerId: '',
        competenciaDate: format(new Date(), 'yyyy-MM-dd'),
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        amount: '',
        description: '',
        paymentMethod: 'pix',
        status: 'planned',
        notes: '',
        tags: '',
        attachments: [],
        isRecurring: false,
        recurringFrequency: '',
      });
      setTransferData({
        fromAccountId: '',
        toAccountId: '',
        amount: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
      });
      setIsTransfer(false);
      setErrors({});

    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Erro ao salvar transação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
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
            value={formData?.companyId}
            onChange={(value) => handleInputChange('companyId', value)}
            required
          />

          {/* Account and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Conta"
              options={accountOptions}
              value={formData?.accountId}
              onChange={(value) => handleInputChange('accountId', value)}
              error={errors?.accountId}
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
              value={formData?.categoryId}
              onChange={(value) => handleInputChange('categoryId', value)}
              error={errors?.categoryId}
              searchable
              required
            />
            
            <Input
              label="Fornecedor/Cliente"
              type="text"
              placeholder="Digite o nome..."
              value={formData?.vendorId}
              onChange={(e) => handleInputChange('vendorId', e?.target?.value)}
              error={errors?.vendorId}
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
              value={formData?.competenciaDate}
              onChange={(e) => handleInputChange('competenciaDate', e?.target?.value)}
              error={errors?.competenciaDate}
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
              onClick={handleSubmit}
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