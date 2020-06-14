import React, { useRef, useEffect, forwardRef } from "react";
import { v4 as uuidv4 } from "uuid";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
  ref?: React.Ref<HTMLInputElement>;
}

const Input: React.FunctionComponent<InputProps> = forwardRef(({ labelText, ...otherProps }, ref: React.Ref<HTMLInputElement>) => {
  const idRef = useRef(null);

  useEffect(() => {
    if (idRef.current) {
      return;
    }

    idRef.current = uuidv4();
  }, []);

  return (
    <>
      {labelText && <label htmlFor={idRef.current}>{labelText}</label>}
      <input id={idRef.current} className="form-control" ref={ref} {...otherProps} />
    </>
  );
});

export default Input;
