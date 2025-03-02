// src/components/core/NotificationsManager.jsx
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NotificationBanner } from '../ui/NotificationBanner';
import { useAppStore } from '../../context/AppStore';

/**
 * Componente para gestionar y mostrar notificaciones globales en la aplicación
 */
export const NotificationsManager = () => {
  const { state, actions } = useAppStore();
  const { notifications } = state;
  
  // Estado para controlar las notificaciones visibles con animaciones
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  
  // Cuando cambia el array de notificaciones, actualizar las visibles
  useEffect(() => {
    // Detectar nuevas notificaciones
    const newNotifications = notifications.filter(
      notification => !visibleNotifications.some(vn => vn.id === notification.id)
    );
    
    // Añadir nuevas notificaciones con estado "entering"
    if (newNotifications.length > 0) {
      const updatedNotifications = [
        ...visibleNotifications,
        ...newNotifications.map(notification => ({
          ...notification,
          status: 'entering'
        }))
      ];
      
      setVisibleNotifications(updatedNotifications);
      
      // Después de un breve tiempo, cambiar estado a "visible"
      setTimeout(() => {
        setVisibleNotifications(prev => 
          prev.map(notification => 
            newNotifications.some(n => n.id === notification.id)
              ? { ...notification, status: 'visible' }
              : notification
          )
        );
      }, 50);
    }
    
    // Eliminar notificaciones que ya no existen en el estado global
    const notificationsToRemove = visibleNotifications.filter(
      vn => !notifications.some(n => n.id === vn.id)
    );
    
    if (notificationsToRemove.length > 0) {
      // Primero marcar como "exiting" para animar salida
      setVisibleNotifications(prev => 
        prev.map(notification => 
          notificationsToRemove.some(n => n.id === notification.id)
            ? { ...notification, status: 'exiting' }
            : notification
        )
      );
      
      // Luego eliminar después de completar la animación
      setTimeout(() => {
        setVisibleNotifications(prev => 
          prev.filter(notification => 
            !notificationsToRemove.some(n => n.id === notification.id)
          )
        );
      }, 300); // Duración de la animación en ms
    }
  }, [notifications]);
  
  // Si no hay notificaciones visibles, no renderizar nada
  if (visibleNotifications.length === 0) {
    return null;
  }
  
  // Crear portal para renderizar fuera del flujo normal de la aplicación
  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full">
      {/* Notificaciones */}
      {visibleNotifications.map(({ id, title, message, type, status, action, onAction }) => (
        <div 
          key={id} 
          className={`transition-all duration-300 ${
            status === 'entering' ? 'opacity-0 translate-x-8' : 
            status === 'exiting' ? 'opacity-0 translate-y-[-10px]' : 
            'opacity-100 translate-x-0'
          }`}
        >
          <NotificationBanner
            type={type}
            title={title}
            message={message}
            action={action}
            onAction={() => {
              if (onAction) onAction();
              actions.removeNotification(id);
            }}
            onClose={() => actions.removeNotification(id)}
          />
        </div>
      ))}
    </div>,
    document.body
  );
};

export default NotificationsManager;