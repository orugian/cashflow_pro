/**
 * @typedef {Object} Company
 * @property {string} id - Unique identifier
 * @property {string} cnpj - Brazilian tax ID
 * @property {string} razaoSocial - Legal company name
 * @property {string} nomeFantasia - Trade name
 * @property {string} endereco - Address
 * @property {string} email - Email address
 * @property {string} telefone - Phone number
 * @property {string} logo - Logo URL or base64
 * @property {boolean} active - Is company active
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} Account
 * @property {string} id - Unique identifier
 * @property {string} companyId - Company reference
 * @property {string} bank - Bank name
 * @property {string} branch - Branch number
 * @property {string} number - Account number
 * @property {'corrente'|'poupanca'|'investimento'} kind - Account type
 * @property {number} currentBalance - Current balance
 * @property {number} targetBalance - Target balance goal
 * @property {'active'|'inactive'|'blocked'} status - Account status
 * @property {boolean} pixEnabled - PIX enabled flag
 * @property {boolean} boletoEnabled - Boleto enabled flag
 * @property {boolean} reconciliationEnabled - Auto reconciliation enabled
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id - Unique identifier
 * @property {string} companyId - Company reference
 * @property {string} accountId - Account reference
 * @property {'entry'|'exit'|'transfer'} type - Transaction type
 * @property {string} categoryId - Category reference
 * @property {string} vendorId - Vendor reference (optional)
 * @property {string} customerId - Customer reference (optional)
 * @property {Date} competenciaDate - Competence date
 * @property {Date} dueDate - Due date
 * @property {Date} paidDate - Payment date (optional)
 * @property {number} amount - Transaction amount
 * @property {'planned'|'confirmed'|'paid'|'overdue'|'canceled'|'partially-paid'} status - Transaction status
 * @property {'pix'|'boleto'|'cartao'|'ted'|'cash'|'check'} paymentMethod - Payment method
 * @property {string[]} tags - Tags array
 * @property {string} notes - Notes
 * @property {Attachment[]} attachments - Attachments array
 * @property {string} recurrenceId - Recurrence reference (optional)
 * @property {string} reciprocalId - Transfer reciprocal ID (optional)
 * @property {number} remainingBalance - Remaining balance for partial payments
 * @property {boolean} reconciled - Is reconciled flag
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 * @property {Object} audit - Audit information
 */

/**
 * @typedef {Object} Category
 * @property {string} id - Unique identifier
 * @property {string} parentId - Parent category ID (optional)
 * @property {string} sebraeCode - SEBRAE classification code (optional)
 * @property {string} name - Category name
 * @property {'revenue'|'expense'|'tax'} kind - Category type
 * @property {string} color - Category color
 * @property {string} icon - Category icon
 * @property {boolean} active - Is category active
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} Vendor
 * @property {string} id - Unique identifier
 * @property {string} companyId - Company reference
 * @property {string} name - Vendor name
 * @property {string} cnpjCpf - CNPJ or CPF
 * @property {string} email - Email address
 * @property {string} phone - Phone number
 * @property {string} address - Address
 * @property {boolean} active - Is vendor active
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} Customer
 * @property {string} id - Unique identifier
 * @property {string} companyId - Company reference
 * @property {string} name - Customer name
 * @property {string} cnpjCpf - CNPJ or CPF
 * @property {string} email - Email address
 * @property {string} phone - Phone number
 * @property {string} address - Address
 * @property {boolean} active - Is customer active
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} Budget
 * @property {string} id - Unique identifier
 * @property {string} companyId - Company reference
 * @property {string} categoryId - Category reference
 * @property {string} month - Month in YYYY-MM format
 * @property {number} amountPlanned - Planned amount
 * @property {number} amountActual - Actual amount (computed)
 * @property {number} alertThreshold - Alert threshold percentage
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} Attachment
 * @property {string} id - Unique identifier
 * @property {string} name - File name
 * @property {number} size - File size in bytes
 * @property {string} mime - MIME type
 * @property {string} data - Base64 data or object URL
 * @property {Date} createdAt - Creation date
 */

/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier
 * @property {string} name - User name
 * @property {string} email - User email
 * @property {'admin'|'viewer'} role - User role
 * @property {UserPermissions} permissions - Extended permissions
 * @property {Date} lastLogin - Last login date
 * @property {boolean} active - Is user active
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} UserPermissions
 * @property {boolean} canViewReports - Can view reports
 * @property {boolean} canExportData - Can export data
 * @property {boolean} canViewBudgets - Can view budgets
 * @property {boolean} canViewAnalytics - Can view analytics
 * @property {boolean} canViewSettings - Can view settings
 * @property {boolean} canManageCategories - Can manage categories (viewer extension)
 * @property {boolean} canManageVendors - Can manage vendors (viewer extension)
 * @property {boolean} canManageCustomers - Can manage customers (viewer extension)
 */

/**
 * @typedef {Object} Alert
 * @property {string} id - Unique identifier
 * @property {string} companyId - Company reference
 * @property {'negative-balance'|'overdue-payment'|'budget-exceeded'|'goal-achieved'} type - Alert type
 * @property {string} title - Alert title
 * @property {string} message - Alert message
 * @property {'low'|'medium'|'high'} severity - Alert severity
 * @property {boolean} read - Is alert read
 * @property {Object} metadata - Additional metadata
 * @property {Date} createdAt - Creation date
 */

/**
 * @typedef {Object} Recurrence
 * @property {string} id - Unique identifier
 * @property {'daily'|'weekly'|'monthly'|'quarterly'|'semiannual'|'annual'} frequency - Recurrence frequency
 * @property {Date} endDate - End date (optional)
 * @property {number} occurrences - Number of occurrences (optional)
 * @property {boolean} active - Is recurrence active
 * @property {Date} lastGenerated - Last generation date
 * @property {Date} nextGeneration - Next generation date
 */

/**
 * @typedef {Object} SystemPreferences
 * @property {'light'|'dark'|'auto'} theme - Theme preference
 * @property {'compact'|'comfortable'} density - UI density
 * @property {string} language - Language code
 * @property {Object} colors - Custom color palette
 * @property {NotificationSettings} notifications - Notification settings
 * @property {AccessibilitySettings} accessibility - Accessibility settings
 */

/**
 * @typedef {Object} NotificationSettings
 * @property {boolean} email - Email notifications enabled
 * @property {boolean} whatsapp - WhatsApp notifications enabled
 * @property {string} webhookUrl - n8n webhook URL
 */

/**
 * @typedef {Object} AccessibilitySettings
 * @property {boolean} highContrast - High contrast mode
 * @property {boolean} largeText - Large text mode
 * @property {boolean} reducedMotion - Reduced motion mode
 */

export default {};