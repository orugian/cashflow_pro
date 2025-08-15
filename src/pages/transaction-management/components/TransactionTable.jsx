import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { 
  selectCategories, 
  selectVendors, 
  selectCustomers, 
  selectScopedAccounts,
} from '../../../store/selectors';

const TransactionTable = ({ 
  transactions, 
  selectedTransactions, 
  onSelectionChange, 
  onEditTransaction, 
  onDuplicateTransaction, 
  onCancelTransaction, 
  onReconcileTransaction,
  sortConfig,
  onSort
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  
  // Redux selectors to get related data
  const categories = useSelector(selectCategories);
  const vendors = useSelector(selectVendors);
  const customers = useSelector(selectCustomers);
  const accounts = useSelector(selectScopedAccounts);

  // Helper functions to get names from IDs
  const getCategoryName = (categoryId) => {
    const category = categories?.find(c => c?.id === categoryId);
    return category?.name || 'N/A';
  };

  const getVendorName = (vendorId) => {
    if (!vendorId) return 'N/A';
    const vendor = vendors?.find(v => v?.id === vendorId);
    return vendor?.name || 'N/A';
  };

  const getCustomerName = (customerId) => {
    if (!customerId) return 'N/A';
    const customer = customers?.find(c => c?.id === customerId);
    return customer?.name || 'N/A';
  };

  const getAccountName = (accountId) => {
    const account = accounts?.find(a => a?.id === accountId);
    return account ? `${account?.bank} ${account?.number}` : 'N/A';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-success bg-success/10';
      case 'confirmed':
        return 'text-primary bg-primary/10';
      case 'planned':
        return 'text-muted-foreground bg-muted';
      case 'partially-paid':
        return 'text-warning bg-warning/10';
      case 'overdue':
        return 'text-error bg-error/10';
      case 'canceled':
        return 'text-muted-foreground bg-muted';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'confirmed':
        return 'Confirmado';
      case 'planned':
        return 'Planejado';
      case 'partially-paid':
        return 'Parcial';
      case 'overdue':
        return 'Atrasado';
      case 'canceled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString)?.toLocaleDateString('pt-BR');
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(transactions?.map(t => t?.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectTransaction = (transactionId, checked) => {
    if (checked) {
      onSelectionChange([...selectedTransactions, transactionId]);
    } else {
      onSelectionChange(selectedTransactions?.filter(id => id !== transactionId));
    }
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) {
      return <Icon name="ArrowUpDown" size={14} color="var(--color-muted-foreground)" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} color="var(--color-primary)" />
      : <Icon name="ArrowDown" size={14} color="var(--color-primary)" />;
  };

  const allSelected = transactions?.length > 0 && selectedTransactions?.length === transactions?.length;
  const someSelected = selectedTransactions?.length > 0 && selectedTransactions?.length < transactions?.length;

  return (
    <div className="bg-card border border-border rounded-lg shadow-base overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => onSort('date')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Data</span>
                  {getSortIcon('date')}
                </button>
              </th>
              
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => onSort('description')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Descrição</span>
                  {getSortIcon('description')}
                </button>
              </th>
              
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => onSort('category')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Categoria</span>
                  {getSortIcon('category')}
                </button>
              </th>
              
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => onSort('vendor')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Fornecedor/Cliente</span>
                  {getSortIcon('vendor')}
                </button>
              </th>
              
              <th className="text-right p-4 font-medium text-foreground">
                <button
                  onClick={() => onSort('amount')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors ml-auto"
                >
                  <span>Valor</span>
                  {getSortIcon('amount')}
                </button>
              </th>
              
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => onSort('status')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Status</span>
                  {getSortIcon('status')}
                </button>
              </th>
              
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => onSort('account')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Conta</span>
                  {getSortIcon('account')}
                </button>
              </th>
              
              <th className="w-32 p-4 font-medium text-foreground text-center">
                Ações
              </th>
            </tr>
          </thead>
          
          <tbody>
            {transactions?.map((transaction) => {
              const isSelected = selectedTransactions?.includes(transaction?.id);
              const isHovered = hoveredRow === transaction?.id;
              
              return (
                <tr
                  key={transaction?.id}
                  className={`
                    border-b border-border transition-colors duration-150
                    ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'}
                    ${isHovered ? 'shadow-sm' : ''}
                  `}
                  onMouseEnter={() => setHoveredRow(transaction?.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="p-4">
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => handleSelectTransaction(transaction?.id, e?.target?.checked)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {formatDate(transaction?.competenciaDate)}
                      </span>
                      {transaction?.dueDate && transaction?.dueDate !== transaction?.competenciaDate && (
                        <span className="text-xs text-muted-foreground">
                          Venc: {formatDate(transaction?.dueDate)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {transaction?.description || 'N/A'}
                      </span>
                      {transaction?.notes && (
                        <span className="text-xs text-muted-foreground truncate max-w-48">
                          {transaction?.notes}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-foreground">
                      {getCategoryName(transaction?.categoryId)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-foreground">
                      {transaction?.vendorId 
                        ? getVendorName(transaction?.vendorId)
                        : transaction?.customerId 
                          ? getCustomerName(transaction?.customerId)
                          : 'N/A'
                      }
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className={`text-sm font-semibold ${
                        transaction?.type === 'entry' ? 'text-success' : 'text-error'
                      }`}>
                        {transaction?.type === 'entry' ? '+' : '-'}{formatCurrency(transaction?.amount || 0)}
                      </span>
                      {transaction?.paymentMethod && (
                        <span className="text-xs text-muted-foreground capitalize">
                          {transaction?.paymentMethod}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`
                      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${getStatusColor(transaction?.status)}
                    `}>
                      {getStatusLabel(transaction?.status)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-foreground">
                      {getAccountName(transaction?.accountId)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditTransaction(transaction)}
                        iconName="Edit"
                        iconSize={14}
                        className="h-8 w-8 p-0"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDuplicateTransaction(transaction)}
                        iconName="Copy"
                        iconSize={14}
                        className="h-8 w-8 p-0"
                      />
                      {transaction?.status !== 'canceled' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCancelTransaction(transaction)}
                          iconName="X"
                          iconSize={14}
                          className="h-8 w-8 p-0 text-error hover:text-error"
                        />
                      )}
                      {transaction?.status === 'confirmed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onReconcileTransaction(transaction)}
                          iconName="Check"
                          iconSize={14}
                          className="h-8 w-8 p-0 text-success hover:text-success"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Empty State */}
      {transactions?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <Icon name="Receipt" size={48} color="var(--color-muted-foreground)" />
          <h3 className="text-lg font-medium text-foreground mt-4">
            Nenhuma transação encontrada
          </h3>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Ajuste os filtros ou adicione uma nova transação para começar.
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;