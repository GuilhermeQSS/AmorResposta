import LoginControl from '../controllers/loginControl.js';
import e from "express";
const router = e.Router();

router.post("/",LoginControl.login);

export default router;