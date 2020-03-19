import axios from 'axios';
const getServiceInstance = (env) => {
      return axios.create({
        baseURL: `http://127.0.0.1:5000/${env}`
      });
};
export default getServiceInstance;