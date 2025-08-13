import React, { useState } from 'react';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import Header from '../../components/ui/Header';
import ReportSidebar from './components/ReportSidebar';
import ReportConfiguration from './components/ReportConfiguration';
import ReportPreview from './components/ReportPreview';
import ScheduleReportModal from './components/ScheduleReportModal';
import ExportModal from './components/ExportModal';
import ReportHistory from './components/ReportHistory';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ReportsCenter = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [reportSidebarCollapsed, setReportSidebarCollapsed] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Mock report types for reference
  const reportTypes = {
    'cashflow': {
      'daily-cashflow': { name: 'Fluxo Diário', description: 'Movimentações por dia' },
      'weekly-cashflow': { name: 'Fluxo Semanal', description: 'Consolidado semanal' },
      'monthly-cashflow': { name: 'Fluxo Mensal', description: 'Relatório mensal completo' },
      'yearly-cashflow': { name: 'Fluxo Anual', description: 'Visão anual consolidada' }
    },
    'management': {
      'dre-monthly': { name: 'DRE Mensal', description: 'Demonstração mensal' },
      'dre-quarterly': { name: 'DRE Trimestral', description: 'Consolidado trimestral' },
      'dre-annual': { name: 'DRE Anual', description: 'Demonstração anual' },
      'dre-comparison': { name: 'DRE Comparativa', description: 'Comparação entre períodos' }
    },
    'analysis': {
      'category-breakdown': { name: 'Por Categoria', description: 'Análise por categorias' },
      'vendor-breakdown': { name: 'Por Fornecedor', description: 'Gastos por fornecedor' },
      'customer-breakdown': { name: 'Por Cliente', description: 'Receitas por cliente' },
      'cost-center-breakdown': { name: 'Por Centro de Custo', description: 'Análise por centro de custo' },
      'period-comparison': { name: 'Comparação Períodos', description: 'Comparativo temporal' }
    },
    'compliance': {
      'monthly-accounting': { name: 'Contábil Mensal', description: 'Relatório para contador' },
      'tax-summary': { name: 'Resumo Tributário', description: 'Simples Nacional' },
      'expense-forecast': { name: 'Previsão Despesas', description: 'Projeção de gastos' },
      'revenue-forecast': { name: 'Previsão Receitas', description: 'Projeção de receitas' }
    }
  };

  const handleCategorySelect = (categoryId, itemId) => {
    const reportType = reportTypes?.[categoryId]?.[itemId];
    if (reportType) {
      setSelectedReport({
        categoryId,
        itemId,
        ...reportType
      });
      setReportData(null); // Clear previous report data
    }
  };

  const handleGenerateReport = async (config) => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      // Mock generated report data would be set here
      setReportData({
        generated: true,
        config: config,
        timestamp: new Date()?.toISOString()
      });
      setIsGenerating(false);
    }, 2000);
  };

  const handleScheduleReport = () => {
    setShowScheduleModal(true);
  };

  const handleExportReport = () => {
    setShowExportModal(true);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Sidebar */}
      <NavigationSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Header */}
      <Header 
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={`
        transition-all duration-300 ease-smooth
        ${sidebarCollapsed ? 'ml-16' : 'ml-60'}
        mt-16 min-h-[calc(100vh-4rem)]
      `}>
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Report Sidebar */}
          <ReportSidebar
            selectedCategory={selectedReport}
            onCategorySelect={handleCategorySelect}
            isCollapsed={reportSidebarCollapsed}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="bg-card border-b border-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setReportSidebarCollapsed(!reportSidebarCollapsed)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors lg:hidden"
                  >
                    <Icon name="Menu" size={20} color="var(--color-text-secondary)" />
                  </button>
                  
                  <div>
                    <h1 className="text-xl font-semibold text-foreground">
                      Centro de Relatórios
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Gere, visualize e compartilhe relatórios financeiros detalhados
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    iconName="History"
                    iconPosition="left"
                    onClick={toggleHistory}
                  >
                    Histórico
                  </Button>
                  
                  <Button
                    variant="outline"
                    iconName="Settings"
                    iconPosition="left"
                    onClick={() => console.log('Open settings')}
                  >
                    Configurações
                  </Button>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-hidden">
              {showHistory ? (
                <div className="h-full p-6">
                  <ReportHistory
                    isVisible={showHistory}
                    onToggle={toggleHistory}
                  />
                </div>
              ) : (
                <div className="h-full grid grid-cols-1 xl:grid-cols-2 gap-6 p-6">
                  {/* Configuration Panel */}
                  <div className="space-y-6">
                    <ReportConfiguration
                      selectedReport={selectedReport}
                      onGenerate={handleGenerateReport}
                      isGenerating={isGenerating}
                    />
                  </div>

                  {/* Preview Panel */}
                  <div className="space-y-6">
                    <ReportPreview
                      reportData={reportData}
                      isGenerating={isGenerating}
                      onExport={handleExportReport}
                      onSchedule={handleScheduleReport}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ScheduleReportModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        reportType={selectedReport}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        reportData={reportData}
      />
    </div>
  );
};

export default ReportsCenter;