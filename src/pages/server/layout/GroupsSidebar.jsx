//src/pages/server/layout/GroupsSidebar.jsx
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const GroupsSidebar = ({ isOpen, onClose, groups = [], onSelectGroup, activeGroup }) => (
  <div 
    className={`fixed inset-y-0 right-0 w-80 bg-black-ebano border-l-2 border-gold transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    } z-50`}
  >
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gold">Grupos de Apuestas</h3>
        <Button variant="ghost" onClick={onClose} className="p-1">
          <X className="h-6 w-6 text-gold" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <button
          className={`w-full p-3 text-left rounded-lg transition-colors ${
            activeGroup === 'general' 
              ? 'bg-gold text-black-ebano' 
              : 'bg-blue-deep text-gold hover:bg-blue-700'
          }`}
          onClick={() => onSelectGroup('general')}
        >
          General
        </button>
        
        {groups.map(group => (
          <button
            key={group.id}
            className={`w-full p-3 text-left rounded-lg transition-colors ${
              activeGroup === group.id 
                ? 'bg-gold text-black-ebano' 
                : 'bg-blue-deep text-gold hover:bg-blue-700'
            }`}
            onClick={() => onSelectGroup(group.id)}
          >
            {group.name}
          </button>
        ))}
      </div>
    </div>
  </div>
);

