import { useState } from "react";
type Props = {
  value: string;
  onChange: (v: string) => void;
};


export const PasswordInput = ({ value, onChange }: Props) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="button" onClick={() => setShow(!show)}>
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
};