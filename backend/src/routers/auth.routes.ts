import { userSignup } from "@/controllers/auth.controller";
import { zodValidator } from "@/middlewares/zod";
import { signupSchema } from "@/schemas/userSchemas";
import { Router } from "express";

const router = Router();

router.post("/signup", zodValidator(signupSchema), userSignup);

export default router;
