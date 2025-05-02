import React, { useState } from "react";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import { auth, db, googleProvider, signInWithPopup } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import countries from "../components/adoptantescompon/countries"; // Importar lista de países

const Register = () => {
  const navigate = useNavigate();
  
  // Estados generales
  const [activeMethod, setActiveMethod] = useState("email");
  const [error, setError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("BO"); // Código de país por defecto
  
  // Estados de carga separados
  const [loading, setLoading] = useState({
    email: false,
    google: false,
    phone: false,
    verification: false
  });

  // Estados para registro con email
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Estados para registro con teléfono
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Obtener el país seleccionado
  const selectedCountryData = countries.find(c => c.code === selectedCountry);

  // Validaciones
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;
  const validatePhone = (phone) => /^[0-9]{6,15}$/.test(phone); // Sin código de país

  // Crear perfil en Firestore
  const createUserProfile = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const providerData = user.providerData[0];
    
    await setDoc(userRef, {
      nombre: user.displayName || name,
      email: user.email || null,
      telefono: activeMethod === "phone"
      ? (user.phoneNumber || (selectedCountryData ? `+${selectedCountryData.phone}${phone}` : null))
      : null,
      rol: "adoptante",
      metodo_registro: providerData?.providerId || 
                     (activeMethod === "email" ? "password" : "phone"),
      pais: activeMethod === "phone" ? selectedCountryData?.name : null,
      creado_en: serverTimestamp(),
      ultimo_acceso: serverTimestamp(),
      esta_activo: true,
    });
  };

  // Manejar cambio de método
  const toggleAuthMethod = () => {
    setError("");
    setActiveMethod(activeMethod === "email" ? "phone" : "email");
  };

  // Registrar con email y contraseña
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!name) return setError("Por favor ingresa tu nombre completo");
    if (!validateEmail(email)) return setError("Por favor ingresa un email válido");
    if (!validatePassword(password)) return setError("La contraseña debe tener al menos 6 caracteres");
    if (password !== confirmPassword) return setError("Las contraseñas no coinciden");

    setLoading({...loading, email: true});
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await createUserProfile(userCredential.user);
      navigate("/adoptante");
    } catch (error) {
      setError(
        error.code === "auth/email-already-in-use" ? "Este email ya está registrado" :
        error.code === "auth/invalid-email" ? "Email inválido" :
        error.code === "auth/weak-password" ? "La contraseña es muy débil" :
        "Ocurrió un error al registrar"
      );
    } finally {
      setLoading({...loading, email: false});
    }
  };

  // Registrar con Google
  const handleGoogleRegister = async () => {
    if (loading.google) return;
    
    setLoading({...loading, google: true});
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!result.user.displayName) {
        setName("");
        setActiveMethod("phone"); // Mostrar formulario para completar nombre
        return;
      }
      await createUserProfile(result.user);
      navigate("/adoptante");
    } catch (error) {
      setError(error.code === "auth/popup-closed-by-user" ? 
        "El popup de Google fue cerrado" : "Error con Google");
    } finally {
      setLoading({...loading, google: false});
    }
  };

  // Registrar con teléfono
  const handlePhoneRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!name) return setError("Por favor ingresa tu nombre completo");
    if (!validatePhone(phone)) return setError("Por favor ingresa un número de teléfono válido");

    const fullPhoneNumber = `+${selectedCountryData.phone}${phone}`;
    
    setLoading({...loading, phone: true});
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, recaptcha);
      setConfirmationResult(confirmation);
      setShowPhoneVerification(true);
    } catch (error) {
      console.log("🔥 Firebase error:", error);
      console.log("☎️ Enviando este número:", fullPhoneNumber);
      setError(
        error.code === "auth/invalid-phone-number" ? "Número de teléfono inválido" :
        error.code === "auth/quota-exceeded" ? "Límite de intentos excedido" :
        error.code === "auth/captcha-check-failed" ? "Error en la verificación reCAPTCHA" :
        "Error con teléfono"
      );
    } finally {
      setLoading({...loading, phone: false});
    }
  };

  // Verificar código de teléfono
  const verifyPhoneCode = async (e) => {
    e.preventDefault();
    setError("");
    if (verificationCode.length !== 6) return setError("El código debe tener 6 dígitos");

    setLoading({...loading, verification: true});
    try {
      await confirmationResult.confirm(verificationCode);
      await createUserProfile(auth.currentUser);
      navigate("/adoptante");
    } catch (error) {
      setError("Código inválido o expirado. Intenta nuevamente");
    } finally {
      setLoading({...loading, verification: false});
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <a href="/login" className="text-emerald-600 flex items-center">
            <span className="mr-2">←</span> Volver al inicio de sesión
          </a>
        </div>

        <h2 className="text-2xl font-bold text-center text-emerald-800 mb-4">
          Regístrate
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {showPhoneVerification ? (
          <form onSubmit={verifyPhoneCode}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Código de verificación (6 dígitos) *
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength="6"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                placeholder="Ingresa el código SMS"
                required
                disabled={loading.verification}
              />
            </div>
            <button
              type="submit"
              disabled={loading.verification}
              className={`w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition cursor-pointer${
                loading.verification ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading.verification ? "Verificando..." : "Verificar Código"}
            </button>
          </form>
        ) : (
          <>
            {activeMethod === "email" ? (
              <form onSubmit={handleEmailRegister} className="mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                    placeholder="Tu nombre"
                    required
                    disabled={loading.email}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                    placeholder="tu@email.com"
                    required
                    disabled={loading.email}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Contraseña (mínimo 6 caracteres) *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                      placeholder="••••••••"
                      minLength="6"
                      required
                      disabled={loading.email}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Repetir contraseña *
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                    placeholder="••••••••"
                    minLength="6"
                    required
                    disabled={loading.email}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading.email}
                  className={`w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition cursor-pointer ${
                    loading.email ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading.email ? "Registrando..." : "Registrarse"}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePhoneRegister} className="mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                    placeholder="Tu nombre"
                    required
                    disabled={loading.phone}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Teléfono *
                  </label>
                  <div className="flex">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-1/3 px-2 py-2 border rounded-l-lg focus:outline-none focus:ring focus:ring-emerald-300"
                      disabled={loading.phone}
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name} (+{country.phone})
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-2/3 px-4 py-2 border-t border-b border-r rounded-r-lg focus:outline-none focus:ring focus:ring-emerald-300"
                      placeholder="112345678"
                      required
                      disabled={loading.phone}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading.phone}
                  className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer${
                    loading.phone ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading.phone ? "Enviando código..." : "Registrarse"}
                </button>
              </form>
            )}

            <div className="mb-4 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">o</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGoogleRegister}
                disabled={loading.google}
                className={`w-full text-black py-2 rounded-lg border border-black hover:bg-red-700 hover:text-white transition flex items-center justify-center cursor-pointer ${
                  loading.google ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.667-4.146-2.675-6.735-2.675-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.524 10-10 0-0.167-0.007-0.334-0.020-0.5h-9.98z"/>
                </svg>
                {loading.google ? "Procesando..." : "Registrarse con Google"}
              </button>

              <button
                onClick={toggleAuthMethod}
                disabled={loading.email || loading.phone || loading.google}
                className={`w-full text-black py-2 rounded-lg border border-black hover:bg-gray-700 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer${
                  loading.email || loading.phone || loading.google ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {activeMethod === "email" ? (
                  <>
                  <FaPhone />
                  Registrarse con Teléfono
                  </>
                ) : activeMethod === "phone" ? (
                  <>
                    <FaEnvelope />
                    Registrarse con Email
                  </>
                ) : (
                  <>
                    <FaGoogle />
                    Registrarse con Google
                  </>
                )}
              </button>

            </div>

            <div id="recaptcha-container" className="hidden"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;