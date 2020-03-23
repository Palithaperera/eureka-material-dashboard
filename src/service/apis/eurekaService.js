const axios = require('axios');
const getServiceInstance = (env) => {
  let environment;
      switch(env){
        case "DEV":
          environment = 'http://10.83.143.221:8761/'
          break;
        case "DEV2":
          environment = 'http://10.83.135.4:8761/'
          break;
        case "QA-INT":
          environment = 'http://10.83.134.193:8761/'
          break;
        case "STG":
            environment = 'http://10.83.118.251:8761/'
            break;
        case "PRD":
          environment = 'http://10.83.70.39:8761/'
          break;
        default:
          environment = 'http://10.83.143.221:8761/'
          break;
      }
      return axios.create({
        baseURL: environment
      });
};
module.exports = getServiceInstance;