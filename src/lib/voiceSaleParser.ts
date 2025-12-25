import { Product } from './types'

export interface ParsedVoiceSale {
  productName: string
  quantity: number
  customerName: string
  paymentMethod: 'PIX' | 'Dinheiro' | 'Cartão' | null
  confidence: 'high' | 'medium' | 'low'
  rawTranscript: string
}

const paymentMethodKeywords = {
  pix: ['pix', 'pix', 'no pix', 'pelo pix', 'via pix'],
  dinheiro: ['dinheiro', 'em dinheiro', 'no dinheiro', 'cash', 'espécie', 'em espécie'],
  cartao: ['cartão', 'cartao', 'no cartão', 'no cartao', 'débito', 'debito', 'crédito', 'credito']
}

const quantityKeywords = {
  'uma': 1, 'um': 1,
  'duas': 2, 'dois': 2,
  'três': 3, 'tres': 3,
  'quatro': 4,
  'cinco': 5,
  'seis': 6,
  'sete': 7,
  'oito': 8,
  'nove': 9,
  'dez': 10
}

/**
 * Extrai a forma de pagamento da frase
 */
function extractPaymentMethod(text: string): 'PIX' | 'Dinheiro' | 'Cartão' | null {
  const lowerText = text.toLowerCase()
  
  if (paymentMethodKeywords.pix.some(keyword => lowerText.includes(keyword))) {
    return 'PIX'
  }
  
  if (paymentMethodKeywords.dinheiro.some(keyword => lowerText.includes(keyword))) {
    return 'Dinheiro'
  }
  
  if (paymentMethodKeywords.cartao.some(keyword => lowerText.includes(keyword))) {
    return 'Cartão'
  }
  
  return null
}

/**
 * Extrai a quantidade da frase
 */
function extractQuantity(text: string): number {
  const lowerText = text.toLowerCase()
  
  // Procurar por números escritos por extenso
  for (const [word, value] of Object.entries(quantityKeywords)) {
    if (lowerText.includes(word)) {
      return value
    }
  }
  
  // Procurar por números (1, 2, 3...)
  const numberMatch = text.match(/\b(\d+)\b/)
  if (numberMatch) {
    return parseInt(numberMatch[1])
  }
  
  // Default: 1
  return 1
}

/**
 * Extrai o nome do cliente da frase
 * Procura por padrões como "para [Nome]" ou "do [Nome]"
 */
function extractCustomerName(text: string): string {
  const lowerText = text.toLowerCase()
  
  // Padrões: "para João", "do João", "da Maria", "pro João"
  const patterns = [
    /\bpara\s+([a-záàâãéèêíïóôõöúçñ\s]+?)(?:\s+no\s|\s+em\s|\s+pelo\s|\s+via\s|$)/i,
    /\bpro\s+([a-záàâãéèêíïóôõöúçñ\s]+?)(?:\s+no\s|\s+em\s|\s+pelo\s|\s+via\s|$)/i,
    /\bdo\s+([a-záàâãéèêíïóôõöúçñ\s]+?)(?:\s+no\s|\s+em\s|\s+pelo\s|\s+via\s|$)/i,
    /\bda\s+([a-záàâãéèêíïóôõöúçñ\s]+?)(?:\s+no\s|\s+em\s|\s+pelo\s|\s+via\s|$)/i,
  ]
  
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      // Capitalizar nome
      return match[1].trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    }
  }
  
  return ''
}

/**
 * Extrai o nome do produto da frase
 * Remove palavras-chave de quantidade, cliente e pagamento
 */
function extractProductName(text: string, quantity: number, customerName: string, paymentMethod: string | null): string {
  let productText = text.toLowerCase()
  
  // Remover quantidade
  if (quantity > 1) {
    const quantityWord = Object.entries(quantityKeywords).find(([_, val]) => val === quantity)?.[0]
    if (quantityWord) {
      productText = productText.replace(new RegExp(`\\b${quantityWord}\\b`, 'gi'), '')
    }
    productText = productText.replace(new RegExp(`\\b${quantity}\\b`, 'g'), '')
  } else {
    productText = productText.replace(/\b(uma?|um)\b/gi, '')
  }
  
  // Remover nome do cliente
  if (customerName) {
    productText = productText.replace(new RegExp(`\\b(para|pro|do|da)\\s+${customerName}\\b`, 'gi'), '')
  }
  
  // Remover forma de pagamento
  if (paymentMethod) {
    const allPaymentKeywords = [
      ...paymentMethodKeywords.pix,
      ...paymentMethodKeywords.dinheiro,
      ...paymentMethodKeywords.cartao
    ]
    allPaymentKeywords.forEach(keyword => {
      productText = productText.replace(new RegExp(`\\b(no|em|pelo|via)?\\s*${keyword}\\b`, 'gi'), '')
    })
  }
  
  // Limpar e capitalizar
  return productText
    .trim()
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Encontra o produto mais similar no catálogo
 */
function findBestMatchProduct(productName: string, availableProducts: Product[]): Product | null {
  if (!productName || availableProducts.length === 0) return null
  
  const normalizedSearch = productName.toLowerCase().trim()
  
  // 1. Busca exata
  const exactMatch = availableProducts.find(p => 
    p.name.toLowerCase() === normalizedSearch
  )
  if (exactMatch) return exactMatch
  
  // 2. Busca por inclusão (produto contém a busca OU busca contém o produto)
  const inclusionMatch = availableProducts.find(p => {
    const normalizedProduct = p.name.toLowerCase()
    return normalizedProduct.includes(normalizedSearch) || normalizedSearch.includes(normalizedProduct)
  })
  if (inclusionMatch) return inclusionMatch
  
  // 3. Busca por palavras-chave (qualquer palavra da busca está no produto)
  const keywords = normalizedSearch.split(' ').filter(w => w.length > 2)
  const keywordMatch = availableProducts.find(p => {
    const normalizedProduct = p.name.toLowerCase()
    return keywords.some(keyword => normalizedProduct.includes(keyword))
  })
  if (keywordMatch) return keywordMatch
  
  return null
}

/**
 * Calcula o nível de confiança da interpretação
 */
function calculateConfidence(
  productFound: boolean,
  hasCustomer: boolean,
  hasPaymentMethod: boolean
): 'high' | 'medium' | 'low' {
  const score = [productFound, hasCustomer, hasPaymentMethod].filter(Boolean).length
  
  if (score === 3) return 'high'
  if (score === 2) return 'medium'
  return 'low'
}

/**
 * Função principal: interpreta a frase de voz e extrai dados da venda
 */
export function parseVoiceSale(transcript: string, availableProducts: Product[]): ParsedVoiceSale {
  // 1. Extrair componentes da frase
  const quantity = extractQuantity(transcript)
  const paymentMethod = extractPaymentMethod(transcript)
  const customerName = extractCustomerName(transcript)
  
  // 2. Extrair nome do produto (removendo outros componentes)
  const productName = extractProductName(transcript, quantity, customerName, paymentMethod)
  
  // 3. Encontrar produto no catálogo
  const matchedProduct = findBestMatchProduct(productName, availableProducts)
  
  // 4. Calcular confiança
  const confidence = calculateConfidence(
    !!matchedProduct,
    !!customerName,
    !!paymentMethod
  )
  
  return {
    productName: matchedProduct?.name || productName,
    quantity,
    customerName,
    paymentMethod,
    confidence,
    rawTranscript: transcript
  }
}

/**
 * Valida se a venda interpretada está completa
 */
export function validateParsedSale(parsed: ParsedVoiceSale, availableProducts: Product[]): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  // Verificar se produto existe
  const productExists = availableProducts.some(p => 
    p.name.toLowerCase() === parsed.productName.toLowerCase()
  )
  
  if (!productExists) {
    errors.push(`Produto "${parsed.productName}" não encontrado no catálogo`)
  }
  
  // Verificar quantidade
  if (parsed.quantity < 1) {
    errors.push('Quantidade inválida')
  }
  
  // Verificar forma de pagamento
  if (!parsed.paymentMethod) {
    errors.push('Forma de pagamento não identificada')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
