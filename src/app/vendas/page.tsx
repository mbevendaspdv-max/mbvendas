"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Shield,
  Target,
  Users,
  DollarSign,
  AlertTriangle,
  ChevronDown,
  X
} from "lucide-react"

export default function VendasPage() {
  const router = useRouter()
  const [selectedPain, setSelectedPain] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  function handleCTA() {
    // Redireciona para página de registro
    router.push('/register')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white overflow-x-hidden">
      {/* Header com Urgência */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-lg bg-slate-950/80 border-b border-red-900/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              <span className="font-bold text-lg">Transformação Empresarial</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-red-400 text-sm font-semibold animate-pulse">
                <Clock className="w-4 h-4" />
                <span>Últimas vagas disponíveis</span>
              </div>
              <Button 
                onClick={handleCTA}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 font-bold"
              >
                Quero Mudar Agora
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Impacto Emocional */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-red-900/30 border border-red-600 rounded-full">
            <span className="text-red-400 font-semibold text-sm">⚠️ Sua empresa está sangrando dinheiro agora mesmo</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Você está a <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500">um passo</span> de perder tudo.
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-300 mb-8 leading-relaxed">
            Ou a <span className="text-yellow-400 font-bold">um clique</span> de transformar o caos em controle total.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={handleCTA}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-8 text-2xl rounded-2xl shadow-2xl hover:scale-105 transition-all font-bold"
            >
              Quero Mudar Minha Realidade Agora
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>

          <p className="text-sm text-blue-400">
            ⏰ Apenas <span className="text-red-400 font-bold">7 vagas</span> restantes hoje
          </p>
        </div>
      </section>

      {/* Seção Interativa - Escolha sua Dor */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4">
            Qual dessas situações <span className="text-red-500">te sufoca</span> agora?
          </h2>
          <p className="text-center text-blue-300 mb-12 text-lg">
            Clique na que mais dói. Seja honesto consigo mesmo.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                id: "money", 
                icon: DollarSign, 
                title: "Pouco Dinheiro", 
                description: "Mal consigo pagar as contas",
                color: "from-red-600 to-rose-600"
              },
              { 
                id: "failing", 
                icon: TrendingUp, 
                title: "Empresa Falindo", 
                description: "Cada dia que passa piora",
                color: "from-orange-600 to-red-600"
              },
              { 
                id: "stress", 
                icon: AlertTriangle, 
                title: "Mal-Estar Constante", 
                description: "Não durmo pensando nisso",
                color: "from-purple-600 to-pink-600"
              },
            ].map((pain) => {
              const Icon = pain.icon
              const isSelected = selectedPain === pain.id
              
              return (
                <button
                  key={pain.id}
                  onClick={() => setSelectedPain(pain.id)}
                  className={`p-8 rounded-2xl border-2 transition-all transform hover:scale-105 text-left ${
                    isSelected 
                      ? `bg-gradient-to-br ${pain.color} border-white shadow-2xl scale-105` 
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <Icon className={`w-12 h-12 mx-auto mb-4 ${isSelected ? 'text-white' : 'text-blue-400'}`} />
                  <h3 className="text-xl font-bold mb-2">{pain.title}</h3>
                  <p className={`text-sm ${isSelected ? 'text-white' : 'text-blue-300'}`}>
                    {pain.description}
                  </p>
                </button>
              )
            })}
          </div>

          {selectedPain && (
            <div className="mt-12 p-8 bg-gradient-to-br from-blue-900 to-cyan-900 rounded-2xl border-2 border-cyan-600 animate-in fade-in slide-in-from-bottom-4">
              <p className="text-2xl font-bold text-center mb-6">
                Eu sei exatamente como você se sente.
              </p>
              <p className="text-lg text-blue-200 text-center mb-8">
                A boa notícia? <span className="text-yellow-400 font-bold">O problema não é você.</span><br/>
                Você só não teve a ferramenta certa até agora.
              </p>
              <div className="text-center">
                <Button 
                  onClick={handleCTA}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-10 py-6 text-xl font-bold"
                >
                  Quero a Solução Agora
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Visualização de Sonhos */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-6">
            Imagine por um momento...
          </h2>
          
          <div className="space-y-8">
            {[
              {
                icon: CheckCircle2,
                title: "Acordar sabendo exatamente quanto você ganhou",
                description: "Sem surpresas. Sem susto. Números claros na sua mão."
              },
              {
                icon: Shield,
                title: "Ter controle total sobre cada centavo",
                description: "Saber para onde vai cada real. Sentir segurança financeira."
              },
              {
                icon: Target,
                title: "Ver sua empresa crescendo, não afundando",
                description: "Números subindo. Clientes voltando. Lucro real no final do mês."
              },
              {
                icon: Zap,
                title: "Dormir tranquilo pela primeira vez em meses",
                description: "Sem aquele aperto no peito. Sem medo do amanhã."
              },
            ].map((dream, index) => {
              const Icon = dream.icon
              return (
                <div 
                  key={index}
                  className="flex gap-6 items-start p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-cyan-600 transition-all hover:scale-105"
                >
                  <div className="p-4 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{dream.title}</h3>
                    <p className="text-blue-300 text-lg">{dream.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-3xl font-bold mb-6">
              Agora pense: <span className="text-yellow-400">como seria sua vida assim?</span>
            </p>
            <Button 
              onClick={handleCTA}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-12 py-8 text-2xl font-bold rounded-2xl"
            >
              Quero Viver Isso
            </Button>
          </div>
        </div>
      </section>

      {/* Promessas Fortes */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-950 to-cyan-950">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12">
            O que você vai <span className="text-cyan-400">conquistar</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Transformar caos em controle absoluto",
              "Clareza total sobre seu dinheiro",
              "Decisões rápidas e certeiras",
              "Segurança financeira real",
              "Tempo livre de volta",
              "Paz de espírito garantida",
              "Crescimento acelerado",
              "Confiança renovada"
            ].map((promise, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-6 bg-slate-900/50 rounded-xl border border-cyan-800 hover:border-cyan-600 transition-all"
              >
                <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0" />
                <span className="text-lg font-semibold">{promise}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOMO - Medo de Perder */}
      <section className="py-20 px-4 bg-gradient-to-br from-red-950 to-rose-950">
        <div className="container mx-auto max-w-4xl text-center">
          <AlertTriangle className="w-20 h-20 text-yellow-400 mx-auto mb-6 animate-pulse" />
          
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Enquanto você lê isso...
          </h2>
          
          <div className="space-y-4 mb-12 text-xl">
            <p className="text-red-300">
              ⏰ Outros empreendedores estão tomando controle agora
            </p>
            <p className="text-red-300">
              📈 Seus concorrentes estão crescendo enquanto você hesita
            </p>
            <p className="text-red-300">
              💰 Cada minuto que passa, você perde dinheiro
            </p>
          </div>

          <div className="p-8 bg-slate-900/80 rounded-2xl border-2 border-red-600 mb-8">
            <p className="text-3xl font-black mb-4">
              Você tem <span className="text-red-500">2 escolhas</span>:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="p-6 bg-red-900/30 rounded-xl border border-red-700">
                <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Continuar como está</h3>
                <p className="text-red-300">Mais noites sem dormir. Mais dívidas. Mais desespero.</p>
              </div>
              <div className="p-6 bg-green-900/30 rounded-xl border border-green-700">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Agir AGORA</h3>
                <p className="text-green-300">Controle. Crescimento. Tranquilidade. Sucesso.</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleCTA}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-12 py-8 text-2xl font-bold rounded-2xl animate-pulse"
          >
            Quero Dar Esse Passo AGORA
          </Button>
        </div>
      </section>

      {/* Apresentação da Solução */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-block mb-6 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full">
              <span className="text-white font-bold text-lg">✨ A Solução que Você Esperava</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              MBvendas: Seu Sistema de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Controle Total</span>
            </h2>
            
            <p className="text-2xl text-blue-300 mb-8">
              Simples. Poderoso. Feito para empreendedores como você.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Zap,
                title: "Rápido",
                description: "Configure em minutos. Resultados no mesmo dia."
              },
              {
                icon: Shield,
                title: "Seguro",
                description: "Seus dados protegidos. Controle absoluto."
              },
              {
                icon: Target,
                title: "Eficaz",
                description: "Feito para resolver seu problema AGORA."
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 hover:border-cyan-600 transition-all hover:scale-105"
                >
                  <Icon className="w-12 h-12 text-cyan-400 mb-4" />
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-blue-300 text-lg">{feature.description}</p>
                </div>
              )
            })}
          </div>

          <div className="p-10 bg-gradient-to-br from-green-900 to-emerald-900 rounded-3xl border-2 border-green-600 text-center">
            <p className="text-3xl font-black mb-4">
              Não é só um sistema. É a <span className="text-yellow-400">ponte</span> entre sua vida atual e a vida que você merece.
            </p>
            <p className="text-xl text-green-200 mb-8">
              Simples de usar. Impossível de ignorar os resultados.
            </p>
            <Button 
              onClick={handleCTA}
              size="lg"
              className="bg-white text-green-900 hover:bg-green-50 px-12 py-8 text-2xl font-bold rounded-2xl"
            >
              Quero Começar Agora
            </Button>
          </div>
        </div>
      </section>

      {/* Oferta */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Quanto vale <span className="text-yellow-400">sua paz de espírito</span>?
          </h2>
          
          <p className="text-2xl text-blue-300 mb-12">
            Quanto você já perdeu por não ter controle?
          </p>

          <div className="p-12 bg-slate-800/50 rounded-3xl border-2 border-cyan-600 mb-8">
            <div className="mb-8">
              <p className="text-lg text-blue-400 mb-2">De:</p>
              <p className="text-4xl text-red-500 line-through font-bold mb-4">R$ 497,00</p>
              <p className="text-lg text-blue-400 mb-2">Por apenas:</p>
              <p className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-4">
                R$ 97
              </p>
              <p className="text-xl text-green-400 font-bold">
                Menos que um jantar fora. Mais que uma vida transformada.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-lg">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span>Acesso imediato e vitalício</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-lg">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span>Suporte prioritário</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-lg">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span>Atualizações gratuitas</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-lg">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span>Garantia de 30 dias</span>
              </div>
            </div>

            <Button 
              onClick={handleCTA}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-16 py-10 text-3xl font-black rounded-2xl shadow-2xl animate-pulse"
            >
              QUERO MUDAR MINHA REALIDADE AGORA
            </Button>

            <p className="text-sm text-red-400 mt-6 font-semibold animate-pulse">
              ⚠️ Apenas 7 vagas restantes neste preço
            </p>
          </div>

          <p className="text-lg text-blue-400">
            💡 Pense: Quanto você <span className="text-red-400 font-bold">perde</span> a cada dia sem controle?<br/>
            Esse investimento se paga na primeira semana.
          </p>
        </div>
      </section>

      {/* CTA Final Poderoso */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-950 via-purple-950 to-pink-950">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
            Você chegou até aqui.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Isso significa algo.
            </span>
          </h2>

          <p className="text-2xl text-blue-300 mb-12">
            Você sabe que precisa mudar.<br/>
            Você sabe que essa é a hora.<br/>
            Você sabe que se sair agora, vai se arrepender.
          </p>

          <div className="p-12 bg-slate-900/80 rounded-3xl border-2 border-yellow-600 mb-12">
            <p className="text-3xl font-black mb-6">
              A pergunta não é "se" você vai mudar.
            </p>
            <p className="text-3xl font-black text-yellow-400 mb-8">
              A pergunta é: QUANDO?
            </p>
            <p className="text-xl text-blue-300 mb-8">
              Daqui a 1 mês? Daqui a 1 ano?<br/>
              Ou <span className="text-green-400 font-bold">AGORA</span>?
            </p>
          </div>

          <Button 
            onClick={handleCTA}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-20 py-12 text-4xl font-black rounded-3xl shadow-2xl hover:scale-105 transition-all"
          >
            SIM, QUERO MUDAR AGORA
          </Button>

          <p className="text-sm text-blue-400 mt-8">
            🔒 Pagamento 100% seguro • Garantia de 30 dias
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto text-center">
          <p className="text-blue-400 mb-2">
            MBvendas © 2024 • Transformando Empreendedores
          </p>
          <p className="text-sm text-blue-600">
            Sua decisão de hoje define seu amanhã.
          </p>
        </div>
      </footer>
    </div>
  )
}
