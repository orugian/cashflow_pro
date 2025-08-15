import { format, subMonths, addDays, subDays } from 'date-fns';

// SEBRAE-like categories
const categories = [
  // Revenue Categories
  { id: 'cat-1', parentId: null, sebraeCode: 'REC001', name: 'Vendas de Produtos', kind: 'revenue', color: '#059669', icon: 'ShoppingCart', active: true },
  { id: 'cat-2', parentId: null, sebraeCode: 'REC002', name: 'Prestação de Serviços', kind: 'revenue', color: '#0891B2', icon: 'Briefcase', active: true },
  { id: 'cat-3', parentId: null, sebraeCode: 'REC003', name: 'Receitas Financeiras', kind: 'revenue', color: '#7C3AED', icon: 'TrendingUp', active: true },
  
  // Expense Categories - Administrative
  { id: 'cat-4', parentId: null, sebraeCode: 'ADM001', name: 'Despesas Administrativas', kind: 'expense', color: '#DC2626', icon: 'FileText', active: true },
  { id: 'cat-5', parentId: 'cat-4', sebraeCode: 'ADM002', name: 'Salários e Encargos', kind: 'expense', color: '#DC2626', icon: 'Users', active: true },
  { id: 'cat-6', parentId: 'cat-4', sebraeCode: 'ADM003', name: 'Aluguel', kind: 'expense', color: '#DC2626', icon: 'Home', active: true },
  { id: 'cat-7', parentId: 'cat-4', sebraeCode: 'ADM004', name: 'Energia Elétrica', kind: 'expense', color: '#DC2626', icon: 'Zap', active: true },
  { id: 'cat-8', parentId: 'cat-4', sebraeCode: 'ADM005', name: 'Telefone/Internet', kind: 'expense', color: '#DC2626', icon: 'Phone', active: true },
  
  // Expense Categories - Operational
  { id: 'cat-9', parentId: null, sebraeCode: 'OPE001', name: 'Despesas Operacionais', kind: 'expense', color: '#EA580C', icon: 'Settings', active: true },
  { id: 'cat-10', parentId: 'cat-9', sebraeCode: 'OPE002', name: 'Matéria Prima', kind: 'expense', color: '#EA580C', icon: 'Package', active: true },
  { id: 'cat-11', parentId: 'cat-9', sebraeCode: 'OPE003', name: 'Fornecedores', kind: 'expense', color: '#EA580C', icon: 'Truck', active: true },
  { id: 'cat-12', parentId: 'cat-9', sebraeCode: 'OPE004', name: 'Marketing', kind: 'expense', color: '#EA580C', icon: 'Megaphone', active: true },
  
  // Tax Categories
  { id: 'cat-13', parentId: null, sebraeCode: 'TAX001', name: 'Tributos', kind: 'tax', color: '#7C2D12', icon: 'Receipt', active: true },
  { id: 'cat-14', parentId: 'cat-13', sebraeCode: 'TAX002', name: 'Simples Nacional', kind: 'tax', color: '#7C2D12', icon: 'FileCheck', active: true },
  { id: 'cat-15', parentId: 'cat-13', sebraeCode: 'TAX003', name: 'FGTS', kind: 'tax', color: '#7C2D12', icon: 'Shield', active: true },
  { id: 'cat-16', parentId: 'cat-13', sebraeCode: 'TAX004', name: 'INSS', kind: 'tax', color: '#7C2D12', icon: 'Heart', active: true },
];

