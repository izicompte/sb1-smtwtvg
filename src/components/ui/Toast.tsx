import { Toaster } from 'react-hot-toast';

export function Toast() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: 'var(--toast-bg)',
          color: 'var(--toast-color)',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        success: {
          style: {
            background: 'var(--toast-success-bg)',
            color: 'var(--toast-success-color)',
            borderLeft: '4px solid #22c55e',
          },
          icon: '🎉',
        },
        error: {
          style: {
            background: 'var(--toast-error-bg)',
            color: 'var(--toast-error-color)',
            borderLeft: '4px solid #ef4444',
          },
          icon: '❌',
        },
      }}
    />
  );
}