import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ExportModal = ({ isOpen, onClose, reportData }) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'pdf',
    template: 'standard',
    includeCharts: true,
    includeAttachments: false,
    emailRecipients: '',
    whatsappNumbers: '',
    saveToHistory: true
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportStep, setExportStep] = useState('config'); // config, exporting, success

  const formatOptions = [
    { value: 'pdf', label: 'PDF', description: 'Formato ideal para visualização e impressão' },
    { value: 'xlsx', label: 'Excel (XLSX)', description: 'Planilha editável com dados estruturados' },
    { value: 'csv', label: 'CSV', description: 'Dados tabulares para importação' }
  ];

  const templateOptions = [
    { value: 'standard', label: 'Padrão', description: 'Layout padrão com logo da empresa' },
    { value: 'detailed', label: 'Detalhado', description: 'Inclui gráficos e análises extras' },
    { value: 'summary', label: 'Resumido', description: 'Apenas informações essenciais' },
    { value: 'accounting', label: 'Contábil', description: 'Formato para contador/auditor' }
  ];

  const handleConfigChange = (field, value) => {
    setExportConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportStep('exporting');

    // Simulate export process
    setTimeout(() => {
      setExportStep('success');
      setIsExporting(false);
    }, 3000);
  };

  const handleSendEmail = () => {
    console.log('Sending via email:', exportConfig?.emailRecipients);
    // Implement email sending logic
  };

  const handleSendWhatsApp = () => {
    console.log('Sending via WhatsApp:', exportConfig?.whatsappNumbers);
    // Implement WhatsApp sending via n8n webhook
  };

  const handleDownload = () => {
    console.log('Downloading file...');
    // Implement file download
    onClose();
  };

  const resetModal = () => {
    setExportStep('config');
    setIsExporting(false);
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
              {exportStep === 'config' && 'Exportar Relatório'}
              {exportStep === 'exporting' && 'Gerando Arquivo'}
              {exportStep === 'success' && 'Exportação Concluída'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {exportStep === 'config' && 'Configure as opções de exportação'}
              {exportStep === 'exporting' && 'Processando dados e gerando arquivo...'}
              {exportStep === 'success' && 'Arquivo gerado com sucesso'}
            </p>
          </div>
          <button
            onClick={resetModal}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Icon name="X" size={20} color="var(--color-text-secondary)" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {exportStep === 'config' && (
            <div className="space-y-6">
              {/* Format Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Formato de Exportação
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {formatOptions?.map((format) => (
                    <div
                      key={format?.value}
                      className={`
                        border rounded-lg p-4 cursor-pointer transition-all
                        ${exportConfig?.format === format?.value
                          ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                        }
                      `}
                      onClick={() => handleConfigChange('format', format?.value)}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          checked={exportConfig?.format === format?.value}
                          onChange={() => handleConfigChange('format', format?.value)}
                          className="w-4 h-4 text-primary"
                        />
                        <div>
                          <div className="font-medium text-foreground">{format?.label}</div>
                          <div className="text-sm text-muted-foreground">{format?.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Selection */}
              <Select
                label="Template"
                description="Escolha o layout do relatório"
                options={templateOptions}
                value={exportConfig?.template}
                onChange={(value) => handleConfigChange('template', value)}
              />

              {/* Export Options */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Opções de Exportação
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="includeCharts"
                      checked={exportConfig?.includeCharts}
                      onChange={(e) => handleConfigChange('includeCharts', e?.target?.checked)}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                    />
                    <label htmlFor="includeCharts" className="text-sm text-foreground">
                      Incluir gráficos e visualizações
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="includeAttachments"
                      checked={exportConfig?.includeAttachments}
                      onChange={(e) => handleConfigChange('includeAttachments', e?.target?.checked)}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                    />
                    <label htmlFor="includeAttachments" className="text-sm text-foreground">
                      Incluir anexos das transações
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="saveToHistory"
                      checked={exportConfig?.saveToHistory}
                      onChange={(e) => handleConfigChange('saveToHistory', e?.target?.checked)}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                    />
                    <label htmlFor="saveToHistory" className="text-sm text-foreground">
                      Salvar no histórico de relatórios
                    </label>
                  </div>
                </div>
              </div>

              {/* Sharing Options */}
              <div className="border-t border-border pt-6">
                <h4 className="text-sm font-medium text-foreground mb-4">Compartilhamento</h4>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="emailRecipients" className="text-sm text-foreground block mb-2">
                      Enviar por Email
                    </label>
                    <input
                      type="email"
                      id="emailRecipients"
                      placeholder="email1@empresa.com, email2@empresa.com"
                      value={exportConfig?.emailRecipients}
                      onChange={(e) => handleConfigChange('emailRecipients', e?.target?.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Emails separados por vírgula
                    </p>
                  </div>

                  <div>
                    <label htmlFor="whatsappNumbers" className="text-sm text-foreground block mb-2">
                      Enviar via WhatsApp
                    </label>
                    <input
                      type="text"
                      id="whatsappNumbers"
                      placeholder="+5511999999999, +5511888888888"
                      value={exportConfig?.whatsappNumbers}
                      onChange={(e) => handleConfigChange('whatsappNumbers', e?.target?.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Números com código do país, separados por vírgula
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {exportStep === 'exporting' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Gerando Relatório
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                Processando dados e aplicando formatação...\nEste processo pode levar alguns minutos.
              </p>
            </div>
          )}

          {exportStep === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="CheckCircle" size={32} color="var(--color-success)" />
              </div>
              
              <h3 className="text-lg font-medium text-foreground mb-2">
                Relatório Exportado com Sucesso!
              </h3>
              
              <p className="text-sm text-muted-foreground mb-6">
                Seu relatório foi gerado e está pronto para download ou compartilhamento.
              </p>

              <div className="space-y-3">
                <Button
                  variant="default"
                  iconName="Download"
                  iconPosition="left"
                  fullWidth
                  onClick={handleDownload}
                >
                  Baixar Arquivo
                </Button>

                {exportConfig?.emailRecipients && (
                  <Button
                    variant="outline"
                    iconName="Mail"
                    iconPosition="left"
                    fullWidth
                    onClick={handleSendEmail}
                  >
                    Enviar por Email
                  </Button>
                )}

                {exportConfig?.whatsappNumbers && (
                  <Button
                    variant="outline"
                    iconName="MessageCircle"
                    iconPosition="left"
                    fullWidth
                    onClick={handleSendWhatsApp}
                  >
                    Enviar via WhatsApp
                  </Button>
                )}
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Formato:</span>
                  <span className="text-foreground font-medium">
                    {formatOptions?.find(f => f?.value === exportConfig?.format)?.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Template:</span>
                  <span className="text-foreground font-medium">
                    {templateOptions?.find(t => t?.value === exportConfig?.template)?.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Gerado em:</span>
                  <span className="text-foreground font-medium">
                    {new Date()?.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {exportStep === 'config' && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
            <Button
              variant="outline"
              onClick={resetModal}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              iconName="Download"
              iconPosition="left"
              loading={isExporting}
              onClick={handleExport}
            >
              Exportar
            </Button>
          </div>
        )}

        {exportStep === 'success' && (
          <div className="flex items-center justify-center p-6 border-t border-border">
            <Button
              variant="outline"
              onClick={resetModal}
            >
              Fechar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportModal;