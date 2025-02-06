//src/pages/server/layout/ServerHeader.jsx
import React from 'react';
import { Menu } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const ServerHeader = ({ serverName, totalBets, activeBets, onToggleGroups }) => (
  <Card className="mb-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gold mb-2">{serverName}</h1>
        <div className="flex gap-4 text-white">
          <span>Apuestas Totales: {totalBets}</span>
          <span>Apuestas Activas: {activeBets}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        onClick={onToggleGroups}
        className="p-2"
      >
        <Menu className="h-6 w-6 text-gold" />
      </Button>
    </div>
  </Card>
);

