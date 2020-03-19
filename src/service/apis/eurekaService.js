const axios = require('axios');
const getServiceInstance = (env) => {
  let environment;
      switch(env){
        case "dev":
          environment = 'http://10.83.143.221:8761/'
          break;
        case "dev2":
          environment = 'http://10.83.135.4:8761/'
          break;
        case "stg":
          environment = 'http://10.83.118.251:8761/'
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