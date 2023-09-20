import { AntifraudTransactionResponse } from '../clients'

export const approvedRequest = (id: string, tid: string, code?: string) => {
  return {
    id,
    tid,
    status: 'approved',
    code: code ?? '2000',
    message: 'Low risk of fraud',
    analysisType: 'automatic',
    score: 5.01,
    responses: {
      customIdentifier: 'test',
    },
  }
}

export const receivedRequest = (id: string, tid: string, code?: string) => {
  return {
    id,
    tid,
    status: 'received',
    code: code ?? '2001',
    message: 'Low risk of fraud',
    analysisType: 'automatic',
    score: 5.01,
    responses: {
      customIdentifier: 'test',
    },
  }
}

export const deniedRequest = (id: string, tid: string, code?: string) => {
  return {
    id,
    tid,
    status: 'denied',
    code: code ?? '4001',
    message: 'Extremely risky',
    analysisType: 'automatic',
    score: 99.01,
    responses: {
      customIdentifier: 'test',
    },
  }
}

export const getTransactionStatus = (
  transaction: AntifraudTransactionResponse
): AntifraudTransactionResponse => {
  const firstPaymentLastFourDigits =
    transaction._metadata?.payments[0]?.details?.lastDigits

  const { _metadata, ...transactionResponse } = transaction

  if (transaction.status !== 'received' && transaction.status !== 'undefined') {
    return transactionResponse
  }

  if (firstPaymentLastFourDigits === '1234') {
    return deniedRequest(transaction.id, transaction.tid)
  }

  if (transaction._metadata?.counter === 5) {
    return approvedRequest(transaction.id, transaction.tid)
  }

  return transactionResponse
}

const lastCharFromString = (item: string) => {
  return item.charAt(item.length - 1)
}

export const handleTestSuiteTransaction = (id: string, tid: string) => {
  if (lastCharFromString(id) === '1') {
    return approvedRequest(id, tid)
  }

  if (lastCharFromString(id) === '2') {
    return deniedRequest(id, tid)
  }

  if (lastCharFromString(id) === '3' || lastCharFromString(id) === '5') {
    return approvedRequest(id, tid, 'async')
  }

  if (lastCharFromString(id) === '4' || lastCharFromString(id) === '6') {
    return deniedRequest(id, tid, 'async')
  }

  return receivedRequest(id, tid)
}

export const possibleStatus = ['received', 'undefined', 'approved', 'denied']
