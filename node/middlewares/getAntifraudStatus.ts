import { UserInputError } from '@vtex/api'

import { TRANSACTION_BUCKET } from '../clients'
import { getTransactionStatus, handleTestSuiteTransaction } from './utils'

export async function getAntifraudStatus(
  ctx: Context,
  next: () => Promise<any>
) {
  const { antifraudTransactionStorage } = ctx.clients
  const { transactionId } = ctx.vtex.route.params
  const headers = ctx.header

  if (typeof transactionId !== 'string') {
    throw new UserInputError(
      'The transactionId route parameter must be a string'
    )
  }

  const transaction = await antifraudTransactionStorage.get(transactionId)

  const transactionStatus = getTransactionStatus(transaction)

  const isTestSuite = headers['x-provider-api-is-testsuite'] === 'true'

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache, no-store')

  if (isTestSuite) {
    const antifraudTransaction = handleTestSuiteTransaction(
      transaction.id,
      transaction.tid
    )

    if (
      antifraudTransaction.code === 'async' &&
      transaction.status === 'received'
    ) {
      await antifraudTransactionStorage.saveJSON(
        TRANSACTION_BUCKET,
        transactionId,
        {
          ...antifraudTransaction,
        }
      )
      transaction.status = 'undefined'

      ctx.body = transaction
      await next()

      return
    }

    ctx.body = antifraudTransaction
    await next()

    return
  }

  if (transactionStatus.status === 'received') {
    transactionStatus.status = 'undefined'
  }

  if (!isTestSuite) {
    antifraudTransactionStorage.saveJSON(TRANSACTION_BUCKET, transactionId, {
      ...transactionStatus,
      _metadata: {
        counter: (transaction._metadata?.counter as number) + 1,
        payments: transaction._metadata?.payments,
      },
    })
  }

  delete transactionStatus._metadata

  ctx.body = transactionStatus

  await next()
}
