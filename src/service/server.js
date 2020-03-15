const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const http = require('http');
const app = express();
const axios = require('axios');
const eurekaService = require('./apis/eurekaService');
var xml = require('xml');

const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/api/services',cors(), async (req, res) => {
  res.set('Content-Type', 'application/json');
  let response = await getApps();
  res.send(response);
});


app.get('/api/application/:name',cors(), async (req, res) => {
    let appName = req.params['name']
    let response = await getApps();
    let app = response.find( (obj) =>
        obj.name === appName
    );

    let instances;
    if(app.instance) {
      instances = await Promise.all( app.instance.map( async (instance) => {
          let healthUrl = `http://${instance.ipAddr}:${instance.port.$}/health`;
          let healthData = await getHealth(healthUrl)
          return {
            healthUrl: healthUrl,
            hostName: instance.hostName,
            ip: instance.ipAddr,
            healthData: healthData
          }
        })
      );
    }
    res.send(instances);
});

const getApps = async () => {
  let responseObj;
  await eurekaService.get('/eureka/apps')
  .then(response => {
    responseObj = response.data;
  })
  .catch(error => {
    console.log(error);
  });

  return responseObj.applications.application;
}

const getHealth = async (healthUrl) => {
  let response;
  try{
    response = await axios.get(healthUrl);
    console.log(response);
  } catch(error) {
    console.log(error);
    return null;
  }
  return response.data;
}

app.listen(port, () => console.log(`Listening on port ${port}`));