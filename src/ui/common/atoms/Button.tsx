import { image } from '../../../config/constant/image';
interface ButtonProps {
  name: string;
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  buttonText: string;
  className: string;


}

const Button: React.FC<ButtonProps> = ({
  name,
  type = undefined,
  disabled = false,
  buttonText,
  className,
}) => {
  return (
    <div>
      <button
        type={type}
        disabled={disabled}
        className={`border rounded-md 
            w-24 bg-blue-700 text-white p-2  ${className}`}
      >
        {disabled ? <img className="w-10 h-10" src={image?.loader} alt="" /> : name}

        <span>{buttonText}</span>
      </button>
    </div>
  );
};

export default Button;
