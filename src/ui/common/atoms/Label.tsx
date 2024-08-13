import React from 'react';
import RequiredSign from './RequiredSign';

interface ILabel {
  name: string;
  label: string;
  required?: boolean;
}

const Label: React.FC<ILabel> = ({ name, label, required }) => {
  return (
    <label htmlFor={name} className="text-gray-700">
      {label} {required && <RequiredSign />}
    </label>
  );
};

export default Label;
