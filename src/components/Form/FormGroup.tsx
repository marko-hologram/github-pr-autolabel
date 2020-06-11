import React from "react";

const FormGroup: React.FunctionComponent<Record<string, unknown>> = ({ children }) => {
  return <div className="form-group">{children}</div>;
};

export default FormGroup;
