const express = require("express");
const router = express.Router();

const {
  getPosts,
  createPost,
  getPost,
  updatePost,
  getAzureBlobSAS,
  verifyAzureBlobSAS,
  getPostsLikedByUser,
} = require("../controllers/postsController");

const auth = require("../middlewares/auth");
const roles = require("../middlewares/role");
const { multerPostUpload } = require("../services/multer");

/**
 * @swagger
 * /v1/posts:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get all posts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       content:
 *                         type: string
 *                       img_url:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                       comments:
 *                         type: array
 *                         items:
 *                           type: string
 *                       likes:
 *                         type: array
 *                         items:
 *                           type: string
 *                       dislikes:
 *                         type: array
 *                         items:
 *                           type: string
 *                       shares:
 *                         type: array
 *                         items:
 *                           type: string
 *                       views:
 *                         type: array
 *                         items:
 *                           type: string
 *                       reports:
 *                         type: array
 *                         items:
 *                           type: string
 *                       saved:
 *                         type: array
 *                         items:
 *                           type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           username:
 *                             type: string
 *                           email:
 *                             type: string
 *                           role:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                           updatedAt:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *
 */
router.get("/posts", auth, getPosts);

/**
 * @openapi
 *
 * /v1/posts:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Create a post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               post_image:
 *                 type: string
 *                 format: binary
 *               content:
 *                 type: string
 *               tags:
 *                 type: string // Comma separated tags
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     content:
 *                       type: string
 *                     img_url:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                     comments:
 *                       type: array
 *                       items:
 *                         type: string
 *                     likes:
 *                       type: array
 *                       items:
 *                         type: string
 *                     dislikes:
 *                       type: array
 *                       items:
 *                         type: string
 *                     shares:
 *                       type: array
 *                       items:
 *                         type: string
 *                     views:
 *                       type: array
 *                       items:
 *                         type: string
 *                     reports:
 *                       type: array
 *                       items:
 *                         type: string
 *                     saved:
 *                       type: array
 *                       items:
 *                         type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                         updatedAt:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *
 */
router.post(
  "/posts",
  auth,
  roles(["admin", "super_admin"]),
  multerPostUpload.fields([{ name: "post_image", maxCount: 1 }]),
  createPost
);

/**
 *
 * @openapi
 * /v1/posts/{id}:
 *   get:
 *     summary: Get a post by id
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     content:
 *                       type: string
 *                     img_url:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                     comments:
 *                       type: array
 *                       items:
 *                         type: string
 *                     likes:
 *                       type: array
 *                       items:
 *                         type: string
 *                     dislikes:
 *                       type: array
 *                       items:
 *                         type: string
 *                     shares:
 *                       type: array
 *                       items:
 *                         type: string
 *                     views:
 *                       type: array
 *                       items:
 *                         type: string
 *                     reports:
 *                       type: array
 *                       items:
 *                         type: string
 *                     saved:
 *                       type: array
 *                       items:
 *                         type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                         updatedAt:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *
 */

router.get("/posts/:id", auth, getPost);

/**
 * @openapi
 * /v1/posts/{id}:
 *   put:
 *     summary: Update a post by id
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               post_image:
 *                 type: string
 *               tags:
 *                 type: string // Comma separated tags
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     content:
 *                       type: string
 *                     img_url:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                     comments:
 *                       type: array
 *                       items:
 *                         type: string
 *                     likes:
 *                       type: array
 *                       items:
 *                         type: string
 *                     dislikes:
 *                       type: array
 *                       items:
 *                         type: string
 *                     shares:
 *                       type: array
 *                       items:
 *                         type: string
 *                     views:
 *                       type: array
 *                       items:
 *                         type: string
 *                     reports:
 *                       type: array
 *                       items:
 *                         type: string
 *                     saved:
 *                       type: array
 *                       items:
 *                         type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                         updatedAt:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *
 */

router.put("/posts/:id", auth, roles(["admin", "super_admin"]), updatePost);

/**
 * @openapi
 * /v1/posts/{id}:
 *   delete:
 *     summary: Delete a post by id
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     content:
 *                       type: string
 *                     img_url:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                     comments:
 *                       type: array
 *                       items:
 *                         type: string
 *                     likes:
 *                       type: array
 *                       items:
 *                         type: string
 *                     dislikes:
 *                       type: array
 *                       items:
 *                         type: string
 *                     shares:
 *                       type: array
 *                       items:
 *                         type: string
 *                     views:
 *                       type: array
 *                       items:
 *                         type: string
 *                     reports:
 *                       type: array
 *                       items:
 *                         type: string
 *                     saved:
 *                       type: array
 *                       items:
 *                         type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                         updatedAt:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *
 *
 *
 *
 */

router.delete("/posts/:id", auth, roles(["admin", "super_admin"]), updatePost);

/**
 * @openapi
 * /v1/sas-token:
 *   get:
 *     summary: Get Azure Blob SAS token
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Azure Blob SAS token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sas:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *
 */

router.get("/sas-token", auth, getAzureBlobSAS);

/**
 * @openapi
 * /v1/sas-token:
 *   post:
 *     summary: Verify Azure Blob SAS token
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Azure Blob SAS token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sas:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */

router.post("/sas-token", auth, verifyAzureBlobSAS);

/**
 * @openapi
 * /v1/posts/liked:
 *   get:
 *     summary: Get posts liked by user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       content:
 *                         type: string
 *                       post_image:
 *                         type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */

router.get("/posts-liked", auth, getPostsLikedByUser);

module.exports = router;
