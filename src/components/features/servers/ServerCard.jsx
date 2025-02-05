// components/features/servers/ServerCard.jsx
export const ServerCard = ({ name, iconUrl, memberCount }) => {
  return (
    <div className="bg-blue-deep p-4 rounded-lg border-2 border-gold hover:border-red-casino transition-colors">
      <img 
        src={iconUrl || '/default-server-icon.png'} 
        alt={name}
        className="w-16 h-16 rounded-full mx-auto mb-4"
      />
      <h3 className="text-gold text-xl font-bold text-center">{name}</h3>
      {memberCount && (
        <p className="text-white text-center mt-2">
          {memberCount} miembros
        </p>
      )}
    </div>
  );
};