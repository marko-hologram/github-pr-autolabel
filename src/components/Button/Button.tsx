import React, { useState } from "react";
import classnames from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top" | "framename";
  rel?: "alternate" | "author" | "bookmark" | "external" | "help" | "license" | "next" | "nofollow" | "noreferrer" | "noopener" | "prev" | "search" | "tag";
}

const Button: React.FunctionComponent<ButtonProps> = ({ children, variant = "primary", href, ...otherProps }) => {
  const classesString = classnames("btn", `btn-${variant}`);

  const WrapperTag: any = href ? "a" : "button";

  return (
    <WrapperTag className={classesString} href={href} {...otherProps}>
      {children}
    </WrapperTag>
  );
};

export default Button;
