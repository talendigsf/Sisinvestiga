import express from "express";
import userService from "../services/userService.js";
import {
  createUser,
  verifyEmail,
  logInUser,
  logOutUser,
  logOutAllUser,
  updateUser,
  updateUserRole,
  updateSelfUser,
  getUser,
  getAllUsers,
  getUserById,
  disableUser,
  enableUser,
  resetPassword,
  forgotPassword,
} from "../controllers/userController.js";
import { uploadImages, handleFileUpload } from "../middlewares/fileUpload.js";
import { auth, authRole } from "../middlewares/auth.js";
import {
  validateCreateUser,
  validateUpdateUser,
  validateForgotPassword,
  validateResetPassword,
} from "../middlewares/validators.js";

const UsersRouter = express.Router();

// Rutas de los usuarios
UsersRouter.post("/register", validateCreateUser, createUser);
UsersRouter.post("/verify-email", verifyEmail);
UsersRouter.post("/login", userService.loginLimiter, logInUser);
UsersRouter.post("/logout", auth, logOutUser);
UsersRouter.post("/logout-all", auth, logOutAllUser);
UsersRouter.post("/forgot-password", validateForgotPassword, forgotPassword);
UsersRouter.post(
  "/reset-password/:token",
  validateResetPassword,
  resetPassword
);
UsersRouter.put(
  "/me",
  auth,
  uploadImages("fotoPerfil", 1),
  handleFileUpload("profile", "fotoPerfil"),
  validateUpdateUser,
  updateSelfUser
);
UsersRouter.put('/:id/role', auth, authRole(['Administrador']), updateUserRole);
UsersRouter.put(
  "/:id",
  auth,
  uploadImages("fotoPerfil", 1),
  handleFileUpload("profile", "fotoPerfil"),
  authRole(["Administrador"]),
  validateUpdateUser,
  updateUser
);

UsersRouter.put("/:id/disable", auth, authRole(["Administrador"]), disableUser);
UsersRouter.put("/:id/enable", auth, authRole(["Administrador"]), enableUser);

UsersRouter.get("/me", auth, getUser);
UsersRouter.get("/getuser/:id", auth, authRole(["Administrador"]), getUserById);
UsersRouter.get("/", auth, authRole(["Administrador"]), getAllUsers);

export default UsersRouter;
