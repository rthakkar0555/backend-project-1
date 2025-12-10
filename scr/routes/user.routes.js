import { Router } from "express";
import {registerUser,loginUser,refreshAccessToken, changeUserPassword, getCurrentUser, updateAvatar, getUserChannelProfile} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js"
import authMiddlerware from "../middlewares/auth.middleware.js";
import { logoutUser } from "../controllers/user.controller.js";
const router = Router()

router.route("/login").post(loginUser);

router.route("/register").post(
  upload.fields([
    {
      name:"avatar",
      maxCount:1
    },
    {
      name:"coverImage",
      maxCount:1
    }
  ]),
  registerUser
)

router.route("/logout").post(authMiddlerware,logoutUser)
router.route("/refresh").post(refreshAccessToken)
router.route("/change-pass").post(authMiddlerware,changeUserPassword)
router.route("/curr-user").get(authMiddlerware,getCurrentUser)
router.route("/update-avatar").put(upload.single("avatar"),authMiddlerware,updateAvatar)
router.route("/profile/:username").get(authMiddlerware,getUserChannelProfile)
export default router 