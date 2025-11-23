# RegistrationForm Component

A fully-featured, accessible registration form component built with React, TypeScript, and Tailwind CSS for the BrainWave project.

## Features

### Form Validation
- **Email Format Validation**: Uses regex pattern to validate email addresses
- **Password Strength Check**: Minimum 8 characters required
- **Password Match Validation**: Ensures confirm password matches password field
- **Real-time Error Clearing**: Errors clear when user starts typing in a field
- **Visual Feedback**: Shows success indicators when validation passes

### State Management
- **React Hooks**: Uses `useState` for form state management
- **Independent Error Tracking**: Separate state for form field errors
- **Loading State**: Provides visual feedback during form submission
- **Success Messages**: Displays confirmation after successful registration

### Styling & Design
- **Tailwind CSS 4**: Fully responsive design built with utility classes
- **Dark Mode Support**: Complete dark theme styling with `dark:` prefixes
- **Consistent Design**: Matches the existing BrainWave design system
- **Smooth Transitions**: Hover and focus states with smooth animations
- **Loading Spinner**: Animated spinner during form submission

### Accessibility
- **Semantic HTML**: Proper use of form elements and labels
- **ARIA Attributes**: 
  - `aria-invalid` for error states
  - `aria-describedby` for error message associations
  - `aria-busy` for loading state
- **Keyboard Navigation**: Full keyboard support for all form fields
- **Label Association**: All inputs properly linked to labels via `htmlFor`
- **Auto-complete Support**: Appropriate `autoComplete` attributes

### TypeScript
- **Full Type Safety**: Completely typed with interfaces
- **FormState Interface**: Typed form data structure
- **FormErrors Interface**: Typed error state
- **Props Interface**: Clear component prop definitions
- **React.FC Pattern**: Proper functional component typing

## Usage

### Basic Usage (No Callback)

```tsx
import RegistrationForm from '@/app/components/RegistrationForm';

export default function RegisterPage() {
  return <RegistrationForm />;
}
```

### With Submit Callback

```tsx
'use client';

import RegistrationForm from '@/app/components/RegistrationForm';

export default function RegisterPage() {
  const handleRegistration = async (formData: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
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
  };

  return <RegistrationForm onSubmit={handleRegistration} />;
}
```

## Props

```typescript
interface RegistrationFormProps {
  onSubmit?: (formData: FormState) => Promise<void> | void;
}

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
}
```

### onSubmit (Optional)
- **Type**: `(formData: FormState) => Promise<void> | void`
- **Description**: Callback function called when form is successfully validated and submitted
- **Behavior**: 
  - Can be async or sync
  - Form loading state is active during async operations
  - Any thrown errors are caught and displayed
  - Form resets after successful submission

## Validation Rules

### Email
- Required field
- Must match email format pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

### Password
- Required field
- Minimum 8 characters
- Success indicator appears when criteria is met

### Confirm Password
- Required field
- Must exactly match the password field
- Shows match status feedback

## Component States

### Initial State
- Empty form fields
- No error messages
- Submit button enabled
- No success message

### During Validation Error
- Error messages displayed under each invalid field
- Field borders highlighted with error styling (red)
- Submit button remains enabled
- No success message

### During Submission
- Submit button disabled
- Loading spinner shown
- Button text changes to "Creating account..."
- Cursor changes to not-allowed

### After Successful Submission
- Green success message displayed
- Form fields cleared
- Loading state removed

## Styling Classes

The component uses Tailwind CSS utility classes for:
- **Layout**: Flexbox, grid, positioning
- **Colors**: Zinc for text, blue for interactions, red for errors, green for success
- **Spacing**: Padding, margins for consistent whitespace
- **Typography**: Font sizes, weights, line heights
- **Effects**: Shadows, borders, transitions
- **Dark Mode**: Prefixed with `dark:` for dark theme variants

## Example with Error Handling

```tsx
'use client';

import { useState } from 'react';
import RegistrationForm from '@/app/components/RegistrationForm';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);

  const handleRegistration = async (formData: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      setError(null);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}
      <RegistrationForm onSubmit={handleRegistration} />
    </div>
  );
}
```

## Browser Support

- Modern browsers with ES2017+ support
- Full dark mode support based on `prefers-color-scheme`
- Accessibility tested with keyboard navigation and screen readers

## Dependencies

- React 19.2.0
- Next.js 16.0.1
- TypeScript 5+
- Tailwind CSS 4

## File Location

- Component: `app/components/RegistrationForm.tsx`
- Demo Page: `app/register/page.tsx`
- Examples: `app/components/RegistrationForm.example.tsx`

## Notes

- The component is a client component (uses `'use client'` directive)
- Form state is managed locally within the component
- Error handling can be extended with custom error callbacks
- The component integrates seamlessly with Next.js App Router
