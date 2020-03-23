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

app.get('/:env/api/services',cors(), async (req, res) => {
  const env = req.params['env']
  res.set('Content-Type', 'application/json');
  let apps = await getApps(env);

  let response = apps.map((obj, index) => {
    return [(index + 1).toString(),obj.name, obj.instance.length.toString(), `${obj.instance[0].ipAddr}:${obj.instance[0].port.$.toString()}`]
  })
  res.send(response);
});


app.get('/:env/api/application/:name',cors(), async (req, res) => {
    const appName = req.params['name']
    const env = req.params['env'].toUpperCase();
    let response = await getApps(env);
    let app = response.find( (obj) =>
        obj.name === appName
    );

    let instances;
    if(app.instance) {
      instances = await Promise.all( app.instance.map( async (instance) => {
          let healthData = await getHealth(instance)
          return healthData;
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

const getHealth = async (instance) => {
  let healthUrl = `http://${instance.ipAddr}:${instance.port.$}/health`;
  let response;
  try {
    response = await axios.get(healthUrl);
  } catch(error) {
    console.log('Health data get failed for: ' + healthUrl);
  }
  return {
    healthUrl: healthUrl,
    hostName: instance.hostName,
    ip: instance.ipAddr,
    healthData: response && response.data
  };
}



app.listen(port, () => console.log(`Listening on port ${port}`));