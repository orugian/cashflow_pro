import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    {
      id: 'new-expense',
      label: 'Nova Despesa',
      icon: 'Minus',
      color: 'bg-error text-error-foreground',
      action: () => {
        console.log('Open new expense form');
        setIsOpen(false);
      }
    },
    {
      id: 'new-income',
      label: 'Nova Receita',
      icon: 'Plus',
      color: 'bg-success text-success-foreground',
      action: () => {
        console.log('Open new income form');
        setIsOpen(false);
      }
    },
    {
      id: 'new-transfer',
      label: 'Transferência',
      icon: 'ArrowLeftRight',
      color: 'bg-primary text-primary-foreground',
      action: () => {
        console.log('Open new transfer form');
        setIsOpen(false);
      }
    },
    {
      id: 'quick-payment',
      label: 'Pagamento Rápido',
      icon: 'CreditCard',
      color: 'bg-warning text-warning-foreground',
      action: () => {
        console.log('Open quick payment form');
        setIsOpen(false);
      }
    }
  ];

  const handleMainButtonClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-100">
      {/* Quick Actions Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3 mb-2">
          {quickActions?.map((action, index) => (
            <div
              key={action?.id}
              className="flex items-center space-x-3 animate-in slide-in-from-bottom-2 duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Action Label */}
              <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-pronounced">
                <span className="text-sm font-medium text-popover-foreground whitespace-nowrap">
                  {action?.label}
                </span>
              </div>
              
              {/* Action Button */}
              <button
                onClick={action?.action}
                className={`
                  w-12 h-12 rounded-full shadow-pronounced
                  transition-all duration-200 ease-smooth hover-elevation
                  ${action?.color}
                  hover:scale-110 active:scale-95
                `}
              >
                <Icon 
                  name={action?.icon} 
                  size={20} 
                  color="currentColor" 
                />
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/20 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      {/* Main Action Button */}
      <button
        onClick={handleMainButtonClick}
        className={`
          w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-pronounced
          transition-all duration-200 ease-smooth hover-elevation
          hover:scale-110 active:scale-95
          ${isOpen ? 'rotate-45' : 'rotate-0'}
        `}
      >
        <Icon 
          name="Plus" 
          size={24} 
          color="currentColor" 
        />
      </button>
    </div>
  );
};

export default QuickActionButton;