import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ScheduleReportModal = ({ isOpen, onClose, reportType }) => {
  const [scheduleConfig, setScheduleConfig] = useState({
    frequency: 'monthly',
    dayOfMonth: '1',
    dayOfWeek: 'monday',
    time: '09:00',
    recipients: '',
    format: 'pdf',
    includeAttachments: true,
    autoSend: true,
    startDate: '2025-09-01'
  });

  const frequencyOptions = [
    { value: 'daily', label: 'Diário' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensal' },
    { value: 'quarterly', label: 'Trimestral' },
    { value: 'yearly', label: 'Anual' }
  ];

  const dayOfWeekOptions = [
    { value: 'monday', label: 'Segunda-feira' },
    { value: 'tuesday', label: 'Terça-feira' },
    { value: 'wednesday', label: 'Quarta-feira' },
    { value: 'thursday', label: 'Quinta-feira' },
    { value: 'friday', label: 'Sexta-feira' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sunday', label: 'Domingo' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'xlsx', label: 'Excel (XLSX)' },
    { value: 'csv', label: 'CSV' }
  ];

  const handleConfigChange = (field, value) => {
    setScheduleConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSchedule = () => {
    console.log('Scheduling report:', {
      reportType,
      config: scheduleConfig
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-pronounced w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Agendar Relatório
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Configure o envio automático de relatórios
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Icon name="X" size={20} color="var(--color-text-secondary)" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Report Info */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="FileText" size={20} color="var(--color-primary)" />
              <div>
                <h3 className="font-medium text-foreground">
                  {reportType?.name || 'Relatório Selecionado'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {reportType?.description || 'Configuração de agendamento automático'}
                </p>
              </div>
            </div>
          </div>

          {/* Frequency Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Frequência"
              description="Com que frequência o relatório será gerado"
              options={frequencyOptions}
              value={scheduleConfig?.frequency}
              onChange={(value) => handleConfigChange('frequency', value)}
            />

            {scheduleConfig?.frequency === 'weekly' && (
              <Select
                label="Dia da Semana"
                options={dayOfWeekOptions}
                value={scheduleConfig?.dayOfWeek}
                onChange={(value) => handleConfigChange('dayOfWeek', value)}
              />
            )}

            {scheduleConfig?.frequency === 'monthly' && (
              <Input
                label="Dia do Mês"
                type="number"
                min="1"
                max="31"
                value={scheduleConfig?.dayOfMonth}
                onChange={(e) => handleConfigChange('dayOfMonth', e?.target?.value)}
                description="Dia do mês para gerar o relatório"
              />
            )}
          </div>

          {/* Time and Start Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Horário"
              type="time"
              value={scheduleConfig?.time}
              onChange={(e) => handleConfigChange('time', e?.target?.value)}
              description="Horário para envio do relatório"
            />

            <Input
              label="Data de Início"
              type="date"
              value={scheduleConfig?.startDate}
              onChange={(e) => handleConfigChange('startDate', e?.target?.value)}
              description="Quando começar o agendamento"
            />
          </div>

          {/* Recipients */}
          <Input
            label="Destinatários"
            type="email"
            placeholder="email1@empresa.com, email2@empresa.com"
            value={scheduleConfig?.recipients}
            onChange={(e) => handleConfigChange('recipients', e?.target?.value)}
            description="Emails separados por vírgula para receber os relatórios"
          />

          {/* Format and Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Formato"
              options={formatOptions}
              value={scheduleConfig?.format}
              onChange={(value) => handleConfigChange('format', value)}
            />

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="includeAttachments"
                  checked={scheduleConfig?.includeAttachments}
                  onChange={(e) => handleConfigChange('includeAttachments', e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                />
                <label htmlFor="includeAttachments" className="text-sm text-foreground">
                  Incluir anexos
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="autoSend"
                  checked={scheduleConfig?.autoSend}
                  onChange={(e) => handleConfigChange('autoSend', e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                />
                <label htmlFor="autoSend" className="text-sm text-foreground">
                  Envio automático por email
                </label>
              </div>
            </div>
          </div>

          {/* Preview Schedule */}
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">Resumo do Agendamento</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>Frequência:</strong> {frequencyOptions?.find(f => f?.value === scheduleConfig?.frequency)?.label}
              </p>
              {scheduleConfig?.frequency === 'weekly' && (
                <p>
                  <strong>Dia:</strong> {dayOfWeekOptions?.find(d => d?.value === scheduleConfig?.dayOfWeek)?.label}
                </p>
              )}
              {scheduleConfig?.frequency === 'monthly' && (
                <p>
                  <strong>Dia do mês:</strong> {scheduleConfig?.dayOfMonth}
                </p>
              )}
              <p>
                <strong>Horário:</strong> {scheduleConfig?.time}
              </p>
              <p>
                <strong>Próximo envio:</strong> {new Date(scheduleConfig.startDate)?.toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* WhatsApp Integration */}
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Icon name="MessageCircle" size={20} color="var(--color-success)" />
              <h4 className="font-medium text-foreground">Integração WhatsApp</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Envie relatórios automaticamente via WhatsApp usando webhook n8n
            </p>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="whatsappEnabled"
                className="w-4 h-4 text-success bg-background border-border rounded focus:ring-success"
              />
              <label htmlFor="whatsappEnabled" className="text-sm text-foreground">
                Habilitar envio via WhatsApp
              </label>
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
            iconName="Calendar"
            iconPosition="left"
            onClick={handleSchedule}
          >
            Agendar Relatório
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleReportModal;