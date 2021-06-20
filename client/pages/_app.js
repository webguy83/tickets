import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header/header';

const AppComp = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComp.getInitialProps = async (appCtx) => {
  const axios = await buildClient(appCtx.ctx);
  const { data } = await axios.get('/api/users/currentuser');

  let pageProps = {};

  if (appCtx.Component.getInitialProps) {
    pageProps = await appCtx.Component.getInitialProps(appCtx.ctx);
  }
  return {
    pageProps,
    ...data,
  };
};

export default AppComp;
