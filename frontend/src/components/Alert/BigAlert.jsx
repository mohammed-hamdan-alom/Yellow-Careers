import React from "react";
import { Alert } from "antd";

/**
 * Renders a big alert component.
 */
const BigAlert = ({ message, description }) => (
  <Alert message={message} description={description} type='error' />
);

export default BigAlert;
