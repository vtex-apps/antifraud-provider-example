import type { ClientsConfig, ServiceContext, RecorderState } from '@vtex/api'
import { method, Service } from '@vtex/api'

import { Clients } from './clients'
import { getAntifraudStatus } from './middlewares/getAntifraudStatus'
import { listManifest } from './middlewares/listManifest'
import { preAnalysis } from './middlewares/preAnalysis'
import { sendAntifraudData } from './middlewares/sendAntifraudData'
import { Minicart, Payments } from './types'

const TIMEOUT_MS = 800

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients, AntifraudRequestState>

  interface AntifraudRequestState extends RecorderState {
    reference: string
    id: string
    value: string
    ip: string
    deviceFingerprint?: string
    store: string
    miniCart: Minicart
    payments: Payments
    hook: string
    transactionStartDate: string
  }
}

export default new Service({
  clients,
  routes: {
    sendAntifraudData: method({
      POST: [sendAntifraudData],
    }),
    listManifest: method({
      GET: [listManifest],
    }),
    getAntifraudStatus: method({
      GET: [getAntifraudStatus],
    }),
    preAnalysis: method({
      POST: [preAnalysis],
    }),
  },
})
