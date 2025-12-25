/**
 * SALE CONFIRMATION MODAL - Modal de confirmação de venda
 * Usado tanto para venda manual quanto por voz
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { SaleItem, PaymentMethod } from '@/lib/types'
import { CheckCircle2, AlertCircle } from 'lucide-react'

type SaleConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  items: SaleItem[]
  paymentMethod: PaymentMethod
  customerName?: string
  discount: number
  total: number
  isDarkMode?: boolean
}

export const SaleConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  items,
  paymentMethod,
  customerName,
  discount,
  total,
  isDarkMode = false
}: SaleConfirmationModalProps) => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl ${isDarkMode ? 'bg-blue-900 border-blue-800' : 'bg-white'}`}>
        <DialogHeader>
          <DialogTitle className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
            Confirmar Venda
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cliente */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-800/50' : 'bg-blue-50'}`}>
            <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Cliente
            </p>
            <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
              {customerName || 'Cliente não identificado'}
            </p>
          </div>

          {/* Itens */}
          <div>
            <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Itens da Venda
            </p>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    isDarkMode ? 'bg-blue-800/50 border-blue-700' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                      {item.productName}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {item.quantity}x R$ {item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                    R$ {item.subtotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-800/50' : 'bg-blue-50'}`}>
            <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Forma de Pagamento
            </p>
            <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
              {paymentMethod}
            </p>
          </div>

          {/* Totais */}
          <div className={`p-6 rounded-lg ${
            isDarkMode 
              ? 'bg-gradient-to-br from-green-950 to-emerald-950 border border-green-900' 
              : 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200'
          }`}>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className={`${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                  Subtotal
                </p>
                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-green-900'}`}>
                  R$ {subtotal.toFixed(2)}
                </p>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <p className={`${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                    Desconto
                  </p>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-green-900'}`}>
                    - R$ {discount.toFixed(2)}
                  </p>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-green-600">
                <p className={`text-lg font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                  Total
                </p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-green-900'}`}>
                  R$ {total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Aviso */}
          <div className={`flex items-start gap-3 p-4 rounded-lg ${
            isDarkMode ? 'bg-orange-950/50 border border-orange-900' : 'bg-orange-50 border border-orange-200'
          }`}>
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                Atenção
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                Ao confirmar, a venda será registrada, o estoque será atualizado automaticamente e o lançamento será feito no caixa.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className={isDarkMode ? 'border-blue-700 text-blue-300 hover:bg-blue-800' : ''}
          >
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Confirmar Venda
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
