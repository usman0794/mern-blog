import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState("");
  const postId = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();

        if (!res.ok) {
          alert("Error fetching post data...");
          setPublishError(data.message);
          return;
        }

        setFormData({
          title: data.title,
          category: data.category,
          content: data.content,
        });
        setImageUrl(data.image);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  // AWS S3 Configuration
  const s3Client = new S3Client({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
  });
  const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;

  const handleUploadImage = async () => {
    if (!file) {
      setUploadStatus("No file selected!");
      return;
    }

    const key = `posts/images/${Date.now()}-${file.name}`;
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: file.type,
    };

    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);

      const uploadedImageUrl = `https://${bucketName}.s3.${
        import.meta.env.VITE_AWS_REGION
      }.amazonaws.com/${key}`;

      setImageUrl(uploadedImageUrl); // Store the image URL
      setUploadStatus("Image uploaded successfully!");
    } catch (error) {
      console.error("S3 Upload Error:", error);
      setUploadStatus(`Error: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const completeFormData = { ...formData, image: imageUrl };

    // console.log("Submitting form data:", completeFormData);

    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeFormData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error form submit data...");
        const errorMessage = data.message || "Unknown error occurred.";
        setPublishError(errorMessage);
        return;
      }

      setPublishError(null);
      alert("Post created successfully!");
      navigate(`/post/${data.slug}`);
    } catch (error) {
      console.error("Error creating post:", error);
      setPublishError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
            }}
            value={formData.title}
          />
          <Select
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
            }}
            value={formData.category}
          >
            <option value="uncategorized">Select a Category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
            <option value="aws">AWS</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            id="file"
            accept="image/*"
            required
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
          >
            Upload Image
          </Button>
        </div>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-full h-72 object-cover mt-4"
          />
        )}
        <ReactQuill
          theme="snow"
          value={formData.content}
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({
              ...formData,
              content: value,
            });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
