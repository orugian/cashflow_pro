import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ReportHistory = ({ isVisible, onToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock report history data
  const reportHistory = [
    {
      id: '1',
      name: 'Fluxo de Caixa Mensal - Julho 2025',
      type: 'monthly-cashflow',
      format: 'pdf',
      generatedAt: '2025-08-01T10:30:00Z',
      generatedBy: 'Maria Silva Santos',
      size: '2.4 MB',
      downloads: 3,
      shared: true,
      status: 'completed'
    },
    {
      id: '2',
      name: 'DRE Trimestral - Q2 2025',
      type: 'dre-quarterly',
      format: 'xlsx',
      generatedAt: '2025-07-15T14:20:00Z',
      generatedBy: 'João Oliveira',
      size: '1.8 MB',
      downloads: 7,
      shared: false,
      status: 'completed'
    },
    {
      id: '3',
      name: 'Análise por Categoria - Junho 2025',
      type: 'category-breakdown',
      format: 'pdf',
      generatedAt: '2025-07-01T09:15:00Z',
      generatedBy: 'Maria Silva Santos',
      size: '3.1 MB',
      downloads: 2,
      shared: true,
      status: 'completed'
    },
    {
      id: '4',
      name: 'Relatório Contábil Mensal - Junho 2025',
      type: 'monthly-accounting',
      format: 'pdf',
      generatedAt: '2025-06-30T16:45:00Z',
      generatedBy: 'Sistema Automático',
      size: '4.2 MB',
      downloads: 12,
      shared: true,
      status: 'completed'
    },
    {
      id: '5',
      name: 'Previsão de Receitas - H2 2025',
      type: 'revenue-forecast',
      format: 'xlsx',
      generatedAt: '2025-06-15T11:30:00Z',
      generatedBy: 'Maria Silva Santos',
      size: '1.5 MB',
      downloads: 5,
      shared: false,
      status: 'completed'
    }
  ];

  const getTypeLabel = (type) => {
    const typeMap = {
      'monthly-cashflow': 'Fluxo de Caixa Mensal',
      'dre-quarterly': 'DRE Trimestral',
      'category-breakdown': 'Análise por Categoria',
      'monthly-accounting': 'Contábil Mensal',
      'revenue-forecast': 'Previsão de Receitas'
    };
    return typeMap?.[type] || type;
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'pdf':
        return 'FileText';
      case 'xlsx':
        return 'FileSpreadsheet';
      case 'csv':
        return 'Database';
      default:
        return 'File';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReports = reportHistory?.filter(report => {
    const matchesSearch = report?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         getTypeLabel(report?.type)?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesFilter = filterType === 'all' || report?.format === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (reportId) => {
    console.log('Downloading report:', reportId);
    // Implement download logic
  };

  const handleShare = (reportId) => {
    console.log('Sharing report:', reportId);
    // Implement share logic
  };

  const handleDelete = (reportId) => {
    console.log('Deleting report:', reportId);
    // Implement delete logic
  };

  if (!isVisible) return null;

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Histórico de Relatórios
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredReports?.length} relatório{filteredReports?.length !== 1 ? 's' : ''} encontrado{filteredReports?.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <Button
          variant="ghost"
          iconName="X"
          onClick={onToggle}
        />
      </div>
      {/* Search and Filter */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Buscar relatórios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Todos os formatos</option>
              <option value="pdf">PDF</option>
              <option value="xlsx">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>
      </div>
      {/* Reports List */}
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {filteredReports?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Search" size={32} color="var(--color-muted-foreground)" />
            <h4 className="text-sm font-medium text-foreground mt-2">
              Nenhum relatório encontrado
            </h4>
            <p className="text-xs text-muted-foreground">
              Tente ajustar os filtros de busca
            </p>
          </div>
        ) : (
          filteredReports?.map((report) => (
            <div key={report?.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  {/* File Icon */}
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon 
                      name={getFormatIcon(report?.format)} 
                      size={20} 
                      color="var(--color-primary)" 
                    />
                  </div>

                  {/* Report Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {report?.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {getTypeLabel(report?.type)} • {report?.format?.toUpperCase()}
                    </p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>Gerado em {formatDate(report?.generatedAt)}</span>
                      <span>por {report?.generatedBy}</span>
                      <span>{report?.size}</span>
                    </div>

                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Icon name="Download" size={12} />
                        <span>{report?.downloads} download{report?.downloads !== 1 ? 's' : ''}</span>
                      </div>
                      
                      {report?.shared && (
                        <div className="flex items-center space-x-1 text-xs text-success">
                          <Icon name="Share" size={12} />
                          <span>Compartilhado</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 ml-4">
                  <button
                    onClick={() => handleDownload(report?.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Baixar"
                  >
                    <Icon name="Download" size={16} color="var(--color-text-secondary)" />
                  </button>
                  
                  <button
                    onClick={() => handleShare(report?.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Compartilhar"
                  >
                    <Icon name="Share" size={16} color="var(--color-text-secondary)" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(report?.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors text-error hover:bg-error/10"
                    title="Excluir"
                  >
                    <Icon name="Trash2" size={16} color="var(--color-error)" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Relatórios mantidos por 90+ dias</span>
          <Button
            variant="ghost"
            size="sm"
            iconName="Trash2"
            iconPosition="left"
            onClick={() => console.log('Clear old reports')}
          >
            Limpar Antigos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportHistory;