import { Query } from './proto/queries_pb'
import { QueryServiceClient } from './proto/endpoint_pb_service'
import queryHelper from './query-helper'

var adminPriv =
  '0f0ce16d2afbb8eca23c7d8c2724f0c257a800ee2bbd54688cec6b898e3f7e33'

let queryFull2 = queryHelper.sign(
  queryHelper.addMeta(
    queryHelper.addQuery(
      new Query(), 'getAccount', { accountId: 'test@notary' }
    ),
  { creatorAccountId: 'test@notary' }),
  adminPriv)

const queryClient = new QueryServiceClient(
  'http://localhost:8081'
)

queryClient.find(queryFull2, (err, response) => {
  console.log(JSON.stringify(response))
})