// Two companies data
const companies = [
  {
    id: 'company-1',
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Tech Solutions Ltda.',
    nomeFantasia: 'TechSol',
    endereco: 'Av. Paulista, 1000 - São Paulo, SP',
    email: 'contato@techsol.com.br',
    telefone: '(11) 3000-1000',
    logo: null,
    active: true,
    createdAt: subMonths(new Date(), 12),
    updatedAt: new Date(),
  },
  {
    id: 'company-2',
    cnpj: '98.765.432/0001-10',
    razaoSocial: 'Consultoria Brasil S.A.',
    nomeFantasia: 'ConsBrasil',
    endereco: 'Rua das Flores, 500 - Rio de Janeiro, RJ',
    email: 'financeiro@consbrasil.com.br',
    telefone: '(21) 2500-2000',
    logo: null,
    active: true,
    createdAt: subMonths(new Date(), 8),
    updatedAt: new Date(),
  }
];

// Three bank accounts total (2 for company-1, 1 for company-2)
const accounts = [
  {
    id: 'acc-1',
    companyId: 'company-1',
    bank: 'Banco do Brasil',
    branch: '0001',
    number: '12345-6',
    kind: 'corrente',
    currentBalance: 85420.50,
    targetBalance: 100000.00,
    status: 'active',
    pixEnabled: true,
    boletoEnabled: true,
    reconciliationEnabled: true,
    createdAt: subMonths(new Date(), 12),
    updatedAt: new Date(),
  },
  {
    id: 'acc-2',
    companyId: 'company-1',
    bank: 'Itaú',
    branch: '4521',
    number: '98765-4',
    kind: 'poupanca',
    currentBalance: 42030.25,
    targetBalance: 50000.00,
    status: 'active',
    pixEnabled: true,
    boletoEnabled: false,
    reconciliationEnabled: false,
    createdAt: subMonths(new Date(), 10),
    updatedAt: new Date(),
  },
  {
    id: 'acc-3',
    companyId: 'company-2',
    bank: 'Santander',
    branch: '3210',
    number: '54321-0',
    kind: 'corrente',
    currentBalance: 28965.75,
    targetBalance: 40000.00,
    status: 'active',
    pixEnabled: true,
    boletoEnabled: true,
    reconciliationEnabled: true,
    createdAt: subMonths(new Date(), 8),
    updatedAt: new Date(),
  }
];

// Vendors and customers
const vendors = [
  { id: 'vendor-1', companyId: 'company-1', name: 'Fornecedor Tech Ltda.', cnpjCpf: '11.222.333/0001-44', email: 'vendas@fornecedortech.com', phone: '(11) 4000-1000', address: 'Rua Tech, 100', active: true, createdAt: subMonths(new Date(), 6), updatedAt: new Date() },
  { id: 'vendor-2', companyId: 'company-1', name: 'Materiais Pro', cnpjCpf: '22.333.444/0001-55', email: 'contato@materiaispro.com', phone: '(11) 4000-2000', address: 'Av. Industrial, 200', active: true, createdAt: subMonths(new Date(), 5), updatedAt: new Date() },
  { id: 'vendor-3', companyId: 'company-2', name: 'Serviços Brasil', cnpjCpf: '33.444.555/0001-66', email: 'admin@servicosbrasil.com', phone: '(21) 5000-1000', address: 'Rua Serviços, 300', active: true, createdAt: subMonths(new Date(), 4), updatedAt: new Date() },
];

const customers = [
  { id: 'customer-1', companyId: 'company-1', name: 'Cliente Premium Ltda.', cnpjCpf: '44.555.666/0001-77', email: 'compras@clientepremium.com', phone: '(11) 6000-1000', address: 'Av. Premium, 400', active: true, createdAt: subMonths(new Date(), 6), updatedAt: new Date() },
  { id: 'customer-2', companyId: 'company-1', name: 'Empresa ABC', cnpjCpf: '55.666.777/0001-88', email: 'financeiro@empresaabc.com', phone: '(11) 6000-2000', address: 'Rua ABC, 500', active: true, createdAt: subMonths(new Date(), 5), updatedAt: new Date() },
  { id: 'customer-3', companyId: 'company-2', name: 'Corporação XYZ', cnpjCpf: '66.777.888/0001-99', email: 'pagamentos@corpxyz.com', phone: '(21) 7000-1000', address: 'Av. Corporativa, 600', active: true, createdAt: subMonths(new Date(), 4), updatedAt: new Date() },
];

