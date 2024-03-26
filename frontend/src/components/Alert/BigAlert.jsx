import React from 'react';
import { Alert } from 'antd';

const BigAlert = ({message, description, type}) => (
  <Alert
    message={message}
    description={description}
    type={type}
  />
);

export const showError = (message) => {
  BigAlert({message, description:"", type: 'error'});
}

export const showFormattedError = (error) => {
  BigAlert({message: error.message, description: "", type: 'error'});
}

export default BigAlert;