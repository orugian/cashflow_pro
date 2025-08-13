import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const AnalyticsTabs = ({ selectedCompany }) => {
  const [activeTab, setActiveTab] = useState('categories');

  const tabs = [
    {
      id: 'categories',
      name: 'Categorias',
      icon: 'BarChart3',
      description: 'Análise por categoria de despesas e receitas'
    },
    {
      id: 'vendors',
      name: 'Fornecedores',
      icon: 'Users',
      description: 'Performance e análise de fornecedores'
    },
    {
      id: 'customers',
      name: 'Clientes',
      icon: 'UserCheck',
      description: 'Insights sobre clientes e receitas'
    },
    {
      id: 'cost-centers',
      name: 'Centros de Custo',
      icon: 'Building',
      description: 'Análise por centro de custo'
    },
    {
      id: 'forecast-vs-actual',
      name: 'Previsto vs Real',
      icon: 'GitCompare',
      description: 'Comparação entre projeções e realizações'
    },
    {
      id: 'seasonality',
      name: 'Sazonalidade',
      icon: 'Calendar',
      description: 'Padrões sazonais e tendências'
    }
  ];

  // Mock data for different tabs
  const mockData = {
    categories: [
      { name: 'Vendas', value: 450000, percentage: 65, color: 'var(--color-success)' },
      { name: 'Serviços', value: 180000, percentage: 26, color: 'var(--color-primary)' },
      { name: 'Consultoria', value: 62000, percentage: 9, color: 'var(--color-secondary)' },
      { name: 'Salários', value: -220000, percentage: 45, color: 'var(--color-error)' },
      { name: 'Fornecedores', value: -120000, percentage: 25, color: 'var(--color-warning)' },
      { name: 'Operacional', value: -85000, percentage: 17, color: 'var(--color-muted-foreground)' },
      { name: 'Marketing', value: -65000, percentage: 13, color: 'var(--color-accent)' }
    ],
    vendors: [
      { name: 'Tech Solutions Ltda', amount: 45000, transactions: 12, avgTicket: 3750, trend: 'up' },
      { name: 'Digital Services ME', amount: 32000, transactions: 8, avgTicket: 4000, trend: 'up' },
      { name: 'Cloud Provider SA', amount: 28000, transactions: 3, avgTicket: 9333, trend: 'stable' },
      { name: 'Office Supplies Co', amount: 15000, transactions: 24, avgTicket: 625, trend: 'down' },
      { name: 'Marketing Agency', amount: 22000, transactions: 6, avgTicket: 3667, trend: 'up' }
    ],
    customers: [
      { name: 'Empresa Alpha Ltda', revenue: 85000, transactions: 15, avgTicket: 5667, growth: 25 },
      { name: 'Beta Corporation', revenue: 72000, transactions: 12, avgTicket: 6000, growth: 15 },
      { name: 'Gamma Industries', revenue: 58000, transactions: 10, avgTicket: 5800, growth: -5 },
      { name: 'Delta Solutions', revenue: 45000, transactions: 18, avgTicket: 2500, growth: 35 },
      { name: 'Epsilon Group', revenue: 38000, transactions: 8, avgTicket: 4750, growth: 10 }
    ],
    costCenters: [
      { name: 'Desenvolvimento', budget: 120000, actual: 115000, variance: -4.2 },
      { name: 'Marketing', budget: 80000, actual: 92000, variance: 15.0 },
      { name: 'Vendas', budget: 60000, actual: 58000, variance: -3.3 },
      { name: 'Administrativo', budget: 45000, actual: 47000, variance: 4.4 },
      { name: 'Operações', budget: 35000, actual: 33000, variance: -5.7 }
    ],
    forecastVsActual: [
      { month: 'Jan', forecast: 125000, actual: 132000, variance: 5.6 },
      { month: 'Fev', forecast: 130000, actual: 128000, variance: -1.5 },
      { month: 'Mar', forecast: 135000, actual: 142000, variance: 5.2 },
      { month: 'Abr', forecast: 140000, actual: 138000, variance: -1.4 },
      { month: 'Mai', forecast: 145000, actual: 151000, variance: 4.1 },
      { month: 'Jun', forecast: 150000, actual: 147000, variance: -2.0 }
    ],
    seasonality: [
      { month: 'Jan', revenue: 420000, expenses: 310000, netFlow: 110000 },
      { month: 'Fev', revenue: 380000, expenses: 295000, netFlow: 85000 },
      { month: 'Mar', revenue: 450000, expenses: 320000, netFlow: 130000 },
      { month: 'Abr', revenue: 425000, expenses: 315000, netFlow: 110000 },
      { month: 'Mai', revenue: 480000, expenses: 335000, netFlow: 145000 },
      { month: 'Jun', revenue: 520000, expenses: 350000, netFlow: 170000 },
      { month: 'Jul', revenue: 490000, expenses: 340000, netFlow: 150000 },
      { month: 'Ago', revenue: 460000, expenses: 325000, netFlow: 135000 },
      { month: 'Set', revenue: 510000, expenses: 345000, netFlow: 165000 },
      { month: 'Out', revenue: 535000, expenses: 360000, netFlow: 175000 },
      { month: 'Nov', revenue: 580000, expenses: 380000, netFlow: 200000 },
      { month: 'Dez', revenue: 620000, expenses: 400000, netFlow: 220000 }
    ]
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(Math.abs(value));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'categories':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Categories Pie Chart */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-4">Receitas por Categoria</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockData?.categories?.filter(item => item?.value > 0)}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percentage }) => `${name} (${percentage}%)`}
                      >
                        {mockData?.categories?.filter(item => item?.value > 0)?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry?.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Expense Categories Bar Chart */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-4">Despesas por Categoria</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockData?.categories?.filter(item => item?.value < 0)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="name" stroke="var(--color-text-secondary)" fontSize={12} />
                      <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickFormatter={formatCurrency} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="value" fill="var(--color-error)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );

      case 'vendors':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {mockData?.vendors?.map((vendor, index) => (
                <div key={index} className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="Building" size={20} color="var(--color-primary)" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{vendor?.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {vendor?.transactions} transações • Ticket médio: {formatCurrency(vendor?.avgTicket)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-foreground">
                        {formatCurrency(vendor?.amount)}
                      </div>
                      <div className={`flex items-center space-x-1 text-sm ${
                        vendor?.trend === 'up' ? 'text-success' : 
                        vendor?.trend === 'down' ? 'text-error' : 'text-muted-foreground'
                      }`}>
                        <Icon 
                          name={vendor?.trend === 'up' ? 'TrendingUp' : vendor?.trend === 'down' ? 'TrendingDown' : 'Minus'} 
                          size={16} 
                        />
                        <span>{vendor?.trend === 'up' ? 'Crescendo' : vendor?.trend === 'down' ? 'Declinando' : 'Estável'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'customers':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {mockData?.customers?.map((customer, index) => (
                <div key={index} className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <Icon name="UserCheck" size={20} color="var(--color-success)" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{customer?.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {customer?.transactions} transações • Ticket médio: {formatCurrency(customer?.avgTicket)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-success">
                        {formatCurrency(customer?.revenue)}
                      </div>
                      <div className={`flex items-center space-x-1 text-sm ${
                        customer?.growth >= 0 ? 'text-success' : 'text-error'
                      }`}>
                        <Icon name={customer?.growth >= 0 ? 'TrendingUp' : 'TrendingDown'} size={16} />
                        <span>{Math.abs(customer?.growth)}% {customer?.growth >= 0 ? 'crescimento' : 'queda'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'cost-centers':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {mockData?.costCenters?.map((center, index) => (
                <div key={index} className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-foreground">{center?.name}</h4>
                    <div className={`text-sm font-medium ${
                      center?.variance < 0 ? 'text-success' : 'text-error'
                    }`}>
                      {center?.variance > 0 ? '+' : ''}{center?.variance?.toFixed(1)}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Orçado:</span>
                      <span className="text-foreground">{formatCurrency(center?.budget)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Realizado:</span>
                      <span className="text-foreground">{formatCurrency(center?.actual)}</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          center?.variance < 0 ? 'bg-success' : 'bg-error'
                        }`}
                        style={{ width: `${Math.min((center?.actual / center?.budget) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'forecast-vs-actual':
        return (
          <div className="space-y-6">
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-4">Previsto vs Realizado (Últimos 6 Meses)</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData?.forecastVsActual}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" stroke="var(--color-text-secondary)" fontSize={12} />
                    <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="forecast" fill="var(--color-primary)" name="Previsto" />
                    <Bar dataKey="actual" fill="var(--color-success)" name="Realizado" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'seasonality':
        return (
          <div className="space-y-6">
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-4">Padrão Sazonal (12 Meses)</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData?.seasonality}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" stroke="var(--color-text-secondary)" fontSize={12} />
                    <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="revenue" stroke="var(--color-success)" strokeWidth={2} name="Receita" />
                    <Line type="monotone" dataKey="expenses" stroke="var(--color-error)" strokeWidth={2} name="Despesas" />
                    <Line type="monotone" dataKey="netFlow" stroke="var(--color-primary)" strokeWidth={3} name="Fluxo Líquido" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-base">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                border-b-2 transition-colors duration-200
                ${activeTab === tab?.id
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }
              `}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.name}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            {tabs?.find(tab => tab?.id === activeTab)?.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {tabs?.find(tab => tab?.id === activeTab)?.description}
          </p>
        </div>
        
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AnalyticsTabs;