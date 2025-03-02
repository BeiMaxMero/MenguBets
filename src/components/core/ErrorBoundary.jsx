// src/components/core/ErrorBoundary.jsx
import React, { Component } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la UI alternativa
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    // También puedes registrar el error en un servicio de reporte de errores
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Aquí podrías enviar el error a un servicio como Sentry o LogRocket
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Renderiza cualquier UI alternativa
      return (
        <Card className="max-w-2xl mx-auto my-8 bg-blue-deep">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gold mb-4">Algo salió mal</h2>
            <p className="text-white mb-6">
              Ha ocurrido un error inesperado en la aplicación. Puedes intentar recargar la página o volver al inicio.
            </p>
            
            {process.env.NODE_ENV !== 'production' && (
              <div className="bg-black-ebano p-4 rounded-lg mb-6 text-left">
                <p className="text-red-casino mb-2 font-bold">Error: {this.state.error?.toString()}</p>
                <p className="text-gray-400 text-sm overflow-auto max-h-48">
                  {this.state.errorInfo?.componentStack}
                </p>
              </div>
            )}
            
            <div className="flex justify-center gap-4">
              <Button
                variant="secondary"
                onClick={this.handleReset}
              >
                Intentar de nuevo
              </Button>
              <Button
                variant="primary"
                onClick={() => window.location.href = '/'}
              >
                Volver al inicio
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;