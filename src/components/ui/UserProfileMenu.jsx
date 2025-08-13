import React, { useState } from 'react';
import { User, Settings, LogOut, Shield, Eye, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../state/store';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const UserProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useStore();
  
  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
    setIsOpen(false);
  };
  
  const handleSettings = () => {
    navigate('/company-account-settings?tab=users');
    setIsOpen(false);
  };
  
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return Shield;
      case 'viewer':
        return Eye;
      default:
        return UserCheck;
    }
  };
  
  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'viewer':
        return 'Visualizador';
      default:
        return 'Usuário';
    }
  };
  
  if (!currentUser) {
    return (
      <button
        onClick={() => navigate('/login')}
        className="
          flex items-center space-x-2 px-3 py-2 rounded-lg
          text-muted-foreground hover:text-foreground
          hover:bg-muted transition-colors
          focus:outline-none focus:ring-2 focus:ring-ring
        "
      >
        <User className="h-5 w-5" />
        <span className="hidden sm:block text-sm">Entrar</span>
      </button>
    );
  }
  
  const RoleIcon = getRoleIcon(currentUser?.role);
  
  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center space-x-2 px-3 py-2 rounded-lg
          text-foreground hover:bg-muted transition-colors
          focus:outline-none focus:ring-2 focus:ring-ring
        "
      >
        <div className="
          h-8 w-8 rounded-full bg-primary text-primary-foreground
          flex items-center justify-center text-sm font-medium
        ">
          {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium">{currentUser?.name}</div>
          <div className="text-xs text-muted-foreground">
            {getRoleLabel(currentUser?.role)}
          </div>
        </div>
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 z-50">
          <div className="bg-popover border border-border rounded-lg shadow-lg">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="
                  h-10 w-10 rounded-full bg-primary text-primary-foreground
                  flex items-center justify-center font-medium
                ">
                  {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">
                    {currentUser?.name}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {currentUser?.email}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <RoleIcon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {getRoleLabel(currentUser?.role)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Last Login */}
              {currentUser?.lastLogin && (
                <div className="mt-2 pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Último acesso: {format(
                      new Date(currentUser.lastLogin), 
                      'dd/MM/yyyy HH:mm', 
                      { locale: ptBR }
                    )}
                  </p>
                </div>
              )}
            </div>
            
            {/* Menu Items */}
            <div className="py-1">
              {/* Settings */}
              <button
                onClick={handleSettings}
                className="
                  w-full flex items-center space-x-3 px-4 py-2 text-left
                  text-popover-foreground hover:bg-muted transition-colors
                "
              >
                <Settings className="h-4 w-4" />
                <div>
                  <div className="text-sm">Configurações</div>
                  <div className="text-xs text-muted-foreground">
                    Usuários e permissões
                  </div>
                </div>
              </button>
              
              {/* Role-specific info */}
              <div className="px-4 py-2 border-t border-border">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  Permissões Ativas:
                </div>
                <div className="space-y-1">
                  {currentUser?.role === 'admin' ? (
                    <div className="text-xs text-success flex items-center space-x-1">
                      <Shield className="h-3 w-3" />
                      <span>Acesso total ao sistema</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>Visualização apenas</span>
                      </div>
                      {currentUser?.permissions?.canExportData && (
                        <div className="text-xs text-primary">
                          • Exportação de dados
                        </div>
                      )}
                      {currentUser?.permissions?.canManageCategories && (
                        <div className="text-xs text-primary">
                          • Gerenciar categorias
                        </div>
                      )}
                      {currentUser?.permissions?.canManageVendors && (
                        <div className="text-xs text-primary">
                          • Gerenciar fornecedores
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Logout */}
            <div className="border-t border-border pt-1">
              <button
                onClick={handleLogout}
                className="
                  w-full flex items-center space-x-3 px-4 py-2 text-left
                  text-destructive hover:bg-destructive/10 transition-colors
                "
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserProfileMenu;