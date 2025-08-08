import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    apellido_paterno: '',
    apellido_materno: '',
    phone: '',
    email: '',
    password: '',
    password2: '',
    acepto_terminos: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false); // Modal de términos

  const navigate = useNavigate();

  const handleChange = e => {
    const { name, type, checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (formData.password !== formData.password2) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!formData.acepto_terminos) {
      setError('Debes aceptar los términos y condiciones.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const errorData = await response.json();

      if (!response.ok) {
        if (errorData.password) {
          throw new Error(errorData.password.join(' '));
        }

        const firstField = Object.keys(errorData)[0];
        const message = Array.isArray(errorData[firstField])
          ? errorData[firstField].join(' ')
          : errorData[firstField];

        throw new Error(message || 'Error en el registro');
      }

      localStorage.setItem('correo_verificacion', formData.email);

      setMensaje('¡Registro exitoso!');
      setTimeout(() => {
        navigate('/verificacion', {
          state: { mensaje: '¡Registro exitoso! Revisa tu correo.' }
        });
      }, 1500);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-right">
        <h2>¡MedPal!</h2>
        <p>Tu compañero en cada paso de tu bienestar.</p>
        <Link to="/" className="btn btn-custom mt-3">Iniciar Sesión</Link>
      </div>

      <div className="auth-left">
        <h2 className="mb-3">Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            className="form-control mb-2"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="apellido_paterno"
            placeholder="Apellido Paterno"
            className="form-control mb-2"
            value={formData.apellido_paterno}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="apellido_materno"
            placeholder="Apellido Materno"
            className="form-control mb-2"
            value={formData.apellido_materno}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Teléfono"
            className="form-control mb-2"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo"
            className="form-control mb-2"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="input-group mb-2">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              onCopy={e => e.preventDefault()}
              onPaste={e => e.preventDefault()}
              onCut={e => e.preventDefault()}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(prev => !prev)}
              tabIndex={-1}
            >
              <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
            </button>
          </div>

          <div className="input-group mb-3">
            <input
              type={showPassword2 ? 'text' : 'password'}
              name="password2"
              placeholder="Confirmar Contraseña"
              className="form-control"
              value={formData.password2}
              onChange={handleChange}
              required
              onCopy={e => e.preventDefault()}
              onPaste={e => e.preventDefault()}
              onCut={e => e.preventDefault()}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword2(prev => !prev)}
              tabIndex={-1}
            >
              <i className={`bi ${showPassword2 ? 'bi-eye' : 'bi-eye-slash'}`}></i>
            </button>
          </div>

          {/* Términos y condiciones con modal */}
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="acepto_terminos"
              id="acepto_terminos"
              checked={formData.acepto_terminos}
              onChange={handleChange}
              required
            />
            <label className="form-check-label" htmlFor="acepto_terminos">
              Acepto los{' '}
              <button
                type="button"
                className="btn btn-link p-0 align-baseline"
                onClick={() => setShowModal(true)}
                style={{ fontSize: 'inherit' }}
              >
                términos y condiciones
              </button>
            </label>
          </div>

          <button type="submit" className="btn btn-custom w-100">Registrarse</button>
        </form>

        {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>

      {/* MODAL DE TÉRMINOS */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Términos y Condiciones de Uso MedPal</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Última actualización: Julio 11 del 2025
              </p>
              <p>
                Bienvenido/a a MedPal, una plataforma web especializada en la gestión, almacenamiento y consulta de
                información médica personal. Al acceder, registrarte o utilizar nuestros servicios, aceptas quedar legalmente
                vinculado a los presentes Términos y Condiciones, así como a nuestra Política de Privacidad. Este documento
                establece las reglas, obligaciones, limitaciones y responsabilidades del uso de MedPal conforme a la legislación
                vigente.
              </p>
              <h6>1. Aceptación de los Términos</h6>
              <p>El uso de MedPal implica la aceptación plena y sin reservas de los Términos aquí establecidos. Al registrarte como
              usuario, declaras que:  </p>
              <ul>
                <li>Has leído, comprendido y aceptado estos Términos y Condiciones.</li>
                <li>Eres mayor de edad, o cuentas con autorización y supervisión de tu tutor legal si eres menor</li>
                <li>Reconoces que MedPal no proporciona atención médica profesional, diagnósticos clínicos ni tratamiento
                médico alguno.  </li>
              </ul>
              <p>Este acuerdo constituye un contrato vinculante conforme a las leyes mexicanas (LFPDPPP) y estadounidenses
              (HIPAA).</p>
              <h6>2. Descripción del Servicio</h6>
              <p>MedPal proporciona acceso a funciones que permiten a los usuarios registrados:</p>
              <ul>
                <li>Subir y almacenar archivos personales relacionados con su salud, como recetas, estudios clínicos,
                certificados y diagnósticos.</li>
                <li>Registrar, editar y consultar citas médicas.</li>
                <li>Acceder a un historial médico organizado de manera cronológica.</li>
              </ul>
              <p>El acceso está limitado al usuario titular de la cuenta. En el caso de menores de edad, el acceso, gestión y registro
              de la cuenta están exclusivamente autorizados a su tutor legal debidamente validado mediante documentación
              oficial.</p>
              <h6>3. Registro de Usuario</h6>
              <p>El usuario deberá completar el proceso de registro proporcionando:</p>
              <ul>
                <li>nformación veraz, actualizada y completa, incluyendo datos personales básicos.</li>
                <li>Una contraseña segura, que deberá ser gestionada y protegida de forma responsable.</li>
              </ul>
              <p>El usuario asume plena responsabilidad por todas las actividades realizadas en su cuenta, incluyendo el uso
              indebido por parte de terceros si existe negligencia en el resguardo de credenciales.</p>
              <p>Queda prohibido:</p>
              <ul>
                <li>Crear cuentas falsas o duplicadas</li>
                <li>Registrar datos médicos de terceros sin consentimiento informado.</li>
                <li>Falsear identidades o actuar en nombre de otras personas sin autorización legal.</li>
              </ul>
              <h6>4. Privacidad y Confidencialidad</h6>
              <p>La protección de los datos personales sensibles almacenados en MedPal es prioritaria. Se aplican principios
              reconocidos internacionalmente:</p>
              <ul>
                <li>Licitud: Los datos se recopilan y procesan conforme a la ley.</li>
                <li>Finalidad: Los datos se tratan exclusivamente para los fines establecidos por la plataforma.</li>
                <li>Consentimiento: El usuario proporciona autorización explícita para el tratamiento de sus datos.</li>
                <li>Confidencialidad: Los datos no se comparten ni divulgan sin autorización del titular.</li>
              </ul>
              <p>En México, estos principios están definidos por la Ley Federal de Protección de Datos Personales en Posesión de
              los Particulares (LFPDPPP). En Estados Unidos, se aplican conforme a la HIPAA Privacy Rule y Security Rule.
              MedPal no permite el acceso por parte de terceros, salvo en los casos expresamente contemplados por la ley. El
              usuario conserva sus derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) y puede ejercerlos
              mediante mecanismos formales descritos en la Política de Privacidad.</p>
              <h6>5. Uso Aceptable</h6>
              <p>El uso de MedPal está limitado a fines personales relacionados con el bienestar y la gestión médica del usuario.
              El usuario se compromete a:</p>
              <ul>
                <li>No utilizar la plataforma para fines comerciales, fraudulentos o ilícitos.</li>
                <li>No subir archivos ofensivos, inapropiados, ilegales ni que infrinjan derechos de propiedad intelectual.</li>
                <li>No intentar acceder, modificar o vulnerar la información, estructura o seguridad del sistema.</li>
                <li>No suplantar la identidad de otros usuarios ni manipular información médica ajena.</li>
              </ul>
              <p>El incumplimiento puede derivar en sanciones, suspensión del servicio, cancelación de cuenta y, en casos graves,
              responsabilidad civil o penal conforme a las legislaciones aplicables</p>
              <h6>6. Seguridad de la Información</h6>
              <p>MedPal implementa medidas de protección que buscan minimizar los riesgos inherentes al tratamiento digital de
              datos sensibles. Estas medidas incluyen:</p>
              <ul>
                <li>Cifrado de extremo a extremo en el almacenamiento y transmisión de datos.</li>
                <li>Autenticación multifactorial opcional.</li>
                <li>Control de acceso basado en roles.</li>
                <li>Copias de seguridad automatizadas y segmentadas.</li>
                <li>Registro y auditoría de accesos, acciones y modificaciones.</li>
              </ul>
              <p>Estas prácticas se alinean con la Norma Oficial Mexicana NOM-004-SSA3-2012, la NOM-024-SSA3-2012 para
              expediente clínico electrónico, y las reglas técnicas contenidas en la HIPAA Security Rule.</p>
              <p>No obstante, el usuario acepta que ningún sistema digital es completamente invulnerable, y que existe un riesgo
              inherente al uso de plataformas web que puede incluir ataques cibernéticos, pérdida parcial de datos, o accesos
              no autorizados. MedPal se compromete a actuar conforme a protocolos establecidos de respuesta ante
              incidentes, en caso de detectarse una violación de seguridad.</p>
              <h6>7. Menores de Edad</h6>
              <p>La gestión de cuentas de usuarios menores de edad está sujeta a condiciones especiales:</p>
              <ul>
                <li>El tutor legal es el único autorizado para realizar el registro, gestionar la información médica y acceder a
                los servicios.</li>
                <li>Se deberá proporcionar documentación oficial que acredite el vínculo legal.</li>
                <li>El menor no podrá interactuar con la cuenta de forma autónoma, salvo en entornos validados por el tutor.</li>
              </ul>
              <p>MedPal aplica medidas reforzadas de control y protección para menores conforme a:</p>
              <ul>
                <li>LFPDPPP en México, que exige mayor diligencia en el tratamiento de datos de menores</li>
                <li>COPPA (Children’s Online Privacy Protection Act) en Estados Unidos, que regula el uso de plataformas
                digitales por parte de menores y establece controles parentales obligatorios.</li>
              </ul>
              <h6>8. Modificaciones</h6>
              <p>MedPal se reserva el derecho de modificar estos Términos y Condiciones cuando sea necesario por cambios
              legales, técnicos o estratégicos. Las modificaciones se notificarán a través de:</p>
              <ul>
                <li>Publicaciones en el portal oficial.</li>
                <li>Comunicaciones por correo electrónico (previa autorización del usuario).</li>
                <li> Banners informativos visibles desde el panel principal.</li>
              </ul>
              <p>Las modificaciones entrarán en vigor desde su publicación. El uso continuo del sistema posterior a la notificación
              se considerará aceptación tácita de los nuevos términos.</p>
              <p>El usuario tiene derecho a solicitar aclaraciones o rechazar los cambios mediante mecanismos formales, los cuales
              podrían derivar en la suspensión o cancelación de la cuenta si existe incompatibilidad legal.</p> 
              <h6>9. Limitación de Responsabilidad</h6>
              <p>MedPal actúa exclusivamente como herramienta de gestión y almacenamiento de información médica personal,
              sin sustituir ni representar funciones clínicas, médicas ni profesionales.</p>
              <p>No se realizan:</p>
              <ul>
                <li>Diagnósticos médicos.</li>
                <li>Prescripciones de tratamiento.</li>
                <li> Valoraciones clínicas.</li>
              </ul>
              <p>Toda la información ingresada y utilizada por el usuario se considera autogestionada y bajo su exclusiva
              responsabilidad. MedPal no garantiza la veracidad, integridad o exactitud de los datos ingresados por los usuarios.
              MedPal tampoco se responsabiliza por:</p>
              <ul>
                <li>Decisiones médicas tomadas con base en información almacenada</li>
                <li>Interpretaciones incorrectas de documentos.</li>
                <li>Consecuencias médicas derivadas del mal uso del sistema</li>
              </ul>
              <p>Esta cláusula se establece conforme a prácticas internacionales de exoneración de responsabilidad y se
              recomienda que el usuario consulte siempre con profesionales médicos certificados para decisiones clínicas.</p>
              <h6>10. Contacto</h6>
              <p>Para ejercer cualquier derecho, aclarar dudas, solicitar asistencia técnica o legal, o presentar comentarios sobre
              el sistema, el usuario podrá comunicarse con MedPal a través de:</p>
              <ul>
                <li>Correo electrónico oficial: [correo electrónico de contacto]</li>
                <li>Formulario de atención disponible en la plataforma</li>
                <li>Teléfono de atención a usuarios, en horarios establecidos</li>
              </ul>
              <p>MedPal se compromete a brindar respuesta en tiempo razonable y conforme a protocolos establecidos de
              atención al usuario.</p>
              <h6>Marco Normativo Aplicable</h6>
              <p>En México:</p>
              <ul>
                <li>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</li>
                <li>NOM-004-SSA3-2012 sobre expediente clínico físico y electrónico</li>
                <li>NOM-024-SSA3-2012 sobre intercambio, interoperabilidad y seguridad en sistemas informáticos de salud</li>
              </ul>
              <h6>En Estados Unidos:</h6>
              <ul>
                <li>HIPAA Privacy Rule y HIPAA Security Rule</li>
                <li>HITECH Act (actualizaciones y protección reforzada ante incidentes)</li>
                <li>42 CFR Part 2 (tratamiento de datos sensibles como uso de sustancias controladas)</li>
              </ul>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
