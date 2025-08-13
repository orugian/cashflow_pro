import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ReportSidebar = ({ selectedCategory, onCategorySelect, isCollapsed = false }) => {
  const [expandedSections, setExpandedSections] = useState({
    cashflow: true,
    management: true,
    analysis: true,
    compliance: true
  });

  const reportCategories = [
    {
      id: 'cashflow',
      title: 'Fluxo de Caixa',
      icon: 'TrendingUp',
      items: [
        { id: 'daily-cashflow', name: 'Fluxo Diário', description: 'Movimentações por dia' },
        { id: 'weekly-cashflow', name: 'Fluxo Semanal', description: 'Consolidado semanal' },
        { id: 'monthly-cashflow', name: 'Fluxo Mensal', description: 'Relatório mensal completo' },
        { id: 'yearly-cashflow', name: 'Fluxo Anual', description: 'Visão anual consolidada' }
      ]
    },
    {
      id: 'management',
      title: 'DRE Gerencial',
      icon: 'FileText',
      items: [
        { id: 'dre-monthly', name: 'DRE Mensal', description: 'Demonstração mensal' },
        { id: 'dre-quarterly', name: 'DRE Trimestral', description: 'Consolidado trimestral' },
        { id: 'dre-annual', name: 'DRE Anual', description: 'Demonstração anual' },
        { id: 'dre-comparison', name: 'DRE Comparativa', description: 'Comparação entre períodos' }
      ]
    },
    {
      id: 'analysis',
      title: 'Análises Detalhadas',
      icon: 'BarChart3',
      items: [
        { id: 'category-breakdown', name: 'Por Categoria', description: 'Análise por categorias' },
        { id: 'vendor-breakdown', name: 'Por Fornecedor', description: 'Gastos por fornecedor' },
        { id: 'customer-breakdown', name: 'Por Cliente', description: 'Receitas por cliente' },
        { id: 'cost-center-breakdown', name: 'Por Centro de Custo', description: 'Análise por centro de custo' },
        { id: 'period-comparison', name: 'Comparação Períodos', description: 'Comparativo temporal' }
      ]
    },
    {
      id: 'compliance',
      title: 'Relatórios Contábeis',
      icon: 'Shield',
      items: [
        { id: 'monthly-accounting', name: 'Contábil Mensal', description: 'Relatório para contador' },
        { id: 'tax-summary', name: 'Resumo Tributário', description: 'Simples Nacional' },
        { id: 'expense-forecast', name: 'Previsão Despesas', description: 'Projeção de gastos' },
        { id: 'revenue-forecast', name: 'Previsão Receitas', description: 'Projeção de receitas' }
      ]
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev?.[sectionId]
    }));
  };

  const handleItemSelect = (categoryId, itemId) => {
    onCategorySelect(categoryId, itemId);
  };

  return (
    <div className={`
      bg-card border-r border-border h-full overflow-y-auto
      transition-all duration-300 ease-smooth
      ${isCollapsed ? 'w-16' : 'w-80'}
    `}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        {!isCollapsed && (
          <div>
            <h2 className="text-lg font-semibold text-foreground">Relatórios</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Selecione o tipo de relatório
            </p>
          </div>
        )}
        
        {isCollapsed && (
          <div className="flex justify-center">
            <Icon name="FileText" size={24} color="var(--color-primary)" />
          </div>
        )}
      </div>
      {/* Categories */}
      <div className="py-2">
        {reportCategories?.map((category) => (
          <div key={category?.id} className="mb-2">
            {/* Category Header */}
            <button
              onClick={() => toggleSection(category?.id)}
              className={`
                w-full flex items-center px-4 py-3
                hover:bg-muted transition-colors duration-200
                ${isCollapsed ? 'justify-center' : 'justify-between'}
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon 
                  name={category?.icon} 
                  size={20} 
                  color="var(--color-text-secondary)" 
                />
                {!isCollapsed && (
                  <span className="font-medium text-sm text-foreground">
                    {category?.title}
                  </span>
                )}
              </div>
              
              {!isCollapsed && (
                <Icon 
                  name={expandedSections?.[category?.id] ? "ChevronDown" : "ChevronRight"} 
                  size={16} 
                  color="var(--color-text-secondary)" 
                />
              )}
            </button>

            {/* Category Items */}
            {!isCollapsed && expandedSections?.[category?.id] && (
              <div className="ml-4 border-l border-border">
                {category?.items?.map((item) => {
                  const isSelected = selectedCategory?.categoryId === category?.id && 
                                   selectedCategory?.itemId === item?.id;
                  
                  return (
                    <button
                      key={item?.id}
                      onClick={() => handleItemSelect(category?.id, item?.id)}
                      className={`
                        w-full flex items-start space-x-3 px-4 py-2 ml-4
                        hover:bg-muted transition-colors duration-200
                        ${isSelected ? 'bg-primary/10 border-r-2 border-r-primary' : ''}
                      `}
                    >
                      <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-left">
                        <div className={`
                          text-sm font-medium
                          ${isSelected ? 'text-primary' : 'text-foreground'}
                        `}>
                          {item?.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item?.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Collapsed Tooltip */}
            {isCollapsed && (
              <div className="hidden group-hover:block absolute left-full top-0 ml-2 z-50">
                <div className="bg-popover border border-border rounded-lg shadow-pronounced p-3 min-w-64">
                  <h3 className="font-medium text-sm text-popover-foreground mb-2">
                    {category?.title}
                  </h3>
                  <div className="space-y-2">
                    {category?.items?.map((item) => (
                      <button
                        key={item?.id}
                        onClick={() => handleItemSelect(category?.id, item?.id)}
                        className="w-full text-left p-2 rounded hover:bg-muted transition-colors"
                      >
                        <div className="text-sm font-medium text-popover-foreground">
                          {item?.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item?.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border mt-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Ações Rápidas</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors">
              <Icon name="Calendar" size={16} />
              <span>Agendar Relatório</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors">
              <Icon name="History" size={16} />
              <span>Histórico de Relatórios</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors">
              <Icon name="Settings" size={16} />
              <span>Configurar Templates</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportSidebar;