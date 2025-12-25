"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package, 
  AlertTriangle,
  FileText,
  Calendar,
  Filter,
  Download,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { supabase } from "@/lib/supabase"

type ReportType = 
  | "parcelas-recebidas"
  | "inadimplentes"
  | "financeiro"
  | "lucro"
  | "faturamento"
  | "mais-vendidos"
  | "estoque-minimo"
  | "vendas-periodo"
  | "ticket-medio"
  | "vendas-desconto"
  | "fiado-resumo"
  | "cancelamentos"

interface ReportCard {
  id: ReportType
  title: string
  description: string
  icon: any
  color: string
}

export default function RelatoriosPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null)
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })

  const reports: ReportCard[] = [
    {
      id: "parcelas-recebidas",
      title: "Parcelas Recebidas",
      description: "Pagamentos efetivamente recebidos",
      icon: DollarSign,
      color: "from-green-600 to-emerald-600"
    },
    {
      id: "inadimplentes",
      title: "Clientes Inadimplentes",
      description: "Quem está devendo agora",
      icon: AlertTriangle,
      color: "from-red-600 to-rose-600"
    },
    {
      id: "financeiro",
      title: "Financeiro (Formas de Pagamento)",
      description: "Como o dinheiro entra",
      icon: TrendingUp,
      color: "from-blue-600 to-cyan-600"
    },
    {
      id: "lucro",
      title: "Relatório de Lucro",
      description: "O que realmente dá lucro",
      icon: ArrowUpRight,
      color: "from-purple-600 to-pink-600"
    },
    {
      id: "faturamento",
      title: "Faturamento Geral",
      description: "Quanto você faturou",
      icon: FileText,
      color: "from-orange-600 to-amber-600"
    },
    {
      id: "mais-vendidos",
      title: "Produtos Mais Vendidos",
      description: "Rankings de performance",
      icon: Package,
      color: "from-indigo-600 to-blue-600"
    },
    {
      id: "estoque-minimo",
      title: "Estoque Mínimo",
      description: "O que está acabando",
      icon: AlertTriangle,
      color: "from-yellow-600 to-orange-600"
    },
    {
      id: "vendas-periodo",
      title: "Vendas por Período",
      description: "Análise temporal de vendas",
      icon: Calendar,
      color: "from-teal-600 to-green-600"
    },
    {
      id: "ticket-medio",
      title: "Ticket Médio",
      description: "Valor médio por venda",
      icon: DollarSign,
      color: "from-cyan-600 to-blue-600"
    },
    {
      id: "vendas-desconto",
      title: "Vendas com Desconto",
      description: "Impacto dos descontos",
      icon: ArrowDownRight,
      color: "from-pink-600 to-rose-600"
    },
    {
      id: "fiado-resumo",
      title: "Fiado (Resumo)",
      description: "Visão geral do crédito",
      icon: Users,
      color: "from-violet-600 to-purple-600"
    },
    {
      id: "cancelamentos",
      title: "Cancelamentos",
      description: "Vendas canceladas",
      icon: AlertTriangle,
      color: "from-red-600 to-orange-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">
            📊 Relatórios
          </h1>
          <p className="text-blue-300 text-lg">
            Controle financeiro real. Decisões baseadas em dados.
          </p>
        </div>

        {/* Filtro Global de Período */}
        <Card className="p-6 mb-8 bg-slate-900/50 border-slate-700">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 text-blue-300">
                Data Inicial
              </label>
              <input
                type="date"
                value={dateFilter.startDate}
                onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-600 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 text-blue-300">
                Data Final
              </label>
              <input
                type="date"
                value={dateFilter.endDate}
                onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-600 focus:outline-none"
              />
            </div>
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
              <Filter className="w-4 h-4 mr-2" />
              Aplicar Filtro
            </Button>
          </div>
        </Card>

        {/* Grid de Relatórios */}
        {!selectedReport ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => {
              const Icon = report.icon
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className="group p-6 bg-slate-900/50 border border-slate-700 rounded-2xl hover:border-cyan-600 transition-all hover:scale-105 text-left"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${report.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{report.title}</h3>
                  <p className="text-blue-300 text-sm mb-4">{report.description}</p>
                  <div className="flex items-center text-cyan-400 text-sm font-semibold">
                    Ver relatório
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div>
            <Button
              onClick={() => setSelectedReport(null)}
              variant="outline"
              className="mb-6 border-slate-700 text-white hover:bg-slate-800"
            >
              ← Voltar aos Relatórios
            </Button>
            
            {/* Renderiza o relatório selecionado */}
            <ReportContent reportType={selectedReport} dateFilter={dateFilter} />
          </div>
        )}
      </div>
    </div>
  )
}

// Componente que renderiza o conteúdo de cada relatório
function ReportContent({ reportType, dateFilter }: { reportType: ReportType, dateFilter: any }) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    loadReportData()
  }, [reportType, dateFilter])

  async function loadReportData() {
    setLoading(true)
    
    try {
      // Aqui vamos buscar os dados reais do Supabase
      // Por enquanto, vamos simular um carregamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // TODO: Implementar queries específicas para cada tipo de relatório
      setData({})
    } catch (error) {
      console.error("Erro ao carregar relatório:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-12 bg-slate-900/50 border-slate-700 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-blue-300">Carregando dados do relatório...</p>
      </Card>
    )
  }

  // Renderiza conteúdo específico baseado no tipo de relatório
  switch (reportType) {
    case "parcelas-recebidas":
      return <ParcelasRecebidasReport data={data} dateFilter={dateFilter} />
    case "inadimplentes":
      return <InadimplentesReport data={data} />
    case "financeiro":
      return <FinanceiroReport data={data} dateFilter={dateFilter} />
    case "lucro":
      return <LucroReport data={data} dateFilter={dateFilter} />
    case "faturamento":
      return <FaturamentoReport data={data} dateFilter={dateFilter} />
    case "mais-vendidos":
      return <MaisVendidosReport data={data} dateFilter={dateFilter} />
    case "estoque-minimo":
      return <EstoqueMinimoReport data={data} />
    case "vendas-periodo":
      return <VendasPeriodoReport data={data} dateFilter={dateFilter} />
    case "ticket-medio":
      return <TicketMedioReport data={data} dateFilter={dateFilter} />
    case "vendas-desconto":
      return <VendasDescontoReport data={data} dateFilter={dateFilter} />
    case "fiado-resumo":
      return <FiadoResumoReport data={data} dateFilter={dateFilter} />
    case "cancelamentos":
      return <CancelamentosReport data={data} dateFilter={dateFilter} />
    default:
      return <div>Relatório não implementado</div>
  }
}

// Componentes individuais para cada relatório
function ParcelasRecebidasReport({ data, dateFilter }: any) {
  return (
    <Card className="p-6 bg-slate-900/50 border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">💰 Parcelas Recebidas</h2>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>
      
      <div className="mb-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
        <p className="text-sm text-green-300 mb-1">Total Recebido no Período</p>
        <p className="text-3xl font-black text-green-400">R$ 0,00</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Data</th>
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Cliente</th>
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Valor</th>
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Forma</th>
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Venda</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="text-center py-8 text-blue-400">
                Nenhum pagamento registrado no período selecionado
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function InadimplentesReport({ data }: any) {
  return (
    <Card className="p-6 bg-slate-900/50 border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">⚠️ Clientes Inadimplentes</h2>
        <Button className="bg-gradient-to-r from-red-600 to-rose-600">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <p className="text-sm text-yellow-300 mb-1">A Vencer (até 30 dias)</p>
          <p className="text-3xl font-black text-yellow-400">R$ 0,00</p>
        </div>
        <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
          <p className="text-sm text-red-300 mb-1">Em Atraso (+ 30 dias)</p>
          <p className="text-3xl font-black text-red-400">R$ 0,00</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Cliente</th>
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Total Devido</th>
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Vendas Abertas</th>
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Dias Atraso</th>
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Última Compra</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="text-center py-8 text-blue-400">
                Nenhum cliente inadimplente no momento
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function FinanceiroReport({ data, dateFilter }: any) {
  return (
    <Card className="p-6 bg-slate-900/50 border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">💳 Financeiro (Formas de Pagamento)</h2>
        <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
          <p className="text-sm text-green-300 mb-1">💵 Dinheiro</p>
          <p className="text-2xl font-black text-green-400">R$ 0,00</p>
        </div>
        <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
          <p className="text-sm text-blue-300 mb-1">📱 Pix</p>
          <p className="text-2xl font-black text-blue-400">R$ 0,00</p>
        </div>
        <div className="p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
          <p className="text-sm text-purple-300 mb-1">💳 Cartão</p>
          <p className="text-2xl font-black text-purple-400">R$ 0,00</p>
        </div>
      </div>

      <div className="p-6 bg-cyan-900/20 border border-cyan-700 rounded-lg">
        <p className="text-sm text-cyan-300 mb-1">Total Recebido</p>
        <p className="text-4xl font-black text-cyan-400">R$ 0,00</p>
      </div>
    </Card>
  )
}

function LucroReport({ data, dateFilter }: any) {
  return (
    <Card className="p-6 bg-slate-900/50 border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">📈 Relatório de Lucro</h2>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="mb-6 p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
        <p className="text-sm text-purple-300 mb-1">Lucro Bruto Total</p>
        <p className="text-3xl font-black text-purple-400">R$ 0,00</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Produto</th>
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Qtd Vendida</th>
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Faturamento</th>
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Custo Total</th>
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Lucro</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="text-center py-8 text-blue-400">
                Nenhuma venda registrada no período
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function FaturamentoReport({ data, dateFilter }: any) {
  return (
    <Card className="p-6 bg-slate-900/50 border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">💰 Faturamento Geral</h2>
        <Button className="bg-gradient-to-r from-orange-600 to-amber-600">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-orange-900/20 border border-orange-700 rounded-lg">
          <p className="text-sm text-orange-300 mb-1">Faturamento Diário</p>
          <p className="text-2xl font-black text-orange-400">R$ 0,00</p>
        </div>
        <div className="p-4 bg-amber-900/20 border border-amber-700 rounded-lg">
          <p className="text-sm text-amber-300 mb-1">Faturamento Mensal</p>
          <p className="text-2xl font-black text-amber-400">R$ 0,00</p>
        </div>
      </div>

      <div className="p-6 bg-green-900/20 border border-green-700 rounded-lg">
        <p className="text-sm text-green-300 mb-1">Comparação com Período Anterior</p>
        <div className="flex items-center gap-2 mt-2">
          <ArrowUpRight className="w-6 h-6 text-green-400" />
          <p className="text-3xl font-black text-green-400">0%</p>
        </div>
      </div>
    </Card>
  )
}

function MaisVendidosReport({ data, dateFilter }: any) {
  return (
    <Card className="p-6 bg-slate-900/50 border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">🏆 Produtos Mais Vendidos</h2>
        <Button className="bg-gradient-to-r from-indigo-600 to-blue-600">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <h3 className="text-lg font-bold mb-3 text-cyan-400">Por Quantidade</h3>
          <p className="text-blue-400 text-sm">Nenhum produto vendido no período</p>
        </div>

        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <h3 className="text-lg font-bold mb-3 text-green-400">Por Faturamento</h3>
          <p className="text-blue-400 text-sm">Nenhum produto vendido no período</p>
        </div>

        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <h3 className="text-lg font-bold mb-3 text-purple-400">Por Lucro</h3>
          <p className="text-blue-400 text-sm">Nenhum produto vendido no período</p>
        </div>
      </div>
    </Card>
  )
}

function EstoqueMinimoReport({ data }: any) {
  return (
    <Card className="p-6 bg-slate-900/50 border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">📦 Estoque Mínimo</h2>
        <Button className="bg-gradient-to-r from-yellow-600 to-orange-600">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Produto</th>
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Qtd Atual</th>
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Qtd Mínima</th>
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="text-center py-8 text-blue-400">
                Todos os produtos estão acima do estoque mínimo
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function VendasPeriodoReport({ data, dateFilter }: any) {
  return (
    <Card className="p-6 bg-slate-900/50 border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">📅 Vendas por Período</h2>
        <Button className="bg-gradient-to-r from-teal-600 to-green-600">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-teal-900/20 border border-teal-700 rounded-lg">
          <p className="text-sm text-teal-300 mb-1">Quantidade de Vendas</p>
          <p className="text-2xl font-black text-teal-400">0</p>
        </div>
        <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
          <p className="text-sm text-green-300 mb-1">Faturamento</p>
          <p className="text-2xl font-black text-green-400">R$ 0,00</p>
        </div>
        <div className="p-4 bg-cyan-900/20 border border-cyan-700 rounded-lg">
          <p className="text-sm text-cyan-300 mb-1">Ticket Médio</p>
          <p className="text-2xl font-black text-cyan-400">R$ 0,00</p>
        </div>
      </div>
    </Card>
  )
}

function TicketMedioReport({ data, dateFilter }: any) {
  return (
    <Card className="p-6 bg-slate-900/50 border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">🎯 Ticket Médio</h2>
        <Button className="bg-gradient-to-r from-cyan-600 to-blue-600">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="p-6 bg-cyan-900/20 border border-cyan-700 rounded-lg mb-6">
        <p className="text-sm text-cyan-300 mb-1">Ticket Médio do Período</p>
        <p className="text-4xl font-black text-cyan-400">R$ 0,00</p>
        <p className="text-sm text-blue-400 mt-2">
          Faturamento ÷ Número de vendas
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <p className="text-sm text-blue-300 mb-1">Total de Vendas</p>
          <p className="text-2xl font-black">0</p>
        </div>
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <p className="text-sm text-blue-300 mb-1">Faturamento Total</p>
          <p className="text-2xl font-black">R$ 0,00</p>
        </div>
      </div>
    </Card>
  )
}

function VendasDescontoReport({ data, dateFilter }: any) {
  return (
    <Card className="p-6 bg-slate-900/50 border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">🏷️ Vendas com Desconto</h2>
        <Button className="bg-gradient-to-r from-pink-600 to-rose-600">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-pink-900/20 border border-pink-700 rounded-lg">
          <p className="text-sm text-pink-300 mb-1">Vendas com Desconto</p>
          <p className="text-2xl font-black text-pink-400">0</p>
        </div>
        <div className="p-4 bg-rose-900/20 border border-rose-700 rounded-lg">
          <p className="text-sm text-rose-300 mb-1">Total em Descontos</p>
          <p className="text-2xl font-black text-rose-400">R$ 0,00</p>
        </div>
        <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
          <p className="text-sm text-red-300 mb-1">% Médio de Desconto</p>
          <p className="text-2xl font-black text-red-400">0%</p>
        </div>
      </div>
    </Card>
  )
}

function FiadoResumoReport({ data, dateFilter }: any) {
  return (
    <Card className="p-6 bg-slate-900/50 border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">📝 Fiado (Resumo)</h2>
        <Button className="bg-gradient-to-r from-violet-600 to-purple-600">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-violet-900/20 border border-violet-700 rounded-lg">
          <p className="text-sm text-violet-300 mb-1">Total Fiado</p>
          <p className="text-2xl font-black text-violet-400">R$ 0,00</p>
        </div>
        <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
          <p className="text-sm text-green-300 mb-1">Total Recebido</p>
          <p className="text-2xl font-black text-green-400">R$ 0,00</p>
        </div>
        <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <p className="text-sm text-yellow-300 mb-1">Total em Aberto</p>
          <p className="text-2xl font-black text-yellow-400">R$ 0,00</p>
        </div>
      </div>
    </Card>
  )
}

function CancelamentosReport({ data, dateFilter }: any) {
  return (
    <Card className="p-6 bg-slate-900/50 border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">❌ Cancelamentos</h2>
        <Button className="bg-gradient-to-r from-red-600 to-orange-600">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
        <p className="text-sm text-red-300 mb-1">Impacto Financeiro</p>
        <p className="text-3xl font-black text-red-400">R$ 0,00</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Data</th>
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Cliente</th>
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Valor</th>
              <th className="text-left py-3 px-4 text-blue-300 font-semibold">Motivo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="text-center py-8 text-blue-400">
                Nenhuma venda cancelada no período
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  )
}
