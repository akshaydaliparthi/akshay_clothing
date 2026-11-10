import React from 'react';
import { useStore } from '../context/StoreContext';

export default function ProtectedRoute({ children, requiredRole = 'admin' }) {
  const { state, navigate } = useStore();
  if (!state.user || (requiredRole && state.user.role !== requiredRole)) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="font-display text-2xl font-extrabold uppercase">Access Restricted</h2>
        <p className="text-xs opacity-75">Please sign in with an Admin account to view this page.</p>
        <button
          onClick={() => navigate('account')}
          className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase bg-[var(--ak-accent)] text-[var(--ak-accent-fg)]"
        >
          Go to Sign In
        </button>
      </div>
    );
  }
  return children;
}
