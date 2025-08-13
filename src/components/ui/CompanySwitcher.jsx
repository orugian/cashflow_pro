import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const CompanySwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const dropdownRef = useRef(null);

  // Mock company data - in real app this would come from context/API
  const companies = [
    {
      id: '1',
      name: 'Tech Solutions Ltda',
      cnpj: '12.345.678/0001-90',
      status: 'active',
      role: 'admin'
    },
    {
      id: '2',
      name: 'Consultoria Digital ME',
      cnpj: '98.765.432/0001-10',
      status: 'active',
      role: 'viewer'
    },
    {
      id: '3',
      name: 'Inovação Empresarial SA',
      cnpj: '11.222.333/0001-44',
      status: 'pending',
      role: 'admin'
    }
  ];

  // Set default selected company
  useEffect(() => {
    if (!selectedCompany && companies?.length > 0) {
      setSelectedCompany(companies?.[0]);
    }
  }, [selectedCompany, companies]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setIsOpen(false);
    // In real app, this would update global context and trigger data refresh
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      case 'inactive':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'pending':
        return 'Pendente';
      case 'inactive':
        return 'Inativa';
      default:
        return 'Desconhecido';
    }
  };

  if (!selectedCompany) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
        <div className="w-4 h-4 bg-muted-foreground/20 rounded animate-pulse"></div>
        <div className="w-32 h-4 bg-muted-foreground/20 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-3 px-3 py-2 rounded-lg
          transition-all duration-200 ease-smooth
          hover:bg-muted hover-elevation
          ${isOpen ? 'bg-muted shadow-medium' : 'bg-transparent'}
          border border-transparent hover:border-border
        `}
      >
        {/* Company Avatar */}
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Building2" size={16} color="var(--color-primary)" />
        </div>

        {/* Company Info */}
        <div className="flex flex-col items-start min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm text-foreground truncate max-w-32">
              {selectedCompany?.name}
            </span>
            <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedCompany?.status)?.replace('text-', 'bg-')}`}></div>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {selectedCompany?.cnpj}
          </span>
        </div>

        {/* Dropdown Arrow */}
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          color="var(--color-text-secondary)" 
          className="transition-transform duration-200"
        />
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="
          absolute top-full left-0 mt-2 w-80
          bg-popover border border-border rounded-lg shadow-pronounced
          py-2 z-200
          max-h-96 overflow-y-auto
        ">
          {/* Header */}
          <div className="px-4 py-2 border-b border-border">
            <h3 className="font-medium text-sm text-popover-foreground">
              Selecionar Empresa
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {companies?.length} empresa{companies?.length !== 1 ? 's' : ''} disponível{companies?.length !== 1 ? 'is' : ''}
            </p>
          </div>

          {/* Company List */}
          <div className="py-2">
            {companies?.map((company) => {
              const isSelected = selectedCompany?.id === company?.id;
              
              return (
                <button
                  key={company?.id}
                  onClick={() => handleCompanySelect(company)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3
                    transition-colors duration-200
                    hover:bg-muted
                    ${isSelected ? 'bg-primary/5 border-r-2 border-r-primary' : ''}
                  `}
                >
                  {/* Company Avatar */}
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                  `}>
                    <Icon 
                      name="Building2" 
                      size={18} 
                      color={isSelected ? 'currentColor' : 'var(--color-text-secondary)'} 
                    />
                  </div>
                  {/* Company Details */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center space-x-2">
                      <span className={`
                        font-medium text-sm truncate
                        ${isSelected ? 'text-primary' : 'text-popover-foreground'}
                      `}>
                        {company?.name}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(company?.status)?.replace('text-', 'bg-')}`}></div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground font-mono">
                        {company?.cnpj}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
                        {company?.role === 'admin' ? 'Admin' : 'Visualizador'}
                      </span>
                    </div>
                    
                    <span className={`text-xs ${getStatusColor(company?.status)}`}>
                      {getStatusLabel(company?.status)}
                    </span>
                  </div>
                  {/* Selected Indicator */}
                  {isSelected && (
                    <Icon name="Check" size={16} color="var(--color-primary)" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border">
            <button className="
              w-full flex items-center justify-center space-x-2 px-3 py-2
              text-sm text-primary hover:text-primary/80
              transition-colors duration-200
            ">
              <Icon name="Plus" size={16} />
              <span>Adicionar Nova Empresa</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySwitcher;