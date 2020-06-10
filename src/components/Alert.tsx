import React from "react";
import classnames from "classnames";

interface AlertProps {
  variant: "primary" | "secondary" | "danger" | "success";
}

const Alert: React.FunctionComponent<AlertProps> = ({ variant, children }) => {
  const classesString = classnames("alert", `alert-${variant}`);
  return <div className={classesString}>{children}</div>;
};

export default Alert;
