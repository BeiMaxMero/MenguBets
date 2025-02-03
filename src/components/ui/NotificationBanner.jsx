// src/components/ui/NotificationBanner.jsx
import React from 'react';
import { Button } from './Button';

export const NotificationBanner = ({ type = 'info', message, action, onAction, onClose }) => {
  const types = {
    info: {
      bgColor: 'bg-blue-deep',
      icon: 'ℹ️',
      textColor: 'text-white'
    },
    success: {
      bgColor: 'bg-green-600',
      icon: '✅',
      textColor: 'text-white'
    },
    warning: {
      bgColor: 'bg-yellow-500',
      icon: '⚠️',
      textColor: 'text-black'
    },
    error: {
      bgColor: 'bg-red-casino',
      icon: '❌',
      textColor: 'text-white'
    }
  };

  const { bgColor, icon, textColor } = types[type];

  return (
    <div className={`${bgColor} p-4 rounded-lg shadow-lg ${textColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xl">{icon}</span>
          <p className="font-medium">{message}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {action && (
            <Button 
              variant="ghost"
              onClick={onAction}
              className="text-sm hover:text-gold"
            >
              {action}
            </Button>
          )}
          
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-sm hover:text-gold"
          >
            ✕
          </Button>
        </div>
      </div>
    </div>
  );
};