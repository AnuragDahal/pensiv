import { userLogin, userSignup } from "@/controllers/auth.controller";
import { zodValidator } from "@/middlewares/zod";
import { loginSchema, signupSchema } from "@/schemas/userSchemas";
import { Router } from "express";

const router = Router();

router.post("/signup", zodValidator(signupSchema), userSignup);
router.post("/login", zodValidator(loginSchema), userLogin);

export default router;
