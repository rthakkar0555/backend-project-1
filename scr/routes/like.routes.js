import { Router } from "express";
import authMiddlerware from '../middlewares/auth.middleware.js';
import {getLikedVideos,toggleCommentLike,toggleVideoLike,toggleTweetLike} from "../controllers/like.controller.js"
const router=Router()

router.use(authMiddlerware)

router.route("/videos").get(getLikedVideos)

router.route("/toggle/v/:videoId").patch(toggleVideoLike)
router.route("/toggle/c/:commentId").patch(toggleCommentLike)
router.route("/toggle/t/:tweetId").patch(toggleTweetLike)


export default router