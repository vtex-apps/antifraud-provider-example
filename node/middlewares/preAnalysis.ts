import { UserInputError } from '@vtex/api'
import { json } from 'co-body'
import { v4 as uuidv4 } from 'uuid'

import { AntifraudTransactionResponse } from '../clients'
import { approvedRequest, deniedRequest } from './utils'

export async function preAnalysis(ctx: Context, next: () => Promise<any>) {
  ctx.state = await json(ctx.req)

  const { id, miniCart } = ctx.state
  const tid = uuidv4()

  let response: AntifraudTransactionResponse

  switch (miniCart?.buyer?.firstName) {
    case 'Error500':
      throw new Error('Invalid transaction')
    case 'Error400':
      throw new UserInputError('Invalid transaction')
    case 'Risky':
      response = deniedRequest(id, tid)
      break
    default:
      response = approvedRequest(id, tid)
      break
  }

  ctx.body = response
  ctx.status = 200
  await next()
}
