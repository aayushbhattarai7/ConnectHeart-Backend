import React, { useState } from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

interface InputFieldProps {
  placeholder?: string;
  type?: string;
  name: string;
  readOnly?: boolean;
  error?: FieldError;
  register: UseFormRegister<any>;
  multiple?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className: string;
  required?: boolean;
  maxlength?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  type,
  name,
  readOnly,
  error,
  register,
  multiple,
  onChange,
  className,
  required,
  maxlength,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const toggleField = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex">
      <input
        type={type && type === 'password' ? (showPassword ? 'text' : 'password') : 'text'}
        readOnly={readOnly}
        placeholder={placeholder}
        multiple={multiple}
        {...register(name)}
        onChange={onChange}
        className={`border rounded-lg  p-2 outline-none ${className}`}
        required
        maxLength={200}
      />
      {type === 'password' && (
        <span className="icon p-4" onClick={toggleField}>
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      )}
    </div>
  );
};

export default InputField;
