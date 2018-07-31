import { QueryServiceClient, CommandServiceClient } from './proto/endpoint_pb_service'
import queryHelper from './query-helper'
import txHelper from './tx-helper'
import iroha from 'iroha-lib'

import _ from 'lodash'

var adminPriv =
  '0f0ce16d2afbb8eca23c7d8c2724f0c257a800ee2bbd54688cec6b898e3f7e33'

var adminPub =
  '889f6b881e331be21487db77dcf32c5f8d3d5e8066e78d2feac4239fe91d416f'

let createdTime = Date.now()

var txBuilder = new iroha.ModelTransactionBuilder()
var crypto = new iroha.ModelCrypto()

var keys = crypto.convertFromExisting(adminPub, adminPriv)

var tx = txBuilder
  .creatorAccountId('test@notary')
  .createdTime(createdTime)
  .createAsset('pobeda', 'notary', 5)
  .build()

var txblob = new iroha.ModelProtoTransaction(tx).signAndAddSignature(keys).finish().blob()

var txArray = blob2array(txblob)
var blockTransaction = require('./proto/block_pb.js').Transaction // block_pb2.Transaction()
var protoTx = blockTransaction.deserializeBinary(txArray)

console.log(protoTx.getSignaturesList())

var transaction = _.flow(
  (t) => txHelper.addCommand(t, 'CreateAsset', { assetName: 'pobeda1', domainId: 'notary', precision: 5 }),
  (t) => txHelper.addMeta(t, { creatorAccountId: 'test@notary', createdTime }),
  (t) => txHelper.sign(t, adminPriv)
)(txHelper.emptyTransaction())

console.log(transaction.getSignaturesList())

// var query = _.flow(
//   (q) => queryHelper.addQuery(q, 'getAccount', { accountId: 'test@notary' }),
//   (q) => queryHelper.addMeta(q, { creatorAccountId: 'test@notary' }),
//   (q) => queryHelper.sign(q, adminPriv)
// )(queryHelper.emptyQuery())

// const queryClient = new QueryServiceClient(
//   'http://localhost:8081'
// )

// queryClient.find(query, (err, response) => {
//   console.log(JSON.stringify(response))
// })

const txClient = new CommandServiceClient(
  'http://localhost:8081'
)

var p = new Promise((resolve, reject) => {
  console.log('Submit transaction...')
  txClient.torii(transaction, (err, data) => {
    if (err) {
      reject(err)
    } else {
      console.log('Submitted transaction successfully')
      resolve()
    }
  })
}).then(console.log('kek')).catch(err => console.log(err))

function blob2array (blob) {
  var bytearray = new Uint8Array(blob.size())
  for (let i = 0; i < blob.size(); ++i) {
    bytearray[i] = blob.get(i)
  }
  return bytearray
}
