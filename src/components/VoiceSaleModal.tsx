"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Mic, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  Volume2,
  Edit
} from 'lucide-react'
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition'
import { parseVoiceSale, validateParsedSale, ParsedVoiceSale } from '@/lib/voiceSaleParser'
import { Product, SaleItem, PaymentMethod } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { createSale } from '@/lib/salesService'

interface VoiceSaleModalProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
  onSaleCreated: () => void
  isDarkMode: boolean
}

export function VoiceSaleModal({ 
  isOpen, 
  onClose, 
  products, 
  onSaleCreated,
  isDarkMode 
}: VoiceSaleModalProps) {
  const { 
    isListening, 
    transcript, 
    error: voiceError, 
    isSupported,
    startListening, 
    stopListening,
    resetTranscript 
  } = useVoiceRecognition()

  const [parsedSale, setParsedSale] = useState<ParsedVoiceSale | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [step, setStep] = useState<'listening' | 'confirming' | 'editing'>('listening')
  const [editedData, setEditedData] = useState<{
    productName: string
    quantity: number
    customerName: string
    paymentMethod: string
  }>({
    productName: '',
    quantity: 1,
    customerName: '',
    paymentMethod: ''
  })

  // Processar transcrição quando finalizar
  useEffect(() => {
    if (transcript && !isListening && step === 'listening') {
      const parsed = parseVoiceSale(transcript, products)
      setParsedSale(parsed)
      
      const validation = validateParsedSale(parsed, products)
      setValidationErrors(validation.errors)
      
      if (validation.isValid) {
        setStep('confirming')
      } else {
        setStep('editing')
        setEditedData({
          productName: parsed.productName,
          quantity: parsed.quantity,
          customerName: parsed.customerName,
          paymentMethod: parsed.paymentMethod || ''
        })
      }
    }
  }, [transcript, isListening, products, step])

  const handleStartListening = () => {
    resetTranscript()
    setParsedSale(null)
    setValidationErrors([])
    setStep('listening')
    startListening()
  }

  const handleConfirmSale = () => {
    if (!parsedSale) return

    const product = products.find(p => 
      p.name.toLowerCase() === parsedSale.productName.toLowerCase()
    )

    if (!product || !parsedSale.paymentMethod) return

    const saleItems: SaleItem[] = [{
      productId: product.id,
      productName: product.name,
      quantity: parsedSale.quantity,
      unitPrice: product.price,
      subtotal: product.price * parsedSale.quantity
    }]

    const result = createSale(
      saleItems,
      parsedSale.paymentMethod as PaymentMethod,
      parsedSale.customerName || 'Cliente não identificado',
      0
    )

    if (result.success) {
      alert(`✅ Venda registrada com sucesso!\n\nCliente: ${parsedSale.customerName || 'Cliente não identificado'}\nTotal: R$ ${result.sale!.total.toFixed(2)}\nPagamento: ${parsedSale.paymentMethod}`)
      onSaleCreated()
      handleClose()
    } else {
      alert(`❌ Erro ao registrar venda:\n${result.error}`)
    }
  }

  const handleConfirmEdited = () => {
    const product = products.find(p => 
      p.name.toLowerCase() === editedData.productName.toLowerCase()
    )

    if (!product || !editedData.paymentMethod) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    const saleItems: SaleItem[] = [{
      productId: product.id,
      productName: product.name,
      quantity: editedData.quantity,
      unitPrice: product.price,
      subtotal: product.price * editedData.quantity
    }]

    const result = createSale(
      saleItems,
      editedData.paymentMethod as PaymentMethod,
      editedData.customerName || 'Cliente não identificado',
      0
    )

    if (result.success) {
      alert(`✅ Venda registrada com sucesso!\n\nCliente: ${editedData.customerName || 'Cliente não identificado'}\nTotal: R$ ${result.sale!.total.toFixed(2)}\nPagamento: ${editedData.paymentMethod}`)
      onSaleCreated()
      handleClose()
    } else {
      alert(`❌ Erro ao registrar venda:\n${result.error}`)
    }
  }

  const handleClose = () => {
    stopListening()
    resetTranscript()
    setParsedSale(null)
    setValidationErrors([])
    setStep('listening')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
        isDarkMode 
          ? 'bg-blue-900 border-blue-800' 
          : 'bg-white border-blue-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-blue-800' : 'border-blue-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${
              isListening 
                ? 'bg-gradient-to-br from-red-500 to-pink-600 animate-pulse' 
                : 'bg-gradient-to-br from-blue-600 to-cyan-600'
            }`}>
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                Venda por Voz
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {step === 'listening' && 'Fale naturalmente a venda'}
                {step === 'confirming' && 'Confirme os dados da venda'}
                {step === 'editing' && 'Corrija os dados necessários'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-blue-800' 
                : 'hover:bg-blue-100'
            }`}
          >
            <X className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Verificar suporte */}
          {!isSupported && (
            <div className={`p-4 rounded-lg border-2 ${
              isDarkMode 
                ? 'bg-red-950 border-red-900' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                    Navegador não suportado
                  </p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                    Use Chrome, Edge ou Safari para usar reconhecimento de voz.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Erro de voz */}
          {voiceError && (
            <div className={`p-4 rounded-lg border-2 ${
              isDarkMode 
                ? 'bg-orange-950 border-orange-900' 
                : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className={`font-semibold ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                    Erro no reconhecimento
                  </p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                    {voiceError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Instruções */}
          {step === 'listening' && !transcript && (
            <div className={`p-6 rounded-xl border-2 text-center ${
              isDarkMode 
                ? 'bg-blue-800/50 border-blue-700' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <Volume2 className={`w-12 h-12 mx-auto mb-4 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <h3 className={`text-lg font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-blue-900'
              }`}>
                Como usar
              </h3>
              <p className={`text-sm mb-4 ${
                isDarkMode ? 'text-blue-300' : 'text-blue-700'
              }`}>
                Fale de forma natural, por exemplo:
              </p>
              <div className={`space-y-2 text-sm ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                <p className="font-semibold">"Uma coxinha para João Félix no Pix"</p>
                <p className="font-semibold">"Duas coxinhas para Maria em dinheiro"</p>
                <p className="font-semibold">"Refrigerante do Pedro no cartão"</p>
              </div>
            </div>
          )}

          {/* Transcrição */}
          {transcript && (
            <div className={`p-4 rounded-lg border-2 ${
              isDarkMode 
                ? 'bg-blue-800/50 border-blue-700' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start gap-3">
                <Volume2 className={`w-5 h-5 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                } flex-shrink-0 mt-0.5`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    Você disse:
                  </p>
                  <p className={`text-lg font-semibold ${
                    isDarkMode ? 'text-white' : 'text-blue-900'
                  }`}>
                    "{transcript}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dados interpretados - Confirmação */}
          {step === 'confirming' && parsedSale && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border-2 ${
                isDarkMode 
                  ? 'bg-green-950 border-green-900' 
                  : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className={`font-semibold ${
                    isDarkMode ? 'text-green-300' : 'text-green-700'
                  }`}>
                    Venda interpretada com sucesso
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`ml-auto ${
                      parsedSale.confidence === 'high' ? 'border-green-600 text-green-600' :
                      parsedSale.confidence === 'medium' ? 'border-yellow-600 text-yellow-600' :
                      'border-orange-600 text-orange-600'
                    }`}
                  >
                    {parsedSale.confidence === 'high' ? 'Alta confiança' :
                     parsedSale.confidence === 'medium' ? 'Média confiança' :
                     'Baixa confiança'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-blue-800/50 border-blue-700' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <p className={`text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    Produto
                  </p>
                  <p className={`text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-blue-900'
                  }`}>
                    {parsedSale.productName}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-blue-800/50 border-blue-700' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <p className={`text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    Quantidade
                  </p>
                  <p className={`text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-blue-900'
                  }`}>
                    {parsedSale.quantity}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-blue-800/50 border-blue-700' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <p className={`text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    Cliente
                  </p>
                  <p className={`text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-blue-900'
                  }`}>
                    {parsedSale.customerName || 'Não identificado'}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-blue-800/50 border-blue-700' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <p className={`text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    Pagamento
                  </p>
                  <p className={`text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-blue-900'
                  }`}>
                    {parsedSale.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Valor total */}
              {(() => {
                const product = products.find(p => 
                  p.name.toLowerCase() === parsedSale.productName.toLowerCase()
                )
                if (product) {
                  const total = product.price * parsedSale.quantity
                  return (
                    <div className={`p-6 rounded-xl border-2 ${
                      isDarkMode 
                        ? 'bg-gradient-to-br from-green-950 to-emerald-950 border-green-900' 
                        : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                    }`}>
                      <p className={`text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-green-400' : 'text-green-600'
                      }`}>
                        Valor Total
                      </p>
                      <p className={`text-3xl font-bold ${
                        isDarkMode ? 'text-white' : 'text-green-900'
                      }`}>
                        R$ {total.toFixed(2)}
                      </p>
                    </div>
                  )
                }
                return null
              })()}
            </div>
          )}

          {/* Dados interpretados - Edição */}
          {step === 'editing' && (
            <div className="space-y-4">
              {validationErrors.length > 0 && (
                <div className={`p-4 rounded-lg border-2 ${
                  isDarkMode 
                    ? 'bg-orange-950 border-orange-900' 
                    : 'bg-orange-50 border-orange-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className={`font-semibold mb-2 ${
                        isDarkMode ? 'text-orange-300' : 'text-orange-700'
                      }`}>
                        Corrija os seguintes problemas:
                      </p>
                      <ul className={`text-sm space-y-1 list-disc list-inside ${
                        isDarkMode ? 'text-orange-400' : 'text-orange-600'
                      }`}>
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className={`text-sm font-medium mb-1 block ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    Produto *
                  </label>
                  <select 
                    className={`w-full p-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-blue-800 border-blue-700 text-white' 
                        : 'bg-white border-blue-200'
                    }`}
                    value={editedData.productName}
                    onChange={(e) => setEditedData({...editedData, productName: e.target.value})}
                  >
                    <option value="">Selecione um produto</option>
                    {products.map(product => (
                      <option key={product.id} value={product.name}>
                        {product.name} - R$ {product.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-sm font-medium mb-1 block ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    Quantidade *
                  </label>
                  <Input 
                    type="number"
                    min="1"
                    value={editedData.quantity}
                    onChange={(e) => setEditedData({...editedData, quantity: parseInt(e.target.value) || 1})}
                    className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                  />
                </div>

                <div>
                  <label className={`text-sm font-medium mb-1 block ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    Cliente
                  </label>
                  <Input 
                    placeholder="Nome do cliente (opcional)"
                    value={editedData.customerName}
                    onChange={(e) => setEditedData({...editedData, customerName: e.target.value})}
                    className={isDarkMode ? 'bg-blue-800 border-blue-700' : ''}
                  />
                </div>

                <div>
                  <label className={`text-sm font-medium mb-1 block ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    Forma de Pagamento *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Pix', 'Dinheiro', 'Cartão'].map(method => (
                      <button
                        key={method}
                        onClick={() => setEditedData({...editedData, paymentMethod: method})}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          editedData.paymentMethod === method
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
                </div>
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-3">
            {step === 'listening' && (
              <>
                <Button
                  onClick={handleStartListening}
                  disabled={!isSupported || isListening}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                >
                  {isListening ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Ouvindo...
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      Iniciar Gravação
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  size="lg"
                >
                  Cancelar
                </Button>
              </>
            )}

            {step === 'confirming' && (
              <>
                <Button
                  onClick={() => setStep('editing')}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Editar
                </Button>
                <Button
                  onClick={handleConfirmSale}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Confirmar Venda
                </Button>
              </>
            )}

            {step === 'editing' && (
              <>
                <Button
                  onClick={handleStartListening}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Tentar Novamente
                </Button>
                <Button
                  onClick={handleConfirmEdited}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Confirmar Venda
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
