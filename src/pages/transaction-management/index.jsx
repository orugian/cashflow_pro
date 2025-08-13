import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import TransactionFilters from './components/TransactionFilters';
import TransactionTable from './components/TransactionTable';
import BulkActionsToolbar from './components/BulkActionsToolbar';
import NewTransactionDrawer from './components/NewTransactionDrawer';
import TransactionPagination from './components/TransactionPagination';
import ExportModal from './components/ExportModal';

const TransactionManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    account: 'all',
    status: 'all',
    category: 'all',
    vendor: '',
    tags: '',
    paymentMethods: [],
    amountRange: { min: '', max: '' }
  });

  // Mock transaction data
  useEffect(() => {
    const mockTransactions = [
      {
        id: '1',
        date: '2025-08-13',
        dueDate: '2025-08-15',
        description: 'Fatura de Energia Elétrica - Agosto/2025',
        category: 'Utilidades (Água, Luz, Internet)',
        vendor: 'Enel Distribuição São Paulo',
        amount: 1250.75,
        type: 'expense',
        status: 'confirmed',
        account: 'Banco do Brasil - Conta Corrente',
        paymentMethod: 'Débito Automático',
        notes: 'Consumo elevado devido ao ar condicionado',
        tags: 'recorrente, utilidades',
        company: 'Tech Solutions Ltda'
      },
      {
        id: '2',
        date: '2025-08-12',
        dueDate: '2025-08-12',
        description: 'Prestação de Serviços - Desenvolvimento Web',
        category: 'Prestação de Serviços',
        vendor: 'Empresa ABC Ltda',
        amount: 15000.00,
        type: 'income',
        status: 'paid',
        account: 'Banco do Brasil - Conta Corrente',
        paymentMethod: 'PIX',
        notes: 'Projeto finalizado conforme cronograma',
        tags: 'projeto, desenvolvimento',
        company: 'Tech Solutions Ltda'
      },
      {
        id: '3',
        date: '2025-08-11',
        dueDate: '2025-08-20',
        description: 'Aluguel do Escritório - Agosto/2025',
        category: 'Aluguel e Condomínio',
        vendor: 'Imobiliária Central',
        amount: 3500.00,
        type: 'expense',
        status: 'planned',
        account: 'Banco do Brasil - Conta Corrente',
        paymentMethod: 'TED',
        notes: 'Incluir taxa de condomínio',
        tags: 'recorrente, aluguel',
        company: 'Tech Solutions Ltda'
      },
      {
        id: '4',
        date: '2025-08-10',
        dueDate: '2025-08-10',
        description: 'Compra de Material de Escritório',
        category: 'Despesas Administrativas',
        vendor: 'Papelaria Moderna',
        amount: 450.30,
        type: 'expense',
        status: 'paid',
        account: 'Cartão de Crédito Empresarial',
        paymentMethod: 'Cartão de Crédito',
        notes: 'Materiais para equipe administrativa',
        tags: 'escritório, administrativo',
        company: 'Tech Solutions Ltda'
      },
      {
        id: '5',
        date: '2025-08-09',
        dueDate: '2025-08-25',
        description: 'Campanha Google Ads - Agosto',
        category: 'Marketing e Publicidade',
        vendor: 'Google Brasil',
        amount: 2800.00,
        type: 'expense',
        status: 'confirmed',
        account: 'Banco do Brasil - Conta Corrente',
        paymentMethod: 'Cartão de Crédito',
        notes: 'Campanha para captação de novos clientes',
        tags: 'marketing, digital',
        company: 'Tech Solutions Ltda'
      },
      {
        id: '6',
        date: '2025-08-08',
        dueDate: '2025-08-08',
        description: 'Consultoria Jurídica - Contratos',
        category: 'Despesas Operacionais',
        vendor: 'Escritório Advocacia Silva & Associados',
        amount: 1800.00,
        type: 'expense',
        status: 'paid',
        account: 'Banco do Brasil - Conta Corrente',
        paymentMethod: 'PIX',
        notes: 'Revisão de contratos comerciais',
        tags: 'jurídico, consultoria',
        company: 'Tech Solutions Ltda'
      },
      {
        id: '7',
        date: '2025-08-07',
        dueDate: '2025-08-15',
        description: 'Simples Nacional - Julho/2025',
        category: 'Simples Nacional',
        vendor: 'Receita Federal do Brasil',
        amount: 2150.45,
        type: 'expense',
        status: 'overdue',
        account: 'Banco do Brasil - Conta Corrente',
        paymentMethod: 'DARF',
        notes: 'Pagamento em atraso - multa aplicada',
        tags: 'imposto, simples',
        company: 'Tech Solutions Ltda'
      },
      {
        id: '8',
        date: '2025-08-06',
        dueDate: '2025-08-06',
        description: 'Venda de Licenças de Software',
        category: 'Venda de Produtos',
        vendor: 'Cliente XYZ Corp',
        amount: 8500.00,
        type: 'income',
        status: 'paid',
        account: 'Banco do Brasil - Conta Corrente',
        paymentMethod: 'TED',
        notes: '50 licenças anuais do sistema',
        tags: 'software, licenças',
        company: 'Tech Solutions Ltda'
      },
      {
        id: '9',
        date: '2025-08-05',
        dueDate: '2025-08-30',
        description: 'Internet Fibra Ótica - Agosto/2025',
        category: 'Utilidades (Água, Luz, Internet)',
        vendor: 'Vivo Empresas',
        amount: 299.90,
        type: 'expense',
        status: 'planned',
        account: 'Banco do Brasil - Conta Corrente',
        paymentMethod: 'Débito Automático',
        notes: 'Plano 500MB dedicado',
        tags: 'recorrente, internet',
        company: 'Tech Solutions Ltda'
      },
      {
        id: '10',
        date: '2025-08-04',
        dueDate: '2025-08-04',
        description: 'Reembolso de Viagem - Reunião Cliente',
        category: 'Despesas Operacionais',
        vendor: 'João Silva (Funcionário)',
        amount: 680.50,
        type: 'expense',
        status: 'paid',
        account: 'Dinheiro em Espécie',
        paymentMethod: 'Dinheiro',
        notes: 'Combustível e pedágio para São Paulo',
        tags: 'reembolso, viagem',
        company: 'Tech Solutions Ltda'
      }
    ];

    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...transactions];

    // Apply filters
    if (filters?.dateRange?.start) {
      filtered = filtered?.filter(t => t?.date >= filters?.dateRange?.start);
    }
    if (filters?.dateRange?.end) {
      filtered = filtered?.filter(t => t?.date <= filters?.dateRange?.end);
    }
    if (filters?.account !== 'all') {
      filtered = filtered?.filter(t => t?.account === filters?.account);
    }
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(t => t?.status === filters?.status);
    }
    if (filters?.category !== 'all') {
      filtered = filtered?.filter(t => t?.category?.includes(filters?.category));
    }
    if (filters?.vendor) {
      filtered = filtered?.filter(t => 
        t?.vendor?.toLowerCase()?.includes(filters?.vendor?.toLowerCase())
      );
    }
    if (filters?.tags) {
      filtered = filtered?.filter(t => 
        t?.tags?.toLowerCase()?.includes(filters?.tags?.toLowerCase())
      );
    }
    if (filters?.paymentMethods?.length > 0) {
      filtered = filtered?.filter(t => 
        filters?.paymentMethods?.some(method => 
          t?.paymentMethod?.toLowerCase()?.includes(method?.toLowerCase())
        )
      );
    }
    if (filters?.amountRange?.min) {
      filtered = filtered?.filter(t => t?.amount >= parseFloat(filters?.amountRange?.min));
    }
    if (filters?.amountRange?.max) {
      filtered = filtered?.filter(t => t?.amount <= parseFloat(filters?.amountRange?.max));
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (sortConfig?.key === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortConfig?.key === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = aValue?.toString()?.toLowerCase();
        bValue = bValue?.toString()?.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [transactions, filters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions?.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      dateRange: { start: '', end: '' },
      account: 'all',
      status: 'all',
      category: 'all',
      vendor: '',
      tags: '',
      paymentMethods: [],
      amountRange: { min: '', max: '' }
    });
  };

  const handleNewTransaction = (transactionData) => {
    const newTransaction = {
      ...transactionData,
      id: Date.now()?.toString(),
      date: transactionData?.competenceDate,
      createdAt: new Date()?.toISOString()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleEditTransaction = (transaction) => {
    console.log('Edit transaction:', transaction);
    // In real app, open edit modal/drawer
  };

  const handleDuplicateTransaction = (transaction) => {
    const duplicated = {
      ...transaction,
      id: Date.now()?.toString(),
      description: `${transaction?.description} (Cópia)`,
      status: 'planned',
      date: new Date()?.toISOString()?.split('T')?.[0]
    };
    
    setTransactions(prev => [duplicated, ...prev]);
  };

  const handleCancelTransaction = (transaction) => {
    setTransactions(prev => 
      prev?.map(t => 
        t?.id === transaction?.id 
          ? { ...t, status: 'canceled' }
          : t
      )
    );
  };

  const handleReconcileTransaction = (transaction) => {
    setTransactions(prev => 
      prev?.map(t => 
        t?.id === transaction?.id 
          ? { ...t, status: 'paid' }
          : t
      )
    );
  };

  const handleBulkEdit = () => {
    console.log('Bulk edit:', selectedTransactions);
    // In real app, open bulk edit modal
  };

  const handleBulkCancel = () => {
    setTransactions(prev => 
      prev?.map(t => 
        selectedTransactions?.includes(t?.id)
          ? { ...t, status: 'canceled' }
          : t
      )
    );
    setSelectedTransactions([]);
  };

  const handleBulkReconcile = () => {
    setTransactions(prev => 
      prev?.map(t => 
        selectedTransactions?.includes(t?.id)
          ? { ...t, status: 'paid' }
          : t
      )
    );
    setSelectedTransactions([]);
  };

  const handleBulkExport = () => {
    setIsExportModalOpen(true);
  };

  const handleExport = (exportConfig) => {
    console.log('Export with config:', exportConfig);
    // In real app, trigger export process
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <NavigationSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <Header 
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      {/* Main Content */}
      <main className={`
        transition-all duration-300 ease-smooth pt-16
        ${sidebarCollapsed ? 'ml-16' : 'ml-60'}
        lg:ml-60
      `}>
        <div className="p-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Gestão de Transações
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie todas as transações financeiras da empresa
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                onClick={() => setIsExportModalOpen(true)}
                iconName="Download"
                iconPosition="left"
              >
                Exportar
              </Button>
              
              <Button
                variant="default"
                onClick={() => setIsNewTransactionOpen(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Nova Transação
              </Button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-3">
              <TransactionFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Receipt" size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-xl font-semibold text-foreground">
                        {filteredTransactions?.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <Icon name="TrendingUp" size={20} color="var(--color-success)" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Receitas</p>
                      <p className="text-xl font-semibold text-success">
                        R$ {filteredTransactions?.filter(t => t?.type === 'income')?.reduce((sum, t) => sum + t?.amount, 0)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                      <Icon name="TrendingDown" size={20} color="var(--color-error)" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Despesas</p>
                      <p className="text-xl font-semibold text-error">
                        R$ {filteredTransactions?.filter(t => t?.type === 'expense')?.reduce((sum, t) => sum + t?.amount, 0)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                      <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Em Atraso</p>
                      <p className="text-xl font-semibold text-warning">
                        {filteredTransactions?.filter(t => t?.status === 'overdue')?.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bulk Actions */}
              <BulkActionsToolbar
                selectedCount={selectedTransactions?.length}
                onBulkEdit={handleBulkEdit}
                onBulkCancel={handleBulkCancel}
                onBulkExport={handleBulkExport}
                onBulkReconcile={handleBulkReconcile}
                onClearSelection={() => setSelectedTransactions([])}
              />

              {/* Transaction Table */}
              <TransactionTable
                transactions={paginatedTransactions}
                selectedTransactions={selectedTransactions}
                onSelectionChange={setSelectedTransactions}
                onEditTransaction={handleEditTransaction}
                onDuplicateTransaction={handleDuplicateTransaction}
                onCancelTransaction={handleCancelTransaction}
                onReconcileTransaction={handleReconcileTransaction}
                sortConfig={sortConfig}
                onSort={handleSort}
              />

              {/* Pagination */}
              <TransactionPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredTransactions?.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          </div>
        </div>
      </main>
      {/* Modals */}
      <NewTransactionDrawer
        isOpen={isNewTransactionOpen}
        onClose={() => setIsNewTransactionOpen(false)}
        onSave={handleNewTransaction}
      />
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        selectedTransactions={selectedTransactions}
      />
    </div>
  );
};

export default TransactionManagement;