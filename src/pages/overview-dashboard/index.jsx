import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import Header from '../../components/ui/Header';
import KPICard from './components/KPICard';
import ProjectedBalanceChart from './components/ProjectedBalanceChart';
import AlertsPanel from './components/AlertsPanel';
import TopCategoriesCard from './components/TopCategoriesCard';
import TopVendorsCard from './components/TopVendorsCard';
import BudgetAdherenceCard from './components/BudgetAdherenceCard';
import TaxEstimateCard from './components/TaxEstimateCard';
import QuickActionButton from './components/QuickActionButton';

const OverviewDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock KPI data
  const kpiData = [
    {
      title: 'Saldo Bruto',
      value: 'R$ 127.450,75',
      subtitle: 'Todas as contas',
      change: '+12,3%',
      changeType: 'positive',
      icon: 'Wallet',
      onClick: () => navigate('/transaction-management')
    },
    {
      title: 'Entradas vs Saídas',
      value: 'R$ +15.420',
      subtitle: 'Agosto 2025',
      change: '+8,7%',
      changeType: 'positive',
      icon: 'TrendingUp',
      onClick: () => navigate('/analytics-forecasting')
    },
    {
      title: 'Fluxo de Caixa Líquido',
      value: 'R$ 85.320,50',
      subtitle: 'Posição atual',
      change: '+5,2%',
      changeType: 'positive',
      icon: 'DollarSign',
      onClick: () => navigate('/analytics-forecasting')
    },
    {
      title: 'Runway (Meses)',
      value: '18,5 meses',
      subtitle: 'Com gastos atuais',
      change: '+2,1 meses',
      changeType: 'positive',
      icon: 'Calendar',
      onClick: () => navigate('/analytics-forecasting')
    },
    {
      title: 'Taxa de Queima',
      value: 'R$ 4.620/mês',
      subtitle: 'Média últimos 3 meses',
      change: '-3,8%',
      changeType: 'positive',
      icon: 'Flame',
      onClick: () => navigate('/analytics-forecasting')
    }
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Sidebar */}
      <NavigationSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      {/* Header */}
      <Header 
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />
      {/* Main Content */}
      <main className={`
        transition-all duration-300 ease-smooth
        ${sidebarCollapsed ? 'ml-16' : 'ml-60'}
        mt-16 p-6
      `}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Dashboard Financeiro
            </h1>
            <p className="text-muted-foreground">
              Visão geral consolidada do fluxo de caixa e indicadores financeiros
            </p>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {kpiData?.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                subtitle={kpi?.subtitle}
                change={kpi?.change}
                changeType={kpi?.changeType}
                icon={kpi?.icon}
                onClick={kpi?.onClick}
                loading={loading}
              />
            ))}
          </div>

          {/* Main Chart and Alerts */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Projected Balance Chart */}
            <div className="xl:col-span-3">
              <ProjectedBalanceChart />
            </div>

            {/* Alerts Panel */}
            <div className="xl:col-span-1">
              <AlertsPanel />
            </div>
          </div>

          {/* Bottom Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Top Categories */}
            <div className="lg:col-span-1 xl:col-span-1">
              <TopCategoriesCard 
                onClick={() => navigate('/analytics-forecasting?view=categories')}
              />
            </div>

            {/* Top Vendors */}
            <div className="lg:col-span-1 xl:col-span-1">
              <TopVendorsCard 
                onClick={() => navigate('/analytics-forecasting?view=vendors')}
              />
            </div>

            {/* Budget Adherence */}
            <div className="lg:col-span-1 xl:col-span-1">
              <BudgetAdherenceCard 
                onClick={() => navigate('/analytics-forecasting?view=budget')}
              />
            </div>

            {/* Tax Estimate */}
            <div className="lg:col-span-1 xl:col-span-1">
              <TaxEstimateCard 
                onClick={() => navigate('/company-account-settings?tab=tax')}
              />
            </div>
          </div>

          {/* Footer Spacer */}
          <div className="h-20"></div>
        </div>
      </main>
      {/* Quick Action Button */}
      <QuickActionButton />
    </div>
  );
};

export default OverviewDashboard;