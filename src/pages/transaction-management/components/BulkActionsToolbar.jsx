import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsToolbar = ({ 
  selectedCount, 
  onBulkEdit, 
  onBulkCancel, 
  onBulkExport, 
  onBulkReconcile,
  onClearSelection 
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="CheckSquare" size={20} color="var(--color-primary)" />
          <span className="text-sm font-medium text-primary">
            {selectedCount} transação{selectedCount !== 1 ? 'ões' : ''} selecionada{selectedCount !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkEdit}
            iconName="Edit"
            iconSize={14}
          >
            Editar em Lote
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onBulkReconcile}
            iconName="Check"
            iconSize={14}
          >
            Reconciliar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onBulkExport}
            iconName="Download"
            iconSize={14}
          >
            Exportar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onBulkCancel}
            iconName="X"
            iconSize={14}
            className="text-error hover:text-error"
          >
            Cancelar
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconSize={14}
          >
            Limpar Seleção
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsToolbar;