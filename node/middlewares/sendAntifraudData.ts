import { UserInputError } from '@vtex/api'
import { json } from 'co-body'
import { v4 as uuidv4 } from 'uuid'

import { AntifraudTransactionResponse, TRANSACTION_BUCKET } from '../clients'
import { approvedRequest, deniedRequest, receivedRequest } from './utils'

export async function sendAntifraudData(
  ctx: Context,
  next: () => Promise<any>
) {
  const headers = ctx.header
  ctx.state = await json(ctx.req)

  const isTestSuite = headers['x-provider-api-is-testsuite'] === 'true'

  const { antifraudTransactionStorage } = ctx.clients

  const { id, miniCart, payments } = ctx.state
  const tid = uuidv4()

  if (isTestSuite) {
    const testSuiteTransaction = receivedRequest(id, tid)
    ctx.body = testSuiteTransaction
    ctx.status = 200

    await antifraudTransactionStorage.saveJSON(TRANSACTION_BUCKET, id, {
      ...testSuiteTransaction,
      _metadata: {
        counter: 1,
        payments,
      },
    })

    await next()
    return
  }

  let response: AntifraudTransactionResponse

  switch (miniCart?.buyer?.firstName) {
    case 'Error500':
      throw new Error('Invalid transaction')
    case 'Error400':
      throw new UserInputError('Invalid transaction')
    case 'NotRisky':
      response = approvedRequest(id, tid)
      break
    case 'Risky':
      response = deniedRequest(id, tid)
      break
    default:
      response = receivedRequest(id, tid)
      break
  }

  const transaction = {
    ...response,
    _metadata: {
      counter: 1,
      payments,
    },
  }

  await antifraudTransactionStorage.saveJSON(
    TRANSACTION_BUCKET,
    id,
    transaction
  )

  ctx.body = response
  ctx.status = 200
  await next()
}
