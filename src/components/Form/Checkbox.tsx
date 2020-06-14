import React, { ReactElement, useRef, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

interface CheckboxProps {
  checked: boolean;
  name: string;
  disabled: boolean;
  children: ReactNode;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FunctionComponent<CheckboxProps> = ({ children, checked, name, onChange }): ReactElement => {
  const idRef = useRef(null);

  useEffect(() => {
    if (idRef.current) {
      return;
    }

    idRef.current = uuidv4();
  }, []);

  return (
    <div className="form-group form-check">
      <input type="checkbox" id={idRef.current} className="form-check-input" name={name} checked={checked} onChange={onChange} />
      <label htmlFor={idRef.current} className="form-check-label">
        {children}
      </label>
    </div>
  );
};

export default Checkbox;
