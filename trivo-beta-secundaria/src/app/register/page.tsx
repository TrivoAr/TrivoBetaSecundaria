"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const firstname = formData.get("firstname")?.toString();
    const lastname = formData.get("lastname")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();
    const rol = "alumno";

    // Validaciones en cliente
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsSubmitting(false);
      return;
    }

    try {
      // Llamada a tu endpoint de registro
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname, email, password, rol }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Error en el registro");
      }

      toast.success("¡Cuenta creada exitosamente!");

      // Autologin
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.ok) {
        router.push("/home");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div className="min-h-screen bg-[#FEFBF9] flex justify-center items-center p-6 font-['Inter']">
    <div className="w-full max-w-md">
      {/* Contenedor principal con efecto glassmorphism */}
      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-white/20">
        
        {/* Header con logo y título */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <img
              src="/assets/Logo/trivo_negro-removebg-preview.png"
              alt="Trivo Logo"
              className="mx-auto w-[140px] drop-shadow-sm"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#C95100] mb-2">
            Encuentra a tu tribu
          </h1>
          <p className="text-gray-500 text-sm">
            Únete a la comunidad y descubre nuevas experiencias
          </p>
        </div>

        {/* Error message con mejor diseño */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Inputs mejorados con efectos */}
          <div className="space-y-4">
            <div className="relative group">
              <input
                type="text"
                name="firstname"
                placeholder="Nombre"
                className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C95100] focus:border-transparent transition-all duration-300 group-hover:shadow-md text-gray-700 placeholder-gray-400"
              />
            </div>
            
            <div className="relative group">
              <input
                type="text"
                name="lastname"
                placeholder="Apellido"
                className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C95100] focus:border-transparent transition-all duration-300 group-hover:shadow-md text-gray-700 placeholder-gray-400"
              />
            </div>
            
            <div className="relative group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C95100] focus:border-transparent transition-all duration-300 group-hover:shadow-md text-gray-700 placeholder-gray-400"
              />
            </div>
            
            <div className="relative group">
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C95100] focus:border-transparent transition-all duration-300 group-hover:shadow-md text-gray-700 placeholder-gray-400"
              />
            </div>
            
            <div className="relative group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C95100] focus:border-transparent transition-all duration-300 group-hover:shadow-md text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Checkbox de términos mejorado */}
          <div className="flex items-start space-x-3 mt-6">
            <div className="flex items-center h-6">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 text-[#C95100] bg-gray-100 border-gray-300 rounded focus:ring-[#C95100] focus:ring-2"
                required
              />
            </div>
            <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
              Acepto los{" "}
              <a
                href="/terminos-condiciones"
                className="text-[#C95100] font-medium hover:underline transition-all duration-200"
              >
                términos y condiciones
              </a>
            </label>
          </div>

          {/* Botón principal con gradiente y efectos */}
          <button
            className="w-full bg-gradient-to-r from-[#C95100] to-[#ff6b35] text-white font-semibold py-4 px-6 rounded-2xl mt-8 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <span>Creando cuenta...</span>
              </>
            ) : (
              <>
                <span>Crear cuenta</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>

          {/* Botón de atrás mejorado */}
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full mt-4 text-[#C95100] bg-orange-50 hover:bg-orange-100 py-3 px-6 rounded-2xl font-medium transition-all duration-300 hover:shadow-md flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Atrás</span>
          </button>
        </form>
      </div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-[#C95100]/10 rounded-full blur-xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-300/20 rounded-full blur-2xl -z-10"></div>
    </div>
  </div>
);
}

export default RegisterPage;
