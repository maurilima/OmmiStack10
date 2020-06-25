import { useState } from "react";

export default function useFormInput(initalValue) {
    const [value, setValue] = useState(initalValue);
  
    function handleChange(e) {
      setValue(e.target.value);
        //  console.log(e.target.name);
        //  console.log(e.target.value);
    }
    return {
      value,
      onChange: handleChange
    };
  }