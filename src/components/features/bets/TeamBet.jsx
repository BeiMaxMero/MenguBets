import { UserAvatar } from '../../ui/UserAvatar';

export const TeamBet = ({ bet }) => {
  return (
    <div className="bg-blue-deep p-4 rounded-lg gold-border mb-4">
      <div className="flex items-center gap-4 mb-2">
        {bet.members.map(member => (
          <UserAvatar 
            key={member.id} 
            user={member} 
            className="border-2 border-gold"
          />
        ))}
      </div>
      <p className="text-gold">
        Pronóstico: <span className="text-red-casino">{bet.prediction}</span>
      </p>
    </div>
  );
};