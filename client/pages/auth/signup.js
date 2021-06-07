import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [doReq, errors] = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
    success: () => Router.push('/'),
  });

  const onSignUpSubmit = (e) => {
    e.preventDefault();

    doReq();
  };

  const renderError = function (field) {
    if (errors) {
      const err = errors.find((err) => err.field === field);
      if (err) {
        return err.data;
      }
    }
  };

  return (
    <form onSubmit={onSignUpSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      {renderError('email')}
      <div className="form-group">
        <label>Password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      {renderError('password')}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};

export default SignUp;
