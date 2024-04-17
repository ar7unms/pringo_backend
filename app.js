const express = require('express');
const routes = require('./controller/fileroute');
const routess = require('./controller/memberroute');
const routesss=require('./controller/transactionRoute')
const routesbind=require('./controller/bindRoute')

const app = express();
const port = 3001;

app.use('/api/print',routes);
app.use('/api/bind',routesbind);
app.use('/api/member',routess);
app.use('/api/transaction',routesss)
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
