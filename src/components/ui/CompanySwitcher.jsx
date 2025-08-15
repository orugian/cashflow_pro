import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronDown, Building2, Globe } from 'lucide-react';
import { 
  selectCompanies, 
  selectActiveCompanyId, 
  selectActiveScope 
} from '../../store/selectors';
import { 
  setActiveCompanyId, 
  setActiveScope 
} from '../../store/slices/settingsSlice';

const CompanySwitcher = () => {
  const dispatch = useDispatch();
  const companies = useSelector(selectCompanies);
  const activeCompanyId = useSelector(selectActiveCompanyId);
  const activeScope = useSelector(selectActiveScope);
  const [isOpen, setIsOpen] = useState(false);

  const activeCompany = companies?.find(c => c?.id === activeCompanyId);

  const handleScopeChange = (scope, companyId = null) => {
    dispatch(setActiveScope(scope));
    if (companyId) {
      dispatch(setActiveCompanyId(companyId));
    }
    setIsOpen(false);
  };

  const getDisplayName = () => {
    if (activeScope === 'global') {
      return 'Carteira Global';
    }
    return activeCompany?.nomeFantasia || 'Selecione uma empresa';
  };

  const getDisplayIcon = () => {
    return activeScope === 'global' ? Globe : Building2;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          {React.createElement(getDisplayIcon(), { 
            size: 16, 
            className: activeScope === 'global' ? 'text-blue-600' : 'text-primary' 
          })}
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-foreground">
            {getDisplayName()}
          </div>
          <div className="text-xs text-muted-foreground">
            {activeScope === 'global' 
              ? `${companies?.filter(c => c?.active)?.length} empresas` 
              : activeCompany?.cnpj || 'CNPJ não informado'
            }
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-pronounced z-50">
            <div className="p-2">
              {/* Global Wallet Option */}
              <button
                onClick={() => handleScopeChange('global')}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left hover:bg-muted transition-colors ${
                  activeScope === 'global' ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activeScope === 'global' ? 'bg-blue-500/20' : 'bg-muted'
                }`}>
                  <Globe className="w-5 h-5" color={activeScope === 'global' ? '#2563eb' : 'currentColor'} />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Carteira Global</div>
                  <div className="text-sm text-muted-foreground">
                    Visão consolidada de todas as empresas
                  </div>
                </div>
                {activeScope === 'global' && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
              </button>

              {/* Separator */}
              <div className="my-2 border-t border-border" />

              {/* Individual Companies */}
              <div className="space-y-1">
                {companies?.filter(c => c?.active)?.map((company) => (
                  <button
                    key={company?.id}
                    onClick={() => handleScopeChange('company', company?.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left hover:bg-muted transition-colors ${
                      activeScope === 'company' && activeCompanyId === company?.id ?'bg-primary/10 text-primary' :'text-foreground'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activeScope === 'company' && activeCompanyId === company?.id ?'bg-primary/20' :'bg-muted'
                    }`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{company?.nomeFantasia}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {company?.cnpj}
                      </div>
                    </div>
                    {activeScope === 'company' && activeCompanyId === company?.id && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {companies?.filter(c => c?.active)?.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhuma empresa ativa encontrada
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CompanySwitcher;