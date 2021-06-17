import buildClient from '../api/build-client';

const Home = ({ currentUser }) => {
  return (
    <h1>{currentUser ? 'You are signed in.' : 'You are not signed in.'}</h1>
  );
};

Home.getInitialProps = async (ctx) => {
  const axios = await buildClient(ctx);
  const { data } = await axios.get('/api/users/currentuser');
  return data;
};

export default Home;
