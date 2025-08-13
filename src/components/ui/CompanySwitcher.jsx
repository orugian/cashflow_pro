import React, { useState } from 'react';
import { ChevronDown, Building2, Globe, Plus } from 'lucide-react';
import useStore from '../../state/store';

const CompanySwitcher = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const { 
    companies, 
    currentCompanyId, 
    globalView,
    setCurrentCompany, 
    toggleGlobalView,
    canPerformAction
  } = useStore();
  
  const currentCompany = companies?.find(c => c?.id === currentCompanyId);
  
  const handleCompanySelect = (companyId) => {
    setCurrentCompany(companyId);
    setIsOpen(false);
  };
  
  const handleGlobalViewToggle = () => {
    toggleGlobalView();
    setIsOpen(false);
  };
  
  const handleAddCompany = () => {
    // This would trigger a modal or navigation to add company form
    setIsOpen(false);
    // For now, just log
    console.log('Add new company functionality');
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg
          bg-card border border-border
          text-foreground text-sm font-medium
          hover:bg-muted transition-colors
          focus:outline-none focus:ring-2 focus:ring-ring
          min-w-[180px] justify-between
        `}
      >
        <div className="flex items-center space-x-2">
          {globalView ? (
            <>
              <Globe className="h-4 w-4 text-primary" />
              <span>Carteira Global</span>
            </>
          ) : currentCompany ? (
            <>
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div className="text-left">
                <div className="text-sm font-medium">{currentCompany?.nomeFantasia}</div>
                <div className="text-xs text-muted-foreground">
                  {currentCompany?.cnpj?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')}
                </div>
              </div>
            </>
          ) : (
            <>
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>Selecionar Empresa</span>
            </>
          )}
        </div>
        <ChevronDown 
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-[280px] z-50">
          <div className="bg-popover border border-border rounded-lg shadow-lg">
            {/* Global View Option */}
            <button
              onClick={handleGlobalViewToggle}
              className={`
                w-full flex items-center space-x-2 px-3 py-2 text-left
                hover:bg-muted transition-colors
                ${globalView ? 'bg-primary/10 text-primary' : 'text-popover-foreground'}
                border-b border-border
              `}
            >
              <Globe className="h-4 w-4" />
              <div>
                <div className="font-medium">Carteira Global</div>
                <div className="text-xs text-muted-foreground">
                  Visão consolidada de todas as empresas
                </div>
              </div>
            </button>
            
            {/* Company List */}
            <div className="py-1">
              {companies?.filter(c => c?.active)?.map((company) => (
                <button
                  key={company?.id}
                  onClick={() => handleCompanySelect(company?.id)}
                  className={`
                    w-full flex items-center space-x-2 px-3 py-2 text-left
                    hover:bg-muted transition-colors
                    ${currentCompanyId === company?.id && !globalView ? 
                      'bg-primary/10 text-primary' : 'text-popover-foreground'}
                  `}
                >
                  <Building2 className="h-4 w-4" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{company?.nomeFantasia}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {company?.razaoSocial}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {company?.cnpj?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Add Company Option */}
            {canPerformAction('create') && (
              <div className="border-t border-border pt-1">
                <button
                  onClick={handleAddCompany}
                  className="
                    w-full flex items-center space-x-2 px-3 py-2 text-left
                    hover:bg-muted transition-colors
                    text-muted-foreground hover:text-foreground
                  "
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm">Adicionar Empresa</span>
                </button>
              </div>
            )}
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

export default CompanySwitcher;