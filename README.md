# CashFlow Pro

Um sistema avançado de gestão financeira empresarial construído com React e Redux Toolkit, oferecendo controle completo sobre fluxo de caixa, transações e análises financeiras.

## Características Principais

- **Gestão Multi-empresa**: Suporte completo para múltiplas empresas com alternância entre visões individuais e consolidada (Carteira Global)
- **Persistência Local-First**: Dados salvos automaticamente no localStorage com versionamento e migrações
- **Controle de Permissões**: Sistema robusto de usuários com roles (admin/viewer) e permissões granulares
- **Dashboard Analítico**: KPIs em tempo real, projeções de saldo e alertas inteligentes
- **Gestão Completa de Transações**: Entradas, saídas, transferências e conciliação bancária
- **Sistema de Orçamentos**: Controle orçamentário com alertas de desvio
- **Relatórios e Exportação**: Exportação em múltiplos formatos com histórico de backups

## Tecnologias Utilizadas

### Core
- **React 18.2.0** - Biblioteca principal para interfaces
- **Redux Toolkit 2.6.1** - Gerenciamento de estado robusto e performático
- **React Redux 9.2.0** - Bindings oficiais Redux para React
- **Vite 5.0.0** - Build tool e dev server ultra-rápido

### UI & Styling
- **Tailwind CSS 3.4.6** - Framework CSS utility-first
- **Framer Motion 10.16.4** - Animações fluidas e interações
- **Lucide React 0.484.0** - Ícones SVG modernos e consistentes
- **Recharts 2.15.2** - Gráficos e visualizações de dados

### Funcionalidades
- **date-fns 4.1.0** - Manipulação de datas com localização brasileira
- **React Hook Form 7.55.0** - Formulários performáticos com validação
- **React Router DOM 6.0.2** - Roteamento client-side

## Arquitetura Redux

### Estrutura de Slices

```
src/store/
├── store.js              # Configuração principal do store
├── persistence.js        # Gerenciamento de localStorage e migrações
├── seed.js              # Dados iniciais e mock data
├── selectors.js         # Seletores memoizados para performance
└── slices/
    ├── companiesSlice.js      # Gestão de empresas
    ├── accountsSlice.js       # Contas bancárias
    ├── categoriesSlice.js     # Categorias de receitas/despesas
    ├── vendorsCustomersSlice.js # Fornecedores e clientes
    ├── costCentersSlice.js    # Centros de custo
    ├── transactionsSlice.js   # Transações financeiras
    ├── budgetsSlice.js        # Orçamentos
    ├── settingsSlice.js       # Configurações globais
    ├── usersSlice.js          # Usuários e permissões
    └── alertsSlice.js         # Sistema de alertas
```

### Persistência & Backups

#### Versionamento de Dados
- **Versão Atual**: `cfp:v1`
- **Migrações Automáticas**: Sistema de migrations para compatibilidade entre versões
- **Backup Multi-nível**: Global, por empresa e dados essenciais

#### Funcionalidades de Persistência
- **Auto-save**: Debounced (500ms) com requestIdleCallback para performance
- **Cross-tab Sync**: Sincronização automática entre abas do navegador
- **Recovery**: Sistema robusto de recuperação em caso de falhas
- **Export/Import**: JSON estruturado com validação de integridade

### Global Wallet (Carteira Global)

Sistema de consolidação multi-empresa:

```javascript
// Seletores para visão consolidada
selectScopedCompanies()    // Empresas ativas no escopo atual
selectScopedAccounts()     // Contas do escopo (individual/global)
selectScopedTransactions() // Transações filtradas por escopo
selectConsolidatedKPIs()   // KPIs consolidados (exclui transfers)
```

### Memoização e Performance

Utilização extensiva de `createSelector` do Redux Toolkit para:
- **Cálculos de KPI** memoizados por dependências
- **Filtros complexos** com cache automático
- **Agregações** otimizadas para grandes volumes de dados
- **Seletores derivados** para evitar re-renders desnecessários

## Sistema de Transações

### Tipos Suportados
- **Entradas** (`entry`): Receitas e recebimentos
- **Saídas** (`exit`): Despesas e pagamentos  
- **Transferências** (`transfer`): Movimentação entre contas (par de transações linkadas)

### Estados do Fluxo
- **Planejado** (`planned`): Transação futura agendada
- **Confirmado** (`confirmed`): Transação aprovada, pendente de pagamento
- **Pago** (`paid`): Transação executada com atualização de saldo
- **Parcial** (`partially-paid`): Pagamento parcial com saldo remanescente
- **Atrasado** (`overdue`): Vencimento ultrapassado sem pagamento
- **Cancelado** (`canceled`): Transação cancelada

