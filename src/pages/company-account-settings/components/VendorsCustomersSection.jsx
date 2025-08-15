import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

import { 
  selectVendorsByCompany, 
  selectCustomersByCompany,
  selectActiveCompanyId,
  selectCanEdit 
} from '../../../store/selectors';
import { 
  addVendor, 
  addCustomer, 
  editVendor, 
  editCustomer, 
  deleteVendor, 
  deleteCustomer 
} from '../../../store/slices/vendorsCustomersSlice';
import { Trash2, Edit, Plus, Search } from 'lucide-react';

const VendorsCustomersSection = () => {
  const dispatch = useDispatch();
  const activeCompanyId = useSelector(selectActiveCompanyId);
  const vendors = useSelector((state) => selectVendorsByCompany(state, activeCompanyId));
  const customers = useSelector((state) => selectCustomersByCompany(state, activeCompanyId));
  const canEdit = useSelector(selectCanEdit);

  const [activeTab, setActiveTab] = useState('vendors');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    cnpjCpf: '',
    email: '',
    phone: '',
    address: '',
    contact: '',
    notes: '',
    category: '',
    creditLimit: '',
    paymentTerms: '',
  });

  const [errors, setErrors] = useState({});

  const filteredVendors = useMemo(() => {
    return vendors?.filter(vendor => 
      vendor?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      vendor?.cnpjCpf?.includes(searchQuery) ||
      vendor?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    ) || [];
  }, [vendors, searchQuery]);

  const filteredCustomers = useMemo(() => {
    return customers?.filter(customer => 
      customer?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      customer?.cnpjCpf?.includes(searchQuery) ||
      customer?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    ) || [];
  }, [customers, searchQuery]);

  const handleOpenModal = (type, item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({
        name: item?.name || '',
        cnpjCpf: item?.cnpjCpf || '',
        email: item?.email || '',
        phone: item?.phone || '',
        address: item?.address || '',
        contact: item?.contact || '',
        notes: item?.notes || '',
        category: item?.category || '',
        creditLimit: item?.creditLimit || '',
        paymentTerms: item?.paymentTerms || '',
      });
    } else {
      setFormData({
        name: '',
        cnpjCpf: '',
        email: '',
        phone: '',
        address: '',
        contact: '',
        notes: '',
        category: '',
        creditLimit: '',
        paymentTerms: '',
      });
    }
    setActiveTab(type);
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
    if (!formData?.cnpjCpf?.trim()) newErrors.cnpjCpf = 'CNPJ/CPF é obrigatório';
    if (formData?.email && !/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Email inválido';
    }

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
      active: true,
    };

    if (editingItem) {
      // Edit existing
      if (activeTab === 'vendors') {
        dispatch(editVendor({ id: editingItem?.id, ...data }));
      } else {
        dispatch(editCustomer({ id: editingItem?.id, ...data }));
      }
    } else {
      // Add new
      if (activeTab === 'vendors') {
        dispatch(addVendor(data));
      } else {
        dispatch(addCustomer(data));
      }
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (!canEdit) {
      alert('Você não tem permissão para realizar esta ação');
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      if (activeTab === 'vendors') {
        dispatch(deleteVendor(id));
      } else {
        dispatch(deleteCustomer(id));
      }
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '';
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
          Fornecedores & Clientes
        </h3>
        <p className="text-sm text-muted-foreground">
          Gerencie seu cadastro de fornecedores e clientes
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'vendors', label: 'Fornecedores', count: vendors?.length || 0 },
            { id: 'customers', label: 'Clientes', count: customers?.length || 0 }
          ]?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }
              `}
            >
              {tab?.label}
              <span className="ml-2 bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">
                {tab?.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Add */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder={`Buscar ${activeTab === 'vendors' ? 'fornecedores' : 'clientes'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        {canEdit && (
          <Button
            onClick={() => handleOpenModal(activeTab)}
            className="ml-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar {activeTab === 'vendors' ? 'Fornecedor' : 'Cliente'}
          </Button>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {(activeTab === 'vendors' ? filteredVendors : filteredCustomers)?.map((item) => (
          <div
            key={item?.id}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h4 className="font-semibold text-foreground">{item?.name}</h4>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {item?.cnpjCpf}
                  </span>
                </div>
                
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {item?.email && (
                    <div>📧 {item?.email}</div>
                  )}
                  {item?.phone && (
                    <div>📞 {item?.phone}</div>
                  )}
                  {item?.address && (
                    <div>📍 {item?.address}</div>
                  )}
                  {item?.creditLimit && (
                    <div>💰 Limite: {formatCurrency(item?.creditLimit)}</div>
                  )}
                  {item?.paymentTerms && (
                    <div>📅 Prazo: {item?.paymentTerms}</div>
                  )}
                </div>

                {item?.notes && (
                  <div className="mt-2 text-sm text-muted-foreground italic">
                    "{item?.notes}"
                  </div>
                )}
              </div>

              {canEdit && (
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenModal(activeTab, item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item?.id)}
                    className="text-error hover:text-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        {(activeTab === 'vendors' ? filteredVendors : filteredCustomers)?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              Nenhum {activeTab === 'vendors' ? 'fornecedor' : 'cliente'} encontrado
            </div>
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

            <div className="inline-block align-bottom bg-card rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-card px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      {editingItem ? 'Editar' : 'Adicionar'} {activeTab === 'vendors' ? 'Fornecedor' : 'Cliente'}
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCloseModal}
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4 md:space-y-0">
                    <div className="col-span-2">
                      <Input
                        label="Nome/Razão Social *"
                        value={formData?.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e?.target?.value }))}
                        error={errors?.name}
                        required
                      />
                    </div>

                    <Input
                      label="CNPJ/CPF *"
                      value={formData?.cnpjCpf}
                      onChange={(e) => setFormData(prev => ({ ...prev, cnpjCpf: e?.target?.value }))}
                      error={errors?.cnpjCpf}
                      required
                    />

                    <Input
                      label="Email"
                      type="email"
                      value={formData?.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e?.target?.value }))}
                      error={errors?.email}
                    />

                    <Input
                      label="Telefone"
                      value={formData?.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e?.target?.value }))}
                    />

                    <Input
                      label="Pessoa de Contato"
                      value={formData?.contact}
                      onChange={(e) => setFormData(prev => ({ ...prev, contact: e?.target?.value }))}
                    />

                    <div className="col-span-2">
                      <Input
                        label="Endereço"
                        value={formData?.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e?.target?.value }))}
                      />
                    </div>

                    {activeTab === 'customers' && (
                      <>
                        <Input
                          label="Limite de Crédito"
                          type="number"
                          step="0.01"
                          value={formData?.creditLimit}
                          onChange={(e) => setFormData(prev => ({ ...prev, creditLimit: e?.target?.value }))}
                        />

                        <Input
                          label="Prazo de Pagamento"
                          placeholder="Ex: 30 dias"
                          value={formData?.paymentTerms}
                          onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e?.target?.value }))}
                        />
                      </>
                    )}

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Observações
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
                        value={formData?.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e?.target?.value }))}
                        placeholder="Informações adicionais..."
                      />
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

export default VendorsCustomersSection;