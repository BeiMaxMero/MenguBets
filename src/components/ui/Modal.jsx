// src/components/ui/Modal.jsx
import React from 'react';
import { Button } from './Button';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black-ebano bg-opacity-75 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full justify-center items-center p-4">
        <div className="relative bg-blue-deep rounded-xl max-w-lg w-full p-6 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gold">{title}</h3>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-white hover:text-gold"
            >
              ✕
            </Button>
          </div>
          
          {/* Content */}
          <div className="space-y-4">
            {children}
          </div>
          
          {/* Footer */}
          <div className="mt-6 flex justify-end gap-4">
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};