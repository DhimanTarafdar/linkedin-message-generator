'use client';

export const inputClass =
  'w-full px-3.5 py-2.5 rounded-md text-sm outline-none transition-all';

export const inputStyle = {
  border: '1.5px solid var(--border)',
  background: 'var(--card-bg)',
  color: 'var(--text-primary)',
};

export function FormInput({ label, required, hint, children }) {
  return (
    <div>
      <label
        className="block text-sm font-semibold mb-1.5"
        style={{ color: 'var(--text-primary)' }}
      >
        {label}
        {required && <span className="ml-1" style={{ color: 'var(--error)' }}>*</span>}
      </label>
      {children}
      {hint && (
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{hint}</p>
      )}
    </div>
  );
}
