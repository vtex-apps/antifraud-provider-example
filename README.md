# Antifraud provider example

The Antifraud provider example is an antifraud connector, implemented following our [Antifraud Provider Protocol](https://help.vtex.com/tutorial/antifraud-provider--4aZtmdpgFikcsQomWyqAOq), in order to be an template in which the partners can use to develop new antifraud connectors using VTEX IO.

### Routes

Currently the connector have 4 routes:

- POST `https://{{account}}.myvtex.com/fake-antifraud/transactions/` - [Send antifraud data](https://developers.vtex.com/vtex-rest-api/reference/sendantifrauddata)
- GET `https://{{account}}.myvtex.com/fake-antifraud/transactions/{transactionId}` - [Get antifraud status](https://developers.vtex.com/vtex-rest-api/reference/getantifraudstatus)
- POST `https://{{account}}.myvtex.com/fake-antifraud/pre-analysis` - [Send antifraud pre-analysis data](https://developers.vtex.com/vtex-rest-api/reference/sendantifraudpreanalysisdata)
- GET `https://{{account}}.myvtex.com/fake-antifraud/manifest` - [List manifest](https://developers.vtex.com/vtex-rest-api/reference/manifest)

In order to guarantee that the connector works, we implemented some logic in the routes when they receive the header 'x-provider-api-is-testsuite', in order to pass in the [Antifraud test suite](https://gatewayio.myvtex.com/admin/test-suite/antifraud-provider).

### Custom behaviors

This connector is supposed to return mocked values to each request, as it is test purpose only. But, those mocked values can change depending on the input it receives.

The default status returned when calling the `Send antifraud data` is **received**, but, when passing as the first name of the buyer the string *Risky*, it returns **denied**. 
The same behavior happens when trying to pass the string *NotRisky*, it returns a status **approved**. The same behavior occours with the `Send antifraud pre-analysis data` route.

In the `Get antifraud status` we have a different flow. There, we return **undefined** as status four times, and then return **approved** (except when we already have a transaction that has been denied before).
This route can also return **denied** if the 4 last digits from the first payment of the transaction are *1234*.

### How to test

In order to test the connector, you will need to run it inside a VTEX IO Workspace. When connected to a workspace, run the `vtex link` command in a terminal, and then your connector is going to be running inside VTEX IO infrastructure.

When linked, the app will provide the routes described in the **Routes** session.

To verify that your connector is working as the protocol expects, the [antifraud-provider-tests Postman collection](https://github.com/vtex-apps/antifraud-provider-tests) can be used. The initial version of the connector is already passing in all tests of the collection. 
