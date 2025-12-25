export type Product = {
  id: string
  name: string
  price: number
  stock: number
  category: string
  barcode?: string
}

export type SaleItem = {
  productId: string
  productName: string // snapshot do nome no momento da venda
  quantity: number
  unitPrice: number // preço congelado no momento da venda
  subtotal: number
}

export type PaymentMethod = "Pix" | "Dinheiro" | "Cartão" | "Débito" | "Crédito" | "Crédito 2x" | "Crédito 3x"

export type SaleStatus = "confirmada" | "cancelada"

export type Sale = {
  id: string
  date: string // data da venda (ISO format)
  time: string // hora da venda
  userId: string // usuário que realizou a venda
  userName: string // nome do usuário (snapshot)
  customerId?: string // ID do cliente (opcional)
  customerName?: string // nome do cliente (opcional)
  paymentMethod: PaymentMethod
  status: SaleStatus
  items: SaleItem[] // itens vendidos
  subtotal: number // total bruto
  discount: number // descontos aplicados
  total: number // total final da venda
  observations?: string // observações adicionais
  createdAt: string // timestamp de criação
  cancelledAt?: string // timestamp de cancelamento (se aplicável)
  cancelReason?: string // motivo do cancelamento
}

export type CashierTransaction = {
  id: string
  type: "entrada" | "saida"
  description: string
  value: number
  category: string
  date: string
  time: string
  saleId?: string // referência à venda (se for transação de venda)
  createdAt: string
}

export type CashierSession = {
  id: string
  openedAt: string
  openedBy: string
  initialBalance: number
  currentBalance: number
  sales: Sale[]
  transactions: CashierTransaction[]
  status: "aberto" | "fechado"
  closedAt?: string
  closedBy?: string
  finalBalance?: number
}

export type StockMovement = {
  id: string
  productId: string
  productName: string
  quantity: number // positivo = entrada, negativo = saída
  type: "venda" | "cancelamento" | "ajuste" | "entrada"
  saleId?: string // referência à venda (se aplicável)
  date: string
  time: string
  userId: string
  createdAt: string
}

// Tipo legado para compatibilidade com código existente
export type CashierSale = {
  id: string
  customer: string
  total: number
  method: string
  time: string
  items: {
    product: Product
    quantity: number
    subtotal: number
  }[]
}
