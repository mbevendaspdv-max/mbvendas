"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ChevronRight, Sparkles } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
}

const questions: Question[] = [
  {
    id: 1,
    question: "Como você se sente em relação ao controle financeiro da sua empresa?",
    options: [
      "Totalmente perdido, não sei por onde começar",
      "Tenho algum controle, mas sinto que falta organização",
      "Uso planilhas, mas é trabalhoso e confuso",
      "Preciso de algo mais profissional e automatizado"
    ]
  },
  {
    id: 2,
    question: "Qual é o seu maior desafio hoje?",
    options: [
      "Não sei quanto estou ganhando ou perdendo",
      "Perco muito tempo organizando dados manualmente",
      "Não consigo tomar decisões rápidas por falta de informação",
      "Sinto que estou deixando dinheiro na mesa"
    ]
  },
  {
    id: 3,
    question: "O que te impede de dormir tranquilo?",
    options: [
      "Medo de não conseguir pagar as contas",
      "Incerteza sobre o futuro do negócio",
      "Sensação de estar trabalhando muito e ganhando pouco",
      "Falta de controle sobre o que acontece na empresa"
    ]
  },
  {
    id: 4,
    question: "Se você pudesse resolver UM problema agora, qual seria?",
    options: [
      "Ter clareza total sobre meu dinheiro",
      "Economizar tempo em tarefas administrativas",
      "Tomar decisões mais inteligentes e rápidas",
      "Sentir segurança e controle sobre o negócio"
    ]
  },
  {
    id: 5,
    question: "Como você imagina sua empresa daqui a 6 meses?",
    options: [
      "Crescendo de forma sustentável e organizada",
      "Com processos automatizados e eficientes",
      "Gerando mais lucro com menos esforço",
      "Me dando paz de espírito e liberdade"
    ]
  }
]

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const progress = ((currentQuestion + 1) / questions.length) * 100

  function handleAnswer(option: string) {
    setSelectedOption(option)
  }

  function handleNext() {
    if (!selectedOption) return

    const newAnswers = [...answers, selectedOption]
    setAnswers(newAnswers)
    setSelectedOption(null)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Quiz completo - redireciona para página de vendas
      router.push('/vendas')
    }
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-900/30 border border-blue-600 rounded-full">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-blue-300">Descubra sua solução ideal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            Vamos entender sua situação
          </h1>
          <p className="text-blue-300">
            Responda com sinceridade. Isso vai nos ajudar a te ajudar melhor.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-blue-400 mb-2">
            <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight">
            {currentQ.question}
          </h2>

          <div className="space-y-4">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`w-full text-left p-6 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                  selectedOption === option
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 shadow-lg shadow-cyan-500/50'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedOption === option
                      ? 'border-white bg-white'
                      : 'border-slate-600'
                  }`}>
                    {selectedOption === option && (
                      <div className="w-3 h-3 rounded-full bg-cyan-600" />
                    )}
                  </div>
                  <span className={`text-lg ${
                    selectedOption === option ? 'font-semibold' : 'font-medium'
                  }`}>
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            disabled={!selectedOption}
            size="lg"
            className={`px-8 py-6 text-lg font-bold rounded-xl transition-all ${
              selectedOption
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-105'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {currentQuestion < questions.length - 1 ? 'Próxima' : 'Ver Minha Solução'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Footer hint */}
        <p className="text-center text-sm text-blue-400 mt-8">
          🔒 Suas respostas são confidenciais e nos ajudam a personalizar sua experiência
        </p>
      </div>
    </div>
  )
}
