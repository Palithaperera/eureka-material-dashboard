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

app.get('/api/services/:env',cors(), async (req, res) => {
  const env = req.params['env']
  res.set('Content-Type', 'application/json');
  let response = await getApps(env);
  res.send(response);
});


app.get('/api/application/:env/:name',cors(), async (req, res) => {
    const appName = req.params['name']
    const env = req.params['env']
    let response = await getApps(env);
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

const getApps = async (env) => {
  let responseObj;
  await eurekaService(env).get('/eureka/apps')
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