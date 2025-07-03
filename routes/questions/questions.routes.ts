import { Router } from "express";
import { CreateQuestion, GetQuestions, UpdateQuestion, ValidateAnswer } from "../../controller/question.controller";
import { generateQuestions } from "../../controller/generateq.controller"
import { Authenticate } from "../../middleware/auth.middleware";
import multer from "multer";


const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = Router();

// router.use(Authenticate)
router.post("/createquestion", upload.single('file'), CreateQuestion);
router.patch("/updatequestion/:id", upload.single('file'), UpdateQuestion);
router.post("/validateanswer/:id", ValidateAnswer);
router.get("/getquestions", GetQuestions);
router.post("/aiassist", generateQuestions)


export default router;
