import { Button, Modal, TextInput } from "flowbite-react";
import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(""); // To track upload status
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef(null);
  const dispatch = useDispatch();

  // AWS S3 Configuration
  const s3Client = new S3Client({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
  });
  const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

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

    const key = `profile-pictures/${currentUser.id}-${Date.now()}-${
      imageFile.name
    }`;
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: imageFile,
      ContentType: imageFile.type,
    };

    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);

      // Construct the image URL
      const imageUrl = `https://${bucketName}.s3.${
        import.meta.env.VITE_AWS_REGION
      }.amazonaws.com/${key}`;
      console.log("Image URL:", imageUrl);

      setUploadStatus("Image uploaded successfully!");
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadStatus("Error uploading image!");
      return null;
    }
  };

  // Update profile in the database
  const updateProfileInDB = async (imageUrl) => {
    try {
      const payload = {
        ...formData,
        profilePicture: imageUrl || currentUser.profilePicture, // Only update the image URL if a new one is uploaded
      };

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      dispatch(updateSuccess(response.data));
      console.log("Profile updated in DB:", response.data);
      setUploadStatus("Profile updated successfully!");
    } catch (error) {
      dispatch(updateFailure(error));
      console.error("Error updating profile in DB:", error);
      setUploadStatus("Error updating profile in database!");
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateStart());
    let imageUrl = null;

    // Upload the image if a new file is selected
    if (imageFile) {
      imageUrl = await uploadImageToS3();
    }
    await updateProfileInDB(imageUrl);
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser.token}`, // Add token for authentication
        },
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        console.error("Failed to delete user:", data.message);
      } else {
        dispatch(deleteUserSuccess(data));
        console.log("User deleted successfully:", data);
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      console.error("Error deleting user:", error.message);
    }
  };

  // handle signout

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Signout failed:", data.message);
      } else {
        dispatch(signoutSuccess());
        //console.log("Signout successful");
      }
    } catch (error) {
      console.error("Error during signout:", error.message);
    }
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
          <img
            src={
              imageFileUrl || currentUser.profilePicture || "default-image-url"
            }
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="******"
          value={formData.password}
          onChange={handleChange}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      {uploadStatus && (
        <p className="mt-3 text-center text-red-500">{uploadStatus}</p>
      )}
      <div className="text-red-600 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignout}>
          Sign out
        </span>
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
