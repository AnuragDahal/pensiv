import {
  userLogin,
  userSignup,
  accessTokenRefresh,
} from "../controllers/auth.controller";
import { z } from "zod";
import { isAuthenticated, zodValidator } from "@/middlewares";
import {
  loginSchema,
  signupSchema,
  tokenSchema,
} from "../schemas/auth.schemas";
import { Router } from "express";

const router = Router();

router.post("/signup", zodValidator(signupSchema), userSignup);
router.post("/login", zodValidator(loginSchema), userLogin);
router.post("/refresh", zodValidator(tokenSchema), accessTokenRefresh);

export default router;
