import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import UserModel from "../models/user.model";

//OBTENER USERS
export const getUsers = async (req: Request, res: Response) => {
  res.json({
    msg: "getUsers - Controlador",
  });
};

//CREAR USERS
export const postUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, rol } = req.body;
  const user = new UserModel({ name, email, password, rol });

  //Encliptar la contraseña (hash)

  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);

  //Guardar en BD
  await user.save();

  res.status(201).json({
    msg: "Usuario creado correctamente",
    user,
  });
};

//ACTUALIZAR USER
export const putUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { _id, password, google, email, ...resto } = req.body;

  //TODO validar contra base de datos

  if (password) {
    //Encliptar la contraseña (hash)
    const salt = bcrypt.genSaltSync();
    resto.password = bcrypt.hashSync(password, salt);
  }

  const user = await UserModel.findByIdAndUpdate(id, resto, { new: true });

  res.json();
};

//BORRAR USER
export const delUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = await UserModel.findByIdAndDelete(id);
  res.json();
};
