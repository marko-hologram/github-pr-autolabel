import { useState } from "react";

type TFormInputBasics = { value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void };
type TFormInputReset = () => void;
type TUseFormInputReturn = [TFormInputBasics, TFormInputReset];

const useFormInput = (initialValue = ""): TUseFormInputReturn => {
  const [value, setValue] = useState(initialValue);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;

    if (inputValue.length === 1) {
      inputValue = inputValue.trim();
    }

    setValue(inputValue);
  };

  const resetInput = () => {
    setValue("");
  };

  return [{ value, onChange: handleChange }, resetInput];
};

export default useFormInput;
