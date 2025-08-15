import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { 
  selectActiveCompanyId,
  selectCanEdit 
} from '../../../store/selectors';
import { 
  addCostCenter, 
  editCostCenter, 
  deleteCostCenter 
} from '../../../store/slices/costCentersSlice';
import { Trash2, Edit, Plus, Search, Target } from 'lucide-react';

const CostCentersSection = () => {
  const dispatch = useDispatch();
  const activeCompanyId = useSelector(selectActiveCompanyId);
  const costCenters = useSelector(state => state?.costCenters?.items?.filter(cc => cc?.companyId === activeCompanyId) || []);
  const canEdit = useSelector(selectCanEdit);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    budget: '',
    manager: '',
    active: true,
  });

  const [errors, setErrors] = useState({});

  const filteredCostCenters = useMemo(() => {
    return costCenters?.filter(cc => 
      cc?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      cc?.code?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      cc?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    ) || [];
  }, [costCenters, searchQuery]);

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({
        name: item?.name || '',
        code: item?.code || '',
        description: item?.description || '',
        budget: item?.budget || '',
        manager: item?.manager || '',
        active: item?.active ?? true,
      });
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
        budget: '',
        manager: '',
        active: true,
      });
    }
    setIsModalOpen(true);
    setErrors({});
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData?.code?.trim()) newErrors.code = 'Código é obrigatório';
    
    // Check for duplicate codes
    const existingCode = costCenters?.find(cc => 
      cc?.code === formData?.code && 
      (!editingItem || cc?.id !== editingItem?.id)
    );
    if (existingCode) newErrors.code = 'Código já existe';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!canEdit) {
      alert('Você não tem permissão para realizar esta ação');
      return;
    }

    if (!validateForm()) return;

    const data = {
      ...formData,
      companyId: activeCompanyId,
      budget: parseFloat(formData?.budget) || 0,
    };

    if (editingItem) {
      dispatch(editCostCenter({ id: editingItem?.id, ...data }));
    } else {
      dispatch(addCostCenter(data));
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (!canEdit) {
      alert('Você não tem permissão para realizar esta ação');
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir este centro de custo?')) {
      dispatch(deleteCostCenter(id));
    }
  };

  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Centros de Custo
        </h3>
        <p className="text-sm text-muted-foreground">
          Organize custos por projetos, departamentos ou atividades
        </p>
      </div>

      {/* Search and Add */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar centros de custo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        {canEdit && (
          <Button
            onClick={() => handleOpenModal()}
            className="ml-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Centro de Custo
          </Button>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredCostCenters?.map((costCenter) => (
          <div
            key={costCenter?.id}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-foreground">{costCenter?.name}</h4>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      {costCenter?.code}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      costCenter?.active 
                        ? 'bg-emerald-100 text-emerald-800' :'bg-red-100 text-red-800'
                    }`}>
                      {costCenter?.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  {costCenter?.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {costCenter?.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    {costCenter?.budget > 0 && (
                      <div>💰 Orçamento: {formatCurrency(costCenter?.budget)}</div>
                    )}
                    {costCenter?.manager && (
                      <div>👤 Responsável: {costCenter?.manager}</div>
                    )}
                  </div>
                </div>
              </div>

              {canEdit && (
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenModal(costCenter)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(costCenter?.id)}
                    className="text-error hover:text-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredCostCenters?.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-muted-foreground">
              Nenhum centro de custo encontrado
            </div>
            {canEdit && (
              <Button
                onClick={() => handleOpenModal()}
                className="mt-4"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Centro de Custo
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleCloseModal} />
            </div>

            <div className="inline-block align-bottom bg-card rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-card px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      {editingItem ? 'Editar' : 'Adicionar'} Centro de Custo
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
                    <Input
                      label="Nome *"
                      value={formData?.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e?.target?.value }))}
                      error={errors?.name}
                      required
                      placeholder="Ex: Marketing Digital"
                    />

                    <Input
                      label="Código *"
                      value={formData?.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e?.target?.value?.toUpperCase() }))}
                      error={errors?.code}
                      required
                      placeholder="Ex: MKT-001"
                    />

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Descrição
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
                        value={formData?.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
                        placeholder="Descrição do centro de custo..."
                      />
                    </div>

                    <Input
                      label="Orçamento Mensal"
                      type="number"
                      step="0.01"
                      value={formData?.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e?.target?.value }))}
                      placeholder="0.00"
                    />

                    <Input
                      label="Responsável"
                      value={formData?.manager}
                      onChange={(e) => setFormData(prev => ({ ...prev, manager: e?.target?.value }))}
                      placeholder="Nome do responsável"
                    />

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="active"
                        checked={formData?.active}
                        onChange={(e) => setFormData(prev => ({ ...prev, active: e?.target?.checked }))}
                        className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                      />
                      <label htmlFor="active" className="ml-2 block text-sm text-foreground">
                        Centro de custo ativo
                      </label>
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
                    {editingItem ? 'Salvar' : 'Adicionar'}
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

export default CostCentersSection;