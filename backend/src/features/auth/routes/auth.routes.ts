import { zodValidator } from "../../../middlewares";
import { Router } from "express";
import {
  accessTokenRefresh,
  userLogin,
  userSignup,
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

export default router;
