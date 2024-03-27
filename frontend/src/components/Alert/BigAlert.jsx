import React from "react";
import { Alert } from "antd";

const BigAlert = ({ message, description }) => (
  <Alert message={message} description={description} type='error' />
);

export default BigAlert;
