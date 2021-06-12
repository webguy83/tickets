import axios from 'axios';

const Home = ({ currentUser }) => {
  //console.log(currentUser);
  return <h1>homeeee {currentUser}</h1>;
};

Home.getInitialProps = async ({ req }) => {
  if (typeof window === 'undefined') {
    // server
    const res = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: req.headers,
      }
    );

    return res.data;
  } else {
    // client
    const res = await axios.get('/api/users/currentuser');
    return res.data;
  }
};

export default Home;
