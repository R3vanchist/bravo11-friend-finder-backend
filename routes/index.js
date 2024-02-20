import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import addTeam from "./addTeam.js";
import addUseCase from "./addUseCase.js";
import addTeamToUseCase from "./addTeamToUseCase.js";
import removeTeam from "./removeTeam.js";
import removeUseCase from "./removeUseCase.js";
import addMemberTeam from "./addMemberTeam.js";
import removeMember from "./removeMember.js";
import getTeam from "./getTeam.js";
import getTeams from "./getTeams.js";
import getUseCase from "./getUseCase.js";
import getUseCases from "./getUseCases.js";
import getMembers from "./getMembers.js";
import getMembersByTeam from "./getMembersByTeam.js";
import getTeamNoMember from "./getTeamNoMember.js";
import getNoUseCaseTeam from "./getNoUseCaseTeam.js";
import updateUseCase from "./updateUseCase.js";
import updateTeam from "./updateTeam.js";

const routes = express.Router();

// Construct __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, "../uploads/");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, and .png files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 16 * 1024 * 1024 }, // 16 MB
});

// Route-specific middleware usage
routes.post("/addTeam", upload.single("image"), addTeam);
routes.post("/addUseCase", upload.single("image"), addUseCase);
routes.post("/addTeamToUseCase", addTeamToUseCase);
routes.get("/getTeam/:id", getTeam);
routes.get("/getTeams", getTeams);
routes.get("/getUseCase/:id", getUseCase);
routes.get("/getUseCases", getUseCases);
routes.get("/getMembers", getMembers);
routes.get("/getMembersByTeam/:teamId", getMembersByTeam);
routes.get("/getTeamNoMember", getTeamNoMember);
routes.get("/getNoUseCaseTeam", getNoUseCaseTeam);
routes.post("/addMemberTeam", addMemberTeam);
routes.post("/removeTeam", removeTeam);
routes.post("/removeUseCase", removeUseCase);
routes.post("/removeMember", removeMember);
routes.post("/updateUseCase", updateUseCase);
routes.post("/updateTeam", updateTeam);

export default routes;