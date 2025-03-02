// src/utils/validators.js
/**
 * Validación general para campos
 */

/**
 * Valida si un campo es requerido
 * @param {string} value - Valor a validar
 * @returns {string|null} - Mensaje de error o null si es válido
 */
export const isRequired = (value) => {
    if (!value || value.trim() === '') {
      return 'Este campo es requerido';
    }
    return null;
  };
  
  /**
   * Valida que un valor tenga una longitud mínima
   * @param {string} value - Valor a validar
   * @param {number} min - Longitud mínima requerida
   * @returns {string|null} - Mensaje de error o null si es válido
   */
  export const minLength = (value, min) => {
    if (!value || value.length < min) {
      return `Este campo debe tener al menos ${min} caracteres`;
    }
    return null;
  };
  
  /**
   * Valida que un valor tenga una longitud máxima
   * @param {string} value - Valor a validar
   * @param {number} max - Longitud máxima permitida
   * @returns {string|null} - Mensaje de error o null si es válido
   */
  export const maxLength = (value, max) => {
    if (value && value.length > max) {
      return `Este campo no puede tener más de ${max} caracteres`;
    }
    return null;
  };
  
  /**
   * Valida que un valor sea un email válido
   * @param {string} value - Email a validar
   * @returns {string|null} - Mensaje de error o null si es válido
   */
  export const isValidEmail = (value) => {
    if (!value) return null;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Por favor, introduce un email válido';
    }
    return null;
  };
  
  /**
   * Valida que un valor sea un número
   * @param {string} value - Valor a validar
   * @returns {string|null} - Mensaje de error o null si es válido
   */
  export const isNumber = (value) => {
    if (!value) return null;
    
    if (isNaN(Number(value))) {
      return 'Este campo debe ser un número';
    }
    return null;
  };
  
  /**
   * Valida que un número esté dentro de un rango
   * @param {number|string} value - Valor a validar
   * @param {number} min - Valor mínimo permitido
   * @param {number} max - Valor máximo permitido
   * @returns {string|null} - Mensaje de error o null si es válido
   */
  export const isInRange = (value, min, max) => {
    if (!value) return null;
    
    const num = Number(value);
    if (isNaN(num)) {
      return 'Este campo debe ser un número';
    }
    
    if (num < min || num > max) {
      return `Este campo debe estar entre ${min} y ${max}`;
    }
    return null;
  };
  
  /**
   * Validaciones específicas para apuestas
   */
  
  /**
   * Valida que una predicción tenga el formato correcto (por ejemplo, "2-1")
   * @param {string} prediction - Predicción a validar
   * @returns {string|null} - Mensaje de error o null si es válido
   */
  export const isValidPrediction = (prediction) => {
    if (!prediction) return 'La predicción es requerida';
    
    const predictionRegex = /^\d+-\d+$/;
    if (!predictionRegex.test(prediction)) {
      return 'La predicción debe tener el formato "N-N"';
    }
    return null;
  };
  
  /**
   * Valida que una fecha sea futura
   * @param {string|Date} date - Fecha a validar
   * @returns {string|null} - Mensaje de error o null si es válido
   */
  export const isFutureDate = (date) => {
    if (!date) return null;
    
    const dateToValidate = new Date(date);
    const now = new Date();
    
    if (dateToValidate <= now) {
      return 'La fecha debe ser futura';
    }
    return null;
  };
  
  /**
   * Validaciones específicas para usuarios
   */
  
  /**
   * Valida que un nombre de usuario tenga el formato correcto
   * @param {string} username - Nombre de usuario a validar
   * @returns {string|null} - Mensaje de error o null si es válido
   */
  export const isValidUsername = (username) => {
    if (!username) return null;
    
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return 'El nombre de usuario solo puede contener letras, números y guiones bajos, y debe tener entre 3 y 20 caracteres';
    }
    return null;
  };
  
  /**
   * Combina múltiples validadores
   * @param {string} value - Valor a validar
   * @param {Array<Function>} validators - Array de funciones validadoras
   * @returns {string|null} - Primer mensaje de error encontrado o null si todos pasan
   */
  export const validate = (value, validators) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        return error;
      }
    }
    return null;
  };