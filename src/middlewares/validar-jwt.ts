import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";

export const validarJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }
  try {
    // Verificar el token
    const { id } = jwt.verify(
      token,
      process.env.SECRET_KEY_JWT || "default_secret_key"
    ) as { id: string };

    //Leer el usuario que corresponde al id
    const usuario = await UserModel.findById(id);

    if (!usuario) {
      return res.status(401).json({
        msg: "Token no válido - usuario no existe en DB",
      });
    }

    //Verificar si el usuario está activo
    if (!usuario.status) {
      return res.status(401).json({
        msg: "Token no válido - usuario no está activo",
      });
    }

    // Si todo es correcto, continuar con la siguiente función
    (req.body as any).userId = id;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "Token no válido",
    });
  }
};
