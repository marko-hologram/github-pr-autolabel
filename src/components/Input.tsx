import React, { useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
}

const Input: React.FunctionComponent<InputProps> = ({ labelText, ...otherProps }) => {
  const idRef = useRef(null);

  useEffect(() => {
    if (idRef.current) {
      return;
    }

    idRef.current = uuidv4();
  }, []);

  return (
    <>
      <label htmlFor={idRef.current}>{labelText}</label>
      <input id={idRef.current} className="form-control" {...otherProps} />
    </>
  );
};

export default Input;
