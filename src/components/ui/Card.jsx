
export const Card = ({ children, className = '' }) => (
  <div className={`bg-black-ebano p-6 rounded-xl border-2 border-gold ${className}`}>
    {children}
  </div>
);