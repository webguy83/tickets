import Router from 'next/router';
import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';

const SignOut = () => {
  const [doReq] = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    success: () => Router.push('/'),
  });

  useEffect(() => {
    doReq();
  }, []);

  return <div>Signing out woooo</div>;
};

export default SignOut;
