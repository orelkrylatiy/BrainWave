'use client';

import RegistrationForm from '@/app/components/RegistrationForm';

export default function RegisterPage() {
  const handleRegistration = async (formData: { email: string; password: string; confirmPassword: string }) => {
    console.log('Registration form submitted with:', {
      email: formData.email,
      password: '***',
    });
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Registration successful');
  };

  return <RegistrationForm onSubmit={handleRegistration} />;
}
