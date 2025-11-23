/**
 * RegistrationForm Component - Usage Examples
 * 
 * This file demonstrates how to use the RegistrationForm component
 * in your Next.js application.
 */

import RegistrationForm from './RegistrationForm';

/**
 * Example 1: Basic usage without callback
 * The form will validate and manage state internally
 */
export function BasicRegistrationForm() {
  return <RegistrationForm />;
}

/**
 * Example 2: With form submission callback
 * Handle the registration data when the form is submitted
 */
export function RegistrationFormWithCallback() {
  const handleSubmit = async (formData: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
    } catch (error) {
      throw error;
    }
  };

  return <RegistrationForm onSubmit={handleSubmit} />;
}

/**
 * Component Features:
 * 
 * 1. Form Validation:
 *    - Email format validation (basic regex check)
 *    - Password strength (minimum 8 characters)
 *    - Password match validation
 *    - Real-time error clearing on input change
 * 
 * 2. State Management:
 *    - Uses React hooks (useState) for form state
 *    - Manages form errors independently
 *    - Loading state for submission
 *    - Success message display
 * 
 * 3. Styling:
 *    - Built with Tailwind CSS 4
 *    - Responsive design (mobile-first)
 *    - Dark mode support (dark: classes)
 *    - Focus states and transitions
 *    - Loading spinner animation
 * 
 * 4. Accessibility:
 *    - Proper label associations with htmlFor
 *    - aria-invalid and aria-describedby attributes
 *    - aria-busy for loading state
 *    - Semantic HTML structure
 *    - Keyboard navigation support
 * 
 * 5. TypeScript:
 *    - Fully typed component with interfaces
 *    - FormState interface for form data
 *    - FormErrors interface for validation errors
 *    - RegistrationFormProps for component props
 * 
 * Props:
 * - onSubmit? (optional): Callback function that receives form data and can be async
 * 
 * The component handles:
 * - Form submission with validation
 * - Error display and management
 * - Loading states
 * - Success feedback
 * - Form reset after successful submission
 */
