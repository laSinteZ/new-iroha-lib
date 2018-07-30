import { QueryServiceClient, CommandServiceClient } from './proto/endpoint_pb_service'
import queryHelper from './query-helper'
import txHelper from './tx-helper'

import _ from 'lodash'

var adminPriv =
  '0f0ce16d2afbb8eca23c7d8c2724f0c257a800ee2bbd54688cec6b898e3f7e33'

var query1 = _.flow(
  (q) => queryHelper.addQuery(q, 'getAccount', { accountId: 'test@notary' }),
  (q) => queryHelper.addMeta(q, { creatorAccountId: 'test@notary' }),
  (q) => queryHelper.sign(q, adminPriv)
)(queryHelper.emptyQuery())

var transaction = _.flow(
  (t) => txHelper.addCommand(t, 'CreateAsset', { assetName: 'lel', domainId: 'notary', precision: 10 }),
  (t) => txHelper.addMeta(t, { creatorAccountId: 'test@notary' }),
  (t) => txHelper.sign(t, adminPriv)
)(txHelper.emptyTransaction())

// let query1 = new Query()
//   |> (_ => queryHelper.addQuery(_, 'getAccount', { accountId: 'test@notary' }))
//   |> (_ => queryHelper.addMeta(_, { creatorAccountId: 'test@notary' }))
//   |> (_ => queryHelper.sign(_, adminPriv))

// const queryClient = new QueryServiceClient(
//   'http://localhost:8081'
// )

// queryClient.find(query1, (err, response) => {
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
