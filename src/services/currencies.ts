interface Currencies {
  USD: string
  EUR: string
  CRC: string
  GBP: string
  ILS: string
  INR: string
  JPY: string
  KRW: string
  NGN: string
  PHP: string
  PLN: string
  PYG: string
  THB: string
  UAH: string
  VND: string
}

export const symbols: Currencies = {
  USD: '$', // US Dollar
  EUR: '€', // Euro
  CRC: '₡', // Costa Rican Colón
  GBP: '£', // British Pound Sterling
  ILS: '₪', // Israeli New Sheqel
  INR: '₹', // Indian Rupee
  JPY: '¥', // Japanese Yen
  KRW: '₩', // South Korean Won
  NGN: '₦', // Nigerian Naira
  PHP: '₱', // Philippine Peso
  PLN: 'zł', // Polish Zloty
  PYG: '₲', // Paraguayan Guarani
  THB: '฿', // Thai Baht
  UAH: '₴', // Ukrainian Hryvnia
  VND: '₫' // Vietnamese Dong
}

export const getSymbol = (code?: string): string => (code ? symbols[code.toUpperCase()] || '' : '')
