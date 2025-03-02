// src/components/ui/NotificationBanner.jsx
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { 
  X, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle 
} from 'lucide-react';

export const NotificationBanner = ({ 
  type = 'info', 
  title = null,
  message,
  action = null,
  onAction = null,
  onClose = null,
  autoClose = true,
  duration = 5000
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [progress, setProgress] = useState(100);
  
  // Configuración según el tipo de notificación
  const types = {
    info: {
      bgColor: 'bg-blue-deep',
      icon: <Info className="h-5 w-5 text-blue-300" />,
      textColor: 'text-white',
      titleColor: 'text-blue-200',
      borderColor: 'border-blue-500'
    },
    success: {
      bgColor: 'bg-green-900',
      icon: <CheckCircle className="h-5 w-5 text-green-400" />,
      textColor: 'text-white',
      titleColor: 'text-green-300',
      borderColor: 'border-green-500'
    },
    warning: {
      bgColor: 'bg-yellow-900',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
      textColor: 'text-white',
      titleColor: 'text-yellow-300',
      borderColor: 'border-yellow-500'
    },
    error: {
      bgColor: 'bg-red-900',
      icon: <AlertCircle className="h-5 w-5 text-red-400" />,
      textColor: 'text-white',
      titleColor: 'text-red-300',
      borderColor: 'border-red-500'
    }
  };

  const { bgColor, icon, textColor, titleColor, borderColor } = types[type];

  const handleClose = () => {
    setIsClosing(true);
    
    // Esperar a que se complete la animación antes de llamar a onClose
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };
  
  // Cerrar automáticamente después de la duración especificada
  useEffect(() => {
    if (!autoClose) return;
    
    // Actualizar barra de progreso
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress <= 0) {
          clearInterval(interval);
          handleClose();
          return 0;
        }
        return prevProgress - (100 / (duration / 100));
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [autoClose, duration]);

  return (
    <div 
      className={`rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform ${
        isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      } ${bgColor} ${textColor} p-0 border-l-4 ${borderColor}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* Icono */}
            <div className="flex-shrink-0 pt-0.5">
              {icon}
            </div>
            
            {/* Contenido */}
            <div className="flex-1">
              {title && (
                <h4 className={`text-sm font-bold mb-1 ${titleColor}`}>
                  {title}
                </h4>
              )}
              <p className="text-sm">{message}</p>
              
              {/* Botón de acción si existe */}
              {action && onAction && (
                <Button 
                  variant="ghost"
                  onClick={onAction}
                  className="mt-2 px-3 py-1 h-auto text-sm hover:bg-blue-700"
                >
                  {action}
                </Button>
              )}
            </div>
          </div>
          
          {/* Botón de cierre */}
          <button
            onClick={handleClose}
            className="ml-3 flex-shrink-0 p-1 rounded-md hover:bg-blue-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Barra de progreso para cierre automático */}
      {autoClose && (
        <div className="h-1 bg-gray-700">
          <div 
            className="h-full bg-gold transition-all ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationBanner;