import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CategoriesSection = () => {
  const [categories, setCategories] = useState([
    {
      id: '1',
      nome: 'Receitas',
      tipo: 'receita',
      cor: '#10B981',
      icone: 'TrendingUp',
      parent: null,
      children: [
        { id: '1-1', nome: 'Vendas de Produtos', tipo: 'receita', cor: '#10B981', icone: 'ShoppingCart', parent: '1' },
        { id: '1-2', nome: 'Prestação de Serviços', tipo: 'receita', cor: '#10B981', icone: 'Wrench', parent: '1' },
        { id: '1-3', nome: 'Receitas Financeiras', tipo: 'receita', cor: '#10B981', icone: 'PiggyBank', parent: '1' }
      ]
    },
    {
      id: '2',
      nome: 'Despesas Operacionais',
      tipo: 'despesa',
      cor: '#EF4444',
      icone: 'TrendingDown',
      parent: null,
      children: [
        { id: '2-1', nome: 'Salários e Encargos', tipo: 'despesa', cor: '#EF4444', icone: 'Users', parent: '2' },
        { id: '2-2', nome: 'Aluguel e Condomínio', tipo: 'despesa', cor: '#EF4444', icone: 'Home', parent: '2' },
        { id: '2-3', nome: 'Energia Elétrica', tipo: 'despesa', cor: '#EF4444', icone: 'Zap', parent: '2' },
        { id: '2-4', nome: 'Telefone e Internet', tipo: 'despesa', cor: '#EF4444', icone: 'Phone', parent: '2' }
      ]
    },
    {
      id: '3',
      nome: 'Marketing e Vendas',
      tipo: 'despesa',
      cor: '#F59E0B',
      icone: 'Megaphone',
      parent: null,
      children: [
        { id: '3-1', nome: 'Publicidade Online', tipo: 'despesa', cor: '#F59E0B', icone: 'Monitor', parent: '3' },
        { id: '3-2', nome: 'Material Promocional', tipo: 'despesa', cor: '#F59E0B', icone: 'Gift', parent: '3' },
        { id: '3-3', nome: 'Eventos e Feiras', tipo: 'despesa', cor: '#F59E0B', icone: 'Calendar', parent: '3' }
      ]
    },
    {
      id: '4',
      nome: 'Impostos e Taxas',
      tipo: 'despesa',
      cor: '#8B5CF6',
      icone: 'FileText',
      parent: null,
      children: [
        { id: '4-1', nome: 'Simples Nacional', tipo: 'despesa', cor: '#8B5CF6', icone: 'Calculator', parent: '4' },
        { id: '4-2', nome: 'FGTS', tipo: 'despesa', cor: '#8B5CF6', icone: 'Briefcase', parent: '4' },
        { id: '4-3', nome: 'Taxas Bancárias', tipo: 'despesa', cor: '#8B5CF6', icone: 'CreditCard', parent: '4' }
      ]
    }
  ]);

  const [expandedCategories, setExpandedCategories] = useState(['1', '2', '3', '4']);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    nome: '',
    tipo: 'despesa',
    cor: '#6B7280',
    icone: 'Folder',
    parent: null
  });

  const tipoOptions = [
    { value: 'receita', label: 'Receita' },
    { value: 'despesa', label: 'Despesa' }
  ];

  const iconeOptions = [
    { value: 'Folder', label: 'Pasta' },
    { value: 'ShoppingCart', label: 'Carrinho' },
    { value: 'Wrench', label: 'Ferramenta' },
    { value: 'PiggyBank', label: 'Cofrinho' },
    { value: 'Users', label: 'Usuários' },
    { value: 'Home', label: 'Casa' },
    { value: 'Zap', label: 'Raio' },
    { value: 'Phone', label: 'Telefone' },
    { value: 'Monitor', label: 'Monitor' },
    { value: 'Gift', label: 'Presente' },
    { value: 'Calendar', label: 'Calendário' },
    { value: 'Calculator', label: 'Calculadora' },
    { value: 'Briefcase', label: 'Maleta' },
    { value: 'CreditCard', label: 'Cartão' }
  ];

  const corOptions = [
    { value: '#10B981', label: 'Verde' },
    { value: '#EF4444', label: 'Vermelho' },
    { value: '#F59E0B', label: 'Amarelo' },
    { value: '#8B5CF6', label: 'Roxo' },
    { value: '#3B82F6', label: 'Azul' },
    { value: '#EC4899', label: 'Rosa' },
    { value: '#6B7280', label: 'Cinza' }
  ];

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => 
      prev?.includes(categoryId) 
        ? prev?.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddCategory = () => {
    const category = {
      id: Date.now()?.toString(),
      ...newCategory,
      children: []
    };
    
    setCategories(prev => [...prev, category]);
    setNewCategory({
      nome: '',
      tipo: 'despesa',
      cor: '#6B7280',
      icone: 'Folder',
      parent: null
    });
    setShowAddForm(false);
  };

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category });
  };

  const handleSaveEdit = () => {
    setCategories(prev => prev?.map(cat => {
      if (cat?.id === editingCategory?.id) {
        return { ...cat, ...editingCategory };
      }
      // Update children if editing a child category
      if (cat?.children) {
        return {
          ...cat,
          children: cat?.children?.map(child => 
            child?.id === editingCategory?.id ? { ...child, ...editingCategory } : child
          )
        };
      }
      return cat;
    }));
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(prev => prev?.filter(cat => {
      if (cat?.id === categoryId) return false;
      if (cat?.children) {
        cat.children = cat?.children?.filter(child => child?.id !== categoryId);
      }
      return true;
    }));
  };

  const getParentOptions = () => {
    return categories?.map(cat => ({
      value: cat?.id,
      label: cat?.nome
    }));
  };

  const getTotalTransactions = (categoryId) => {
    // Mock data - in real app this would come from API
    return Math.floor(Math.random() * 50) + 1;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Categorias</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Organize suas transações com categorias hierárquicas
          </p>
        </div>
        
        <Button 
          variant="default" 
          iconName="Plus" 
          onClick={() => setShowAddForm(true)}
        >
          Nova Categoria
        </Button>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FolderTree" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-semibold text-foreground">{categories?.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} color="var(--color-success)" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Receitas</p>
              <p className="text-2xl font-semibold text-foreground">
                {categories?.filter(cat => cat?.tipo === 'receita')?.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingDown" size={20} color="var(--color-error)" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Despesas</p>
              <p className="text-2xl font-semibold text-foreground">
                {categories?.filter(cat => cat?.tipo === 'despesa')?.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Layers" size={20} color="var(--color-warning)" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subcategorias</p>
              <p className="text-2xl font-semibold text-foreground">
                {categories?.reduce((sum, cat) => sum + (cat?.children?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Categories Tree */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h4 className="text-lg font-medium text-foreground">Estrutura de Categorias</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Baseado nas categorias SEBRAE com personalizações
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-2">
            {categories?.map((category) => (
              <div key={category?.id} className="border border-border rounded-lg">
                {/* Parent Category */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleCategory(category?.id)}
                      className="p-1 rounded hover:bg-muted transition-colors"
                    >
                      <Icon 
                        name={expandedCategories?.includes(category?.id) ? "ChevronDown" : "ChevronRight"} 
                        size={16} 
                        color="var(--color-text-secondary)" 
                      />
                    </button>

                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category?.cor}20` }}
                    >
                      <Icon 
                        name={category?.icone} 
                        size={16} 
                        color={category?.cor} 
                      />
                    </div>

                    <div>
                      <h5 className="font-medium text-foreground">{category?.nome}</h5>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`
                          px-2 py-0.5 text-xs rounded-full
                          ${category?.tipo === 'receita' ?'bg-success/10 text-success' :'bg-error/10 text-error'
                          }
                        `}>
                          {category?.tipo === 'receita' ? 'Receita' : 'Despesa'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {getTotalTransactions(category?.id)} transações
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      iconName="Edit"
                      onClick={() => handleEditCategory(category)}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      iconName="Trash2"
                      onClick={() => handleDeleteCategory(category?.id)}
                    />
                  </div>
                </div>

                {/* Child Categories */}
                {expandedCategories?.includes(category?.id) && category?.children && (
                  <div className="border-t border-border bg-muted/30">
                    {category?.children?.map((child) => (
                      <div key={child?.id} className="flex items-center justify-between p-4 pl-16">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-6 h-6 rounded flex items-center justify-center"
                            style={{ backgroundColor: `${child?.cor}20` }}
                          >
                            <Icon 
                              name={child?.icone} 
                              size={12} 
                              color={child?.cor} 
                            />
                          </div>

                          <div>
                            <h6 className="text-sm font-medium text-foreground">{child?.nome}</h6>
                            <span className="text-xs text-muted-foreground">
                              {getTotalTransactions(child?.id)} transações
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            iconName="Edit"
                            onClick={() => handleEditCategory(child)}
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            iconName="Trash2"
                            onClick={() => handleDeleteCategory(child?.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Add Category Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-pronounced w-full max-w-lg">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Nova Categoria</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Adicione uma nova categoria ao sistema
              </p>
            </div>

            <div className="p-6 space-y-6">
              <Input
                label="Nome da Categoria"
                type="text"
                value={newCategory?.nome}
                onChange={(e) => setNewCategory(prev => ({ ...prev, nome: e?.target?.value }))}
                required
              />

              <Select
                label="Tipo"
                options={tipoOptions}
                value={newCategory?.tipo}
                onChange={(value) => setNewCategory(prev => ({ ...prev, tipo: value }))}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Ícone"
                  options={iconeOptions}
                  value={newCategory?.icone}
                  onChange={(value) => setNewCategory(prev => ({ ...prev, icone: value }))}
                />

                <Select
                  label="Cor"
                  options={corOptions}
                  value={newCategory?.cor}
                  onChange={(value) => setNewCategory(prev => ({ ...prev, cor: value }))}
                />
              </div>

              <Select
                label="Categoria Pai (Opcional)"
                options={[{ value: null, label: 'Categoria Principal' }, ...getParentOptions()]}
                value={newCategory?.parent}
                onChange={(value) => setNewCategory(prev => ({ ...prev, parent: value }))}
              />
            </div>

            <div className="p-6 border-t border-border flex items-center justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
              <Button variant="default" onClick={handleAddCategory}>
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-pronounced w-full max-w-lg">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Editar Categoria</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Atualize as informações da categoria
              </p>
            </div>

            <div className="p-6 space-y-6">
              <Input
                label="Nome da Categoria"
                type="text"
                value={editingCategory?.nome}
                onChange={(e) => setEditingCategory(prev => ({ ...prev, nome: e?.target?.value }))}
                required
              />

              <Select
                label="Tipo"
                options={tipoOptions}
                value={editingCategory?.tipo}
                onChange={(value) => setEditingCategory(prev => ({ ...prev, tipo: value }))}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Ícone"
                  options={iconeOptions}
                  value={editingCategory?.icone}
                  onChange={(value) => setEditingCategory(prev => ({ ...prev, icone: value }))}
                />

                <Select
                  label="Cor"
                  options={corOptions}
                  value={editingCategory?.cor}
                  onChange={(value) => setEditingCategory(prev => ({ ...prev, cor: value }))}
                />
              </div>
            </div>

            <div className="p-6 border-t border-border flex items-center justify-end space-x-3">
              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                Cancelar
              </Button>
              <Button variant="default" onClick={handleSaveEdit}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesSection;