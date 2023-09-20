import { IOClients } from '@vtex/api'
import { vbaseFor } from '@vtex/clients'

export const TRANSACTION_BUCKET = 'transaction'

export interface AntifraudTransactionResponse {
  id: string
  tid: string
  status: string
  score: number | null
  analysisType: string
  responses: Record<string, string>
  code: string
  message: string
  _metadata?: Record<string, any>
}

export const AntifraudTransactionsStorage = vbaseFor<
  string,
  AntifraudTransactionResponse
>(TRANSACTION_BUCKET)
export type AntifraudTransactionsStorage = InstanceType<
  typeof AntifraudTransactionsStorage
>

export class Clients extends IOClients {
  public get antifraudTransactionStorage() {
    return this.getOrSet(
      'antifraudTransactionStorage',
      AntifraudTransactionsStorage
    )
  }
}
