import axios from 'axios';

const Home = ({ currentUser }) => {
  return <h1>homeeee {currentUser}</h1>;
};

Home.getInitialProps = async () => {
  const res = await axios.get('/api/users/currentuser');

  return res.data;
};

export default Home;
