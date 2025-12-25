/**
 * SALES HOOKS - Hooks customizados para gerenciar vendas
 */

import { useState, useEffect } from 'react'
import { 
  createSale, 
  cancelSale, 
  getSales, 
  getSalesReport,
  getCashierBalance,
  getProducts as getProductsFromService
} from '@/lib/salesService'
import { Sale, SaleItem, Product, PaymentMethod } from '@/lib/types'

/**
 * Hook para gerenciar vendas
 */
export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(false)

  const loadSales = (filters?: Parameters<typeof getSales>[0]) => {
    setLoading(true)
    try {
      const loadedSales = getSales(filters)
      setSales(loadedSales)
    } finally {
      setLoading(false)
    }
  }

  const createNewSale = async (
    items: SaleItem[],
    paymentMethod: PaymentMethod,
    customerName?: string,
    discount?: number,
    observations?: string
  ) => {
    setLoading(true)
    try {
      const result = createSale(items, paymentMethod, customerName, discount, observations)
      if (result.success) {
        loadSales()
        return { success: true, sale: result.sale }
      }
      return { success: false, error: result.error }
    } finally {
      setLoading(false)
    }
  }

  const cancelExistingSale = async (saleId: string, reason?: string) => {
    setLoading(true)
    try {
      const result = cancelSale(saleId, reason)
      if (result.success) {
        loadSales()
        return { success: true }
      }
      return { success: false, error: result.error }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSales()
  }, [])

  return {
    sales,
    loading,
    loadSales,
    createNewSale,
    cancelExistingSale
  }
}

/**
 * Hook para relatórios de vendas
 */
export const useSalesReport = (startDate?: string, endDate?: string) => {
  const [report, setReport] = useState<ReturnType<typeof getSalesReport> | null>(null)

  useEffect(() => {
    const reportData = getSalesReport(startDate, endDate)
    setReport(reportData)
  }, [startDate, endDate])

  return report
}

/**
 * Hook para saldo do caixa
 */
export const useCashierBalance = () => {
  const [balance, setBalance] = useState(0)

  const refreshBalance = () => {
    const currentBalance = getCashierBalance()
    setBalance(currentBalance)
  }

  useEffect(() => {
    refreshBalance()
  }, [])

  return { balance, refreshBalance }
}

/**
 * Hook para gerenciar produtos
 */
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])

  const loadProducts = () => {
    const loadedProducts = getProductsFromService()
    setProducts(loadedProducts)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return { products, loadProducts }
}