// Generate ~30 transactions across both companies
const generateTransactions = () => {
  const transactions = [];
  const paymentMethods = ['pix', 'boleto', 'cartao', 'ted', 'cash'];
  const statuses = ['planned', 'confirmed', 'paid', 'overdue'];
  
  // Company 1 transactions
  for (let i = 1; i <= 20; i++) {
    const isRevenue = Math.random() > 0.6;
    const baseDate = subDays(new Date(), Math.floor(Math.random() * 90));
    
    transactions?.push({
      id: `trans-${i}`,
      companyId: 'company-1',
      accountId: Math.random() > 0.5 ? 'acc-1' : 'acc-2',
      type: isRevenue ? 'entry' : 'exit',
      categoryId: isRevenue ? 
        categories?.filter(c => c?.kind === 'revenue')?.[Math.floor(Math.random() * 3)]?.id || 'cat-1' :
        categories?.filter(c => c?.kind === 'expense' && !c?.parentId)?.[Math.floor(Math.random() * 2) + 3]?.id || 'cat-4',
      vendorId: !isRevenue && Math.random() > 0.5 ? `vendor-${Math.floor(Math.random() * 2) + 1}` : null,
      customerId: isRevenue && Math.random() > 0.5 ? `customer-${Math.floor(Math.random() * 2) + 1}` : null,
      competenciaDate: baseDate,
      dueDate: addDays(baseDate, Math.floor(Math.random() * 30)),
      paidDate: Math.random() > 0.3 ? addDays(baseDate, Math.floor(Math.random() * 5)) : null,
      amount: Math.round((Math.random() * 50000 + 1000) * 100) / 100,
      status: statuses?.[Math.floor(Math.random() * statuses?.length)],
      paymentMethod: paymentMethods?.[Math.floor(Math.random() * paymentMethods?.length)],
      tags: Math.random() > 0.7 ? ['urgente'] : [],
      notes: Math.random() > 0.8 ? 'Observações importantes sobre esta transação' : '',
      attachments: [],
      recurrenceId: null,
      transferPairId: null,
      remainingBalance: 0,
      reconciled: Math.random() > 0.5,
      createdAt: baseDate,
      updatedAt: new Date(),
      audit: { createdBy: 'user-1', updatedBy: 'user-1' }
    });
  }
  
  // Company 2 transactions
  for (let i = 21; i <= 30; i++) {
    const isRevenue = Math.random() > 0.6;
    const baseDate = subDays(new Date(), Math.floor(Math.random() * 60));
    
    transactions?.push({
      id: `trans-${i}`,
      companyId: 'company-2',
      accountId: 'acc-3',
      type: isRevenue ? 'entry' : 'exit',
      categoryId: isRevenue ? 
        categories?.filter(c => c?.kind === 'revenue')?.[Math.floor(Math.random() * 3)]?.id || 'cat-2' :
        categories?.filter(c => c?.kind === 'expense' && !c?.parentId)?.[Math.floor(Math.random() * 2) + 3]?.id || 'cat-9',
      vendorId: !isRevenue && Math.random() > 0.5 ? 'vendor-3' : null,
      customerId: isRevenue && Math.random() > 0.5 ? 'customer-3' : null,
      competenciaDate: baseDate,
      dueDate: addDays(baseDate, Math.floor(Math.random() * 30)),
      paidDate: Math.random() > 0.3 ? addDays(baseDate, Math.floor(Math.random() * 5)) : null,
      amount: Math.round((Math.random() * 30000 + 500) * 100) / 100,
      status: statuses?.[Math.floor(Math.random() * statuses?.length)],
      paymentMethod: paymentMethods?.[Math.floor(Math.random() * paymentMethods?.length)],
      tags: Math.random() > 0.8 ? ['importante'] : [],
      notes: Math.random() > 0.9 ? 'Observações sobre a transação' : '',
      attachments: [],
      recurrenceId: null,
      transferPairId: null,
      remainingBalance: 0,
      reconciled: Math.random() > 0.5,
      createdAt: baseDate,
      updatedAt: new Date(),
      audit: { createdBy: 'user-1', updatedBy: 'user-1' }
    });
  }
  
  return transactions;
};

