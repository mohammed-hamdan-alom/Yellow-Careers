import React from "react";
import { Alert } from "antd";
const BigAlert = ({ message, description, type }) => (
  <Alert message={message} description={description} type={type} />
);
export default BigAlert;
