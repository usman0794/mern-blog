import { Button, TextInput } from "flowbite-react";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios"; // Axios for backend communication

export default function DashProfile() {
  const currentUser = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(""); // To track upload status
  const filePickerRef = useRef(null);

  // AWS S3 Configuration
  const s3Client = new S3Client({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
  });

  const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  // Upload image to S3
  const uploadImageToS3 = async () => {
    if (!imageFile) {
      setUploadStatus("No image selected!");
      return null;
    }

    const key = `profile-pictures/${currentUser.id}-${Date.now()}-${imageFile.name}`;

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: imageFile,
      ContentType: imageFile.type,
    };
    
    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);

      // Construct the image URL from the S3 bucket
      const imageUrl = `https://${bucketName}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`;
      console.log("Image URL:", imageUrl);

      setUploadStatus("Image uploaded successfully!");
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadStatus("Error uploading image!");
      return null;
    }
  };

  // Update user profile in the database
  const updateProfileInDB = async (imageUrl) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.id}`,
        {
          profilePicture: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      console.log("Profile updated in DB:", response.data);
      setUploadStatus("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile in DB:", error);
      setUploadStatus("Error updating profile in database!");
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = null;

    // Upload the image if a new file is selected
    if (imageFile) {
      imageUrl = await uploadImageToS3();
    }

    if (imageUrl) {
      await updateProfileInDB(imageUrl);
    }

    // TODO: Update other user details (username, email, password) in your database
    console.log("Form submitted with updated details");
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md"
          onClick={() => {
            filePickerRef.current.click();
          }}
        >
          {/* Show preview image or the current user's profile image */}
          <img
            src={imageFileUrl || currentUser.profilePicture || "default-image-url"} // Provide default image if none
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="********" />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      {uploadStatus && <p className="mt-3 text-center text-red-500">{uploadStatus}</p>}
      <div className="text-red-600 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
