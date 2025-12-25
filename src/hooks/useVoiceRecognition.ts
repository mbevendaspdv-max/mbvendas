"use client"

import { useState, useEffect, useCallback } from 'react'

interface VoiceRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
}

interface UseVoiceRecognitionReturn {
  isListening: boolean
  transcript: string
  error: string | null
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

export function useVoiceRecognition(): UseVoiceRecognitionReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    // Verificar suporte do navegador
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (SpeechRecognition) {
        setIsSupported(true)
        
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = false
        recognitionInstance.lang = 'pt-BR'
        recognitionInstance.maxAlternatives = 1

        recognitionInstance.onstart = () => {
          setIsListening(true)
          setError(null)
        }

        recognitionInstance.onresult = (event: any) => {
          const result = event.results[0][0]
          setTranscript(result.transcript)
        }

        recognitionInstance.onerror = (event: any) => {
          setIsListening(false)
          
          switch (event.error) {
            case 'no-speech':
              setError('Nenhuma fala detectada. Tente novamente.')
              break
            case 'audio-capture':
              setError('Microfone não encontrado. Verifique as permissões.')
              break
            case 'not-allowed':
              setError('Permissão de microfone negada. Habilite nas configurações do navegador.')
              break
            case 'network':
              setError('Erro de rede. Verifique sua conexão.')
              break
            default:
              setError('Erro ao reconhecer fala. Tente novamente.')
          }
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      } else {
        setIsSupported(false)
        setError('Seu navegador não suporta reconhecimento de voz. Use Chrome, Edge ou Safari.')
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      setTranscript('')
      setError(null)
      try {
        recognition.start()
      } catch (err) {
        setError('Erro ao iniciar reconhecimento. Tente novamente.')
      }
    }
  }, [recognition, isListening])

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop()
    }
  }, [recognition, isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setError(null)
  }, [])

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  }
}
