import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const SystemPreferencesSection = () => {
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'pt-BR',
    currency: 'BRL',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1.000,00',
    timezone: 'America/Sao_Paulo',
    notifications: {
      email: true,
      push: true,
      sms: false,
      whatsapp: true
    },
    dashboard: {
      autoRefresh: true,
      refreshInterval: 300,
      defaultView: 'overview',
      showAnimations: true
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false
    },
    privacy: {
      analytics: true,
      crashReports: true,
      usageData: false,
      marketing: false
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  const themeOptions = [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Escuro' },
    { value: 'auto', label: 'Automático (Sistema)' }
  ];

  const languageOptions = [
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'en-US', label: 'English (US)' },
    { value: 'es-ES', label: 'Español' }
  ];

  const currencyOptions = [
    { value: 'BRL', label: 'Real Brasileiro (R$)' },
    { value: 'USD', label: 'Dólar Americano ($)' },
    { value: 'EUR', label: 'Euro (€)' }
  ];

  const dateFormatOptions = [
    { value: 'DD/MM/YYYY', label: '13/08/2025' },
    { value: 'MM/DD/YYYY', label: '08/13/2025' },
    { value: 'YYYY-MM-DD', label: '2025-08-13' }
  ];

  const numberFormatOptions = [
    { value: '1.000,00', label: '1.000,00 (Brasil)' },
    { value: '1,000.00', label: '1,000.00 (EUA)' },
    { value: '1 000,00', label: '1 000,00 (França)' }
  ];

  const timezoneOptions = [
    { value: 'America/Sao_Paulo', label: 'Brasília (GMT-3)' },
    { value: 'America/Manaus', label: 'Manaus (GMT-4)' },
    { value: 'America/Rio_Branco', label: 'Rio Branco (GMT-5)' }
  ];

  const refreshIntervalOptions = [
    { value: 60, label: '1 minuto' },
    { value: 300, label: '5 minutos' },
    { value: 600, label: '10 minutos' },
    { value: 1800, label: '30 minutos' },
    { value: 3600, label: '1 hora' }
  ];

  const defaultViewOptions = [
    { value: 'overview', label: 'Visão Geral' },
    { value: 'cashflow', label: 'Fluxo de Caixa' },
    { value: 'transactions', label: 'Transações' },
    { value: 'analytics', label: 'Análises' }
  ];

  const updatePreference = (section, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [section]: typeof prev?.[section] === 'object' 
        ? { ...prev?.[section], [key]: value }
        : value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In real app, this would save to API
    console.log('Saving preferences:', preferences);
    setHasChanges(false);
    
    // Show success message
    alert('Preferências salvas com sucesso!');
  };

  const handleReset = () => {
    // Reset to default preferences
    setPreferences({
      theme: 'light',
      language: 'pt-BR',
      currency: 'BRL',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: '1.000,00',
      timezone: 'America/Sao_Paulo',
      notifications: {
        email: true,
        push: true,
        sms: false,
        whatsapp: true
      },
      dashboard: {
        autoRefresh: true,
        refreshInterval: 300,
        defaultView: 'overview',
        showAnimations: true
      },
      accessibility: {
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        screenReader: false
      },
      privacy: {
        analytics: true,
        crashReports: true,
        usageData: false,
        marketing: false
      }
    });
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Preferências do Sistema</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Personalize sua experiência no CashFlow Pro
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <>
              <Button variant="outline" onClick={handleReset}>
                Resetar
              </Button>
              <Button variant="default" onClick={handleSave}>
                Salvar Alterações
              </Button>
            </>
          )}
        </div>
      </div>
      {/* Appearance Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Palette" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h4 className="text-lg font-medium text-foreground">Aparência</h4>
            <p className="text-sm text-muted-foreground">Personalize o visual da aplicação</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Tema"
            options={themeOptions}
            value={preferences?.theme}
            onChange={(value) => updatePreference('theme', null, value)}
            description="Escolha entre claro, escuro ou automático"
          />

          <Select
            label="Idioma"
            options={languageOptions}
            value={preferences?.language}
            onChange={(value) => updatePreference('language', null, value)}
            description="Idioma da interface"
          />
        </div>
      </div>
      {/* Regional Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Globe" size={20} color="var(--color-success)" />
          </div>
          <div>
            <h4 className="text-lg font-medium text-foreground">Configurações Regionais</h4>
            <p className="text-sm text-muted-foreground">Formatos de data, número e moeda</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Select
            label="Moeda"
            options={currencyOptions}
            value={preferences?.currency}
            onChange={(value) => updatePreference('currency', null, value)}
          />

          <Select
            label="Formato de Data"
            options={dateFormatOptions}
            value={preferences?.dateFormat}
            onChange={(value) => updatePreference('dateFormat', null, value)}
          />

          <Select
            label="Formato de Número"
            options={numberFormatOptions}
            value={preferences?.numberFormat}
            onChange={(value) => updatePreference('numberFormat', null, value)}
          />

          <div className="md:col-span-2 lg:col-span-3">
            <Select
              label="Fuso Horário"
              options={timezoneOptions}
              value={preferences?.timezone}
              onChange={(value) => updatePreference('timezone', null, value)}
            />
          </div>
        </div>
      </div>
      {/* Notification Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Bell" size={20} color="var(--color-warning)" />
          </div>
          <div>
            <h4 className="text-lg font-medium text-foreground">Notificações</h4>
            <p className="text-sm text-muted-foreground">Configure como receber alertas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Checkbox
            label="Notificações por E-mail"
            description="Receba alertas importantes por e-mail"
            checked={preferences?.notifications?.email}
            onChange={(e) => updatePreference('notifications', 'email', e?.target?.checked)}
          />

          <Checkbox
            label="Notificações Push"
            description="Notificações no navegador"
            checked={preferences?.notifications?.push}
            onChange={(e) => updatePreference('notifications', 'push', e?.target?.checked)}
          />

          <Checkbox
            label="Notificações por SMS"
            description="Alertas críticos via SMS"
            checked={preferences?.notifications?.sms}
            onChange={(e) => updatePreference('notifications', 'sms', e?.target?.checked)}
          />

          <Checkbox
            label="Notificações WhatsApp"
            description="Relatórios e lembretes via WhatsApp"
            checked={preferences?.notifications?.whatsapp}
            onChange={(e) => updatePreference('notifications', 'whatsapp', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Dashboard Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="LayoutDashboard" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h4 className="text-lg font-medium text-foreground">Dashboard</h4>
            <p className="text-sm text-muted-foreground">Personalize a experiência do dashboard</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Checkbox
            label="Atualização Automática"
            description="Atualizar dados automaticamente"
            checked={preferences?.dashboard?.autoRefresh}
            onChange={(e) => updatePreference('dashboard', 'autoRefresh', e?.target?.checked)}
          />

          <Checkbox
            label="Mostrar Animações"
            description="Exibir transições e animações"
            checked={preferences?.dashboard?.showAnimations}
            onChange={(e) => updatePreference('dashboard', 'showAnimations', e?.target?.checked)}
          />

          <Select
            label="Intervalo de Atualização"
            options={refreshIntervalOptions}
            value={preferences?.dashboard?.refreshInterval}
            onChange={(value) => updatePreference('dashboard', 'refreshInterval', value)}
            disabled={!preferences?.dashboard?.autoRefresh}
          />

          <Select
            label="Visualização Padrão"
            options={defaultViewOptions}
            value={preferences?.dashboard?.defaultView}
            onChange={(value) => updatePreference('dashboard', 'defaultView', value)}
          />
        </div>
      </div>
      {/* Accessibility Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Eye" size={20} color="var(--color-secondary)" />
          </div>
          <div>
            <h4 className="text-lg font-medium text-foreground">Acessibilidade</h4>
            <p className="text-sm text-muted-foreground">Opções para melhor experiência</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Checkbox
            label="Alto Contraste"
            description="Aumentar contraste para melhor visibilidade"
            checked={preferences?.accessibility?.highContrast}
            onChange={(e) => updatePreference('accessibility', 'highContrast', e?.target?.checked)}
          />

          <Checkbox
            label="Texto Grande"
            description="Aumentar tamanho da fonte"
            checked={preferences?.accessibility?.largeText}
            onChange={(e) => updatePreference('accessibility', 'largeText', e?.target?.checked)}
          />

          <Checkbox
            label="Movimento Reduzido"
            description="Reduzir animações e transições"
            checked={preferences?.accessibility?.reducedMotion}
            onChange={(e) => updatePreference('accessibility', 'reducedMotion', e?.target?.checked)}
          />

          <Checkbox
            label="Leitor de Tela"
            description="Otimizar para leitores de tela"
            checked={preferences?.accessibility?.screenReader}
            onChange={(e) => updatePreference('accessibility', 'screenReader', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Privacy Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} color="var(--color-error)" />
          </div>
          <div>
            <h4 className="text-lg font-medium text-foreground">Privacidade</h4>
            <p className="text-sm text-muted-foreground">Controle de dados e privacidade</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Checkbox
            label="Análises de Uso"
            description="Ajudar a melhorar o produto com dados anônimos"
            checked={preferences?.privacy?.analytics}
            onChange={(e) => updatePreference('privacy', 'analytics', e?.target?.checked)}
          />

          <Checkbox
            label="Relatórios de Erro"
            description="Enviar relatórios automáticos de erro"
            checked={preferences?.privacy?.crashReports}
            onChange={(e) => updatePreference('privacy', 'crashReports', e?.target?.checked)}
          />

          <Checkbox
            label="Dados de Utilização"
            description="Compartilhar como você usa o sistema"
            checked={preferences?.privacy?.usageData}
            onChange={(e) => updatePreference('privacy', 'usageData', e?.target?.checked)}
          />

          <Checkbox
            label="Comunicações de Marketing"
            description="Receber novidades e ofertas por e-mail"
            checked={preferences?.privacy?.marketing}
            onChange={(e) => updatePreference('privacy', 'marketing', e?.target?.checked)}
          />
        </div>
      </div>
      {/* System Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            <Icon name="Info" size={20} color="var(--color-text-secondary)" />
          </div>
          <div>
            <h4 className="text-lg font-medium text-foreground">Informações do Sistema</h4>
            <p className="text-sm text-muted-foreground">Detalhes da versão e suporte</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Versão</p>
            <p className="font-medium text-foreground">CashFlow Pro v2.1.0</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Última Atualização</p>
            <p className="font-medium text-foreground">13/08/2025</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Suporte</p>
            <p className="font-medium text-foreground">suporte@cashflowpro.com.br</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Backup Automático</p>
              <p className="text-sm text-muted-foreground">Último backup: Hoje às 19:30</p>
            </div>
            <Button variant="outline" iconName="Download">
              Baixar Backup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPreferencesSection;