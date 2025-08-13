import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';

const ExportModal = ({ isOpen, onClose, onExport, selectedTransactions }) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'csv',
    dateRange: 'selected',
    includeAttachments: false,
    columns: {
      date: true,
      description: true,
      category: true,
      vendor: true,
      amount: true,
      status: true,
      account: true,
      paymentMethod: true,
      tags: true,
      notes: true
    },
    emailRecipients: '',
    whatsappNumber: ''
  });

  const formatOptions = [
    { value: 'csv', label: 'CSV (Excel)' },
    { value: 'pdf', label: 'PDF' },
    { value: 'xlsx', label: 'Excel (XLSX)' }
  ];

  const dateRangeOptions = [
    { value: 'selected', label: `Transações Selecionadas (${selectedTransactions?.length})` },
    { value: 'current-month', label: 'Mês Atual' },
    { value: 'last-month', label: 'Mês Anterior' },
    { value: 'current-year', label: 'Ano Atual' },
    { value: 'custom', label: 'Período Personalizado' }
  ];

  const columnOptions = [
    { key: 'date', label: 'Data' },
    { key: 'description', label: 'Descrição' },
    { key: 'category', label: 'Categoria' },
    { key: 'vendor', label: 'Fornecedor/Cliente' },
    { key: 'amount', label: 'Valor' },
    { key: 'status', label: 'Status' },
    { key: 'account', label: 'Conta' },
    { key: 'paymentMethod', label: 'Método de Pagamento' },
    { key: 'tags', label: 'Tags' },
    { key: 'notes', label: 'Observações' }
  ];

  const handleConfigChange = (key, value) => {
    setExportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleColumnChange = (columnKey, checked) => {
    setExportConfig(prev => ({
      ...prev,
      columns: {
        ...prev?.columns,
        [columnKey]: checked
      }
    }));
  };

  const handleExport = () => {
    onExport(exportConfig);
    onClose();
  };

  const getSelectedColumnsCount = () => {
    return Object.values(exportConfig?.columns)?.filter(Boolean)?.length;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-card border border-border rounded-lg shadow-pronounced w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Exportar Transações
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Configure as opções de exportação
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
              iconSize={20}
              className="h-10 w-10 p-0"
            />
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Format and Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Formato de Exportação"
                options={formatOptions}
                value={exportConfig?.format}
                onChange={(value) => handleConfigChange('format', value)}
              />
              
              <Select
                label="Período"
                options={dateRangeOptions}
                value={exportConfig?.dateRange}
                onChange={(value) => handleConfigChange('dateRange', value)}
              />
            </div>

            {/* Custom Date Range */}
            {exportConfig?.dateRange === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Data Inicial"
                  type="date"
                  value={exportConfig?.customStartDate || ''}
                  onChange={(e) => handleConfigChange('customStartDate', e?.target?.value)}
                />
                <Input
                  label="Data Final"
                  type="date"
                  value={exportConfig?.customEndDate || ''}
                  onChange={(e) => handleConfigChange('customEndDate', e?.target?.value)}
                />
              </div>
            )}

            {/* Column Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-foreground">
                  Colunas para Exportar
                </label>
                <span className="text-xs text-muted-foreground">
                  {getSelectedColumnsCount()} de {columnOptions?.length} selecionadas
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {columnOptions?.map((column) => (
                  <Checkbox
                    key={column?.key}
                    label={column?.label}
                    checked={exportConfig?.columns?.[column?.key]}
                    onChange={(e) => handleColumnChange(column?.key, e?.target?.checked)}
                    size="sm"
                  />
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div className="space-y-3">
              <Checkbox
                label="Incluir Anexos"
                checked={exportConfig?.includeAttachments}
                onChange={(e) => handleConfigChange('includeAttachments', e?.target?.checked)}
                description="Anexar arquivos relacionados às transações (apenas PDF)"
              />
            </div>

            {/* Sharing Options */}
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-medium text-foreground mb-4">
                Opções de Compartilhamento
              </h3>
              
              <div className="space-y-4">
                <Input
                  label="Enviar por E-mail"
                  type="email"
                  placeholder="email@exemplo.com (separar múltiplos por vírgula)"
                  value={exportConfig?.emailRecipients}
                  onChange={(e) => handleConfigChange('emailRecipients', e?.target?.value)}
                  description="Opcional: enviar arquivo por e-mail"
                />
                
                <Input
                  label="Enviar por WhatsApp"
                  type="tel"
                  placeholder="+55 11 99999-9999"
                  value={exportConfig?.whatsappNumber}
                  onChange={(e) => handleConfigChange('whatsappNumber', e?.target?.value)}
                  description="Opcional: enviar arquivo via WhatsApp Business"
                />
              </div>
            </div>

            {/* Preview Info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={20} color="var(--color-primary)" />
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    Resumo da Exportação
                  </h4>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                    <li>• Formato: {formatOptions?.find(f => f?.value === exportConfig?.format)?.label}</li>
                    <li>• Período: {dateRangeOptions?.find(d => d?.value === exportConfig?.dateRange)?.label}</li>
                    <li>• Colunas: {getSelectedColumnsCount()} selecionadas</li>
                    {exportConfig?.includeAttachments && <li>• Anexos incluídos</li>}
                    {exportConfig?.emailRecipients && <li>• Envio por e-mail configurado</li>}
                    {exportConfig?.whatsappNumber && <li>• Envio por WhatsApp configurado</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={handleExport}
              iconName="Download"
              iconPosition="left"
              disabled={getSelectedColumnsCount() === 0}
            >
              Exportar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;