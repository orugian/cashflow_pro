import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import Header from '../../components/ui/Header';
import ScenarioSimulator from './components/ScenarioSimulator';
import ForecastChart from './components/ForecastChart';
import AnalyticsTabs from './components/AnalyticsTabs';
import ForecastConfiguration from './components/ForecastConfiguration';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AnalyticsForecasting = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('Tech Solutions Ltda');
  const [scenarioData, setScenarioData] = useState({
    scenario: 'base',
    multipliers: { revenue: 1.0, expenses: 1.0 },
    assumptions: {
      growthRate: 5,
      seasonalityFactor: 10,
      inflationRate: 4.5,
      marketExpansion: 15
    }
  });
  const [forecastConfig, setForecastConfig] = useState({
    forecastMethod: 'hybrid',
    historicalPeriods: 12,
    seasonalAdjustment: true,
    holidayAdjustment: true,
    confidenceLevel: 80
  });

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Handle scenario changes from simulator
  const handleScenarioChange = (newScenarioData) => {
    setScenarioData(newScenarioData);
  };

  // Handle forecast configuration changes
  const handleConfigChange = (newConfig) => {
    setForecastConfig(newConfig);
  };

  // Export forecast report
  const handleExportReport = () => {
    // In real app, this would generate and download a comprehensive PDF report
    console.log('Exporting forecast report...', {
      company: selectedCompany,
      scenario: scenarioData,
      config: forecastConfig,
      timestamp: new Date()?.toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Analytics & Forecasting - CashFlow Pro</title>
        <meta name="description" content="Análises financeiras avançadas e projeções de fluxo de caixa para empresas brasileiras" />
      </Helmet>
      {/* Navigation Sidebar */}
      <NavigationSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleSidebarToggle}
      />
      {/* Header */}
      <Header 
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={handleSidebarToggle}
      />
      {/* Main Content */}
      <main className={`
        transition-all duration-300 ease-smooth pt-16
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}
      `}>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics & Forecasting</h1>
              <p className="text-muted-foreground">
                Análises avançadas e projeções financeiras para {selectedCompany}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="RefreshCw"
                onClick={() => window.location?.reload()}
              >
                Atualizar Dados
              </Button>
              
              <Button
                variant="default"
                iconName="Download"
                onClick={handleExportReport}
              >
                Exportar Relatório
              </Button>
            </div>
          </div>

          {/* Key Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg border border-border p-4 shadow-base">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={20} color="var(--color-success)" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Projeção 12M</p>
                  <p className="text-lg font-semibold text-success">R$ 1.850.000</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4 shadow-base">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Target" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Precisão Modelo</p>
                  <p className="text-lg font-semibold text-primary">87.3%</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4 shadow-base">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risco Identificado</p>
                  <p className="text-lg font-semibold text-warning">Médio</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4 shadow-base">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Calendar" size={20} color="var(--color-secondary)" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Runway</p>
                  <p className="text-lg font-semibold text-secondary">18 meses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario Simulator */}
          <ScenarioSimulator onScenarioChange={handleScenarioChange} />

          {/* Main Forecast Chart */}
          <ForecastChart 
            scenarioData={scenarioData}
            selectedCompany={selectedCompany}
          />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Analytics Tabs - Takes 2/3 of the width */}
            <div className="xl:col-span-2">
              <AnalyticsTabs selectedCompany={selectedCompany} />
            </div>

            {/* Forecast Configuration - Takes 1/3 of the width */}
            <div className="xl:col-span-1">
              <ForecastConfiguration onConfigChange={handleConfigChange} />
            </div>
          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Assessment */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-base">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                  <Icon name="Shield" size={20} color="var(--color-error)" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Avaliação de Riscos</h3>
                  <p className="text-sm text-muted-foreground">Fatores que podem impactar as projeções</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="TrendingDown" size={16} color="var(--color-error)" />
                    <span className="text-sm font-medium text-foreground">Sazonalidade Q4</span>
                  </div>
                  <span className="text-sm text-error font-medium">Alto</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={16} color="var(--color-warning)" />
                    <span className="text-sm font-medium text-foreground">Dependência de Clientes</span>
                  </div>
                  <span className="text-sm text-warning font-medium">Médio</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="DollarSign" size={16} color="var(--color-success)" />
                    <span className="text-sm font-medium text-foreground">Estabilidade de Receita</span>
                  </div>
                  <span className="text-sm text-success font-medium">Baixo</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-base">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Lightbulb" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Recomendações</h3>
                  <p className="text-sm text-muted-foreground">Ações sugeridas baseadas nas análises</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={16} color="var(--color-success)" className="mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Diversificar Base de Clientes</p>
                      <p className="text-xs text-muted-foreground">Reduzir dependência dos top 3 clientes</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-start space-x-2">
                    <Icon name="Target" size={16} color="var(--color-primary)" className="mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Otimizar Custos Operacionais</p>
                      <p className="text-xs text-muted-foreground">Potencial economia de 8-12% identificada</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="flex items-start space-x-2">
                    <Icon name="AlertCircle" size={16} color="var(--color-warning)" className="mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Preparar Reserva de Emergência</p>
                      <p className="text-xs text-muted-foreground">Manter 3-6 meses de despesas operacionais</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsForecasting;