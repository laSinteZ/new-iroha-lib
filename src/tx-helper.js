import { sign as signTransaction, derivePublicKey } from 'ed25519.js'
import cloneDeep from 'lodash/cloneDeep'
import each from 'lodash/each'
import * as Commands from './proto/commands_pb'
import { Signature } from './proto/primitive_pb'
import Transaction from './proto/transaction_pb'
import { sha3_256 } from 'js-sha3'

const emptyTransaction = () => new Transaction.Transaction()

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

const getOrCreatePayload = transaction => transaction.hasPayload() ? cloneDeep(transaction.getPayload()) : new Transaction.Transaction.Payload()

const getOrCreateReducedPayload = payload => payload.hasReducedPayload() ? cloneDeep(payload.getReducedPayload()) : new Transaction.Transaction.Payload.ReducedPayload()

// TODO: AddPeer, setPermission <- need to work with them.
const addCommand = (transaction, commandName, params) => {
  let payloadCommand = new Commands[capitalize(commandName)]()

  each(params, (value, key) => {
    payloadCommand['set' + capitalize(key)](value)
  })

  let command = new Commands.Command()
  command['set' + capitalize(commandName)](payloadCommand)

  let payload = getOrCreatePayload(transaction)
  let reducedPayload = getOrCreateReducedPayload(payload)

  reducedPayload.addCommands(command, reducedPayload.getCommandsList.length)
  payload.setReducedPayload(reducedPayload)

  let txWithCommand = cloneDeep(transaction)
  txWithCommand.setPayload(payload)

  return txWithCommand
}

/**
 * Returns new transaction with meta information
 * @param {Object} transaction base transaction
 * @param {Object} meta - meta info
 * @param {String} meta.creatorAccountId accountID of transaction's creator
 * @param {Number} meta.createdTime time of transaction creation
 * @param {Number} meta.quorum transaction counter (will be removed soon)
 */

const addMeta = (transaction, { creatorAccountId, createdTime = Date.now(), quorum = 1 }) => {
  let payload = getOrCreatePayload(transaction)
  let reducedPayload = getOrCreateReducedPayload(payload)

  reducedPayload.setCreatorAccountId(creatorAccountId)
  reducedPayload.setCreatedTime(createdTime)
  reducedPayload.setQuorum(quorum)

  payload.setReducedPayload(reducedPayload)

  let transactionWithMeta = cloneDeep(transaction)
  transactionWithMeta.setPayload(payload)

  return transactionWithMeta
}

/**
 * Returns new transaction with one more signature
 * @param {Object} transaction base transaction
 * @param {String} privateKeyHex - private key of query's creator in hex.
 */

const sign = (transaction, privateKeyHex) => {
  const privateKey = hexStringToByte(privateKeyHex)
  const publicKey = derivePublicKey(privateKey)

  const payloadHash = sha3_256.array(transaction.payload.serializeBinary())

  const signatory = signTransaction(payloadHash, publicKey, privateKey)

  let s = new Signature()
  s.setPubkey(publicKey)
  s.setSignature(signatory)

  let signedTransactionWithSignature = cloneDeep(transaction)
  signedTransactionWithSignature.addSignatures(s, signedTransactionWithSignature.getSignaturesList.length)

  return signedTransactionWithSignature
}

export default {
  addCommand,
  addMeta,
  sign,
  emptyTransaction
}

function hexStringToByte (str) {
  if (!str) {
    return new Uint8Array()
  }

  var a = []
  for (var i = 0, len = str.length; i < len; i += 2) {
    a.push(parseInt(str.substr(i, 2), 16))
  }

  return new Uint8Array(a)
}
