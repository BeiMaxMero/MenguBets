
export const Button = ({ children, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-red-casino text-gold hover:bg-red-800',
    secondary: 'bg-blue-deep text-white border-2 border-gold',
    ghost: 'bg-black-ebano text-gold hover:bg-gray-900'
  };

  return (
    <button
      className={`px-6 py-2 rounded-lg font-bold transition-colors ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};