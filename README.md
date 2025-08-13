# Cashflow Pro - Sistema de Gestão Financeira

Sistema completo de gestão financeira para pequenas e médias empresas, desenvolvido em React com foco na experiência do usuário e robustez operacional.

## 🚀 Características Principais

### Multi-Empresas & Carteira Global
- **Suporte a múltiplas empresas** com 2 CNPJs configurados por padrão
- **Carteira Global** para visão consolidada de todas as empresas
- **Permissões granulares** entre Administrador e Visualizador
- **Switching dinâmico** entre empresas sem recarregar a página

### Estado Global com Zustand
- **Gerenciamento de estado eficiente** com Zustand
- **Persistência localStorage** com versionamento e migrações automáticas
- **Seletores otimizados** para performance
- **Sincronização reativa** entre componentes

### Sistema Financeiro Avançado
- **Engine de recorrência** com suporte a feriados brasileiros
- **Transferências entre contas** com controles de integridade
- **Sistema de orçamentos** com alertas de estouro
- **Reconciliação bancária** (simulada)
- **Múltiplos status** de transações (planejado, confirmado, pago, atrasado, etc.)

### Relatórios e Exportação
- **Exportação PDF** com gráficos e tabelas formatadas
- **Exportação Excel/CSV** com múltiplas abas
- **DRE simplificado** (visão caixa)
- **Agendamento de relatórios** com histórico
- **Previsões financeiras** até 10 anos

### UX/UI e Acessibilidade
- **Tema claro/escuro** com transições suaves
- **Paleta de cores personalizável** com validação de contraste
- **Densidade ajustável** (compacto/confortável)
- **Acessibilidade WCAG AAA** (alto contraste, texto grande, reduced motion)
- **Virtualização de listas** para performance

## 🛠️ Tecnologias

- **React 18.2** com Hooks funcionais
- **Vite** para build e desenvolvimento
- **Tailwind CSS 3.x** com design system personalizado
- **Zustand** para gerenciamento de estado
- **Zod** para validação de dados
- **date-fns** para manipulação de datas
- **Recharts** para visualizações
- **jsPDF + jsPDF-autotable** para geração de PDFs
- **xlsx** para exportação Excel
- **react-window** para virtualização
- **Lucide React** para ícones

## 📁 Estrutura do Projeto

```
src/
├── state/                    # Gerenciamento de Estado
│   ├── store.js             # Store principal Zustand
│   ├── types.js             # Definições de tipos (JSDoc)
│   ├── seed.js              # Dados iniciais (2 empresas + transações)
│   └── persistence.js       # Persistência localStorage com migrações
├── utils/                    # Utilitários
│   ├── validation.js        # Validação Zod + formatadores
│   ├── brazilian-holidays.js # Feriados brasileiros + dias úteis
│   ├── theme-manager.js     # Gerenciamento de temas e acessibilidade
│   └── export-utils.js      # Exportação PDF/Excel/CSV
├── components/ui/            # Componentes UI base
│   ├── CompanySwitcher.jsx  # Seletor de empresas + Carteira Global
│   ├── AlertsIndicator.jsx  # Indicador de alertas no header
│   └── UserProfileMenu.jsx  # Menu do perfil do usuário
├── pages/                    # Páginas da aplicação
│   ├── overview-dashboard/   # Dashboard principal
│   ├── transaction-management/ # Gestão de transações
│   ├── analytics-forecasting/ # Analytics e previsões
│   ├── company-account-settings/ # Configurações completas
│   └── reports-center/       # Centro de relatórios
└── styles/                   # Estilos globais
    └── tailwind.css         # Tema com tokens CSS customizáveis
```

## 🏃‍♂️ Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd cashflow-pro
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o ambiente de desenvolvimento**
```bash
npm start
```

4. **Acesse a aplicação**
```
http://localhost:3000
```

