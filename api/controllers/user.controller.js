import User from "../models/user.model.js";

// Update Profile Picture
export const updateProfilePicture = async (req, res) => {
  const { id } = req.params; // User ID from the route parameter
  const { profilePictureUrl } = req.body; // URL sent in the request body

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profilePicture: profilePictureUrl },
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Error updating profile picture" });
  }
};
