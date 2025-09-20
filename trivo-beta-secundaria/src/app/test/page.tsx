export default function TailwindTest() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          ¿SE VE ESTO?
        </h1>
        <p className="text-green-600 text-xl">
          Si ves colores, Tailwind funciona
        </p>
      </div>
    </div>
  );
}