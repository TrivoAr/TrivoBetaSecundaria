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
  <div className="min-h-screen flex items-center justify-center p-6" style={{backgroundColor: '#FEFBF9'}}>
    <div className="w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-2xl p-8 border"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="/assets/Logo/trivo_negro-removebg-preview.png"
            alt="Trivo Logo"
            className="mx-auto w-32 mb-4"
          />
          <h1 className="text-2xl font-bold mb-2" style={{color: '#C95100'}}>
            Encuentra a tu tribu
          </h1>
          <p className="text-gray-500 text-sm">
            Únete a la comunidad y descubre nuevas experiencias
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form inputs */}
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <input
              type="text"
              name="firstname"
              placeholder="Nombre"
              className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all block"
              style={{backgroundColor: '#f9fafb'}}
            />
          </div>
          
          <div className="w-full">
            <input
              type="text"
              name="lastname"
              placeholder="Apellido"
              className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all block"
              style={{backgroundColor: '#f9fafb'}}
            />
          </div>
          
          <div className="w-full">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all block"
              style={{backgroundColor: '#f9fafb'}}
            />
          </div>
          
          <div className="w-full">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all block"
              style={{backgroundColor: '#f9fafb'}}
            />
          </div>
          
          <div className="w-full">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all block"
              style={{backgroundColor: '#f9fafb'}}
            />
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-start gap-3 mt-6">
          <div className="flex-shrink-0 mt-1">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 rounded"
              style={{accentColor: '#C95100'}}
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed block">
              Acepto los{" "}
              <a
                href="/terminos-condiciones"
                className="font-medium hover:underline"
                style={{color: '#C95100'}}
              >
                términos y condiciones
              </a>
            </label>
          </div>
        </div>

        {/* Submit button */}
        <button
          className="w-full text-white font-semibold py-4 px-6 rounded-2xl mt-8 transition-all duration-300 hover:shadow-lg disabled:opacity-60 flex items-center justify-center space-x-2"
          style={{
            background: 'linear-gradient(135deg, #C95100 0%, #ff6b35 100%)',
            transform: isSubmitting ? 'none' : 'scale(1)',
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
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

        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full mt-4 py-3 px-6 rounded-2xl font-medium transition-all duration-300 hover:shadow-md flex items-center justify-center space-x-2"
          style={{
            color: '#C95100',
            backgroundColor: '#fff5f0',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ffedd5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#fff5f0';
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Atrás</span>
        </button>
      </form>

      {/* Decorative elements */}
      <div 
        className="absolute top-10 left-10 w-20 h-20 rounded-full blur-xl pointer-events-none -z-10"
        style={{backgroundColor: 'rgba(201, 81, 0, 0.1)'}}
      />
      <div 
        className="absolute bottom-10 right-10 w-32 h-32 rounded-full blur-2xl pointer-events-none -z-10"
        style={{backgroundColor: 'rgba(255, 107, 53, 0.15)'}}
      />
    </div>
  </div>
);
}

export default RegisterPage;
