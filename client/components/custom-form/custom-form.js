import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const CustomForm = ({ title, apiLink }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [doReq, errors] = useRequest({
    url: `/api/users/${apiLink}`,
    method: 'post',
    body: {
      email,
      password,
    },
    success: () => Router.push('/'),
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    await doReq();
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
    <form onSubmit={onSubmit}>
      <h1>{title}</h1>
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
      <button className="btn btn-primary">{title}</button>
    </form>
  );
};

export default CustomForm;
