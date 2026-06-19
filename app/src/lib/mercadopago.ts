import { MercadoPagoConfig, Payment } from 'mercadopago'

export function getMpClient() {
  return new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
}

export function getPaymentClient() {
  return new Payment(getMpClient())
}

export const CUOTA_AMOUNTS: Record<string, number> = {
  'Infantiles -13': 2190,
  'Juveniles -21':  2890,
  'Mayores +22':    3490,
  'Cuota Familiar': 6590,
  'Fitness':        2190,
  'Cuota Amigo':    890,
}

export const DELCLUB_FEE_PERCENT = 0.02
export const RECARGO_TARJETA     = 0.05