### Business Logic
- **Ajuste Automático**: Datas ajustadas para dias úteis (exclui feriados brasileiros)
- **Conciliação Bancária**: Matching automático com extratos
- **Auditoria Completa**: Trilha de modificações com usuário e timestamp
- **Recorrência** (planned): Sistema para transações recorrentes

## Sistema de Permissões

### Roles
- **Admin**: Acesso completo a todas as funcionalidades
- **Viewer**: Apenas visualização com permissões para export e anexos

### Permissões Granulares
```javascript
{
  canViewReports: true,
  canExportData: true,
  canViewBudgets: true, 
  canViewAnalytics: true,
  canViewSettings: false,
  canManageCategories: false,
  canManageVendors: false,
  canManageCustomers: false,
  canViewAttachments: true,
}
```

### Proteção de Actions
- **Middleware**: Validação de permissões em todas as mutations
- **UI Guards**: Componentes condicionais baseados em `selectCanEdit`
- **Bulk Operations**: Proteção em operações em lote

## Alertas Inteligentes

Sistema automatizado de alertas baseado em regras:

### Tipos de Alerta
- **Saldo Negativo**: Projeções de saldo negativo em 7 dias
- **Pagamentos Atrasados**: Transações vencidas não pagas
- **Orçamento Excedido**: Categorias acima do threshold configurado
- **Baixo Saldo**: Contas próximas ao limite mínimo

### Configuração
- **Severidade**: High, Medium, Low com cores e priorização
- **Auto-dismiss**: Alertas que se resolvem automaticamente
- **Notificações**: Suporte para email, WhatsApp e webhooks (configurável)

## Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd cashflow-pro

# Instale dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

### Scripts Disponíveis
```bash
npm start    # Servidor de desenvolvimento (Vite)
npm build    # Build de produção
npm serve    # Preview do build de produção
```

### Estrutura de Desenvolvimento
```
src/
├── components/          # Componentes reutilizáveis
│   └── ui/             # Componentes de interface
├── pages/              # Páginas da aplicação
│   ├── overview-dashboard/
│   ├── transaction-management/
│   ├── analytics-forecasting/
│   ├── reports-center/
│   └── company-account-settings/
├── store/              # Redux store e slices
├── utils/              # Utilitários e helpers
└── styles/             # Estilos globais
```

## Persistência & Backups

### Configuração Automática
- **Auto-save**: Ativado por padrão com debounce de 500ms
- **Validação**: Verificação de integridade em cada operação de salvamento
- **Recovery**: Dados essenciais como fallback em caso de corrupção

### Backup Manual
```javascript
// Export de dados por empresa
const exportData = (companyId) => dispatch(exportData(companyId));

// Import com validação
const importData = (jsonData) => dispatch(importData(jsonData));

// Limpar storage (desenvolvimento)
clearStorageData();
```

### Resetar Storage (Desenvolvimento)
Para resetar completamente os dados durante desenvolvimento:
```javascript
// No console do navegador
localStorage.clear();
// ou especificamente
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('cfp:')) localStorage.removeItem(key);
});
```

## Roadmap

### Próximas Funcionalidades
- [ ] **Recorrência Automática**: Geração automática de transações recorrentes
- [ ] **Anexos Reais**: Upload e gestão de comprovantes
- [ ] **Relatórios PDF/XLSX**: Exportação avançada além do JSON atual
- [ ] **API Integration**: Conectores para bancos e sistemas contábeis
- [ ] **Mobile PWA**: Progressive Web App para dispositivos móveis
- [ ] **Multi-currency**: Suporte a múltiplas moedas
- [ ] **Advanced Analytics**: ML para previsões e insights

### Melhorias de Performance
- [ ] **Virtual Scrolling**: Para tabelas com grandes volumes de dados  
- [ ] **Service Workers**: Cache inteligente e sincronização offline
- [ ] **Lazy Loading**: Carregamento sob demanda de componentes pesados
- [ ] **Database Integration**: Migração para banco de dados real (opcional)

## Contribuição

### Padrões de Código
- **ESLint**: Configuração React/TypeScript
- **Prettier**: Formatação automática
- **Conventional Commits**: Padrão de mensagens de commit
- **Component Structure**: Functional components com hooks

### Guidelines
1. **Redux**: Sempre use selectors para acessar o state
2. **Memoization**: Prefira `createSelector` para computações complexas  
3. **Optional Chaining**: Obrigatório para propriedades aninhadas (`data?.property?.nested`)
4. **Error Handling**: Try-catch em todas as operações assíncronas
5. **Accessibility**: Componentes devem suportar navegação por teclado

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**CashFlow Pro** - Sistema completo de gestão financeira com persistência local, multi-empresa e controle avançado de permissões. Construído para escalar desde pequenas empresas até operações multi-corporativas complexas.