import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth, db } from "../firebase";
import {
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dx6xmqvcy/image/upload";
const UPLOAD_PRESET = "eventhub_upload";

const AccountSettings = () => {
  const { currentUser, userData } = useAuth();

  const [displayName, setDisplayName] = useState(userData?.displayName || "");
  const [bio, setBio] = useState(userData?.bio || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [profilePhoto, setProfilePhoto] = useState(userData?.profilePhoto || "");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    setLoading(true);
    try {
      const res = await axios.post(CLOUDINARY_URL, formData);
      const imageUrl = res.data.secure_url;
      setProfilePhoto(imageUrl);

      await updateDoc(doc(db, "users", currentUser.uid), {
        profilePhoto: imageUrl,
      });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Image upload failed");
    }
    setLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (email !== currentUser.email) {
        await updateEmail(currentUser, email);
      }

      if (oldPassword && newPassword && newPassword === confirmPassword) {
        const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, newPassword);
      }

      await updateDoc(doc(db, "users", currentUser.uid), {
        displayName,
        bio,
        email,
        profilePhoto,
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed: " + err.message);
    }

    setLoading(false);
  };

  const renderPasswordInput = (label, value, setValue, visible, toggleVisibility) => (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        placeholder={label}
        className="w-full border rounded px-3 py-2 pr-10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div
        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
        onClick={toggleVisibility}
      >
        {visible ? <FaEyeSlash /> : <FaEye />}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 flex justify-center items-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-semibold text-indigo-700 mb-6 text-center">
          Account Settings
        </h2>

        {/* Profile Photo Centered */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={profilePhoto || "https://via.placeholder.com/120"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border shadow"
          />
          <label className="mt-3 cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm font-medium">
            Change Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <input
            type="text"
            placeholder="Display Name"
            className="w-full border rounded px-3 py-2"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderPasswordInput("Old Password", oldPassword, setOldPassword, showOld, () =>
              setShowOld(!showOld)
            )}
            {renderPasswordInput("New Password", newPassword, setNewPassword, showNew, () =>
              setShowNew(!showNew)
            )}
            {renderPasswordInput(
              "Confirm Password",
              confirmPassword,
              setConfirmPassword,
              showConfirm,
              () => setShowConfirm(!showConfirm)
            )}
          </div>

          <textarea
            placeholder="Bio"
            className="w-full border rounded px-3 py-2 min-h-[100px]"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 font-semibold tracking-wide"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
