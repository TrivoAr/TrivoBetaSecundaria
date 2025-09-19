"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      email: fd.get("email"),
      password: fd.get("password"),
      firstname: fd.get("firstname"),
      lastname: fd.get("lastname"),
      rol: fd.get("rol") || "alumno",
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Error");
      toast.success("Registrado correctamente");
      router.push("/auth/signin");
    } catch (err: any) {
      toast.error(err.message || "No se pudo registrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="firstname" placeholder="Nombre" required className="input" />
      <input name="lastname" placeholder="Apellido" required className="input" />
      <input name="email" placeholder="Email" type="email" required className="input" />
      <input name="password" placeholder="Contraseña" type="password" minLength={6} required className="input" />
      <select name="rol" className="input">
        <option value="alumno">Alumno</option>
        <option value="profe">Profe</option>
        <option value="dueño de academia">Dueño de academia</option>
      </select>
      <button disabled={loading} className="btn">
        {loading ? "Registrando..." : "Registrarse"}
      </button>
    </form>
  );
}
