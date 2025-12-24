//IMPORTS GENERALES
import { Router } from "express";
import { check } from "express-validator";

//IMPORTS CONTROLLERS
import {
  getUsers,
  postUser,
  putUser,
  delUser,
} from "../controllers/user.controller";
import { validarCampos } from "../middlewares/validar-campos";
import { validarJWT } from "../middlewares/validar-jwt";

const router = Router();
//OBTENER USERS
router.get("/", getUsers);

//CREAR USER
router.post(
  "/",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe ser de más de 6 letras").isLength({
      min: 6,
    }),
    check("email", "El correo no es válido").isEmail(),
  ],
  validarCampos,
  postUser
);

//ACTUALIZAR USER
router.put(
  "/:id",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El correo no es válido").isEmail(),
    check("rol").optional().isIn(["ADMIN_ROLE", "USER_ROLE"]),
    validarCampos,
  ],
  putUser
);

//BORRAR USER
router.delete(
  "/:id",
  [validarJWT, check("id", "El ID no es válido").isMongoId(), validarCampos],
  delUser
);

export default router;
