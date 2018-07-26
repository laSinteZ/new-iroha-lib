import * as ed25519 from 'ed25519.js'
import _ from 'lodash'
import { Signature } from './proto/primitive_pb'
import { GetAccount, Query, QueryPayloadMeta } from './proto/queries_pb'

import * as queries from './proto/queries_pb'

const getOrCreatePayload = (query) => {
  return query.hasPayload() ? _.cloneDeep(query.getPayload()) : new Query.Payload()
}

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

const addQuery = (query, queryName, params) => {
  let payloadQuery = new queries[capitalize(queryName)]()

  _.each(params, (value, key) => {
    payloadQuery['set' + capitalize(key)](value)
  })

  let payload = getOrCreatePayload(query)
  payload['set' + capitalize(queryName)](payloadQuery)

  let queryWithQuery = _.cloneDeep(query)
  queryWithQuery.setPayload(payload)

  return queryWithQuery
}

const addMeta = (query, { creatorAccountId, createdTime = Date.now(), queryCounter = 1 }) => {
  let meta = new QueryPayloadMeta()
  meta.setCreatorAccountId(creatorAccountId)
  meta.setCreatedTime(createdTime)
  meta.setQueryCounter(queryCounter)

  let payload = getOrCreatePayload(query)
  payload.setMeta(meta)

  let queryWithMeta = _.cloneDeep(query)
  queryWithMeta.setPayload(payload)

  return queryWithMeta
}

const sign = (query, privateKeyHex) => {
  const payload = query.getPayload()
  const privateKey = Buffer.from(privateKeyHex, 'hex')
  const publicKey = ed25519.derivePublicKey(privateKey)

  const sign = ed25519.sign(Buffer.from(payload.serializeBinary()), privateKey, publicKey)

  let s = new Signature()
  s.setPubkey(publicKey)
  s.setSignature(sign)

  let signedQueryWithSignatory = _.cloneDeep(query)
  signedQueryWithSignatory.setSignature(s)

  return signedQueryWithSignatory
}

export default {
  sign,
  addMeta,
  addQuery
}
