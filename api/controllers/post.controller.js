import Post from "../models/post.model.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { errorHandler } from "../utils/error.js";

// AWS S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const bucketName = process.env.S3_BUCKET_NAME;

export const create = async (req, res, next) => {
  console.log("Request Body:", req.body);
  if (!req.user.isAdmin) {
    return next(errorHandler("403", "You are not allowed to create a post"));
  }

  const { title, content, category, image } = req.body;

  if (!title || !content) {
    return next(errorHandler("400", "Title and content are required"));
  }

  // Generate slug
  const slug = title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  let imageUrl = image || null;

  // Handle file upload to S3 if a file is provided (in case it's not a URL)
  if (req.file) {
    const file = req.file;
    const key = `posts/${Date.now()}-${file.originalname}`;

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);

      // Construct the S3 URL
      imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      return next(errorHandler("500", "Error uploading image to S3"));
    }
  }

  // Create the post
  const newPost = new Post({
    userId: req.user.id,
    title,
    content,
    image: imageUrl,
    category: category || "uncategorized",
    slug,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};
