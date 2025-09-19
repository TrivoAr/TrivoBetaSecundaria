import { Schema, model, models, Document } from "mongoose";

// Definimos la interfaz para tipar el documento
export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  rol: string;
  imagen?: string;
  fromOAuth?: boolean;
  telnumber?: string;
  resetPasswordAttempts?: number;
  resetPasswordLockedUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Creamos el esquema con IUser como tipo
const UserSchema = new Schema<IUser>(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return !this.fromOAuth; // obligatorio si no viene de Google
      },
      select: false, // evita devolverlo por defecto en queries
    },
    rol: {
      type: String,
      enum: ["alumno", "profe", "dueño de academia"],
      required: true,
    },
    imagen: {
      type: String,
    },
    fromOAuth: {
      type: Boolean,
      default: false,
    },
    telnumber: {
      type: String,
    },
    resetPasswordAttempts: {
      type: Number,
      default: 0,
    },
    resetPasswordLockedUntil: {
      type: Date,
    },
  },
  {
    timestamps: true, // crea createdAt y updatedAt automáticamente
  }
);

// Exportamos el modelo o reutilizamos si ya existe
const User = models.User || model<IUser>("User", UserSchema);
export default User;
