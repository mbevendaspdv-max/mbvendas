"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { VoiceSaleModal } from "@/components/VoiceSaleModal"
import { Product, SaleItem, CashierSale } from "@/lib/types"
import { 
  DollarSign,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  Bell,
  Mic,
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
  Sparkles,
  Menu,
  Settings,
  LogOut,
  Home,
  FileText,
  Wallet,
  UserX,
  TrendingDown,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  Plus,
  Minus,
  Trash2,
  Edit,
  Save,
  ChevronRight,
  Building2,
  Phone,
  MapPin,
  User,
  Store,
  Percent,
  Image as ImageIcon,
  FileDown
} from "lucide-react"

type Sale = {
  id: string
  customer: string
  product: string
  value: number
  method: string
  status: "completed" | "pending" | "cancelled"
  date: string
  time: string
}

type Notification = {
  id: string
  type: "sale" | "stock" | "payment" | "cancellation"
  message: string
  time: string
  read: boolean
}

type Customer = {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  cpf?: string
  totalDebt: number
  lastPayment: string
  status: "active" | "blocked"
}

type Transaction = {
  id: string
  type: "entrada" | "saida"
  description: string
  value: number
  category: string
  date: string
  time: string
}

export default function MBVendas() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isVoiceSaleOpen, setIsVoiceSaleOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"dashboard" | "sales" | "installments" | "notifications" | "cashier" | "financial" | "debtors" | "products" | "settings" | "customers">("dashboard")
  const [showNotifications, setShowNotifications] = useState(false)
  const [cashierOpen, setCashierOpen] = useState(false)
  const [cashierBalance, setCashierBalance] = useState(0)
  const [initialBalance, setInitialBalance] = useState(0)
  const [tempInitialBalance, setTempInitialBalance] = useState("")
  const [cashierSales, setCashierSales] = useState<CashierSale[]>([])

  // Estados da tela de vendas
  const [selectedSeller, setSelectedSeller] = useState("João Vendedor")
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [saleItems, setSaleItems] = useState<SaleItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [observations, setObservations] = useState("")
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState<"value" | "percentage">("value")
  const [saleDate, setSaleDate] = useState("")
  const [saleTime, setSaleTime] = useState("")

  // Estados de clientes
  const [customers, setCustomers] = useState<Customer[]>([
    { id: "1", name: "João Silva", phone: "(11) 98765-4321", email: "joao@email.com", cpf: "123.456.789-00", totalDebt: 0, lastPayment: "15/01/2024", status: "active" },
    { id: "2", name: "Maria Santos", phone: "(11) 97654-3210", email: "maria@email.com", totalDebt: 0, lastPayment: "20/01/2024", status: "active" },
  ])
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({})
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  // Estados da tela de produtos
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Coxinha", price: 5.00, stock: 50, category: "Salgados", barcode: "7891234567890" },
    { id: "2", name: "Refrigerante 2L", price: 8.50, stock: 30, category: "Bebidas", barcode: "7891234567891" },
    { id: "3", name: "Combo Lanche", price: 25.00, stock: 20, category: "Combos", barcode: "7891234567892" },
    { id: "4", name: "Pastel", price: 6.00, stock: 40, category: "Salgados", barcode: "7891234567893" },
    { id: "5", name: "Suco Natural", price: 7.00, stock: 25, category: "Bebidas", barcode: "7891234567894" },
  ])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({})

  // Estados de configurações
  const [companyInfo, setCompanyInfo] = useState({
    name: "MBvendas",
    cnpj: "00.000.000/0001-00",
    phone: "(11) 98765-4321",
    address: "Rua Exemplo, 123 - São Paulo, SP"
  })
  const [paymentMethods, setPaymentMethods] = useState([
    "Dinheiro",
    "PIX",
    "Débito",
    "Crédito",
    "Crédito 2x",
    "Crédito 3x"
  ])

  // Atualizar hora apenas no cliente
  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Tema automático baseado no horário
  useEffect(() => {
    if (currentTime) {
      const hour = currentTime.getHours()
      setIsDarkMode(hour < 6 || hour >= 18)
    }
  }, [currentTime])

  // Inicializar data e hora da venda com valores atuais
  useEffect(() => {
    if (currentTime && !saleDate) {
      setSaleDate(currentTime.toISOString().split('T')[0])
      setSaleTime(currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    }
  }, [currentTime, saleDate])

  // Dados mockados
  const todaySales = 15420.50
  const monthSales = 89750.30
  const monthGoal = 100000
  const activeClients = 342
  const clientsUpToDate = 298
  const lowStock = 12

  const recentSales: Sale[] = [
    { id: "1", customer: "João Silva", product: "Coxinha", value: 5.00, method: "Débito", status: "completed", date: "Hoje", time: "14:32" },
    { id: "2", customer: "Maria Santos", product: "Refrigerante", value: 7.50, method: "PIX", status: "completed", date: "Hoje", time: "14:15" },
    { id: "3", customer: "Pedro Costa", product: "Combo Lanche", value: 25.00, method: "Crédito 2x", status: "pending", date: "Hoje", time: "13:45" },
    { id: "4", customer: "Ana Paula", product: "Salgados", value: 15.00, method: "Dinheiro", status: "completed", date: "Hoje", time: "13:20" },
  ]

  const notifications: Notification[] = [
    { id: "1", type: "cancellation", message: "Fulano cancelou venda de R$10 e lançou nova de R$5", time: "10 min atrás", read: false },
    { id: "2", type: "stock", message: "Estoque de Coxinha está baixo (5 unidades)", time: "1h atrás", read: false },
    { id: "3", type: "payment", message: "Pagamento de João Silva confirmado - R$150", time: "2h atrás", read: true },
    { id: "4", type: "sale", message: "Nova venda registrada - Maria Santos R$45", time: "3h atrás", read: true },
  ]

  const debtors: Customer[] = [
    { id: "1", name: "Carlos Mendes", phone: "(11) 98765-4321", totalDebt: 450.00, lastPayment: "15/01/2024", status: "blocked" },
    { id: "2", name: "Fernanda Lima", phone: "(11) 97654-3210", totalDebt: 120.00, lastPayment: "20/01/2024", status: "active" },
    { id: "3", name: "Roberto Alves", phone: "(11) 96543-2109", totalDebt: 890.00, lastPayment: "10/01/2024", status: "blocked" },
    { id: "4", name: "Juliana Costa", phone: "(11) 95432-1098", totalDebt: 75.50, lastPayment: "22/01/2024", status: "active" },
  ]

  const transactions: Transaction[] = [
    { id: "1", type: "entrada", description: "Venda - João Silva", value: 150.00, category: "Vendas", date: "Hoje", time: "14:32" },
    { id: "2", type: "saida", description: "Compra de estoque", value: 320.00, category: "Fornecedores", date: "Hoje", time: "10:15" },
    { id: "3", type: "entrada", description: "Venda - Maria Santos", value: 85.00, category: "Vendas", date: "Hoje", time: "13:20" },
    { id: "4", type: "saida", description: "Conta de luz", value: 180.00, category: "Despesas", date: "Ontem", time: "16:45" },
    { id: "5", type: "entrada", description: "Pagamento de dívida - Carlos", value: 200.00, category: "Recebimentos", date: "Ontem", time: "11:30" },
  ]

  const totalEntradas = transactions.filter(t => t.type === "entrada").reduce((sum, t) => sum + t.value, 0)
  const totalSaidas = transactions.filter(t => t.type === "saida").reduce((sum, t) => sum + t.value, 0)
  const totalDebt = debtors.reduce((sum, d) => sum + d.totalDebt, 0)
  const blockedCustomers = debtors.filter(d => d.status === "blocked").length

  const unreadNotifications = notifications.filter(n => !n.read).length

  // Funções de clientes
  const addCustomer = () => {
    if (newCustomer.name && newCustomer.phone) {
      const customer: Customer = {
        id: Date.now().toString(),
        name: newCustomer.name,
        phone: newCustomer.phone,
        email: newCustomer.email || "",
        address: newCustomer.address || "",
        cpf: newCustomer.cpf || "",
        totalDebt: 0,
        lastPayment: new Date().toLocaleDateString('pt-BR'),
        status: "active"
      }
      setCustomers([...customers, customer])
      setNewCustomer({})
      setShowCustomerModal(false)
    }
  }

  const updateCustomer = () => {
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? editingCustomer : c))
      setEditingCustomer(null)
    }
  }

  const deleteCustomer = (id: string) => {
    if (confirm("Deseja realmente excluir este cliente?")) {
      setCustomers(customers.filter(c => c.id !== id))
    }
  }

  // Funções da tela de vendas
  const addItemToSale = () => {
    if (selectedProduct && quantity > 0) {
      const existingItem = saleItems.find(item => item.product.id === selectedProduct.id)
      
      if (existingItem) {
        setSaleItems(saleItems.map(item => 
          item.product.id === selectedProduct.id 
            ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * item.product.price }
            : item
        ))
      } else {
        setSaleItems([...saleItems, {
          product: selectedProduct,
          quantity,
          subtotal: selectedProduct.price * quantity
        }])
      }
      
      setSelectedProduct(null)
      setQuantity(1)
    }
  }

  const removeItemFromSale = (productId: string) => {
    setSaleItems(saleItems.filter(item => item.product.id !== productId))
  }

  const calculateSubtotal = () => {
    return saleItems.reduce((sum, item) => sum + item.subtotal, 0)
  }

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal()
    if (discountType === "percentage") {
      return (subtotal * discount) / 100
    }
    return discount
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discountValue = calculateDiscount()
    return subtotal - discountValue
  }

  const exportSaleToPDF = () => {
    alert("Exportação para PDF em desenvolvimento!\n\nEm breve você poderá exportar a venda em PDF.")
  }

  const exportSaleToImage = () => {
    alert("Exportação para Imagem em desenvolvimento!\n\nEm breve você poderá exportar a venda como imagem.")
  }

  const finalizeSale = () => {
    if (saleItems.length === 0) {
      alert("Adicione produtos à venda!")
      return
    }
    if (!paymentMethod) {
      alert("Selecione a forma de pagamento!")
      return
    }
    if (!cashierOpen) {
      alert("O caixa precisa estar aberto para finalizar vendas!")
      return
    }
    
    const total = calculateTotal()
    const newSale: CashierSale = {
      id: Date.now().toString(),
      customer: selectedCustomer || "Cliente não identificado",
      total,
      method: paymentMethod,
      time: saleTime,
      items: [...saleItems]
    }
    
    // Adicionar venda ao caixa
    setCashierSales([...cashierSales, newSale])
    setCashierBalance(cashierBalance + total)
    
    alert(`Venda finalizada!\\nData: ${saleDate}\\nHora: ${saleTime}\\nTotal: R$ ${total.toFixed(2)}\\nPagamento: ${paymentMethod}\\n\\n✅ Venda registrada no caixa!`)
    
    // Limpar venda
    setSaleItems([])
    setSelectedCustomer("")
    setPaymentMethod("")
    setObservations("")
    setDiscount(0)
    setDiscountType("value")
    setSaleDate(currentTime ? currentTime.toISOString().split('T')[0] : "")
    setSaleTime(currentTime ? currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : "")
    setActiveTab("dashboard")
  }

  // Handler para venda por voz
  const handleVoiceSaleConfirm = (items: SaleItem[], customer: string, method: string) => {
    if (!cashierOpen) {
      alert("O caixa precisa estar aberto para finalizar vendas!")
      return
    }

    const total = items.reduce((sum, item) => sum + item.subtotal, 0)
    const newSale: CashierSale = {
      id: Date.now().toString(),
      customer,
      total,
      method,
      time: currentTime ? currentTime.toLocaleTimeString('pt-BR') : '',
      items
    }
    
    setCashierSales([...cashierSales, newSale])
    setCashierBalance(cashierBalance + total)
    
    alert(`✅ Venda por voz registrada!\\n\\nCliente: ${customer}\\nTotal: R$ ${total.toFixed(2)}\\nPagamento: ${method}`)
  }

  // Funções de produtos
  const addProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.stock && newProduct.category) {
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        price: newProduct.price,
        stock: newProduct.stock,
        category: newProduct.category,
        barcode: newProduct.barcode || ""
      }
      setProducts([...products, product])
      setNewProduct({})
    }
  }

  const updateProduct = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p))
      setEditingProduct(null)
    }
  }

  const deleteProduct = (id: string) => {
    if (confirm("Deseja realmente excluir este produto?")) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleOpenCashier = () => {
    const value = parseFloat(tempInitialBalance)
    if (isNaN(value) || value < 0) {
      alert("Digite um valor inicial válido!")
      return
    }
    
    setInitialBalance(value)
    setCashierBalance(value)
    setCashierOpen(true)
    setCashierSales([])
    setTempInitialBalance("")
    alert(`✅ Caixa aberto!\\n\\nSaldo inicial: R$ ${value.toFixed(2)}`)
  }

  const handleCloseCashier = () => {
    const finalBalance = cashierBalance
    const difference = finalBalance - initialBalance
    const totalSalesValue = cashierSales.reduce((sum, sale) => sum + sale.total, 0)
    
    let report = `📊 FECHAMENTO DE CAIXA\\n\\n`
    report += `💰 Saldo inicial: R$ ${initialBalance.toFixed(2)}\\n`
    report += `💵 Total em vendas: R$ ${totalSalesValue.toFixed(2)}\\n`
    report += `📦 Quantidade de vendas: ${cashierSales.length}\\n`
    report += `💳 Saldo final: R$ ${finalBalance.toFixed(2)}\\n`
    report += `${difference >= 0 ? '✅' : '⚠️'} Diferença: R$ ${difference.toFixed(2)}\\n\\n`
    
    if (cashierSales.length > 0) {
      report += `📋 VENDAS REALIZADAS:\\n\\n`
      cashierSales.forEach((sale, index) => {
        report += `${index + 1}. ${sale.time} - ${sale.customer}\\n`
        report += `   R$ ${sale.total.toFixed(2)} (${sale.method})\\n`
      })
    }
    
    alert(report)
    setCashierOpen(false)
    setCashierBalance(0)
    setInitialBalance(0)
    setCashierSales([])
  }

  // Renderizar apenas após montar no cliente
  if (!currentTime) {
    return null
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950' 
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-colors ${
        isDarkMode 
          ? 'bg-blue-900/80 border-blue-800' 
          : 'bg-white/80 border-blue-200'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/279af986-481a-436b-a000-81a6c7ac5799.jpg" 
                alt="MBvendas Logo" 
                className="h-10 w-auto rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  MBvendas
                </h1>
                <p className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {currentTime.toLocaleTimeString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status do Caixa */}
              <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                cashierOpen 
                  ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
              }`}>
                {cashierOpen ? '🟢 Caixa Aberto' : '🔴 Caixa Fechado'}
              </div>

              {/* Botão de Notificações */}
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-blue-800' 
                    : 'hover:bg-blue-100'
                }`}
              >
                <Bell className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`} />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab("settings")}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-blue-800' 
                    : 'hover:bg-blue-100'
                }`}
              >
                <Settings className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Painel de Notificações */}
      {showNotifications && (
        <div className={`fixed top-20 right-4 w-96 max-h-[500px] overflow-y-auto rounded-xl shadow-2xl border z-50 ${
          isDarkMode 
            ? 'bg-blue-900 border-blue-800' 
            : 'bg-white border-blue-200'
        }`}>
          <div className="p-4 border-b border-blue-200 dark:border-blue-800">
            <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
              Notificações
            </h3>
          </div>
          <div className="divide-y divide-blue-200 dark:divide-blue-800">
            {notifications.map(notif => (
              <div 
                key={notif.id}
                className={`p-4 transition-colors ${
                  notif.read 
                    ? isDarkMode ? 'bg-blue-900' : 'bg-white'
                    : isDarkMode ? 'bg-blue-800' : 'bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    notif.type === 'cancellation' ? 'bg-red-100 dark:bg-red-950' :
                    notif.type === 'stock' ? 'bg-orange-100 dark:bg-orange-950' :
                    notif.type === 'payment' ? 'bg-green-100 dark:bg-green-950' :
                    'bg-blue-100 dark:bg-blue-950'
                  }`}>
                    {notif.type === 'cancellation' && <XCircle className="w-4 h-4 text-red-600" />}
                    {notif.type === 'stock' && <AlertTriangle className="w-4 h-4 text-orange-600" />}
                    {notif.type === 'payment' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    {notif.type === 'sale' && <ShoppingCart className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                      {notif.message}
                    </p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-blue-500' : 'text-blue-500'}`}>
                      {notif.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Venda por Voz */}
      <VoiceSaleModal 
        isOpen={isVoiceSaleOpen}
        onClose={() => setIsVoiceSaleOpen(false)}
        products={products}
        onConfirmSale={handleVoiceSaleConfirm}
        isDarkMode={isDarkMode}
      />

      {/* Modal de Cliente */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className={`w-full max-w-md p-6 ${isDarkMode ? 'bg-blue-900 border-blue-800' : 'bg-white border-blue-200'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
              Novo Cliente
            </h3>
            <div className="space-y-3">
              <Input 
                placeholder="Nome completo *"
                value={newCustomer.name || ""}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
              />
              <Input 
                placeholder="Telefone *"
                value={newCustomer.phone || ""}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
              />
              <Input 
                placeholder="Email"
                value={newCustomer.email || ""}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
              />
              <Input 
                placeholder="CPF"
                value={newCustomer.cpf || ""}
                onChange={(e) => setNewCustomer({...newCustomer, cpf: e.target.value})}
                className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
              />
              <Textarea 
                placeholder="Endereço"
                value={newCustomer.address || ""}
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={addCustomer} className="flex-1 bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCustomerModal(false)
                  setNewCustomer({})
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Navegação */}
      <nav className={`border-b ${isDarkMode ? 'border-blue-800' : 'border-blue-200'}`}>
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: "dashboard", label: "Dashboard", icon: Home },
              { id: "sales", label: "Vendas", icon: ShoppingCart },
              { id: "customers", label: "Clientes", icon: Users },
              { id: "products", label: "Produtos", icon: Package },
              { id: "cashier", label: "Caixa", icon: Wallet },
              { id: "financial", label: "Financeiro", icon: BarChart3 },
              { id: "debtors", label: "Devedores", icon: UserX },
              { id: "installments", label: "Parcelas", icon: Calendar },
            ].map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : isDarkMode
                        ? 'border-transparent text-blue-400 hover:text-blue-300'
                        : 'border-transparent text-blue-600 hover:text-blue-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Botão de Vendas Destacado */}
            <Card className={`p-8 border-2 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-blue-900 to-cyan-900 border-blue-700' 
                : 'bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-300'
            }`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-2xl">
                    <ShoppingCart className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                      Nova Venda
                    </h2>
                    <p className={`text-lg ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                      Registre vendas rapidamente
                    </p>
                  </div>
                </div>
                <Button 
                  size="lg"
                  onClick={() => setActiveTab("sales")}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-6 text-xl rounded-2xl shadow-2xl hover:scale-105 transition-all"
                >
                  Iniciar Venda
                </Button>
              </div>
            </Card>

            {/* Botão de Venda por Voz */}
            <Card className={`p-6 border-2 ${
              isDarkMode 
                ? 'bg-blue-900/50 border-blue-800' 
                : 'bg-white border-blue-200'
            }`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                      🎤 Venda por Voz
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      Registre vendas falando naturalmente - ZERO custo, 100% navegador
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => setIsVoiceSaleOpen(true)}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 rounded-xl shadow-lg"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Iniciar Venda por Voz
                </Button>
              </div>
            </Card>

            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Faturamento do Dia */}
              <Card className={`p-6 transition-all hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-green-950 to-emerald-950 border-green-900' 
                  : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    isDarkMode ? 'bg-green-900' : 'bg-green-100'
                  }`}>
                    <DollarSign className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Hoje
                  </Badge>
                </div>
                <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                  Faturamento do Dia
                </h3>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  R$ {todaySales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  +12% vs ontem
                </p>
              </Card>

              {/* Faturamento do Mês */}
              <Card className={`p-6 transition-all hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-blue-950 to-cyan-950 border-blue-900' 
                  : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
                  }`}>
                    <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Mês
                  </Badge>
                </div>
                <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  Faturamento do Mês
                </h3>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  R$ {monthSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <div className="mt-3">
                  <Progress value={(monthSales / monthGoal) * 100} className="h-2" />
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {((monthSales / monthGoal) * 100).toFixed(1)}% da meta
                  </p>
                </div>
              </Card>

              {/* Clientes Ativos */}
              <Card className={`p-6 transition-all hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-purple-950 to-pink-950 border-purple-900' 
                  : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    isDarkMode ? 'bg-purple-900' : 'bg-purple-100'
                  }`}>
                    <Users className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <Badge variant="outline" className="text-purple-600 border-purple-600">
                    Ativos
                  </Badge>
                </div>
                <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  Clientes Ativos
                </h3>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {activeClients}
                </p>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  {clientsUpToDate} em dia
                </p>
              </Card>

              {/* Produtos em Baixa */}
              <Card className={`p-6 transition-all hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-orange-950 to-red-950 border-orange-900' 
                  : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    isDarkMode ? 'bg-orange-900' : 'bg-orange-100'
                  }`}>
                    <AlertTriangle className={`w-6 h-6 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    Alerta
                  </Badge>
                </div>
                <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                  Estoque Baixo
                </h3>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {lowStock}
                </p>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  Produtos críticos
                </p>
              </Card>
            </div>

            {/* Últimas Vendas */}
            <Card className={`p-6 ${
              isDarkMode 
                ? 'bg-blue-900/50 border-blue-800' 
                : 'bg-white border-blue-200'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                  Últimas Vendas
                </h3>
                <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Ver todas
                </Button>
              </div>

              <div className="space-y-4">
                {recentSales.map(sale => (
                  <div 
                    key={sale.id}
                    className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                      isDarkMode 
                        ? 'bg-blue-800/50 border-blue-700' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          sale.status === 'completed' ? 'bg-green-100 dark:bg-green-950' :
                          sale.status === 'pending' ? 'bg-orange-100 dark:bg-orange-950' :
                          'bg-red-100 dark:bg-red-950'
                        }`}>
                          {sale.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                          {sale.status === 'pending' && <Clock className="w-5 h-5 text-orange-600" />}
                          {sale.status === 'cancelled' && <XCircle className="w-5 h-5 text-red-600" />}
                        </div>
                        <div>
                          <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                            {sale.customer}
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            {sale.product} • {sale.method}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                          R$ {sale.value.toFixed(2)}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-blue-500' : 'text-blue-500'}`}>
                          {sale.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "sales" && (
          <div className="space-y-4">
            {/* Header da Tela de Vendas */}
            <div className={`flex items-center justify-between p-4 rounded-xl ${
              isDarkMode ? 'bg-blue-600' : 'bg-blue-600'
            }`}>
              <button 
                onClick={() => setActiveTab("dashboard")}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <h2 className="text-xl font-bold text-white">Nova Venda</h2>
              <button className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                <Settings className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Vendedor */}
            <Card className={`p-4 ${isDarkMode ? 'bg-blue-900/50 border-blue-800' : 'bg-white border-blue-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Vendedor
                  </p>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                    {selectedSeller}
                  </p>
                </div>
                <Button variant="outline" size="sm">Alterar</Button>
              </div>
            </Card>

            {/* Cliente */}
            <Card className={`p-4 ${isDarkMode ? 'bg-blue-900/50 border-blue-800' : 'bg-white border-blue-200'}`}>
              <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Cliente
              </p>
              <div className="flex gap-2">
                <select 
                  className={`flex-1 p-3 rounded-lg border ${
                    isDarkMode ? 'bg-blue-800 border-blue-700 text-white' : 'bg-white border-blue-200'
                  }`}
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  <option value="">Selecionar cliente (opcional)</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.name}>
                      {customer.name} - {customer.phone}
                    </option>
                  ))}
                </select>
                <Button 
                  onClick={() => setShowCustomerModal(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Produtos */}
            <Card className={`p-4 ${isDarkMode ? 'bg-blue-900/50 border-blue-800' : 'bg-white border-blue-200'}`}>
              <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Produtos
              </p>
              
              {/* Adicionar Produto */}
              <div className="space-y-3 mb-4">
                <select 
                  className={`w-full p-3 rounded-lg border ${
                    isDarkMode ? 'bg-blue-800 border-blue-700 text-white' : 'bg-white border-blue-200'
                  }`}
                  value={selectedProduct?.id || ""}
                  onChange={(e) => {
                    const product = products.find(p => p.id === e.target.value)
                    setSelectedProduct(product || null)
                  }}
                >
                  <option value="">Selecione um produto</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - R$ {product.price.toFixed(2)}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <Input 
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    placeholder="Qtd"
                    className={`w-24 ${isDarkMode ? 'bg-blue-800 border-blue-700' : ''}`}
                  />
                  <Button 
                    onClick={addItemToSale}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Lista de Produtos Adicionados */}
              {saleItems.length > 0 && (
                <div className="space-y-2">
                  {saleItems.map((item, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border flex items-center justify-between ${
                        isDarkMode ? 'bg-blue-800/50 border-blue-700' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex-1">
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                          {item.product.name}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {item.quantity}x R$ {item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                          R$ {item.subtotal.toFixed(2)}
                        </p>
                        <button 
                          onClick={() => removeItemFromSale(item.product.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-950 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Forma de Pagamento */}
            <Card className={`p-4 ${isDarkMode ? 'bg-blue-900/50 border-blue-800' : 'bg-white border-blue-200'}`}>
              <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Forma de Pagamento
              </p>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map(method => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      paymentMethod === method
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : isDarkMode
                          ? 'border-blue-700 bg-blue-800/50 text-blue-300 hover:border-blue-600'
                          : 'border-blue-200 bg-white text-blue-900 hover:border-blue-400'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </Card>

            {/* Desconto */}
            <Card className={`p-4 ${isDarkMode ? 'bg-blue-900/50 border-blue-800' : 'bg-white border-blue-200'}`}>
              <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Desconto
              </p>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setDiscountType("value")}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      discountType === "value"
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : isDarkMode
                          ? 'border-blue-700 bg-blue-800/50 text-blue-300'
                          : 'border-blue-200 bg-white text-blue-900'
                    }`}
                  >
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Valor (R$)
                  </button>
                  <button
                    onClick={() => setDiscountType("percentage")}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      discountType === "percentage"
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : isDarkMode
                          ? 'border-blue-700 bg-blue-800/50 text-blue-300'
                          : 'border-blue-200 bg-white text-blue-900'
                    }`}
                  >
                    <Percent className="w-4 h-4 inline mr-2" />
                    Porcentagem (%)
                  </button>
                </div>
                <Input 
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  placeholder={discountType === "value" ? "R$ 0,00" : "0%"}
                  className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                />
                {discount > 0 && (
                  <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Desconto aplicado: R$ {calculateDiscount().toFixed(2)}
                  </p>
                )}
              </div>
            </Card>

            {/* Data e Hora */}
            <Card className={`p-4 ${isDarkMode ? 'bg-blue-900/50 border-blue-800' : 'bg-white border-blue-200'}`}>
              <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Data e Hora da Venda
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs ${isDarkMode ? 'text-blue-500' : 'text-blue-500'}`}>Data</label>
                  <Input 
                    type="date"
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                  />
                </div>
                <div>
                  <label className={`text-xs ${isDarkMode ? 'text-blue-500' : 'text-blue-500'}`}>Hora</label>
                  <Input 
                    type="time"
                    value={saleTime}
                    onChange={(e) => setSaleTime(e.target.value)}
                    className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                  />
                </div>
              </div>
            </Card>

            {/* Observações */}
            <Card className={`p-4 ${isDarkMode ? 'bg-blue-900/50 border-blue-800' : 'bg-white border-blue-200'}`}>
              <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Observações
              </p>
              <Textarea 
                placeholder="Observações adicionais (opcional)"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                rows={3}
              />
            </Card>

            {/* Total */}
            <Card className={`p-6 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-green-950 to-emerald-950 border-green-900' 
                : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    Subtotal
                  </p>
                  <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-green-900'}`}>
                    R$ {calculateSubtotal().toFixed(2)}
                  </p>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between">
                    <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      Desconto ({discountType === "percentage" ? `${discount}%` : "R$"})
                    </p>
                    <p className={`text-lg font-semibold text-red-600`}>
                      - R$ {calculateDiscount().toFixed(2)}
                    </p>
                  </div>
                )}
                <div className="border-t border-green-700 dark:border-green-800 pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <p className={`text-lg font-medium ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                      Total
                    </p>
                    <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-green-900'}`}>
                      R$ {calculateTotal().toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Botões de Ação */}
            <div className="space-y-3">
              <Button 
                onClick={finalizeSale}
                size="lg"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-xl rounded-xl shadow-2xl"
              >
                Finalizar Venda
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={exportSaleToPDF}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button 
                  onClick={exportSaleToImage}
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Exportar Imagem
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="space-y-6">
            {/* Header Clientes */}
            <Card className={`p-6 ${isDarkMode ? 'bg-blue-900/50 border-blue-800' : 'bg-white border-blue-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                  Gerenciar Clientes
                </h3>
                <Button 
                  onClick={() => setShowCustomerModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Cliente
                </Button>
              </div>

              {/* Lista de Clientes */}
              <div className="space-y-3">
                {customers.map(customer => (
                  <div 
                    key={customer.id}
                    className={`p-4 rounded-lg border ${
                      isDarkMode ? 'bg-blue-800/50 border-blue-700' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    {editingCustomer?.id === customer.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input 
                            value={editingCustomer.name}
                            onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                            className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                          />
                          <Input 
                            value={editingCustomer.phone}
                            onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                            className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                          />
                          <Input 
                            value={editingCustomer.email || ""}
                            onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                            className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                          />
                          <Input 
                            value={editingCustomer.cpf || ""}
                            onChange={(e) => setEditingCustomer({...editingCustomer, cpf: e.target.value})}
                            className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={updateCustomer} size="sm" className="bg-green-600 hover:bg-green-700">
                            <Save className="w-4 h-4 mr-2" />
                            Salvar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingCustomer(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                              {customer.name}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {customer.status === "active" ? "Ativo" : "Bloqueado"}
                            </Badge>
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            {customer.phone} {customer.email && `• ${customer.email}`}
                          </p>
                          {customer.cpf && (
                            <p className={`text-xs ${isDarkMode ? 'text-blue-500' : 'text-blue-500'}`}>
                              CPF: {customer.cpf}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingCustomer(customer)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteCustomer(customer.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Header Produtos */}
            <Card className={`p-6 ${isDarkMode ? 'bg-blue-900/50 border-blue-800' : 'bg-white border-blue-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                  Gerenciar Produtos
                </h3>
                <Button 
                  onClick={() => setNewProduct({ name: "", price: 0, stock: 0, category: "" })}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Produto
                </Button>
              </div>

              {/* Formulário Novo Produto */}
              {newProduct.name !== undefined && (
                <div className={`p-4 rounded-lg border mb-4 ${
                  isDarkMode ? 'bg-blue-800/50 border-blue-700' : 'bg-blue-50 border-blue-200'
                }`}>
                  <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                    Adicionar Novo Produto
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input 
                      placeholder="Nome do produto"
                      value={newProduct.name || ""}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                    />
                    <Input 
                      type="number"
                      placeholder="Preço"
                      value={newProduct.price || ""}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                    />
                    <Input 
                      type="number"
                      placeholder="Estoque"
                      value={newProduct.stock || ""}
                      onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                      className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                    />
                    <Input 
                      placeholder="Categoria"
                      value={newProduct.category || ""}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                    />
                    <Input 
                      placeholder="Código de barras (opcional)"
                      value={newProduct.barcode || ""}
                      onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                      className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button onClick={addProduct} className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setNewProduct({})}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              {/* Lista de Produtos */}
              <div className="space-y-3">
                {products.map(product => (
                  <div 
                    key={product.id}
                    className={`p-4 rounded-lg border ${
                      isDarkMode ? 'bg-blue-800/50 border-blue-700' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    {editingProduct?.id === product.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input 
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                            className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                          />
                          <Input 
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                            className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                          />
                          <Input 
                            type="number"
                            value={editingProduct.stock}
                            onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                            className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                          />
                          <Input 
                            value={editingProduct.category}
                            onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                            className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={updateProduct} size="sm" className="bg-green-600 hover:bg-green-700">
                            <Save className="w-4 h-4 mr-2" />
                            Salvar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingProduct(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                              {product.name}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            R$ {product.price.toFixed(2)} • Estoque: {product.stock} un
                          </p>
                          {product.barcode && (
                            <p className={`text-xs ${isDarkMode ? 'text-blue-500' : 'text-blue-500'}`}>
                              Código: {product.barcode}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "cashier" && (
          <div className="space-y-6">
            {/* Controle do Caixa */}
            {!cashierOpen ? (
              <Card className={`p-8 border-2 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-blue-900 to-cyan-900 border-blue-700' 
                  : 'bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-300'
              }`}>
                <div className="max-w-md mx-auto text-center space-y-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-2xl inline-block">
                    <Wallet className="w-16 h-16 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                      Abrir Caixa
                    </h2>
                    <p className={`text-lg ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                      Digite o valor inicial do caixa
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Input 
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="R$ 0,00"
                      value={tempInitialBalance}
                      onChange={(e) => setTempInitialBalance(e.target.value)}
                      className={`text-center text-2xl h-16 ${isDarkMode ? 'bg-blue-800 border-blue-700' : ''}`}
                    />
                    <Button 
                      size="lg"
                      onClick={handleOpenCashier}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-xl rounded-2xl shadow-2xl"
                    >
                      Abrir Caixa
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <>
                {/* Resumo do Caixa Aberto */}
                <Card className={`p-8 border-2 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-green-900 to-emerald-900 border-green-700' 
                    : 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-300'
                }`}>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 shadow-2xl">
                        <Wallet className="w-12 h-12 text-white" />
                      </div>
                      <div>
                        <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-green-900'}`}>
                          Caixa Aberto
                        </h2>
                        <p className={`text-lg ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                          Saldo atual: R$ {cashierBalance.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="lg"
                      onClick={handleCloseCashier}
                      className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-12 py-6 text-xl rounded-2xl shadow-2xl hover:scale-105 transition-all"
                    >
                      Fechar Caixa
                    </Button>
                  </div>
                </Card>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className={`p-6 ${
                    isDarkMode 
                      ? 'bg-blue-900/50 border-blue-800' 
                      : 'bg-white border-blue-200'
                  }`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950">
                        <DollarSign className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                        Saldo Inicial
                      </h3>
                    </div>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                      R$ {initialBalance.toFixed(2)}
                    </p>
                  </Card>

                  <Card className={`p-6 ${
                    isDarkMode 
                      ? 'bg-blue-900/50 border-blue-800' 
                      : 'bg-white border-blue-200'
                  }`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-green-100 dark:bg-green-950">
                        <ShoppingCart className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                        Total Vendas
                      </h3>
                    </div>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                      R$ {cashierSales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}
                    </p>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {cashierSales.length} vendas
                    </p>
                  </Card>

                  <Card className={`p-6 ${
                    isDarkMode 
                      ? 'bg-blue-900/50 border-blue-800' 
                      : 'bg-white border-blue-200'
                  }`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950">
                        <Wallet className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                        Saldo Atual
                      </h3>
                    </div>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                      R$ {cashierBalance.toFixed(2)}
                    </p>
                  </Card>
                </div>

                {/* Lista de Vendas do Caixa */}
                {cashierSales.length > 0 && (
                  <Card className={`p-6 ${
                    isDarkMode 
                      ? 'bg-blue-900/50 border-blue-800' 
                      : 'bg-white border-blue-200'
                  }`}>
                    <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                      Vendas Realizadas ({cashierSales.length})
                    </h3>

                    <div className="space-y-4">
                      {cashierSales.map((sale, index) => (
                        <div 
                          key={sale.id}
                          className={`p-4 rounded-xl border ${
                            isDarkMode 
                              ? 'bg-blue-800/50 border-blue-700' 
                              : 'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                                  Venda #{index + 1} - {sale.customer}
                                </p>
                                <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                  {sale.time} • {sale.method}
                                </p>
                              </div>
                            </div>
                            <p className={`text-lg font-bold text-green-600`}>
                              R$ {sale.total.toFixed(2)}
                            </p>
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-blue-500' : 'text-blue-500'}`}>
                            {sale.items.map((item, i) => (
                              <span key={i}>
                                {item.quantity}x {item.product.name}
                                {i < sale.items.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4">
            {/* Header Configurações */}
            <div className={`flex items-center justify-between p-4 rounded-xl ${
              isDarkMode ? 'bg-orange-600' : 'bg-orange-600'
            }`}>
              <button 
                onClick={() => setActiveTab("dashboard")}
                className="p-2 hover:bg-orange-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <h2 className="text-xl font-bold text-white">Configurações</h2>
              <div className="w-10"></div>
            </div>

            {/* Informações da Empresa */}
            <Card className={`p-6 ${isDarkMode ? 'bg-blue-900/50 border-blue-800' : 'bg-white border-blue-200'}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-950">
                    <Building2 className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                      Informações da Empresa
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      Dados cadastrais do estabelecimento
                    </p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>

              <div className="space-y-4">
                <div>
                  <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Nome
                  </p>
                  <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                    {companyInfo.name}
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    CNPJ
                  </p>
                  <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                    {companyInfo.cnpj}
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Telefone
                  </p>
                  <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                    {companyInfo.phone}
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Endereço
                  </p>
                  <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                    {companyInfo.address}
                  </p>
                </div>
              </div>
            </Card>

            {/* Formas de Pagamento */}
            <Card className={`p-6 ${isDarkMode ? 'bg-blue-900/50 border-blue-800' : 'bg-white border-blue-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-100 dark:bg-green-950">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                      Formas de Pagamento
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      Métodos aceitos no estabelecimento
                    </p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>

              <div className="space-y-2">
                {paymentMethods.map((method, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border flex items-center justify-between ${
                      isDarkMode ? 'bg-blue-800/50 border-blue-700' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                      {method}
                    </p>
                    <Menu className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Usuários e Permissões */}
            <Card className={`p-6 ${isDarkMode ? 'bg-blue-900/50 border-blue-800' : 'bg-white border-blue-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                      Usuários e Permissões
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      Gerenciar vendedores e acessos
                    </p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </Card>

            {/* Impressoras */}
            <Card className={`p-6 ${isDarkMode ? 'bg-blue-900/50 border-blue-800' : 'bg-white border-blue-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                      Impressoras
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      Configurar impressoras térmicas
                    </p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </Card>

            {/* Backup e Sincronização */}
            <Card className={`p-6 ${isDarkMode ? 'bg-blue-900/50 border-blue-800' : 'bg-white border-blue-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-950">
                    <Download className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                      Backup e Sincronização
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      Segurança dos dados
                    </p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </Card>
          </div>
        )}

        {activeTab === "financial" && (
          <div className="space-y-6">
            {/* Cards de Resumo Financeiro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className={`p-6 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-green-950 to-emerald-950 border-green-900' 
                  : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-green-100 dark:bg-green-950">
                    <ArrowUpRight className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                    Total Entradas
                  </h3>
                </div>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  R$ {totalEntradas.toFixed(2)}
                </p>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Últimos 30 dias
                </p>
              </Card>

              <Card className={`p-6 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-red-950 to-rose-950 border-red-900' 
                  : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950">
                    <ArrowDownRight className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                    Total Saídas
                  </h3>
                </div>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  R$ {totalSaidas.toFixed(2)}
                </p>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                  Últimos 30 dias
                </p>
              </Card>

              <Card className={`p-6 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-blue-950 to-cyan-950 border-blue-900' 
                  : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Saldo Líquido
                  </h3>
                </div>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  R$ {(totalEntradas - totalSaidas).toFixed(2)}
                </p>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Balanço geral
                </p>
              </Card>
            </div>

            {/* Filtros e Ações */}
            <Card className={`p-4 ${
              isDarkMode 
                ? 'bg-blue-900/50 border-blue-800' 
                : 'bg-white border-blue-200'
            }`}>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 w-full md:w-auto">
                  <Input 
                    placeholder="Buscar transação..." 
                    className={`${isDarkMode ? 'bg-blue-800 border-blue-700' : 'bg-white'}`}
                  />
                  <Button variant="outline" size="icon">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </Card>

            {/* Lista de Transações */}
            <Card className={`p-6 ${
              isDarkMode 
                ? 'bg-blue-900/50 border-blue-800' 
                : 'bg-white border-blue-200'
            }`}>
              <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                Transações Recentes
              </h3>

              <div className="space-y-4">
                {transactions.map(transaction => (
                  <div 
                    key={transaction.id}
                    className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                      isDarkMode 
                        ? 'bg-blue-800/50 border-blue-700' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          transaction.type === 'entrada' 
                            ? 'bg-green-100 dark:bg-green-950' 
                            : 'bg-red-100 dark:bg-red-950'
                        }`}>
                          {transaction.type === 'entrada' ? (
                            <ArrowUpRight className="w-5 h-5 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                            {transaction.description}
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            {transaction.category} • {transaction.date} às {transaction.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          transaction.type === 'entrada' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.type === 'entrada' ? '+' : '-'} R$ {transaction.value.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "debtors" && (
          <div className="space-y-6">
            {/* Cards de Resumo de Devedores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className={`p-6 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-red-950 to-rose-950 border-red-900' 
                  : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950">
                    <DollarSign className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                    Total em Dívidas
                  </h3>
                </div>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  R$ {totalDebt.toFixed(2)}
                </p>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                  {debtors.length} clientes
                </p>
              </Card>

              <Card className={`p-6 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-orange-950 to-amber-950 border-orange-900' 
                  : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200'
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-950">
                    <UserX className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                    Clientes Bloqueados
                  </h3>
                </div>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {blockedCustomers}
                </p>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  Inadimplentes
                </p>
              </Card>

              <Card className={`p-6 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-blue-950 to-cyan-950 border-blue-900' 
                  : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Clientes Ativos
                  </h3>
                </div>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {debtors.length - blockedCustomers}
                </p>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Com pendências
                </p>
              </Card>
            </div>

            {/* Lista de Devedores */}
            <Card className={`p-6 ${
              isDarkMode 
                ? 'bg-blue-900/50 border-blue-800' 
                : 'bg-white border-blue-200'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                  Lista de Devedores
                </h3>
                <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>

              <div className="space-y-4">
                {debtors.map(customer => (
                  <div 
                    key={customer.id}
                    className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                      isDarkMode 
                        ? 'bg-blue-800/50 border-blue-700' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          customer.status === 'blocked' 
                            ? 'bg-red-100 dark:bg-red-950' 
                            : 'bg-orange-100 dark:bg-orange-950'
                        }`}>
                          {customer.status === 'blocked' ? (
                            <UserX className="w-5 h-5 text-red-600" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                              {customer.name}
                            </p>
                            {customer.status === 'blocked' && (
                              <Badge variant="destructive" className="text-xs">
                                Bloqueado
                              </Badge>
                            )}
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            {customer.phone} • Último pagamento: {customer.lastPayment}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className={`text-lg font-bold text-red-600`}>
                            R$ {customer.totalDebt.toFixed(2)}
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-blue-500' : 'text-blue-500'}`}>
                            Total devido
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "installments" && (
          <div className="text-center py-12">
            <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-blue-700' : 'text-blue-300'}`} />
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
              Gestão de Parcelas
            </h3>
            <p className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>
              Funcionalidade em desenvolvimento
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`mt-12 border-t py-6 ${
        isDarkMode 
          ? 'border-blue-800 bg-blue-900/50' 
          : 'border-blue-200 bg-white/50'
      }`}>
        <div className="container mx-auto px-4 text-center">
          <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            MBvendas © 2024 • PDV de Próxima Geração
          </p>
          <p className={`text-xs mt-2 ${isDarkMode ? 'text-blue-500' : 'text-blue-500'}`}>
            🌗 Tema automático: {isDarkMode ? 'Modo Noturno' : 'Modo Diurno'}
          </p>
        </div>
      </footer>
    </div>
  )
}
