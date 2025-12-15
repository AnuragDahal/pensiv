import { isAuthenticated, zodValidator } from "../../../middlewares";
import { Router } from "express";
import {
  accessTokenRefresh,
  userLogin,
  userSignup,
  getMe,
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

export default router;
