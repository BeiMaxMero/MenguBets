// components/ui/UserAvatar.jsx
import React from 'react';

export const UserAvatar = ({ user, className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  // URL por defecto si el usuario no tiene avatar
  const defaultAvatarUrl = '/default-avatar.png';
  
  // Si el usuario tiene un avatar de Discord, usamos ese
  const avatarUrl = user.avatar || defaultAvatarUrl;

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <img
        src={avatarUrl}
        alt={user.username || 'Usuario'}
        className="rounded-full object-cover w-full h-full"
      />
      {user.isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black-ebano rounded-full" />
      )}
    </div>
  );
};