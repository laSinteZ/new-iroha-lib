import { Query } from './proto/queries_pb'
import { QueryServiceClient } from './proto/endpoint_pb_service'
import queryHelper from './query-helper'
import _ from 'lodash'

var adminPriv =
  '0f0ce16d2afbb8eca23c7d8c2724f0c257a800ee2bbd54688cec6b898e3f7e33'

// var query1 = _.flow(
//   (q) => queryHelper.addQuery(q, 'getAccount', { accountId: 'test@notary' }),
//   (q) => queryHelper.addMeta(q, { creatorAccountId: 'test@notary' }),
//   (q) => queryHelper.sign(q, adminPriv)
// )(new Query())

let query1 = new Query()
  |> (_ => queryHelper.addQuery(_, 'getAccount', { accountId: 'test@notary' }))
  |> (_ => queryHelper.addMeta(_, { creatorAccountId: 'test@notary' }))
  |> (_ => queryHelper.sign(_, adminPriv))

const queryClient = new QueryServiceClient(
  'http://localhost:8081'
)

queryClient.find(query1, (err, response) => {
  console.log(JSON.stringify(response))
})
