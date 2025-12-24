import { Router } from "express";
import { isAuthenticated, zodValidator } from "../../../middlewares";
import {
  accessTokenRefresh,
  getMe,
  userLogin,
  userLogout,
  userSignup
} from "../controllers/auth.controller";
import {
  loginSchema,
  signupSchema,
  tokenSchema,
} from "../schemas/auth.schemas";

const router = Router();

router.post("/signup", zodValidator(signupSchema), userSignup);
router.post("/login", zodValidator(loginSchema), userLogin);
router.post("/refresh", zodValidator(tokenSchema), accessTokenRefresh);
router.get("/me", isAuthenticated, getMe);
router.post("/logout", isAuthenticated, userLogout);

export default router;
