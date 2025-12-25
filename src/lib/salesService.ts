/**
 * SALES SERVICE - Backend completo para área de vendas
 * 
 * Responsabilidades:
 * 1. Criar e gerenciar vendas
 * 2. Atualizar estoque automaticamente
 * 3. Criar lançamentos no caixa
 * 4. Alimentar relatórios
 * 5. Cancelar vendas com reversão completa
 */

import { 
  Sale, 
  SaleItem, 
  Product, 
  PaymentMethod, 
  CashierTransaction, 
  StockMovement,
  SaleStatus 
} from './types'

// ==================== STORAGE KEYS ====================
const STORAGE_KEYS = {
  SALES: 'mb_vendas_sales',
  PRODUCTS: 'mb_vendas_products',
  CASHIER_TRANSACTIONS: 'mb_vendas_cashier_transactions',
  STOCK_MOVEMENTS: 'mb_vendas_stock_movements',
  CURRENT_USER: 'mb_vendas_current_user'
}

// ==================== HELPERS ====================
const getCurrentUser = () => {
  if (typeof window === 'undefined') return { id: '1', name: 'Sistema' }
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return user ? JSON.parse(user) : { id: '1', name: 'João Vendedor' }
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

const getCurrentDateTime = () => {
  const now = new Date()
  return {
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString('pt-BR'),
    iso: now.toISOString()
  }
}

// ==================== STORAGE OPERATIONS ====================
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Erro ao salvar ${key}:`, error)
  }
}

// ==================== PRODUCT OPERATIONS ====================
export const getProducts = (): Product[] => {
  return getFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, [])
}

export const updateProductStock = (productId: string, quantityChange: number): boolean => {
  const products = getProducts()
  const productIndex = products.findIndex(p => p.id === productId)
  
  if (productIndex === -1) {
    console.error(`Produto ${productId} não encontrado`)
    return false
  }
  
  const product = products[productIndex]
  const newStock = product.stock + quantityChange
  
  if (newStock < 0) {
    console.error(`Estoque insuficiente para ${product.name}. Estoque atual: ${product.stock}, tentativa: ${quantityChange}`)
    return false
  }
  
  products[productIndex] = { ...product, stock: newStock }
  saveToStorage(STORAGE_KEYS.PRODUCTS, products)
  
  return true
}

// ==================== STOCK MOVEMENT ====================
const createStockMovement = (
  productId: string,
  productName: string,
  quantity: number,
  type: StockMovement['type'],
  saleId?: string
): void => {
  const movements = getFromStorage<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, [])
  const { date, time, iso } = getCurrentDateTime()
  const user = getCurrentUser()
  
  const movement: StockMovement = {
    id: generateId(),
    productId,
    productName,
    quantity,
    type,
    saleId,
    date,
    time,
    userId: user.id,
    createdAt: iso
  }
  
  movements.push(movement)
  saveToStorage(STORAGE_KEYS.STOCK_MOVEMENTS, movements)
}

// ==================== CASHIER OPERATIONS ====================
const createCashierTransaction = (
  type: 'entrada' | 'saida',
  description: string,
  value: number,
  category: string,
  saleId?: string
): void => {
  const transactions = getFromStorage<CashierTransaction[]>(STORAGE_KEYS.CASHIER_TRANSACTIONS, [])
  const { date, time, iso } = getCurrentDateTime()
  
  const transaction: CashierTransaction = {
    id: generateId(),
    type,
    description,
    value,
    category,
    date,
    time,
    saleId,
    createdAt: iso
  }
  
  transactions.push(transaction)
  saveToStorage(STORAGE_KEYS.CASHIER_TRANSACTIONS, transactions)
}

// ==================== SALE VALIDATION ====================
const validateSale = (
  items: SaleItem[],
  paymentMethod: PaymentMethod,
  total: number
): { valid: boolean; error?: string } => {
  // Regra 1: Não permitir venda sem produto
  if (!items || items.length === 0) {
    return { valid: false, error: 'Venda deve conter pelo menos um produto' }
  }
  
  // Regra 2: Não permitir venda com valor zerado
  if (total <= 0) {
    return { valid: false, error: 'Total da venda deve ser maior que zero' }
  }
  
  // Regra 3: Não permitir venda sem forma de pagamento
  if (!paymentMethod) {
    return { valid: false, error: 'Forma de pagamento é obrigatória' }
  }
  
  // Regra 4: Validar estoque disponível
  const products = getProducts()
  for (const item of items) {
    const product = products.find(p => p.id === item.productId)
    if (!product) {
      return { valid: false, error: `Produto ${item.productName} não encontrado` }
    }
    if (product.stock < item.quantity) {
      return { valid: false, error: `Estoque insuficiente para ${item.productName}. Disponível: ${product.stock}` }
    }
  }
  
  return { valid: true }
}

// ==================== CREATE SALE ====================
export const createSale = (
  items: SaleItem[],
  paymentMethod: PaymentMethod,
  customerName?: string,
  discount: number = 0,
  observations?: string
): { success: boolean; sale?: Sale; error?: string } => {
  // Validar venda
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const total = subtotal - discount
  
  const validation = validateSale(items, paymentMethod, total)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }
  
  const { date, time, iso } = getCurrentDateTime()
  const user = getCurrentUser()
  
  // 1️⃣ CRIAR REGISTRO DA VENDA
  const sale: Sale = {
    id: generateId(),
    date,
    time,
    userId: user.id,
    userName: user.name,
    customerName: customerName || 'Cliente não identificado',
    paymentMethod,
    status: 'confirmada',
    items,
    subtotal,
    discount,
    total,
    observations,
    createdAt: iso
  }
  
  // Salvar venda
  const sales = getFromStorage<Sale[]>(STORAGE_KEYS.SALES, [])
  sales.push(sale)
  saveToStorage(STORAGE_KEYS.SALES, sales)
  
  // 2️⃣ ATUALIZAR ESTOQUE
  for (const item of items) {
    const stockUpdated = updateProductStock(item.productId, -item.quantity)
    if (!stockUpdated) {
      // Reverter venda se falhar atualização de estoque
      const updatedSales = sales.filter(s => s.id !== sale.id)
      saveToStorage(STORAGE_KEYS.SALES, updatedSales)
      return { success: false, error: `Falha ao atualizar estoque de ${item.productName}` }
    }
    
    // Registrar movimento de estoque
    createStockMovement(
      item.productId,
      item.productName,
      -item.quantity,
      'venda',
      sale.id
    )
  }
  
  // 3️⃣ ATUALIZAR CAIXA
  createCashierTransaction(
    'entrada',
    `Venda #${sale.id.slice(-8)} - ${sale.customerName}`,
    total,
    'Vendas',
    sale.id
  )
  
  // 4️⃣ ALIMENTAR RELATÓRIOS (dados já estão salvos e podem ser consultados)
  
  return { success: true, sale }
}

// ==================== CANCEL SALE ====================
export const cancelSale = (
  saleId: string,
  reason?: string
): { success: boolean; error?: string } => {
  const sales = getFromStorage<Sale[]>(STORAGE_KEYS.SALES, [])
  const saleIndex = sales.findIndex(s => s.id === saleId)
  
  if (saleIndex === -1) {
    return { success: false, error: 'Venda não encontrada' }
  }
  
  const sale = sales[saleIndex]
  
  if (sale.status === 'cancelada') {
    return { success: false, error: 'Venda já está cancelada' }
  }
  
  const { iso } = getCurrentDateTime()
  
  // 1️⃣ ALTERAR STATUS PARA CANCELADA
  sales[saleIndex] = {
    ...sale,
    status: 'cancelada',
    cancelledAt: iso,
    cancelReason: reason
  }
  saveToStorage(STORAGE_KEYS.SALES, sales)
  
  // 2️⃣ DEVOLVER ESTOQUE DOS PRODUTOS
  for (const item of sale.items) {
    updateProductStock(item.productId, item.quantity)
    
    // Registrar movimento de estoque
    createStockMovement(
      item.productId,
      item.productName,
      item.quantity,
      'cancelamento',
      sale.id
    )
  }
  
  // 3️⃣ CRIAR LANÇAMENTO NEGATIVO NO CAIXA (ESTORNO)
  createCashierTransaction(
    'saida',
    `Cancelamento Venda #${sale.id.slice(-8)} - ${sale.customerName}${reason ? ` (${reason})` : ''}`,
    sale.total,
    'Estornos',
    sale.id
  )
  
  // 4️⃣ REMOVER IMPACTO DOS RELATÓRIOS (venda marcada como cancelada)
  
  return { success: true }
}

