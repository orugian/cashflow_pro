import { z } from 'zod';

// Validation schemas using Zod
export const companySchema = z?.object({
  cnpj: z?.string()?.min(14, 'CNPJ deve ter 14 dígitos')?.max(18, 'CNPJ inválido')?.regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'Formato de CNPJ inválido'),
  razaoSocial: z?.string()?.min(1, 'Razão social é obrigatória')?.max(255, 'Razão social muito longa'),
  nomeFantasia: z?.string()?.min(1, 'Nome fantasia é obrigatório')?.max(255, 'Nome fantasia muito longo'),
  endereco: z?.string()?.min(10, 'Endereço muito curto')?.max(500, 'Endereço muito longo'),
  email: z?.string()?.email('E-mail inválido')?.max(255, 'E-mail muito longo'),
  telefone: z?.string()?.min(10, 'Telefone inválido')?.max(15, 'Telefone muito longo'),
});

export const accountSchema = z?.object({
  companyId: z?.string()?.min(1, 'Empresa é obrigatória'),
  bank: z?.string()?.min(1, 'Banco é obrigatório')?.max(100, 'Nome do banco muito longo'),
  branch: z?.string()?.min(1, 'Agência é obrigatória')?.max(10, 'Agência inválida'),
  number: z?.string()?.min(1, 'Número da conta é obrigatório')?.max(20, 'Número muito longo'),
  kind: z?.enum(['corrente', 'poupanca', 'investimento'], {
    errorMap: () => ({ message: 'Tipo de conta inválido' })
  }),
  currentBalance: z?.number()?.min(-999999999, 'Saldo muito baixo')?.max(999999999, 'Saldo muito alto'),
  targetBalance: z?.number()?.min(0, 'Meta deve ser positiva')?.max(999999999, 'Meta muito alta'),
  pixEnabled: z?.boolean(),
  boletoEnabled: z?.boolean(),
  reconciliationEnabled: z?.boolean(),
});

export const transactionSchema = z?.object({
  companyId: z?.string()?.min(1, 'Empresa é obrigatória'),
  accountId: z?.string()?.min(1, 'Conta é obrigatória'),
  type: z?.enum(['entry', 'exit', 'transfer'], {
    errorMap: () => ({ message: 'Tipo de transação inválido' })
  }),
  categoryId: z?.string()?.optional(),
  vendorId: z?.string()?.optional(),
  customerId: z?.string()?.optional(),
  competenciaDate: z?.date({
    errorMap: () => ({ message: 'Data de competência inválida' })
  }),
  dueDate: z?.date({
    errorMap: () => ({ message: 'Data de vencimento inválida' })
  }),
  amount: z?.number()?.positive('Valor deve ser positivo')?.max(999999999, 'Valor muito alto'),
  status: z?.enum(['planned', 'confirmed', 'paid', 'overdue', 'canceled', 'partially-paid'], {
    errorMap: () => ({ message: 'Status inválido' })
  }),
  paymentMethod: z?.enum(['pix', 'boleto', 'cartao', 'ted', 'cash', 'check'], {
    errorMap: () => ({ message: 'Método de pagamento inválido' })
  }),
  tags: z?.array(z?.string())?.optional(),
  notes: z?.string()?.max(1000, 'Observações muito longas')?.optional(),
  remainingBalance: z?.number()?.min(0, 'Saldo restante deve ser positivo')?.optional(),
});

export const categorySchema = z?.object({
  parentId: z?.string()?.optional(),
  sebraeCode: z?.string()?.optional(),
  name: z?.string()?.min(1, 'Nome é obrigatório')?.max(100, 'Nome muito longo'),
  kind: z?.enum(['revenue', 'expense', 'tax'], {
    errorMap: () => ({ message: 'Tipo de categoria inválido' })
  }),
  color: z?.string()?.regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  icon: z?.string()?.min(1, 'Ícone é obrigatório'),
  active: z?.boolean(),
});

export const vendorSchema = z?.object({
  companyId: z?.string()?.min(1, 'Empresa é obrigatória'),
  name: z?.string()?.min(1, 'Nome é obrigatório')?.max(255, 'Nome muito longo'),
  cnpjCpf: z?.string()?.min(11, 'CNPJ/CPF deve ter pelo menos 11 dígitos')?.max(18, 'CNPJ/CPF inválido')?.regex(/^(\d{11}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{3}\.\d{3}\.\d{3}-\d{2})$/, 'CNPJ/CPF inválido'),
  email: z?.string()?.email('E-mail inválido')?.optional(),
  phone: z?.string()?.min(10, 'Telefone inválido')?.max(15, 'Telefone muito longo')?.optional(),
  address: z?.string()?.max(500, 'Endereço muito longo')?.optional(),
  active: z?.boolean(),
});

export const customerSchema = vendorSchema; // Same validation rules

export const budgetSchema = z?.object({
  companyId: z?.string()?.min(1, 'Empresa é obrigatória'),
  categoryId: z?.string()?.min(1, 'Categoria é obrigatória'),
  month: z?.string()?.regex(/^\d{4}-\d{2}$/, 'Formato de mês inválido (YYYY-MM)'),
  amountPlanned: z?.number()?.positive('Valor planejado deve ser positivo')?.max(999999999, 'Valor muito alto'),
  alertThreshold: z?.number()?.min(1, 'Limite de alerta deve ser pelo menos 1%')?.max(100, 'Limite de alerta deve ser no máximo 100%'),
});

export const attachmentSchema = z?.object({
  name: z?.string()?.min(1, 'Nome do arquivo é obrigatório')?.max(255, 'Nome muito longo'),
  size: z?.number()?.min(1, 'Arquivo não pode estar vazio')?.max(10 * 1024 * 1024, 'Arquivo deve ter no máximo 10MB'),
  mime: z?.string()?.min(1, 'Tipo MIME é obrigatório'),
  data: z?.string()?.min(1, 'Dados do arquivo são obrigatórios'),
});

export const userSchema = z?.object({
  name: z?.string()?.min(1, 'Nome é obrigatório')?.max(100, 'Nome muito longo'),
  email: z?.string()?.email('E-mail inválido')?.max(255, 'E-mail muito longo'),
  role: z?.enum(['admin', 'viewer'], {
    errorMap: () => ({ message: 'Papel do usuário inválido' })
  }),
  active: z?.boolean(),
});

export const systemPreferencesSchema = z?.object({
  theme: z?.enum(['light', 'dark', 'auto'], {
    errorMap: () => ({ message: 'Tema inválido' })
  }),
  density: z?.enum(['compact', 'comfortable'], {
    errorMap: () => ({ message: 'Densidade inválida' })
  }),
  language: z?.string()?.min(2, 'Código de idioma inválido')?.max(5, 'Código de idioma inválido'),
  colors: z?.object({
    primary: z?.string()?.regex(/^#[0-9A-F]{6}$/i, 'Cor primária inválida'),
    secondary: z?.string()?.regex(/^#[0-9A-F]{6}$/i, 'Cor secundária inválida'),
    accent: z?.string()?.regex(/^#[0-9A-F]{6}$/i, 'Cor de destaque inválida'),
    success: z?.string()?.regex(/^#[0-9A-F]{6}$/i, 'Cor de sucesso inválida'),
    warning: z?.string()?.regex(/^#[0-9A-F]{6}$/i, 'Cor de aviso inválida'),
    error: z?.string()?.regex(/^#[0-9A-F]{6}$/i, 'Cor de erro inválida'),
  }),
  notifications: z?.object({
    email: z?.boolean(),
    whatsapp: z?.boolean(),
    webhookUrl: z?.string()?.url('URL do webhook inválida')?.optional()?.or(z?.literal('')),
  }),
  accessibility: z?.object({
    highContrast: z?.boolean(),
    largeText: z?.boolean(),
    reducedMotion: z?.boolean(),
  }),
});

// Validation helper functions
export const validateData = (schema, data) => {
  try {
    let result = schema?.parse(data);
    return { success: true, data: result, errors: null };
  } catch (error) {
    return { 
      success: false, 
      data: null, 
      errors: error?.errors?.map(err => ({
        field: err?.path?.join('.') || 'unknown',
        message: err?.message,
        code: err?.code,
      })) || []
    };
  }
};

export const validateCNPJ = (cnpj) => {
  const digits = cnpj?.replace(/\D/g, '');
  
  if (digits?.length !== 14) return false;
  
  // Check for repeated digits
  if (/^(\d)\1+$/?.test(digits)) return false;
  
  // CNPJ validation algorithm
  let sum = 0;
  let pos = 5;
  
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits?.[i]) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11;
  if (result < 2) result = 0;
  else result = 11 - result;
  
  if (result !== parseInt(digits?.[12])) return false;
  
  sum = 0;
  pos = 6;
  
  for (let i = 0; i < 13; i++) {
    sum += parseInt(digits?.[i]) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11;
  if (result < 2) result = 0;
  else result = 11 - result;
  
  return result === parseInt(digits?.[13]);
};

export const validateCPF = (cpf) => {
  const digits = cpf?.replace(/\D/g, '');
  
  if (digits?.length !== 11) return false;
  
  // Check for repeated digits
  if (/^(\d)\1+$/?.test(digits)) return false;
  
  // CPF validation algorithm
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits?.[i]) * (10 - i);
  }
  
  let result = (sum * 10) % 11;
  if (result === 10 || result === 11) result = 0;
  if (result !== parseInt(digits?.[9])) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits?.[i]) * (11 - i);
  }
  
  result = (sum * 10) % 11;
  if (result === 10 || result === 11) result = 0;
  if (result !== parseInt(digits?.[10])) return false;
  
  return true;
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })?.format(value);
};

export const formatCNPJ = (cnpj) => {
  const digits = cnpj?.replace(/\D/g, '');
  return digits?.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

export const formatCPF = (cpf) => {
  const digits = cpf?.replace(/\D/g, '');
  return digits?.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatPhone = (phone) => {
  const digits = phone?.replace(/\D/g, '');
  if (digits?.length === 11) {
    return digits?.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (digits?.length === 10) {
    return digits?.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

export const checkFileSize = (file, maxSizeInMB = 10) => {
  const maxSize = maxSizeInMB * 1024 * 1024; // Convert to bytes
  return file?.size <= maxSize;
};

export const checkFileType = (file, allowedTypes = ['image/*', 'application/pdf', 'text/*']) => {
  return allowedTypes?.some(type => {
    if (type?.endsWith('/*')) {
      return file?.type?.startsWith(type?.replace('/*', '/'));
    }
    return file?.type === type;
  });
};

export default {
  validateData,
  validateCNPJ,
  validateCPF,
  formatCurrency,
  formatCNPJ,
  formatCPF,
  formatPhone,
  checkFileSize,
  checkFileType,
  companySchema,
  accountSchema,
  transactionSchema,
  categorySchema,
  vendorSchema,
  customerSchema,
  budgetSchema,
  attachmentSchema,
  userSchema,
  systemPreferencesSchema,
};