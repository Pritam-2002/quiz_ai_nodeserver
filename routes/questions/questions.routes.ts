import { Router } from "express";
import { CreateQuestion, GetQuestions, UpdateQuestion, ValidateAnswers } from "../../controller/question.controller";
import { generateQuestions } from "../../controller/generateq.controller"
import { Authenticate } from "../../middleware/auth.middleware";
import multer from "multer";
import { authorizeAdmin } from "../../middleware/authorizeAdmin.middleware";


const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = Router();

router.use(Authenticate)
router.post("/createquestion", authorizeAdmin, upload.single('file'), CreateQuestion);
router.patch("/updatequestion/:id", authorizeAdmin, upload.single('file'), UpdateQuestion);
router.post("/validateanswer", ValidateAnswers);
router.get("/getquestions", GetQuestions);
router.post("/aiassist", authorizeAdmin, generateQuestions)


export default router;