// ==================== GET SALES ====================
export const getSales = (filters?: {
  status?: SaleStatus
  startDate?: string
  endDate?: string
  userId?: string
  customerId?: string
}): Sale[] => {
  let sales = getFromStorage<Sale[]>(STORAGE_KEYS.SALES, [])
  
  if (filters) {
    if (filters.status) {
      sales = sales.filter(s => s.status === filters.status)
    }
    if (filters.startDate) {
      sales = sales.filter(s => s.date >= filters.startDate!)
    }
    if (filters.endDate) {
      sales = sales.filter(s => s.date <= filters.endDate!)
    }
    if (filters.userId) {
      sales = sales.filter(s => s.userId === filters.userId)
    }
    if (filters.customerId) {
      sales = sales.filter(s => s.customerId === filters.customerId)
    }
  }
  
  return sales.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// ==================== GET SALE BY ID ====================
export const getSaleById = (saleId: string): Sale | null => {
  const sales = getFromStorage<Sale[]>(STORAGE_KEYS.SALES, [])
  return sales.find(s => s.id === saleId) || null
}

// ==================== REPORTS ====================
export const getSalesReport = (startDate?: string, endDate?: string) => {
  const sales = getSales({ 
    status: 'confirmada',
    startDate,
    endDate
  })
  
  const totalSales = sales.length
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
  const totalDiscount = sales.reduce((sum, sale) => sum + sale.discount, 0)
  
  // Vendas por forma de pagamento
  const salesByPaymentMethod = sales.reduce((acc, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total
    return acc
  }, {} as Record<string, number>)
  
  // Vendas por produto
  const salesByProduct = sales.reduce((acc, sale) => {
    sale.items.forEach(item => {
      if (!acc[item.productId]) {
        acc[item.productId] = {
          productName: item.productName,
          quantity: 0,
          revenue: 0
        }
      }
      acc[item.productId].quantity += item.quantity
      acc[item.productId].revenue += item.subtotal
    })
    return acc
  }, {} as Record<string, { productName: string; quantity: number; revenue: number }>)
  
  // Vendas por usuário
  const salesByUser = sales.reduce((acc, sale) => {
    if (!acc[sale.userId]) {
      acc[sale.userId] = {
        userName: sale.userName,
        salesCount: 0,
        revenue: 0
      }
    }
    acc[sale.userId].salesCount += 1
    acc[sale.userId].revenue += sale.total
    return acc
  }, {} as Record<string, { userName: string; salesCount: number; revenue: number }>)
  
  return {
    totalSales,
    totalRevenue,
    totalDiscount,
    salesByPaymentMethod,
    salesByProduct,
    salesByUser
  }
}

// ==================== CASHIER BALANCE ====================
export const getCashierBalance = (): number => {
  const transactions = getFromStorage<CashierTransaction[]>(STORAGE_KEYS.CASHIER_TRANSACTIONS, [])
  
  return transactions.reduce((balance, transaction) => {
    return transaction.type === 'entrada' 
      ? balance + transaction.value 
      : balance - transaction.value
  }, 0)
}

// ==================== STOCK MOVEMENTS ====================
export const getStockMovements = (productId?: string): StockMovement[] => {
  let movements = getFromStorage<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, [])
  
  if (productId) {
    movements = movements.filter(m => m.productId === productId)
  }
  
  return movements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
