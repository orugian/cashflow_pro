import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const UsersPermissionsSection = () => {
  const [users, setUsers] = useState([
    {
      id: '1',
      nome: 'Maria Silva Santos',
      email: 'maria.santos@techsolutions.com.br',
      role: 'admin',
      status: 'ativo',
      ultimoAcesso: '2025-08-13T19:30:00Z',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      permissions: {
        dashboard: true,
        transactions: true,
        analytics: true,
        reports: true,
        settings: true,
        users: true,
        export: true,
        delete: true
      }
    },
    {
      id: '2',
      nome: 'João Carlos Oliveira',
      email: 'joao.oliveira@techsolutions.com.br',
      role: 'viewer',
      status: 'ativo',
      ultimoAcesso: '2025-08-13T18:45:00Z',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      permissions: {
        dashboard: true,
        transactions: true,
        analytics: true,
        reports: true,
        settings: false,
        users: false,
        export: true,
        delete: false
      }
    },
    {
      id: '3',
      nome: 'Ana Paula Costa',
      email: 'ana.costa@techsolutions.com.br',
      role: 'viewer',
      status: 'pendente',
      ultimoAcesso: null,
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      permissions: {
        dashboard: true,
        transactions: false,
        analytics: false,
        reports: true,
        settings: false,
        users: false,
        export: false,
        delete: false
      }
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    nome: '',
    email: '',
    role: 'viewer',
    permissions: {
      dashboard: true,
      transactions: false,
      analytics: false,
      reports: true,
      settings: false,
      users: false,
      export: false,
      delete: false
    }
  });

  const roleOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'viewer', label: 'Visualizador' }
  ];

  const permissionLabels = {
    dashboard: 'Dashboard',
    transactions: 'Transações',
    analytics: 'Análises',
    reports: 'Relatórios',
    settings: 'Configurações',
    users: 'Usuários',
    export: 'Exportar Dados',
    delete: 'Excluir Registros'
  };

  const handleAddUser = () => {
    const user = {
      id: Date.now()?.toString(),
      ...newUser,
      status: 'pendente',
      ultimoAcesso: null,
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 50) + 1}.jpg`
    };
    
    setUsers(prev => [...prev, user]);
    setNewUser({
      nome: '',
      email: '',
      role: 'viewer',
      permissions: {
        dashboard: true,
        transactions: false,
        analytics: false,
        reports: true,
        settings: false,
        users: false,
        export: false,
        delete: false
      }
    });
    setShowAddForm(false);
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleSaveEdit = () => {
    setUsers(prev => prev?.map(user => 
      user?.id === editingUser?.id ? editingUser : user
    ));
    setEditingUser(null);
  };

  const handleToggleStatus = (userId) => {
    setUsers(prev => prev?.map(user => 
      user?.id === userId 
        ? { ...user, status: user?.status === 'ativo' ? 'inativo' : 'ativo' }
        : user
    ));
  };

  const handleDeleteUser = (userId) => {
    setUsers(prev => prev?.filter(user => user?.id !== userId));
  };

  const formatLastAccess = (timestamp) => {
    if (!timestamp) return 'Nunca acessou';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Agora mesmo';
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      return date?.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo':
        return 'text-success';
      case 'pendente':
        return 'text-warning';
      case 'inativo':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'ativo':
        return 'bg-success/10';
      case 'pendente':
        return 'bg-warning/10';
      case 'inativo':
        return 'bg-error/10';
      default:
        return 'bg-muted';
    }
  };

  const getRoleLabel = (role) => {
    return role === 'admin' ? 'Administrador' : 'Visualizador';
  };

  const updatePermission = (user, permission, value) => {
    const updatedUser = {
      ...user,
      permissions: {
        ...user?.permissions,
        [permission]: value
      }
    };
    
    if (editingUser) {
      setEditingUser(updatedUser);
    } else {
      setNewUser(updatedUser);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Usuários & Permissões</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie usuários e controle de acesso ao sistema
          </p>
        </div>
        
        <Button 
          variant="default" 
          iconName="UserPlus" 
          onClick={() => setShowAddForm(true)}
        >
          Convidar Usuário
        </Button>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-semibold text-foreground">{users?.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="UserCheck" size={20} color="var(--color-success)" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ativos</p>
              <p className="text-2xl font-semibold text-foreground">
                {users?.filter(user => user?.status === 'ativo')?.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="UserX" size={20} color="var(--color-warning)" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-2xl font-semibold text-foreground">
                {users?.filter(user => user?.status === 'pendente')?.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} color="var(--color-error)" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admins</p>
              <p className="text-2xl font-semibold text-foreground">
                {users?.filter(user => user?.role === 'admin')?.length}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Users List */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h4 className="text-lg font-medium text-foreground">Lista de Usuários</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie permissões individuais e status dos usuários
          </p>
        </div>

        <div className="divide-y divide-border">
          {users?.map((user) => (
            <div key={user?.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={user?.avatar}
                      alt={user?.nome}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className={`
                      absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card
                      ${user?.status === 'ativo' ? 'bg-success' : user?.status === 'pendente' ? 'bg-warning' : 'bg-error'}
                    `}></div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-foreground">{user?.nome}</h5>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`
                        px-2 py-0.5 text-xs rounded-full
                        ${getStatusBgColor(user?.status)} ${getStatusColor(user?.status)}
                      `}>
                        {user?.status === 'ativo' ? 'Ativo' : user?.status === 'pendente' ? 'Pendente' : 'Inativo'}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
                        {getRoleLabel(user?.role)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatLastAccess(user?.ultimoAcesso)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    iconName="Edit"
                    onClick={() => handleEditUser(user)}
                  >
                    Editar
                  </Button>
                  
                  <Button 
                    variant={user?.status === 'ativo' ? 'destructive' : 'default'}
                    size="sm"
                    onClick={() => handleToggleStatus(user?.id)}
                  >
                    {user?.status === 'ativo' ? 'Desativar' : 'Ativar'}
                  </Button>

                  {user?.role !== 'admin' && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      iconName="Trash2"
                      onClick={() => handleDeleteUser(user?.id)}
                    />
                  )}
                </div>
              </div>

              {/* Permissions Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-4 bg-muted/30 rounded-lg">
                {Object.entries(user?.permissions)?.map(([permission, hasPermission]) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <div className={`
                      w-4 h-4 rounded flex items-center justify-center
                      ${hasPermission ? 'bg-success text-success-foreground' : 'bg-muted border border-border'}
                    `}>
                      {hasPermission && <Icon name="Check" size={12} />}
                    </div>
                    <span className="text-sm text-foreground">{permissionLabels?.[permission]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Add User Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-pronounced w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Convidar Usuário</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Adicione um novo usuário ao sistema
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nome Completo"
                  type="text"
                  value={newUser?.nome}
                  onChange={(e) => setNewUser(prev => ({ ...prev, nome: e?.target?.value }))}
                  required
                />

                <Input
                  label="E-mail"
                  type="email"
                  value={newUser?.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e?.target?.value }))}
                  required
                />
              </div>

              <Select
                label="Função"
                options={roleOptions}
                value={newUser?.role}
                onChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}
                required
              />

              <div>
                <h4 className="font-medium text-foreground mb-4">Permissões</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(permissionLabels)?.map(([permission, label]) => (
                    <Checkbox
                      key={permission}
                      label={label}
                      checked={newUser?.permissions?.[permission]}
                      onChange={(e) => updatePermission(newUser, permission, e?.target?.checked)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex items-center justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
              <Button variant="default" onClick={handleAddUser}>
                Enviar Convite
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-pronounced w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Editar Usuário</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Atualize informações e permissões do usuário
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nome Completo"
                  type="text"
                  value={editingUser?.nome}
                  onChange={(e) => setEditingUser(prev => ({ ...prev, nome: e?.target?.value }))}
                  required
                />

                <Input
                  label="E-mail"
                  type="email"
                  value={editingUser?.email}
                  onChange={(e) => setEditingUser(prev => ({ ...prev, email: e?.target?.value }))}
                  required
                />
              </div>

              <Select
                label="Função"
                options={roleOptions}
                value={editingUser?.role}
                onChange={(value) => setEditingUser(prev => ({ ...prev, role: value }))}
                required
              />

              <div>
                <h4 className="font-medium text-foreground mb-4">Permissões</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(permissionLabels)?.map(([permission, label]) => (
                    <Checkbox
                      key={permission}
                      label={label}
                      checked={editingUser?.permissions?.[permission]}
                      onChange={(e) => updatePermission(editingUser, permission, e?.target?.checked)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex items-center justify-end space-x-3">
              <Button variant="outline" onClick={() => setEditingUser(null)}>
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

export default UsersPermissionsSection;