"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { 
  LogOut, 
  User, 
  Crown, 
  Users, 
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Loader2
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && !user && mounted) {
      router.push("/login")
    }
  }, [user, loading, router, mounted])

  async function handleLogout() {
    await logout()
    router.push("/login")
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-16 h-16 animate-spin text-cyan-500 mx-auto mb-4" />
          <p className="text-lg text-blue-300">Carregando...</p>
        </div>
      </div>
    )
  }

  const planInfo = {
    free: { name: 'Gratuito', color: 'from-gray-600 to-slate-600', maxUsers: 1 },
    basic: { name: 'Básico', color: 'from-blue-600 to-cyan-600', maxUsers: 5 },
    pro: { name: 'Pro', color: 'from-purple-600 to-pink-600', maxUsers: 20 },
    enterprise: { name: 'Enterprise', color: 'from-yellow-600 to-orange-600', maxUsers: 999999 }
  }

  const currentPlan = planInfo[user.plan_type]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MBvendas</h1>
                <p className="text-xs text-blue-400">Sistema de Gestão</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-slate-700 hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-black text-white mb-2">
            Bem-vindo, {user.name}! 👋
          </h2>
          <p className="text-blue-300 text-lg">
            Aqui está o resumo da sua conta
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* User Info Card */}
          <div className="bg-slate-900/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-400">Usuário</p>
                <p className="text-xl font-bold text-white">{user.name}</p>
              </div>
            </div>
            <p className="text-sm text-blue-300">{user.email}</p>
          </div>

          {/* Plan Card */}
          <div className={`bg-gradient-to-br ${currentPlan.color} rounded-2xl p-6 border-2 border-white/20`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80">Plano Atual</p>
                <p className="text-xl font-bold text-white">{currentPlan.name}</p>
              </div>
            </div>
            <p className="text-sm text-white/90">
              Limite: {currentPlan.maxUsers === 999999 ? 'Ilimitado' : `${currentPlan.maxUsers} usuários`}
            </p>
          </div>

          {/* Users Card */}
          <div className="bg-slate-900/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-400">Usuários</p>
                <p className="text-xl font-bold text-white">1 / {currentPlan.maxUsers === 999999 ? '∞' : currentPlan.maxUsers}</p>
              </div>
            </div>
            <p className="text-sm text-blue-300">Usuários ativos no plano</p>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-slate-900/80 backdrop-blur-lg rounded-2xl p-8 border border-slate-800">
          <h3 className="text-2xl font-bold text-white mb-6">
            Recursos do seu plano
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Acesso completo ao sistema',
              'Gestão de vendas',
              'Relatórios em tempo real',
              'Suporte por email',
              'Atualizações automáticas',
              'Segurança avançada'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-blue-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Section (if not enterprise) */}
        {user.plan_type !== 'enterprise' && (
          <div className="mt-8 bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-8 border-2 border-purple-600 text-center">
            <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-3xl font-black text-white mb-3">
              Quer mais recursos?
            </h3>
            <p className="text-purple-200 mb-6 text-lg">
              Faça upgrade para um plano superior e desbloqueie todo o potencial
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-8 py-6 text-xl font-bold"
            >
              Ver Planos Disponíveis
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
