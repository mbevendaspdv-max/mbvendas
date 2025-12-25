"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerUser, checkPlanUserLimit } from "@/lib/auth"
import { useAuth } from "@/contexts/AuthContext"
import { UserPlan } from "@/lib/supabase"
import { User, Mail, Lock, AlertCircle, Loader2, CheckCircle2, Crown } from "lucide-react"

const plans = [
  {
    id: 'free' as UserPlan,
    name: 'Gratuito',
    price: 0,
    maxUsers: 1,
    icon: User,
    color: 'from-gray-600 to-slate-600',
    features: ['Acesso básico', '1 usuário']
  },
  {
    id: 'basic' as UserPlan,
    name: 'Básico',
    price: 97,
    maxUsers: 5,
    icon: CheckCircle2,
    color: 'from-blue-600 to-cyan-600',
    features: ['Acesso completo', 'Até 5 usuários', 'Suporte por email']
  },
  {
    id: 'pro' as UserPlan,
    name: 'Pro',
    price: 297,
    maxUsers: 20,
    icon: Crown,
    color: 'from-purple-600 to-pink-600',
    features: ['Acesso premium', 'Até 20 usuários', 'Suporte prioritário', 'Relatórios avançados']
  },
  {
    id: 'enterprise' as UserPlan,
    name: 'Enterprise',
    price: 997,
    maxUsers: 999999,
    icon: Crown,
    color: 'from-yellow-600 to-orange-600',
    features: ['Acesso ilimitado', 'Usuários ilimitados', 'Suporte 24/7', 'Customização completa']
  }
]

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<UserPlan>('basic')
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Verificar limite de usuários do plano
    const limitCheck = await checkPlanUserLimit(selectedPlan)
    
    if (!limitCheck.allowed) {
      setError(`Limite de usuários atingido para o plano ${selectedPlan}. Atual: ${limitCheck.current}/${limitCheck.max}`)
      setLoading(false)
      return
    }

    const response = await registerUser(email, password, name, selectedPlan)

    if (response.success && response.token) {
      login(response.token)
      router.push("/dashboard")
    } else {
      setError(response.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-900/80 backdrop-blur-lg rounded-3xl p-8 border border-slate-800 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white mb-2">
              Crie sua conta
            </h1>
            <p className="text-blue-300">
              Escolha seu plano e comece agora
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-600 rounded-xl flex items-start gap-3 max-w-2xl mx-auto">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Plans Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Escolha seu plano
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {plans.map((plan) => {
                const Icon = plan.icon
                const isSelected = selectedPlan === plan.id
                
                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 text-left ${
                      isSelected
                        ? `bg-gradient-to-br ${plan.color} border-white shadow-2xl scale-105`
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-white' : 'text-blue-400'}`} />
                    <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-white' : 'text-blue-100'}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-3xl font-black mb-3 ${isSelected ? 'text-white' : 'text-blue-200'}`}>
                      {plan.price === 0 ? 'Grátis' : `R$ ${plan.price}`}
                    </p>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className={`text-sm flex items-start gap-2 ${isSelected ? 'text-white' : 'text-blue-300'}`}>
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="max-w-2xl mx-auto space-y-6">
            <div>
              <Label htmlFor="name" className="text-blue-200 mb-2 block">
                Nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="pl-11 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-12"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-blue-200 mb-2 block">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="pl-11 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-12"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-blue-200 mb-2 block">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  className="pl-11 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-12"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-14 text-xl font-bold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Criando conta...
                </>
              ) : (
                `Criar conta - ${plans.find(p => p.id === selectedPlan)?.name}`
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-blue-400 text-sm">
              Já tem uma conta?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Faça login
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ← Voltar para o início
          </button>
        </div>
      </div>
    </div>
  )
}
