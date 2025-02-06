import React from 'react';
import { Header } from './core/Header';
import { Toaster } from 'react-hot-toast';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black-ebano">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e3a8a',
            color: '#ffd700',
          },
        }}
      />
    </div>
  );
};