### Build para Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run serve
```

## 💾 Dados e Persistência

### Dados Iniciais
O sistema inicializa com:
- **2 Empresas**: TechSol (CNPJ: 12.345.678/0001-90) e ConsBrasil (CNPJ: 98.765.432/0001-10)
- **3 Contas Bancárias**: BB e Itaú para TechSol, Santander para ConsBrasil
- **30+ Transações** distribuídas nos últimos 90 dias
- **Categorias SEBRAE** pré-configuradas
- **2 Usuários**: Admin e Visualizador

### Local Storage
Os dados são persistidos em `localStorage` com as seguintes chaves:
- `cashflow_app_global` - Dados completos do sistema
- `cashflow_app_company-1` - Backup da empresa 1
- `cashflow_app_company-2` - Backup da empresa 2
- `cashflow_theme` - Preferências de tema
- `cashflow_colors` - Paleta de cores customizada
- `cashflow_accessibility` - Configurações de acessibilidade

### Backup e Restore
- **Backup automático** a cada alteração
- **Exportação JSON** por empresa ou global
- **Importação JSON** com validação de estrutura
- **Versionamento** com migrações automáticas

## 🎨 Configurações e Personalizações

### Sistema de Temas
- **3 modos**: Claro, Escuro, Automático (segue sistema)
- **Cores personalizáveis**: Primary, Secondary, Accent, Success, Warning, Error
- **Validação de contraste** WCAG AAA automática
- **Densidade de UI**: Compacto ou Confortável

### Acessibilidade
- **Alto contraste** para usuários com deficiência visual
- **Texto grande** para melhor legibilidade
- **Reduced motion** para usuários sensíveis a animações
- **Focus indicators** visíveis para navegação por teclado
- **ARIA labels** em todos os elementos interativos

### Configurações Disponíveis

#### 1. Perfil da Empresa
- CNPJ, Razão Social, Nome Fantasia
- Endereço completo, E-mail, Telefone
- Upload de logotipo (base64)

#### 2. Contas Bancárias
- CRUD completo de contas
- Metas de saldo com indicadores visuais
- Flags PIX/Boleto/Reconciliação

#### 3. Categorias e Taxonomia
- Árvore hierárquica editável
- Presets SEBRAE/Contábil
- Busca e filtros avançados
- Arquivamento (soft delete)

#### 4. Usuários e Permissões
- Roles: Administrador e Visualizador
- Matrix de permissões extensíveis para visualizador
- Auditoria de último login
- Controles de acesso granulares

#### 5. Preferências do Sistema
- **Tema**: Claro/Escuro/Automático
- **Paleta de cores** editável
- **Densidade**: Compacto/Confortável
- **Idioma**: PT-BR (configurável para futuras expansões)
- **Notificações**: E-mail, WhatsApp (webhook n8n)
- **Acessibilidade**: Alto contraste, texto grande, reduced motion
- **Backup & Restore**: Exportar/Importar JSON

## 💰 Funcionalidades Financeiras

### Transações
- **CRUD completo** com validação Zod
- **Engine de recorrência**: diário, semanal, mensal, trimestral, semestral, anual
- **Feriados brasileiros**: Automove vencimentos para próximo dia útil
- **Status granulares**: Planejado, Confirmado, Pago, Atrasado, Cancelado, Parcialmente Pago
- **Transferências**: Cria 2 lançamentos vinculados automaticamente
- **Anexos**: Até 10MB por arquivo (base64 storage)
- **Reconciliação**: Marca como reconciliado quando pago
- **Importação**: Modal para colar dados CSV-like

### Orçamentos
- **Orçamento por categoria e mês**
- **Valores fixos ou crescimento variável**
- **Alertas de estouro** configuráveis (%)
- **Comparação realizado vs planejado**

### KPIs e Dashboard
- **Saldo Bruto** consolidado por conta
- **Entradas vs Saídas** (mês/período customizável)
- **Fluxo de Caixa Líquido**
- **Runway** (quantos meses de operação)
- **Taxa de Queima** (burn rate)
- **Top 5 Categorias e Fornecedores**
- **Aderência Orçamento vs Realizado**
- **Carteira Global**: Soma todas as empresas

### Tax KPI - Simples Nacional
- **Regime configurável**: Simples Nacional Anexo IV padrão
- **Cálculo automático**: 17,55% sobre faturamento do mês anterior
- **Data de vencimento**: Fim do mês
- **Editável** para regimes personalizados

### Previsões e Alertas
- **3 Modos de Previsão**:
  1. **Determinístico**: Recorrentes + planejados
  2. **Histórico**: Média móvel com sazonalidade (12 meses)
  3. **Premissas**: Crescimento % por categoria
- **Horizonte**: 6m, 12m, 24m, 5y, **10y**
- **Alertas Proativos**:
  - Saldo projetado negativo em X dias (padrão 7)
  - Vencimentos próximos/atrasados
  - Orçamento estourado
  - Metas atingidas

### Centro de Relatórios
- **Exportação PDF**: Com logotipo, gráficos e tabelas formatadas
- **Exportação Excel**: Múltiplas abas (transações, contas, categorias, DRE, previsão)
- **DRE Gerencial**: Visão caixa simplificada
- **Agendamento**: Daily/Weekly/Monthly/Quarterly/Yearly
- **Histórico**: Re-download de relatórios anteriores
- **Destinatários**: Lista de e-mails (integração n8n webhook)

## 🔒 Segurança e Permissões

### Controle de Acesso
- **Role-based access control** (RBAC)
- **Administrador**: Acesso total
- **Visualizador**: Somente leitura + extensões opcionais
- **Extensões para Visualizador**:
  - Exportação de dados
  - Gestão de categorias
  - Gestão de fornecedores/clientes
- **NUNCA permite**: Criar/Editar/Excluir para visualizador

### Auditoria
- **Audit trail** em transações (createdBy, updatedBy)
- **Registro de último login**
- **Histórico de alterações** (futuro)

## 📊 Performance e UX

### Otimizações
- **Virtualização de tabelas** (react-window) para +200 itens
- **Debounce** (250ms) em filtros de busca
- **Memoização** de seletores Zustand
- **Code splitting** por rota
- **Lazy loading** de componentes pesados

### Experiência do Usuário
- **Kinvo-style UX** mantido
- **Micro-feedbacks** em interações
- **Loading states** em operações assíncronas
- **Toast notifications** para ações
- **Drill-downs** clicáveis nos KPIs
- **Filtros persistentes** por usuário

## 🌐 Futuras Integrações

### Preparado para:
- **API Backend** (estrutura de estado compatível)
- **Notificações Reais**: E-mail via webhook n8n
- **Open Banking**: Integração bancária real
- **Multi-idiomas**: i18n structure ready
- **PWA**: Service worker e offline capability

## 📋 Validação e Testes

### Critérios de Aceitação ✅

1. **Seed carrega** com 2 CNPJs, 3 contas, 30 transações
2. **Company switching** atualiza todas as páginas
3. **Carteira Global** soma dados de ambas as empresas  
4. **Permissões funcionam**: Viewer = read-only, Admin = full CRUD
5. **Recorrência mensal** gera 12x com término por parcelas
6. **Feriados empurram** vencimentos para dias úteis
7. **Transferências** criam 2 lançamentos vinculados
8. **Dashboard** mostra todos os KPIs e drill-downs
9. **Tax KPI** calcula 17,55% do faturamento anterior
10. **Forecast 10 anos** alterna entre 3 modos
11. **Alertas** aparecem quando aplicáveis
12. **Relatórios** exportam PDF/Excel/CSV corretamente
13. **Agendamentos** salvam e persistem após reload
14. **Preferências** (tema/cores/densidade) persistem
15. **Backup/Restore** funciona completamente
16. **Tabelas grandes** permanecem suaves (virtualização)
17. **Filtros persistem** por usuário

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

## 📞 Suporte

Para dúvidas ou suporte:
- Abra uma [Issue](../../issues)
- Contate o time de desenvolvimento

---

**Desenvolvido com ❤️ para gestão financeira eficiente**