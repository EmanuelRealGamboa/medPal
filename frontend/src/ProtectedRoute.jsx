import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute: protege rutas según el token y/o datos adicionales.
 *
 * @param {ReactNode} children - El componente a renderizar si está autenticado.
 * @param {boolean} requiresVerificationData - Si se requiere correo/ID de verificación.
 */
export default function ProtectedRoute({ children, requiresVerificationData = false }) {
  const token = localStorage.getItem('token');
  const correoPendiente = localStorage.getItem('correo_verificacion'); // o cualquier valor temporal

  if (requiresVerificationData) {
    // Ruta protegida por verificación (ej: /verificacion)
    if (!correoPendiente) {
      return <Navigate to="/signup" replace />;
    }
    return children;
  }

  // Rutas protegidas por token (ej: /index)
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
