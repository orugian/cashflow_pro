import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format, addMonths } from 'date-fns';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { 
  selectCategories,
  selectScopedBudgets,
  selectActiveCompanyId,
  selectCanEdit 
} from '../../../store/selectors';
import { 
  addBudget, 
  editBudget, 
  deleteBudget,
  copyBudgetFromPreviousMonth 
} from '../../../store/slices/budgetsSlice';
import { TrendingUp, AlertTriangle, CheckCircle, Copy } from 'lucide-react';

const BudgetingSection = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const budgets = useSelector(selectScopedBudgets);
  const activeCompanyId = useSelector(selectActiveCompanyId);
  const canEdit = useSelector(selectCanEdit);

  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  
  const [formData, setFormData] = useState({
    categoryId: '',
    amountPlanned: '',
    alertThreshold: 80,
  });

  // Filter expense categories (exclude revenue and tax)
  const expenseCategories = useMemo(() => {
    return categories?.filter(cat => cat?.kind === 'expense' && cat?.active) || [];
  }, [categories]);

  // Get budgets for selected month
  const monthBudgets = useMemo(() => {
    const budgetsForMonth = budgets?.filter(budget => 
      budget?.month === selectedMonth && budget?.companyId === activeCompanyId
    ) || [];

    // Map budgets with category info and status
    return expenseCategories?.map(category => {
      const budget = budgetsForMonth?.find(b => b?.categoryId === category?.id);
      const status = budget ? getBudgetStatus(budget) : null;
      
      return {
        categoryId: category?.id,
        categoryName: category?.name,
        categoryColor: category?.color,
        budget,
        status,
      };
    });
  }, [budgets, selectedMonth, activeCompanyId, expenseCategories]);

  const getBudgetStatus = (budget) => {
    if (!budget?.amountPlanned || budget?.amountPlanned === 0) return null;
    
    const percentage = (budget?.amountActual / budget?.amountPlanned) * 100;
    
    if (percentage <= 80) return { type: 'ok', label: 'OK', color: 'text-emerald-600' };
    if (percentage <= 100) return { type: 'warning', label: 'Alerta', color: 'text-yellow-600' };
    return { type: 'exceeded', label: 'Estourado', color: 'text-red-600' };
  };

  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value);
  };

  const handleOpenModal = (categoryId, budget = null) => {
    setEditingBudget(budget);
    setFormData({
      categoryId,
      amountPlanned: budget?.amountPlanned || '',
      alertThreshold: budget?.alertThreshold || 80,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
    setFormData({ categoryId: '', amountPlanned: '', alertThreshold: 80 });
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!canEdit) {
      alert('Você não tem permissão para realizar esta ação');
      return;
    }

    const budgetData = {
      companyId: activeCompanyId,
      categoryId: formData?.categoryId,
      month: selectedMonth,
      amountPlanned: parseFloat(formData?.amountPlanned) || 0,
      amountActual: editingBudget?.amountActual || 0,
      alertThreshold: parseInt(formData?.alertThreshold) || 80,
    };

    if (editingBudget) {
      dispatch(editBudget({ id: editingBudget?.id, ...budgetData }));
    } else {
      dispatch(addBudget(budgetData));
    }

    handleCloseModal();
  };

  const handleDelete = (budgetId) => {
    if (!canEdit) {
      alert('Você não tem permissão para realizar esta ação');
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      dispatch(deleteBudget(budgetId));
    }
  };

  const handleCopyFromPreviousMonth = () => {
    if (!canEdit) {
      alert('Você não tem permissão para realizar esta ação');
      return;
    }

    const previousMonth = format(addMonths(new Date(selectedMonth), -1), 'yyyy-MM');
    dispatch(copyBudgetFromPreviousMonth({
      companyId: activeCompanyId,
      fromMonth: previousMonth,
      toMonth: selectedMonth,
    }));
  };

  const monthOptions = useMemo(() => {
    const options = [];
    const currentDate = new Date();
    
    // Generate options for current month and next 11 months
    for (let i = 0; i < 12; i++) {
      const date = addMonths(currentDate, i);
      const value = format(date, 'yyyy-MM');
      const label = format(date, 'MMMM yyyy', { locale: require('date-fns/locale/pt-BR') });
      options?.push({ value, label: label?.charAt(0)?.toUpperCase() + label?.slice(1) });
    }
    
    return options;
  }, []);

  // Calculate totals
  const totals = useMemo(() => {
    const totalPlanned = monthBudgets?.reduce((sum, item) => sum + (item?.budget?.amountPlanned || 0), 0);
    const totalActual = monthBudgets?.reduce((sum, item) => sum + (item?.budget?.amountActual || 0), 0);
    const adherencePercentage = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;
    
    return { totalPlanned, totalActual, adherencePercentage };
  }, [monthBudgets]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Orçamentos
        </h3>
        <p className="text-sm text-muted-foreground">
          Planeje e acompanhe seus gastos por categoria mensalmente
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select
            label="Mês"
            options={monthOptions}
            value={selectedMonth}
            onChange={setSelectedMonth}
            className="w-48"
          />
          
          {canEdit && (
            <Button
              variant="outline"
              onClick={handleCopyFromPreviousMonth}
            >
              <Copy className="w-4 h-4 mr-2" />
              Carregar do Mês Anterior
            </Button>
          )}
        </div>

        {/* Summary */}
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(totals?.totalPlanned)}
          </div>
          <div className="text-sm text-muted-foreground">
            Orçamento Total • {totals?.adherencePercentage?.toFixed(1)}% realizado
          </div>
        </div>
      </div>

      {/* Budget Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-foreground">
            <div className="col-span-4">Categoria</div>
            <div className="col-span-2 text-right">Planejado</div>
            <div className="col-span-2 text-right">Realizado</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-2 text-center">Ações</div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {monthBudgets?.map((item) => {
            const percentage = item?.budget?.amountPlanned > 0 ? 
              (item?.budget?.amountActual / item?.budget?.amountPlanned) * 100 : 0;

            return (
              <div key={item?.categoryId} className="px-6 py-4 hover:bg-muted/50">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Category */}
                  <div className="col-span-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item?.categoryColor }}
                      />
                      <span className="font-medium text-foreground">{item?.categoryName}</span>
                    </div>
                  </div>

                  {/* Planned Amount */}
                  <div className="col-span-2 text-right">
                    <span className="font-medium text-foreground">
                      {item?.budget ? formatCurrency(item?.budget?.amountPlanned) : '-'}
                    </span>
                  </div>

                  {/* Actual Amount */}
                  <div className="col-span-2 text-right">
                    <span className="text-muted-foreground">
                      {item?.budget ? formatCurrency(item?.budget?.amountActual) : '-'}
                    </span>
                    {item?.budget && percentage > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {percentage?.toFixed(1)}%
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-2 text-center">
                    {item?.status && (
                      <div className="flex items-center justify-center space-x-1">
                        {item?.status?.type === 'ok' && <CheckCircle className="w-4 h-4" />}
                        {item?.status?.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                        {item?.status?.type === 'exceeded' && <TrendingUp className="w-4 h-4" />}
                        <span className={`text-sm font-medium ${item?.status?.color}`}>
                          {item?.status?.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 text-center">
                    <div className="flex justify-center space-x-2">
                      {canEdit && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenModal(item?.categoryId, item?.budget)}
                          >
                            {item?.budget ? 'Editar' : 'Definir'}
                          </Button>
                          {item?.budget && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item?.budget?.id)}
                              className="text-error hover:text-error"
                            >
                              Excluir
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleCloseModal} />
            </div>

            <div className="inline-block align-bottom bg-card rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-card px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      {editingBudget ? 'Editar' : 'Definir'} Orçamento
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCloseModal}
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Categoria
                      </label>
                      <div className="p-3 bg-muted rounded-md">
                        <span className="font-medium">
                          {expenseCategories?.find(c => c?.id === formData?.categoryId)?.name}
                        </span>
                      </div>
                    </div>

                    <Input
                      label="Valor Planejado (R$)"
                      type="number"
                      step="0.01"
                      value={formData?.amountPlanned}
                      onChange={(e) => setFormData(prev => ({ ...prev, amountPlanned: e?.target?.value }))}
                      required
                      placeholder="0.00"
                    />

                    <Input
                      label="Limite de Alerta (%)"
                      type="number"
                      min="0"
                      max="100"
                      value={formData?.alertThreshold}
                      onChange={(e) => setFormData(prev => ({ ...prev, alertThreshold: e?.target?.value }))}
                      placeholder="80"
                    />

                    <div className="text-xs text-muted-foreground">
                      * Você receberá alertas quando o gasto atingir {formData?.alertThreshold || 80}% do valor planejado
                    </div>
                  </div>
                </div>

                <div className="bg-muted px-6 py-3 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingBudget ? 'Salvar' : 'Definir'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetingSection;