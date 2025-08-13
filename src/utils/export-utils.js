import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// PDF Export utilities
export const exportToPDF = async (data, config = {}) => {
  const {
    title = 'Relatório Financeiro',
    company,
    dateRange,
    includeCharts = false,
    orientation = 'portrait',
    pageSize = 'a4'
  } = config;
  
  // Create PDF document
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: pageSize
  });
  
  // Set up fonts and styles
  pdf?.setFont('helvetica');
  
  // Add header with company info
  if (company?.logo) {
    try {
      pdf?.addImage(company?.logo, 'PNG', 15, 15, 30, 20);
    } catch (e) {
      console.warn('Failed to add logo to PDF');
    }
  }
  
  // Company information
  pdf?.setFontSize(20);
  pdf?.text(title, 50, 25);
  
  if (company) {
    pdf?.setFontSize(12);
    pdf?.text(company?.razaoSocial || '', 50, 35);
    pdf?.text(`CNPJ: ${company?.cnpj || ''}`, 50, 42);
    if (company?.endereco) {
      pdf?.text(company?.endereco, 50, 49);
    }
  }
  
  // Date range
  if (dateRange) {
    pdf?.setFontSize(10);
    pdf?.text(`Período: ${dateRange}`, 50, 58);
  }
  
  // Generation date
  pdf?.text(
    `Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`,
    50,
    65
  );
  
  let currentY = 80;
  
  // Add tables for different data types
  if (data?.transactions && data?.transactions?.length > 0) {
    pdf?.setFontSize(14);
    pdf?.text('Transações', 15, currentY);
    currentY += 10;
    
    const transactionHeaders = [
      'Data',
      'Descrição',
      'Categoria',
      'Valor',
      'Status'
    ];
    
    const transactionRows = data?.transactions?.map(trans => [
      format(new Date(trans.competenciaDate), 'dd/MM/yyyy'),
      trans?.notes || `${trans?.type === 'entry' ? 'Entrada' : 'Saída'}`,
      trans?.categoryName || '-',
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })?.format(trans?.amount),
      trans?.status === 'paid' ? 'Pago' : 
      trans?.status === 'planned' ? 'Planejado' : 
      trans?.status === 'overdue' ? 'Vencido' : trans?.status
    ]);
    
    pdf?.autoTable({
      head: [transactionHeaders],
      body: transactionRows,
      startY: currentY,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 58, 138] }, // Primary color
    });
    
    currentY = pdf?.lastAutoTable?.finalY + 20;
  }
  
  // Add accounts summary if available
  if (data?.accounts && data?.accounts?.length > 0) {
    pdf?.setFontSize(14);
    pdf?.text('Resumo de Contas', 15, currentY);
    currentY += 10;
    
    const accountHeaders = [
      'Banco',
      'Conta',
      'Tipo',
      'Saldo Atual',
      'Meta'
    ];
    
    const accountRows = data?.accounts?.map(acc => [
      acc?.bank,
      `${acc?.branch}-${acc?.number}`,
      acc?.kind === 'corrente' ? 'Corrente' :
      acc?.kind === 'poupanca' ? 'Poupança' : 'Investimento',
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })?.format(acc?.currentBalance),
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })?.format(acc?.targetBalance || 0)
    ]);
    
    pdf?.autoTable({
      head: [accountHeaders],
      body: accountRows,
      startY: currentY,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 118, 110] }, // Secondary color
    });
    
    currentY = pdf?.lastAutoTable?.finalY + 20;
  }
  
  // Add summary totals
  if (data?.summary) {
    pdf?.setFontSize(14);
    pdf?.text('Resumo Financeiro', 15, currentY);
    currentY += 15;
    
    const summaryData = [
      ['Total de Entradas:', data?.summary?.totalEntries || 'R$ 0,00'],
      ['Total de Saídas:', data?.summary?.totalExits || 'R$ 0,00'],
      ['Saldo Líquido:', data?.summary?.netBalance || 'R$ 0,00'],
      ['Saldo Total em Contas:', data?.summary?.totalBalance || 'R$ 0,00']
    ];
    
    summaryData?.forEach(([label, value]) => {
      pdf?.setFontSize(11);
      pdf?.text(label, 15, currentY);
      pdf?.text(value, 120, currentY);
      currentY += 8;
    });
  }
  
  // Add footer
  const pageCount = pdf?.internal?.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf?.setPage(i);
    pdf?.setFontSize(8);
    pdf?.text(
      `Página ${i} de ${pageCount}`,
      pdf?.internal?.pageSize?.width - 30,
      pdf?.internal?.pageSize?.height - 10
    );
  }
  
  return pdf;
};

// Excel Export utilities
export const exportToExcel = (data, config = {}) => {
  const {
    filename = 'relatorio-financeiro',
    company,
    includeCharts = false
  } = config;
  
  // Create workbook
  const wb = XLSX?.utils?.book_new();
  
  // Add company info sheet
  if (company) {
    const companyData = [
      ['Informações da Empresa'],
      [''],
      ['Razão Social:', company?.razaoSocial || ''],
      ['Nome Fantasia:', company?.nomeFantasia || ''],
      ['CNPJ:', company?.cnpj || ''],
      ['Endereço:', company?.endereco || ''],
      ['E-mail:', company?.email || ''],
      ['Telefone:', company?.telefone || ''],
      [''],
      ['Relatório gerado em:', format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })]
    ];
    
    const companyWs = XLSX?.utils?.aoa_to_sheet(companyData);
    XLSX?.utils?.book_append_sheet(wb, companyWs, 'Empresa');
  }
  
  // Add transactions sheet
  if (data?.transactions && data?.transactions?.length > 0) {
    const transactionData = [
      [
        'ID',
        'Data Competência',
        'Data Vencimento',
        'Data Pagamento',
        'Tipo',
        'Categoria',
        'Fornecedor/Cliente',
        'Conta',
        'Valor',
        'Status',
        'Método Pagamento',
        'Observações'
      ]
    ];
    
    data?.transactions?.forEach(trans => {
      transactionData?.push([
        trans?.id,
        format(new Date(trans.competenciaDate), 'dd/MM/yyyy'),
        format(new Date(trans.dueDate), 'dd/MM/yyyy'),
        trans?.paidDate ? format(new Date(trans.paidDate), 'dd/MM/yyyy') : '',
        trans?.type === 'entry' ? 'Entrada' : trans?.type === 'exit' ? 'Saída' : 'Transferência',
        trans?.categoryName || '',
        trans?.vendorName || trans?.customerName || '',
        trans?.accountName || '',
        trans?.amount,
        trans?.status,
        trans?.paymentMethod || '',
        trans?.notes || ''
      ]);
    });
    
    const transactionsWs = XLSX?.utils?.aoa_to_sheet(transactionData);
    XLSX?.utils?.book_append_sheet(wb, transactionsWs, 'Transações');
  }
  
  // Add accounts sheet
  if (data?.accounts && data?.accounts?.length > 0) {
    const accountData = [
      [
        'ID',
        'Banco',
        'Agência',
        'Conta',
        'Tipo',
        'Saldo Atual',
        'Meta',
        'Status',
        'PIX',
        'Boleto'
      ]
    ];
    
    data?.accounts?.forEach(acc => {
      accountData?.push([
        acc?.id,
        acc?.bank,
        acc?.branch,
        acc?.number,
        acc?.kind,
        acc?.currentBalance,
        acc?.targetBalance || 0,
        acc?.status,
        acc?.pixEnabled ? 'Sim' : 'Não',
        acc?.boletoEnabled ? 'Sim' : 'Não'
      ]);
    });
    
    const accountsWs = XLSX?.utils?.aoa_to_sheet(accountData);
    XLSX?.utils?.book_append_sheet(wb, accountsWs, 'Contas');
  }
  
  // Add categories sheet
  if (data?.categories && data?.categories?.length > 0) {
    const categoryData = [
      ['ID', 'Nome', 'Tipo', 'Pai', 'Código SEBRAE', 'Ativo']
    ];
    
    data?.categories?.forEach(cat => {
      categoryData?.push([
        cat?.id,
        cat?.name,
        cat?.kind === 'revenue' ? 'Receita' : 
        cat?.kind === 'expense' ? 'Despesa' : 'Imposto',
        cat?.parentName || '',
        cat?.sebraeCode || '',
        cat?.active ? 'Sim' : 'Não'
      ]);
    });
    
    const categoriesWs = XLSX?.utils?.aoa_to_sheet(categoryData);
    XLSX?.utils?.book_append_sheet(wb, categoriesWs, 'Categorias');
  }
  
  // Add DRE sheet (Cash flow statement)
  if (data?.dre) {
    const dreData = [
      ['Demonstrativo de Resultado do Exercício (Visão Caixa)'],
      [''],
      ['RECEITAS'],
      ...(data?.dre?.revenues?.map(item => [item?.name, item?.value]) || []),
      ['', ''],
      ['Total de Receitas', data?.dre?.totalRevenues || 0],
      ['', ''],
      ['DESPESAS'],
      ...(data?.dre?.expenses?.map(item => [item?.name, item?.value]) || []),
      ['', ''],
      ['Total de Despesas', data?.dre?.totalExpenses || 0],
      ['', ''],
      ['RESULTADO LÍQUIDO', (data?.dre?.totalRevenues || 0) - (data?.dre?.totalExpenses || 0)]
    ];
    
    const dreWs = XLSX?.utils?.aoa_to_sheet(dreData);
    XLSX?.utils?.book_append_sheet(wb, dreWs, 'DRE');
  }
  
  // Add forecast sheet
  if (data?.forecast) {
    const forecastData = [
      ['Previsão de Fluxo de Caixa'],
      [''],
      ['Mês', 'Entradas Previstas', 'Saídas Previstas', 'Saldo Projetado']
    ];
    
    data?.forecast?.forEach(item => {
      forecastData?.push([
        item?.month,
        item?.projectedEntries || 0,
        item?.projectedExits || 0,
        item?.projectedBalance || 0
      ]);
    });
    
    const forecastWs = XLSX?.utils?.aoa_to_sheet(forecastData);
    XLSX?.utils?.book_append_sheet(wb, forecastWs, 'Previsão');
  }
  
  // Generate and save file
  const timestamp = format(new Date(), 'yyyyMMdd-HHmmss');
  const finalFilename = `${filename}-${timestamp}.xlsx`;
  
  XLSX?.writeFile(wb, finalFilename);
  
  return finalFilename;
};

// CSV Export for simple data
export const exportToCSV = (data, filename = 'dados-financeiros') => {
  if (!data || data?.length === 0) {
    throw new Error('Nenhum dado para exportar');
  }
  
  // Get headers from first object
  const headers = Object.keys(data?.[0]);
  
  // Create CSV content
  const csvContent = [
    headers?.join(','), // Header row
    ...data?.map(row => 
      headers?.map(header => {
        const value = row?.[header];
        // Handle values that might contain commas
        if (typeof value === 'string' && value?.includes(',')) {
          return `"${value}"`;
        }
        return value || '';
      })?.join(',')
    )
  ]?.join('\n');
  
  // Create blob and save
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const timestamp = format(new Date(), 'yyyyMMdd-HHmmss');
  const finalFilename = `${filename}-${timestamp}.csv`;
  
  saveAs(blob, finalFilename);
  
  return finalFilename;
};

// Chart image capture for PDF reports
export const captureChartImage = async (chartRef) => {
  if (!chartRef || !chartRef?.current) {
    return null;
  }
  
  try {
    // Check if html2canvas is available, otherwise return null
    if (typeof html2canvas === 'undefined') {
      console.warn('html2canvas is not available for chart capture');
      return null;
    }
    
    // Use html2canvas if available or implement canvas conversion
    const canvas = await html2canvas(chartRef?.current, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: false
    });
    
    return canvas?.toDataURL('image/png');
  } catch (error) {
    console.warn('Failed to capture chart image:', error);
    return null;
  }
};

// Report scheduling data structure
export const createScheduledReport = (config) => {
  return {
    id: `report-${Date.now()}`,
    name: config?.name || 'Relatório Automático',
    type: config?.type || 'comprehensive', // comprehensive, transactions, accounts
    frequency: config?.frequency || 'monthly', // daily, weekly, monthly, quarterly, yearly
    format: config?.format || 'pdf', // pdf, excel, both
    recipients: config?.recipients || [],
    companyId: config?.companyId,
    filters: config?.filters || {},
    includeCharts: config?.includeCharts !== false,
    active: true,
    lastRun: null,
    nextRun: config?.nextRun || new Date(),
    createdAt: new Date(),
    createdBy: config?.createdBy
  };
};

// Generate comprehensive report data
export const generateReportData = (state, config = {}) => {
  const { 
    companyId, 
    startDate, 
    endDate, 
    includeTransactions = true,
    includeAccounts = true,
    includeCategories = true,
    includeBudgets = true,
    includeForecast = false
  } = config;
  
  const data = {};
  
  // Filter data by company and date range
  const filterByCompany = (items) => 
    companyId ? items?.filter(item => item?.companyId === companyId) : items;
  
  const filterByDate = (items, dateField = 'createdAt') => {
    if (!startDate && !endDate) return items;
    
    return items?.filter(item => {
      const itemDate = new Date(item[dateField]);
      if (startDate && itemDate < new Date(startDate)) return false;
      if (endDate && itemDate > new Date(endDate)) return false;
      return true;
    });
  };
  
  // Company info
  if (companyId) {
    data.company = state?.companies?.find(c => c?.id === companyId);
  }
  
  // Transactions
  if (includeTransactions) {
    let transactions = filterByCompany(state?.transactions || []);
    transactions = filterByDate(transactions, 'competenciaDate');
    
    // Enrich with related data
    data.transactions = transactions?.map(trans => ({
      ...trans,
      categoryName: state?.categories?.find(c => c?.id === trans?.categoryId)?.name,
      accountName: state?.accounts?.find(a => a?.id === trans?.accountId)?.bank + ' ' +
                   state?.accounts?.find(a => a?.id === trans?.accountId)?.number,
      vendorName: state?.vendors?.find(v => v?.id === trans?.vendorId)?.name,
      customerName: state?.customers?.find(c => c?.id === trans?.customerId)?.name
    }));
  }
  
  // Accounts
  if (includeAccounts) {
    data.accounts = filterByCompany(state?.accounts || []);
  }
  
  // Categories
  if (includeCategories) {
    data.categories = (state?.categories || [])?.map(cat => ({
      ...cat,
      parentName: cat?.parentId ? 
        state?.categories?.find(p => p?.id === cat?.parentId)?.name : null
    }));
  }
  
  // Budgets
  if (includeBudgets) {
    data.budgets = filterByCompany(state?.budgets || []);
  }
  
  // Calculate summary
  if (data?.transactions) {
    const entries = data?.transactions?.filter(t => t?.type === 'entry' && t?.status === 'paid');
    const exits = data?.transactions?.filter(t => t?.type === 'exit' && t?.status === 'paid');
    
    data.summary = {
      totalEntries: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })?.format(entries?.reduce((sum, t) => sum + t?.amount, 0)),
      
      totalExits: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })?.format(exits?.reduce((sum, t) => sum + t?.amount, 0)),
      
      netBalance: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })?.format(
        entries?.reduce((sum, t) => sum + t?.amount, 0) -
        exits?.reduce((sum, t) => sum + t?.amount, 0)
      ),
      
      totalBalance: data?.accounts ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })?.format(data?.accounts?.reduce((sum, a) => sum + a?.currentBalance, 0)) : 'R$ 0,00'
    };
  }
  
  // Date range info
  data.dateRange = startDate && endDate ? 
    `${format(new Date(startDate), 'dd/MM/yyyy')} a ${format(new Date(endDate), 'dd/MM/yyyy')}` :
    startDate ? `A partir de ${format(new Date(startDate), 'dd/MM/yyyy')}` :
    endDate ? `Até ${format(new Date(endDate), 'dd/MM/yyyy')}` :
    'Todos os períodos';
  
  return data;
};

export default {
  exportToPDF,
  exportToExcel,
  exportToCSV,
  captureChartImage,
  createScheduledReport,
  generateReportData,
};