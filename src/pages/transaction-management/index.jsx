import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import Header from '../../components/ui/Header';
import TransactionTable from './components/TransactionTable';
import TransactionFilters from './components/TransactionFilters';
import BulkActionsToolbar from './components/BulkActionsToolbar';
import TransactionPagination from './components/TransactionPagination';
import NewTransactionDrawer from './components/NewTransactionDrawer';
import ExportModal from './components/ExportModal';
import Button from '../../components/ui/Button';
import { 
  selectScopedTransactions,
  selectCanEdit,
} from '../../store/selectors';
import { markPaid, updateTransactionStatus, deleteTransaction, reconcileTransaction } from '../../store/slices/transactionsSlice';

const TransactionManagement = () => {
  const dispatch = useDispatch();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Redux selectors
  const transactions = useSelector(selectScopedTransactions);
  const canEdit = useSelector(selectCanEdit);
  
  // Local state
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    account: '',
    dateRange: { from: null, to: null },
    amountRange: { min: '', max: '' },
  });
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [newTransactionOpen, setNewTransactionOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Apply filters
    if (filters?.search) {
      const searchLower = filters?.search?.toLowerCase();
      filtered = filtered?.filter(t => 
        t?.description?.toLowerCase()?.includes(searchLower) ||
        t?.notes?.toLowerCase()?.includes(searchLower)
      );
    }

    if (filters?.status) {
      filtered = filtered?.filter(t => t?.status === filters?.status);
    }

    if (filters?.category) {
      filtered = filtered?.filter(t => t?.categoryId === filters?.category);
    }

    if (filters?.account) {
      filtered = filtered?.filter(t => t?.accountId === filters?.account);
    }

    if (filters?.dateRange?.from) {
      filtered = filtered?.filter(t => 
        new Date(t?.competenciaDate || t?.dueDate) >= new Date(filters.dateRange.from)
      );
    }

    if (filters?.dateRange?.to) {
      filtered = filtered?.filter(t => 
        new Date(t?.competenciaDate || t?.dueDate) <= new Date(filters.dateRange.to)
      );
    }

    if (filters?.amountRange?.min) {
      filtered = filtered?.filter(t => (t?.amount || 0) >= parseFloat(filters?.amountRange?.min));
    }

    if (filters?.amountRange?.max) {
      filtered = filtered?.filter(t => (t?.amount || 0) <= parseFloat(filters?.amountRange?.max));
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig?.key) {
        case 'date':
          aValue = new Date(a?.competenciaDate || a?.dueDate);
          bValue = new Date(b?.competenciaDate || b?.dueDate);
          break;
        case 'amount':
          aValue = a?.amount || 0;
          bValue = b?.amount || 0;
          break;
        case 'description':
          aValue = a?.description || '';
          bValue = b?.description || '';
          break;
        case 'status':
          aValue = a?.status || '';
          bValue = b?.status || '';
          break;
        default:
          aValue = a?.[sortConfig?.key] || '';
          bValue = b?.[sortConfig?.key] || '';
      }

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [transactions, filters, sortConfig]);

  // Pagination
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTransactions?.slice(start, start + itemsPerPage);
  }, [filteredAndSortedTransactions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedTransactions?.length / itemsPerPage);

  // Event handlers
  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleEditTransaction = (transaction) => {
    if (!canEdit) {
      alert('Você não tem permissão para editar transações');
      return;
    }
    setEditingTransaction(transaction);
    setNewTransactionOpen(true);
  };

  const handleDuplicateTransaction = (transaction) => {
    if (!canEdit) {
      alert('Você não tem permissão para criar transações');
      return;
    }
    setEditingTransaction({ ...transaction, id: null });
    setNewTransactionOpen(true);
  };

  const handleCancelTransaction = (transaction) => {
    if (!canEdit) {
      alert('Você não tem permissão para cancelar transações');
      return;
    }
    if (window.confirm('Tem certeza que deseja cancelar esta transação?')) {
      dispatch(updateTransactionStatus({
        id: transaction?.id,
        status: 'canceled',
        currentUserId: 'current-user-id' // This should come from auth context
      }));
    }
  };

  const handleReconcileTransaction = (transaction) => {
    if (!canEdit) {
      alert('Você não tem permissão para conciliar transações');
      return;
    }
    dispatch(reconcileTransaction({
      id: transaction?.id,
      currentUserId: 'current-user-id' // This should come from auth context
    }));
  };

  const handleMarkPaid = () => {
    if (!canEdit) {
      alert('Você não tem permissão para marcar transações como pagas');
      return;
    }
    selectedTransactions?.forEach(id => {
      dispatch(markPaid({
        id,
        paidDate: new Date()?.toISOString(),
        currentUserId: 'current-user-id' // This should come from auth context
      }));
    });
    setSelectedTransactions([]);
  };

  const handleBulkDelete = () => {
    if (!canEdit) {
      alert('Você não tem permissão para deletar transações');
      return;
    }
    if (window.confirm(`Tem certeza que deseja deletar ${selectedTransactions?.length} transações?`)) {
      selectedTransactions?.forEach(id => {
        dispatch(deleteTransaction(id));
      });
      setSelectedTransactions([]);
    }
  };

  const handleCloseDrawer = () => {
    setNewTransactionOpen(false);
    setEditingTransaction(null);
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Gestão de Transações
              </h1>
              <p className="text-muted-foreground">
                Gerencie entradas, saídas e transferências financeiras
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setExportModalOpen(true)}
                iconName="Download"
              >
                Exportar
              </Button>
              {canEdit && (
                <Button
                  onClick={() => setNewTransactionOpen(true)}
                  iconName="Plus"
                >
                  Nova Transação
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <TransactionFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            onClearFilters={() => {
              setFilters({
                search: '',
                status: '',
                category: '',
                account: '',
                dateRange: { from: null, to: null },
                amountRange: { min: '', max: '' },
              });
              setCurrentPage(1);
            }}
          />

          {/* Bulk Actions */}
          {selectedTransactions?.length > 0 && canEdit && (
            <BulkActionsToolbar
              selectedCount={selectedTransactions?.length}
              onMarkPaid={handleMarkPaid}
              onBulkEdit={() => {}}
              onBulkCancel={() => {}}
              onBulkDelete={handleBulkDelete}
              onBulkExport={() => setExportModalOpen(true)}
              onBulkReconcile={() => {}}
              onClearSelection={() => setSelectedTransactions([])}
              onDeselectAll={() => setSelectedTransactions([])}
            />
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Transações</p>
                  <p className="text-2xl font-bold text-foreground">
                    {filteredAndSortedTransactions?.length}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <span className="text-primary text-sm font-medium">
                    {transactions?.length} no total
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold text-foreground">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })?.format(
                      filteredAndSortedTransactions?.reduce((sum, t) => {
                        return sum + (t?.type === 'entry' ? t?.amount : -t?.amount || 0);
                      }, 0)
                    )}
                  </p>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <span className="text-success text-sm font-medium">
                    Líquido
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-foreground">
                    {filteredAndSortedTransactions?.filter(t => 
                      t?.status === 'planned' || t?.status === 'confirmed'
                    )?.length}
                  </p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <span className="text-warning text-sm font-medium">
                    Não pagas
                  </span>
                </div>
              </div>
            </div>
          </div>

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
            totalItems={filteredAndSortedTransactions?.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </main>
      {/* New/Edit Transaction Drawer */}
      <NewTransactionDrawer
        isOpen={newTransactionOpen}
        onClose={handleCloseDrawer}
        transaction={editingTransaction}
        mode={editingTransaction?.id ? 'edit' : 'create'}
      />
      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={() => {}}
        transactions={filteredAndSortedTransactions}
        selectedTransactions={selectedTransactions}
      />
    </div>
  );
};

export default TransactionManagement;