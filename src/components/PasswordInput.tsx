import { useState } from "react";
type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};


export const PasswordInput = ({ value, onChange, placeholder = "Password" }: Props) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button type="button" onClick={() => setShow(!show)}>
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
};