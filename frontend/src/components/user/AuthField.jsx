export function AuthField({ name, label, error, ...props }) {
  return (
    <div>
      <label htmlFor={name} className="field-label">{label}</label>
      <input
        {...props}
        id={name}
        name={name}
        className="field"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && <p id={`${name}-error`} className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
