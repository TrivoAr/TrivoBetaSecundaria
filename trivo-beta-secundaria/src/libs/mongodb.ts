import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongo_cached: Cached | undefined;
}

const cached = global._mongo_cached || (global._mongo_cached = { conn: null, promise: null });

export async function connectDB() {
  if (cached.conn) {
    console.log("✅ Usando conexión existente a MongoDB");
    return cached.conn;
  }
  
  if (!cached.promise) {
    console.log("🔄 Conectando a MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => {
        console.log("✅ Conectado correctamente a MongoDB");
        console.log(`📡 Estado de conexión: ${mongoose.connection.readyState}`);
        console.log(`🗄️ Base de datos: ${mongoose.connection.db?.databaseName}`);
        return m;
      })
      .catch((error) => {
        console.error("❌ Error al conectar a MongoDB:", error);
        throw error;
      });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}