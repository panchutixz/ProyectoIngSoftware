export const WelcomeMessage = ({ 
  userName, 
  puedeCrearReclamo, 
  hasBicicletasPermitidas, 
  cargandoBicicletas 
}) => {
  if (!puedeCrearReclamo) return null;

  return (
    <div className="welcome-message">
      <p>Hola <strong>{userName}</strong>, aquí puedes gestionar tus reclamos sobre tus bicicletas.</p>
      {!hasBicicletasPermitidas && !cargandoBicicletas && (
        <p className="warning-message">
          <strong>Nota:</strong> Para crear un reclamo, necesitas tener al menos una bicicleta en estado "entregada" o "olvidada".
        </p>
      )}
    </div>
  );
};

