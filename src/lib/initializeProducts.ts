/**
 * INITIALIZE PRODUCTS - Script para inicializar produtos no localStorage
 * Execute este código no console do navegador para popular produtos iniciais
 */

const initialProducts = [
  { id: "1", name: "Coxinha", price: 5.00, stock: 50, category: "Salgados", barcode: "7891234567890" },
  { id: "2", name: "Refrigerante 2L", price: 8.50, stock: 30, category: "Bebidas", barcode: "7891234567891" },
  { id: "3", name: "Combo Lanche", price: 25.00, stock: 20, category: "Combos", barcode: "7891234567892" },
  { id: "4", name: "Pastel", price: 6.00, stock: 40, category: "Salgados", barcode: "7891234567893" },
  { id: "5", name: "Suco Natural", price: 7.00, stock: 25, category: "Bebidas", barcode: "7891234567894" },
]

// Salvar produtos no localStorage
if (typeof window !== 'undefined') {
  localStorage.setItem('mb_vendas_products', JSON.stringify(initialProducts))
  console.log('✅ Produtos inicializados com sucesso!')
  console.log('Total de produtos:', initialProducts.length)
}

export const initializeProducts = () => {
  if (typeof window === 'undefined') return
  
  const existingProducts = localStorage.getItem('mb_vendas_products')
  if (!existingProducts) {
    localStorage.setItem('mb_vendas_products', JSON.stringify(initialProducts))
    console.log('✅ Produtos inicializados automaticamente')
  }
}
