import { Router } from "express";
import { isAuthenticated, zodValidator } from "../../../middlewares";
import {
  accessTokenRefresh,
  getMe,
  userLogin,
  userLogout,
  userSignup,
  updateMe,
  updatePassword,
  getMeWithStats
} from "../controllers/auth.controller";
import {
  loginSchema,
  signupSchema,
  tokenSchema,
  updatePasswordSchema,
} from "../schemas/auth.schemas";

const router = Router();

router.post("/signup", zodValidator(signupSchema), userSignup);
router.post("/login", zodValidator(loginSchema), userLogin);
router.post("/refresh", zodValidator(tokenSchema), accessTokenRefresh);
router.get("/me", isAuthenticated, getMeWithStats);
router.patch("/update", isAuthenticated, updateMe);
router.patch("/update-password", isAuthenticated, zodValidator(updatePasswordSchema), updatePassword);
router.post("/logout", isAuthenticated, userLogout);

export default router;
