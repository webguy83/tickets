import axios from 'axios';

const isServer = () => {
  return typeof window === 'undefined';
};

const BuildClient = async ({ req }) => {
  if (isServer()) {
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: '/',
    });
  }
};

export default BuildClient;
