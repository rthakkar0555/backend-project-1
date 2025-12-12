import { Router } from "express";
import { deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo
 } from "../controllers/video.controller.js";

import authMiddlerware from '../middlewares/auth.middleware.js';
import upload from "../middlewares/multer.middleware.js"

const router=Router()

router.use(authMiddlerware)

router.route("/").get(getAllVideos).post(
    upload.fields([
        {
            name:"videoFile",
            maxCount:1
        },
         {
            name:"thumbnail",
            maxCount:1
        }
    ]),
    publishAVideo
)

router.route("/:videoId").delete(deleteVideo).get(getVideoById).patch(upload.single("thumbnail"),updateVideo)

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router
