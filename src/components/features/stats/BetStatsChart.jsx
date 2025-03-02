// src/components/features/stats/BetStatsChart.jsx
import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const BetStatsChart = ({ data, type = 'monthly' }) => {
  const [chartType, setChartType] = useState('bar'); // 'bar' o 'line'
  const [timeRange, setTimeRange] = useState(type); // 'weekly', 'monthly', 'yearly'

  // Datos de ejemplo para cada tipo de rango de tiempo
  const chartData = {
    weekly: [
      { name: 'Lunes', apuestas: 4, aciertos: 2, puntos: 6 },
      { name: 'Martes', apuestas: 6, aciertos: 4, puntos: 12 },
      { name: 'Miércoles', apuestas: 8, aciertos: 5, puntos: 15 },
      { name: 'Jueves', apuestas: 10, aciertos: 7, puntos: 21 },
      { name: 'Viernes', apuestas: 12, aciertos: 6, puntos: 18 },
      { name: 'Sábado', apuestas: 16, aciertos: 10, puntos: 30 },
      { name: 'Domingo', apuestas: 14, aciertos: 8, puntos: 24 }
    ],
    monthly: [
      { name: 'Enero', apuestas: 40, aciertos: 25, puntos: 75 },
      { name: 'Febrero', apuestas: 45, aciertos: 30, puntos: 90 },
      { name: 'Marzo', apuestas: 55, aciertos: 35, puntos: 105 },
      { name: 'Abril', apuestas: 60, aciertos: 40, puntos: 120 },
      { name: 'Mayo', apuestas: 65, aciertos: 45, puntos: 135 },
      { name: 'Junio', apuestas: 70, aciertos: 50, puntos: 150 }
    ],
    yearly: [
      { name: '2021', apuestas: 500, aciertos: 300, puntos: 900 },
      { name: '2022', apuestas: 600, aciertos: 400, puntos: 1200 },
      { name: '2023', apuestas: 700, aciertos: 500, puntos: 1500 },
      { name: '2024', apuestas: 400, aciertos: 300, puntos: 900 }
    ]
  };

  // Usar los datos proporcionados o los datos de ejemplo
  const displayData = data || chartData[timeRange];

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gold">Estadísticas de Apuestas</h3>
        
        <div className="flex gap-2">
          <div className="flex rounded-lg overflow-hidden border border-gold">
            <Button
              className={`px-3 py-1 rounded-none ${chartType === 'bar' ? 'bg-gold text-black-ebano' : 'bg-blue-deep text-gold'}`}
              onClick={() => setChartType('bar')}
            >
              Barras
            </Button>
            <Button
              className={`px-3 py-1 rounded-none ${chartType === 'line' ? 'bg-gold text-black-ebano' : 'bg-blue-deep text-gold'}`}
              onClick={() => setChartType('line')}
            >
              Líneas
            </Button>
          </div>
          
          <select
            className="bg-blue-deep text-gold border border-gold rounded-lg px-3 py-1"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensual</option>
            <option value="yearly">Anual</option>
          </select>
        </div>
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart
              data={displayData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="name" stroke="#FFD700" />
              <YAxis stroke="#FFD700" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E3A8A', 
                  borderColor: '#FFD700',
                  color: '#FFD700'
                }} 
              />
              <Legend wrapperStyle={{ color: '#FFD700' }} />
              <Bar dataKey="apuestas" name="Apuestas" fill="#4682B4" />
              <Bar dataKey="aciertos" name="Aciertos" fill="#32CD32" />
              <Bar dataKey="puntos" name="Puntos" fill="#FFD700" />
            </BarChart>
          ) : (
            <LineChart
              data={displayData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="name" stroke="#FFD700" />
              <YAxis stroke="#FFD700" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E3A8A', 
                  borderColor: '#FFD700',
                  color: '#FFD700'
                }} 
              />
              <Legend wrapperStyle={{ color: '#FFD700' }} />
              <Line type="monotone" dataKey="apuestas" name="Apuestas" stroke="#4682B4" strokeWidth={2} />
              <Line type="monotone" dataKey="aciertos" name="Aciertos" stroke="#32CD32" strokeWidth={2} />
              <Line type="monotone" dataKey="puntos" name="Puntos" stroke="#FFD700" strokeWidth={2} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <p className="text-sm text-gray-400">Total Apuestas</p>
          <p className="text-xl font-bold text-gold">
            {displayData.reduce((acc, item) => acc + item.apuestas, 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Total Aciertos</p>
          <p className="text-xl font-bold text-gold">
            {displayData.reduce((acc, item) => acc + item.aciertos, 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Precisión</p>
          <p className="text-xl font-bold text-gold">
            {Math.round(
              (displayData.reduce((acc, item) => acc + item.aciertos, 0) / 
              displayData.reduce((acc, item) => acc + item.apuestas, 0)) * 100
            )}%
          </p>
        </div>
      </div>
    </Card>
  );
};