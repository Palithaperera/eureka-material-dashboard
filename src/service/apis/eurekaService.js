const axios = require('axios');

module.exports = axios.create({
  baseURL: 'http://10.83.118.251:8761'
});