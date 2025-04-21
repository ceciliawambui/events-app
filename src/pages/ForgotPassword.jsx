import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent.");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center">
      <form onSubmit={handleReset} className="bg-white p-6 rounded shadow w-96 text-black">
        <h1 className="text-center text-2xl font-bold mb-4 text-indigo-600">Reset Password</h1>
        <input type="email" placeholder="Email" required className="w-full border p-2 mb-4" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="bg-indigo-600 w-full text-white py-2 rounded">Send Reset Email</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
