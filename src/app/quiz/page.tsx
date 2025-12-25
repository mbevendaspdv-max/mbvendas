"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  TrendingDown,
  Clock,
  DollarSign,
  Target,
  Zap
} from "lucide-react"

interface Question {
  id: number
  question: string
  subtitle: string
  options: {
    text: string
    value: string
    icon: any
    color: string
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    question: "Qual é a sua maior dor agora?",
    subtitle: "Seja honesto. Ninguém está julgando.",
    options: [
      {
        text: "Pouco dinheiro entrando",
        value: "money",
        icon: DollarSign,
        color: "from-red-600 to-rose-600"
      },
      {
        text: "Empresa perdendo dinheiro",
        value: "losing",
        icon: TrendingDown,
        color: "from-orange-600 to-red-600"
      },
      {
        text: "Mal-estar e ansiedade constante",
        value: "stress",
        icon: AlertTriangle,
        color: "from-purple-600 to-pink-600"
      }
    ]
  },
  {
    id: 2,
    question: "Como você se sente ao acordar?",
    subtitle: "Pense na primeira sensação do dia.",
    options: [
      {
        text: "Preocupado com dinheiro",
        value: "worried",
        icon: AlertTriangle,
        color: "from-red-600 to-rose-600"
      },
      {
        text: "Sem energia, desmotivado",
        value: "tired",
        icon: Clock,
        color: "from-gray-600 to-slate-600"
      },
      {
        text: "Com medo do que vem pela frente",
        value: "afraid",
        icon: TrendingDown,
        color: "from-orange-600 to-red-600"
      }
    ]
  },
  {
    id: 3,
    question: "Quanto tempo você passa pensando nos problemas da empresa?",
    subtitle: "Seja sincero sobre o quanto isso consome você.",
    options: [
      {
        text: "O dia inteiro, não consigo desligar",
        value: "always",
        icon: Clock,
        color: "from-red-600 to-rose-600"
      },
      {
        text: "Várias horas por dia",
        value: "often",
        icon: AlertTriangle,
        color: "from-orange-600 to-red-600"
      },
      {
        text: "Algumas horas, mas me incomoda",
        value: "sometimes",
        icon: Target,
        color: "from-yellow-600 to-orange-600"
      }
    ]
  },
  {
    id: 4,
    question: "O que você mais deseja agora?",
    subtitle: "Se pudesse escolher apenas uma coisa...",
    options: [
      {
        text: "Ter controle total sobre o dinheiro",
        value: "control",
        icon: Target,
        color: "from-green-600 to-emerald-600"
      },
      {
        text: "Dormir tranquilo sem preocupações",
        value: "peace",
        icon: CheckCircle2,
        color: "from-blue-600 to-cyan-600"
      },
      {
        text: "Ver a empresa crescendo de verdade",
        value: "growth",
        icon: TrendingDown,
        color: "from-purple-600 to-pink-600"
      }
    ]
  },
  {
    id: 5,
    question: "Se você pudesse mudar sua realidade HOJE, você faria?",
    subtitle: "Esta é a pergunta mais importante.",
    options: [
      {
        text: "SIM! Estou pronto para mudar agora",
        value: "yes",
        icon: Zap,
        color: "from-green-600 to-emerald-600"
      },
      {
        text: "Sim, mas tenho medo de dar o primeiro passo",
        value: "maybe",
        icon: AlertTriangle,
        color: "from-yellow-600 to-orange-600"
      },
      {
        text: "Quero muito, mas não sei se consigo",
        value: "unsure",
        icon: Clock,
        color: "from-blue-600 to-cyan-600"
      }
    ]
  }
]

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleAnswer = (value: string) => {
    setSelectedOption(value)
    setAnswers({ ...answers, [currentQuestion]: value })
  }

  const handleNext = () => {
    if (!selectedOption) return

    setIsAnimating(true)
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(answers[currentQuestion + 1] || null)
      } else {
        // Quiz completo - redireciona para página de vendas
        router.push('/vendas')
      }
      setIsAnimating(false)
    }, 300)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-blue-400">
              Pergunta {currentQuestion + 1} de {questions.length}
            </span>
            <span className="text-sm text-blue-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div 
          className={`bg-slate-900/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl transition-all duration-300 ${
            isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Question Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
              {question.question}
            </h2>
            <p className="text-lg text-blue-300">
              {question.subtitle}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {question.options.map((option) => {
              const Icon = option.icon
              const isSelected = selectedOption === option.value
              
              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all transform hover:scale-105 text-left ${
                    isSelected
                      ? `bg-gradient-to-r ${option.color} border-white shadow-2xl scale-105`
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      isSelected ? 'bg-white/20' : 'bg-slate-700'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        isSelected ? 'text-white' : 'text-blue-400'
                      }`} />
                    </div>
                    <span className={`text-lg font-semibold ${
                      isSelected ? 'text-white' : 'text-blue-100'
                    }`}>
                      {option.text}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!selectedOption}
            size="lg"
            className={`w-full py-8 text-xl font-bold rounded-2xl transition-all ${
              selectedOption
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-2xl'
                : 'bg-slate-700 cursor-not-allowed opacity-50'
            }`}
          >
            {currentQuestion === questions.length - 1 ? (
              <>
                Ver Minha Solução
                <Zap className="w-6 h-6 ml-2" />
              </>
            ) : (
              <>
                Próxima Pergunta
                <ArrowRight className="w-6 h-6 ml-2" />
              </>
            )}
          </Button>

          {/* Hint */}
          {!selectedOption && (
            <p className="text-center text-sm text-blue-400 mt-4 animate-pulse">
              👆 Selecione uma opção para continuar
            </p>
          )}
        </div>

        {/* Motivational Text */}
        <div className="mt-8 text-center">
          <p className="text-blue-300 text-sm">
            🔒 Suas respostas são confidenciais e nos ajudam a entender melhor sua situação
          </p>
        </div>
      </div>
    </div>
  )
}
