import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../seed';
import { adjustToBusinessDay } from '../../utils/business-days';
import { addMonths } from 'date-fns';

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: initialState?.transactions,
  reducers: {
    addTransaction: (state, action) => {
      const newTransaction = {
        ...action?.payload,
        id: `trans-${Date.now()}`,
        dueDate: adjustToBusinessDay(action?.payload?.dueDate),
        originalDueDate: action?.payload?.dueDate, // Store original for reference
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString(),
        audit: { 
          createdBy: action?.payload?.currentUserId || 'system', 
          updatedBy: action?.payload?.currentUserId || 'system',
        },
        remainingBalance: action?.payload?.amount || 0,
        reconciled: false,
      };
      state?.items?.push(newTransaction);
    },
    
    editTransaction: (state, action) => {
      const { id, currentUserId, ...updates } = action?.payload;
      const transaction = state?.items?.find(t => t?.id === id);
      if (transaction) {
        // Adjust due date if changed
        if (updates?.dueDate && updates?.dueDate !== transaction?.dueDate) {
          updates.dueDate = adjustToBusinessDay(updates?.dueDate);
          updates.originalDueDate = action?.payload?.dueDate;
        }
        
        Object.assign(transaction, updates, { 
          updatedAt: new Date()?.toISOString(),
          audit: { 
            ...transaction?.audit, 
            updatedBy: currentUserId || 'system',
          },
        });
      }
    },
    
    deleteTransaction: (state, action) => {
      state.items = state?.items?.filter(t => t?.id !== action?.payload);
    },
    
    markPaid: (state, action) => {
      const { id, paidDate, amount, currentUserId } = action?.payload;
      const transaction = state?.items?.find(t => t?.id === id);
      if (transaction) {
        transaction.status = 'paid';
        transaction.paidDate = paidDate || new Date()?.toISOString();
        if (amount) transaction.amount = amount;
        transaction.remainingBalance = 0;
        transaction.updatedAt = new Date()?.toISOString();
        transaction.audit = { 
          ...transaction?.audit, 
          updatedBy: currentUserId || 'system',
        };
      }
    },
    
    markPartiallyPaid: (state, action) => {
      const { id, paidAmount, currentUserId } = action?.payload;
      const transaction = state?.items?.find(t => t?.id === id);
      if (transaction) {
        transaction.status = 'partially-paid';
        transaction.paidAmount = paidAmount;
        transaction.remainingBalance = transaction?.amount - paidAmount;
        transaction.updatedAt = new Date()?.toISOString();
        transaction.audit = { 
          ...transaction?.audit, 
          updatedBy: currentUserId || 'system',
        };
      }
    },
    
    cancelTransaction: (state, action) => {
      const { id, currentUserId } = action?.payload;
      const transaction = state?.items?.find(t => t?.id === id);
      if (transaction) {
        transaction.status = 'canceled';
        transaction.updatedAt = new Date()?.toISOString();
        transaction.audit = { 
          ...transaction?.audit, 
          updatedBy: currentUserId || 'system',
        };
      }
    },
    
    createTransfer: (state, action) => {
      const { 
        companyId, 
        fromAccountId, 
        toAccountId, 
        amount, 
        date, 
        notes, 
        currentUserId 
      } = action?.payload;
      
      const transferPairId = `transfer-${Date.now()}`;
      const baseAudit = {
        createdBy: currentUserId || 'system',
        updatedBy: currentUserId || 'system',
      };
      
      // Debit transaction (money leaving source account)
      const debitTransaction = {
        id: `trans-debit-${Date.now()}`,
        companyId,
        accountId: fromAccountId,
        type: 'exit',
        categoryId: null,
        competenciaDate: date,
        dueDate: adjustToBusinessDay(date),
        originalDueDate: date,
        amount,
        status: 'paid',
        paidDate: date,
        paymentMethod: 'transfer',
        notes: `Transferência para conta destino - ${notes || ''}`,
        transferPairId,
        remainingBalance: 0,
        reconciled: true,
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString(),
        audit: baseAudit,
      };
      
      // Credit transaction (money entering destination account)
      const creditTransaction = {
        id: `trans-credit-${Date.now() + 1}`,
        companyId,
        accountId: toAccountId,
        type: 'entry',
        categoryId: null,
        competenciaDate: date,
        dueDate: adjustToBusinessDay(date),
        originalDueDate: date,
        amount,
        status: 'paid',
        paidDate: date,
        paymentMethod: 'transfer',
        notes: `Transferência da conta origem - ${notes || ''}`,
        transferPairId,
        remainingBalance: 0,
        reconciled: true,
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString(),
        audit: baseAudit,
      };
      
      state?.items?.push(debitTransaction, creditTransaction);
    },
    
    createRecurrence: (state, action) => {
      const { baseTransaction, frequency, installments, currentUserId } = action?.payload;
      const recurrenceId = `recurrence-${Date.now()}`;
      
      // Create monthly recurrence (12x as specified)
      for (let i = 0; i < (installments || 12); i++) {
        const installmentDate = addMonths(new Date(baseTransaction?.competenciaDate), i);
        const dueDate = addMonths(new Date(baseTransaction?.dueDate), i);
        
        const installment = {
          ...baseTransaction,
          id: `trans-recur-${Date.now()}-${i}`,
          competenciaDate: installmentDate?.toISOString(),
          dueDate: adjustToBusinessDay(dueDate?.toISOString()),
          originalDueDate: dueDate?.toISOString(),
          recurrenceId,
          installmentNumber: i + 1,
          totalInstallments: installments || 12,
          createdAt: new Date()?.toISOString(),
          updatedAt: new Date()?.toISOString(),
          audit: {
            createdBy: currentUserId || 'system',
            updatedBy: currentUserId || 'system',
          },
        };
        
        state?.items?.push(installment);
      }
    },
    
    duplicateTransaction: (state, action) => {
      const { id, currentUserId } = action?.payload;
      const original = state?.items?.find(t => t?.id === id);
      if (original) {
        const duplicate = {
          ...original,
          id: `trans-dup-${Date.now()}`,
          status: 'planned',
          paidDate: null,
          paidAmount: 0,
          remainingBalance: original?.amount,
          reconciled: false,
          createdAt: new Date()?.toISOString(),
          updatedAt: new Date()?.toISOString(),
          audit: {
            createdBy: currentUserId || 'system',
            updatedBy: currentUserId || 'system',
          },
        };
        state?.items?.push(duplicate);
      }
    },
    
    updateTransactionStatus: (state, action) => {
      const { id, status, currentUserId } = action?.payload;
      const transaction = state?.items?.find(t => t?.id === id);
      if (transaction) {
        transaction.status = status;
        
        // Auto-mark as overdue if past due date and not paid
        if (status !== 'paid' && status !== 'canceled' && transaction?.dueDate) {
          const dueDate = new Date(transaction?.dueDate);
          const now = new Date();
          if (now > dueDate) {
            transaction.status = 'overdue';
          }
        }
        
        transaction.updatedAt = new Date()?.toISOString();
        transaction.audit = { 
          ...transaction?.audit, 
          updatedBy: currentUserId || 'system',
        };
      }
    },
    
    bulkUpdateTransactions: (state, action) => {
      const { ids, updates, currentUserId } = action?.payload;
      ids?.forEach(id => {
        const transaction = state?.items?.find(t => t?.id === id);
        if (transaction) {
          Object.assign(transaction, updates, {
            updatedAt: new Date()?.toISOString(),
            audit: { 
              ...transaction?.audit, 
              updatedBy: currentUserId || 'system',
            },
          });
        }
      });
    },
    
    reconcileTransaction: (state, action) => {
      const { id, currentUserId } = action?.payload;
      const transaction = state?.items?.find(t => t?.id === id);
      if (transaction) {
        transaction.reconciled = true;
        transaction.updatedAt = new Date()?.toISOString();
        transaction.audit = { 
          ...transaction?.audit, 
          updatedBy: currentUserId || 'system',
        };
      }
    },

    // Auto-update overdue transactions
    updateOverdueTransactions: (state) => {
      const now = new Date();
      state?.items?.forEach(transaction => {
        if (
          (transaction?.status === 'planned' || transaction?.status === 'confirmed') &&
          transaction?.dueDate &&
          new Date(transaction?.dueDate) < now
        ) {
          transaction.status = 'overdue';
          transaction.updatedAt = new Date()?.toISOString();
        }
      });
    },
  },
});

export const {
  addTransaction,
  editTransaction,
  deleteTransaction,
  markPaid,
  markPartiallyPaid,
  cancelTransaction,
  createTransfer,
  createRecurrence,
  duplicateTransaction,
  updateTransactionStatus,
  bulkUpdateTransactions,
  reconcileTransaction,
  updateOverdueTransactions,
} = transactionsSlice?.actions;

export default transactionsSlice?.reducer;