import { SubmitHandler, useForm } from 'react-hook-form';

const UpdatePassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        
    }
  return (
    <div>
      <form action="">inp</form>
    </div>
  );
};

export default UpdatePassword;
