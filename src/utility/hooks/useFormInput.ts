import { useState } from "react";

type useFormInputReturn = { value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void };

const useFormInput = (initialValue = ""): useFormInputReturn => {
  const [value, setValue] = useState(initialValue);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;

    if (inputValue.length === 1) {
      inputValue = inputValue.trim();
    }

    setValue(inputValue);
  };

  return { value, onChange: handleChange };
};

export default useFormInput;
