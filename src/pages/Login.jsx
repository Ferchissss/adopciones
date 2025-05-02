import React, { useState } from "react";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth, db, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup, getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import countries from "../components/adoptantescompon/countries"; // Importar lista de países

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({
    email: false,
    google: false,
    phone: false,
    verification: false
  });
  const [activeMethod, setActiveMethod] = useState("email"); // 'email', 'phone'
  const [selectedCountry, setSelectedCountry] = useState("BO"); // Código de país por defecto

  // Obtener el país seleccionado
  const selectedCountryData = countries.find(c => c.code === selectedCountry);

  // Validaciones
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{6,15}$/.test(phone);

  // Login con email y contraseña
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateEmail(email)) {
      setError("Por favor ingresa un email válido");
      return;
    }
    if (!password) {
      setError("Por favor ingresa tu contraseña");
      return;
    }

    setLoading({...loading, email: true});
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleLoginSuccess(userCredential.user);
    } catch (error) {
      setError(
        error.code === "auth/user-not-found" ? "Usuario no encontrado" :
        error.code === "auth/wrong-password" ? "Contraseña incorrecta" :
        error.code === "auth/too-many-requests" ? "Demasiados intentos. Intenta más tarde" :
        "Error al iniciar sesión"
      );
    } finally {
      setLoading({...loading, email: false});
    }
  };

  // Login con Google
  const handleGoogleLogin = async () => {
    if (loading.google) return;
    
    setLoading({...loading, google: true});
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleLoginSuccess(result.user);
    } catch (error) {
      setError(error.code === "auth/popup-closed-by-user" ? 
        "El popup de Google fue cerrado" : "Error con Google");
    } finally {
      setLoading({...loading, google: false});
    }
  };

  // Login con teléfono - Paso 1: Enviar código
  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validatePhone(phone)) {
      setError("Por favor ingresa un número de teléfono válido");
      return;
    }

    const fullPhoneNumber = `+${selectedCountryData.phone}${phone}`;
    console.log("☎️ Enviando este número:", fullPhoneNumber);
    
    setLoading({...loading, phone: true});
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, recaptcha);
      setConfirmationResult(confirmation);
      setShowPhoneVerification(true);
    } catch (error) {
      console.log("🔥 Firebase error:", error); 
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

  // Login con teléfono - Paso 2: Verificar código
  const verifyPhoneCode = async (e) => {
    e.preventDefault();
    setError("");
    
    if (verificationCode.length !== 6) {
      setError("El código debe tener 6 dígitos");
      return;
    }

    setLoading({...loading, verification: true});
    try {
      const result = await confirmationResult.confirm(verificationCode);
      await handleLoginSuccess(result.user);
    } catch (error) {
      setError("Código inválido o expirado. Intenta nuevamente");
    } finally {
      setLoading({...loading, verification: false});
    }
  };

  // Manejar login exitoso
  const handleLoginSuccess = async (user) => {
    try {
      // Obtener datos adicionales del usuario desde Firestore
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      const auth1 = getAuth();
      const user3 = auth1.currentUser;

      console.log(user3);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        
        // Redirigir según el rol
        switch(userData.rol) {
          case "admin":
            navigate("/admin");
            break;
          case "voluntario":
            navigate("/voluntario");
            break;
          default: // adoptante
            navigate("/adoptante");
        }
      } else {
        // Si no tiene perfil en Firestore (no debería pasar)
        setError("Perfil de usuario no encontrado");
        await auth.signOut();
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      setError("Error al cargar los datos del usuario");
    }
  };

  // Cambiar entre métodos de login
  const toggleAuthMethod = () => {
    setError("");
    setActiveMethod(activeMethod === "email" ? "phone" : "email");
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <a href="/" className="text-emerald-600 flex items-center">
            <span className="mr-2">←</span> Volver al inicio
          </a>
        </div>

        <h2 className="text-2xl font-bold text-center text-emerald-800 mb-4">
          Iniciar Sesión
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
              className={`w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition cursor-pointer ${
                loading.verification ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading.verification ? "Verificando..." : "Verificar Código"}
            </button>
          </form>
        ) : (
          <>
            {activeMethod === "email" ? (
              <form onSubmit={handleEmailLogin} className="mb-6">
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
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                    placeholder="••••••••"
                    required
                    disabled={loading.email}
                  />
                </div>

                <div className="flex justify-between items-center mb-4">
                  <a href="/reset-password" className="text-sm text-emerald-600">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading.email}
                  className={`w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition cursor-pointer ${
                    loading.email ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading.email ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePhoneLogin} className="mb-6">
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
                  className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer ${
                    loading.phone ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading.phone ? "Enviando código..." : "Iniciar Sesión"}
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
                onClick={handleGoogleLogin}
                disabled={loading.google}
                className={`w-full text-black py-2 rounded-lg border border-black hover:bg-red-700 hover:text-white transition flex items-center justify-center cursor-pointer${
                  loading.google ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.667-4.146-2.675-6.735-2.675-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.524 10-10 0-0.167-0.007-0.334-0.020-0.5h-9.98z"/>
                </svg>
                {loading.google ? "Procesando..." : "Iniciar con Google"}
              </button>

              <button
                onClick={toggleAuthMethod}
                disabled={loading.email || loading.phone || loading.google}
                className={`w-full text-black py-2 rounded-lg border border-black hover:bg-gray-700 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer ${
                  loading.email || loading.phone || loading.google ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {activeMethod === "email" ? (
                                  <>
                                  <FaPhone />
                                  Iniciar sesión con Teléfono
                                  </>
                                ) : activeMethod === "phone" ? (
                                  <>
                                    <FaEnvelope />
                                    Iniciar sesión con Email
                                  </>
                                ) : (
                                  <>
                                    <FaGoogle />
                                    Iniciar sesión con Google
                                  </>
                                )}
              </button>
            </div>

            <div id="recaptcha-container" className="hidden"></div>

            <p className="text-center text-sm text-gray-600 mt-4">
              ¿No tienes una cuenta?{" "}
              <a href="/register" className="text-emerald-600 hover:underline">
                Regístrate
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;