// Users
const users = [
  {
    id: 'user-1',
    name: 'Admin Principal',
    email: 'admin@sistema.com',
    role: 'admin',
    permissions: {
      canViewReports: true,
      canExportData: true,
      canViewBudgets: true,
      canViewAnalytics: true,
      canViewSettings: true,
      canManageCategories: true,
      canManageVendors: true,
      canManageCustomers: true,
      canViewAttachments: true,
    },
    lastLogin: new Date(),
    active: true,
    createdAt: subMonths(new Date(), 12),
    updatedAt: new Date(),
  },
  {
    id: 'user-2',
    name: 'Usuário Visualizador',
    email: 'viewer@sistema.com',
    role: 'viewer',
    permissions: {
      canViewReports: true,
      canExportData: true,
      canViewBudgets: true,
      canViewAnalytics: true,
      canViewSettings: false,
      canManageCategories: false,
      canManageVendors: false,
      canManageCustomers: false,
      canViewAttachments: true,
    },
    lastLogin: subDays(new Date(), 2),
    active: true,
    createdAt: subMonths(new Date(), 6),
    updatedAt: new Date(),
  }
];

// Sample budgets
const budgets = [
  {
    id: 'budget-1',
    companyId: 'company-1',
    categoryId: 'cat-5',
    month: format(new Date(), 'yyyy-MM'),
    amountPlanned: 15000.00,
    amountActual: 14200.00,
    alertThreshold: 90,
    createdAt: subMonths(new Date(), 1),
    updatedAt: new Date(),
  },
  {
    id: 'budget-2',
    companyId: 'company-1',
    categoryId: 'cat-6',
    month: format(new Date(), 'yyyy-MM'),
    amountPlanned: 5000.00,
    amountActual: 5000.00,
    alertThreshold: 100,
    createdAt: subMonths(new Date(), 1),
    updatedAt: new Date(),
  },
  {
    id: 'budget-3',
    companyId: 'company-2',
    categoryId: 'cat-5',
    month: format(new Date(), 'yyyy-MM'),
    amountPlanned: 8000.00,
    amountActual: 7500.00,
    alertThreshold: 85,
    createdAt: subMonths(new Date(), 1),
    updatedAt: new Date(),
  }
];

// System preferences and settings
const initialSettings = {
  activeScope: 'company', // 'company' | 'global'
  activeCompanyId: 'company-1',
  theme: 'light',
  density: 'comfortable',
  language: 'pt-BR',
  colors: {
    primary: '#1E3A8A',
    secondary: '#0F766E',
    accent: '#DC2626',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
  },
  notifications: {
    email: false,
    whatsapp: false,
    webhookUrl: '',
  },
  accessibility: {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
  },
  taxes: {
    effectiveRate: 0.1755,
    simples: true,
    taxRegime: 'simples_nacional',
  },
  backup: {
    lastBackup: null,
    autoBackup: false,
  },
};

export const initialState = {
  companies: {
    items: companies,
  },
  accounts: {
    items: accounts,
  },
  categories: {
    items: categories,
  },
  vendorsCustomers: {
    vendors: vendors,
    customers: customers,
  },
  costCenters: {
    items: [],
  },
  transactions: {
    items: generateTransactions(),
  },
  budgets: {
    items: budgets,
  },
  settings: initialSettings,
  users: {
    items: users,
    currentUser: users?.[0],
  },
  alerts: {
    items: [],
  },
};

export default initialState;