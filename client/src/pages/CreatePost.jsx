import { Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // State to store uploaded image URL

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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const formData = new FormData();
  //   formData.append("title", document.getElementById("title").value);
  //   formData.append("content", document.querySelector(".ql-editor").innerHTML);
  //   formData.append("category", document.querySelector("select").value);

  //   if (imageUrl) {
  //     formData.append("image", imageUrl);
  //   }

  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_BACKEND_URL}/posts`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //         body: formData,
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       alert("Post created successfully!");
  //     } else {
  //       const errorData = await response.json();
  //       console.error("Error creating post:", errorData);
  //       alert(`Failed to create post: ${errorData.message}`);
  //     }
  //   } catch (error) {
  //     console.error("Form Submission Error:", error);
  //     alert(`Error: ${error.message}`);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", document.getElementById("title").value);
    formData.append("content", document.querySelector(".ql-editor").innerHTML);
    formData.append("category", document.querySelector("select").value);
  
    if (imageUrl) {
      formData.append("image", imageUrl);
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        alert("Failed to create post: " + errorText);
        return;
      }
  
      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error("JSON Parsing Error:", error);
        alert("Response is not in JSON format.");
        return;
      }
  
      alert("Post created successfully!");
    } catch (error) {
      console.error("Form Submission Error:", error);
      alert(`Error: ${error.message}`);
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
          />
          <Select>
            <option value="uncategorized">Select a Category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
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
          placeholder="Write something..."
          className="h-72 mb-12"
          required
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
        {uploadStatus && (
          <p
            className={`mt-3 text-center ${
              uploadStatus.includes("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {uploadStatus}
          </p>
        )}
      </form>
    </div>
  );
}
