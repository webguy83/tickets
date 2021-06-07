import { useState } from 'react';
import axios from 'axios';

const UseRequest = ({ url, method, body, success }) => {
  const [errorsBlock, setErrorsBlock] = useState(null);

  const renderErrors = (errors) => {
    if (errors.length > 0) {
      return errors.map((err) => {
        return {
          data: <div className="alert alert-danger">{err.message}</div>,
          field: err.field,
        };
      });
    }
  };

  const doReq = async function () {
    try {
      setErrorsBlock(null);
      const res = await axios[method](url, body);

      if (success) {
        success(res.data);
      }

      return res.data;
    } catch (err) {
      setErrorsBlock(renderErrors(err.response.data.errors));
    }
  };

  return [doReq, errorsBlock];
};

export default UseRequest;
