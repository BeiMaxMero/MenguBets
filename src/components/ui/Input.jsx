export const Input = ({ label, error, ...props }) => (
    <div className="space-y-1">
      {label && <label className="text-gold font-medium">{label}</label>}
      <input
        className="w-full bg-blue-deep text-white p-3 rounded-lg border  focus:ring-2 focus:ring-red-casino"
        {...props}
      />
      {error && <span className="text-red-casino text-sm">{error}</span>}
    </div>
  );