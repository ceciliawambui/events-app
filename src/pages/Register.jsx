import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("attendee");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const strongPass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!strongPass.test(password)) {
      return alert("Password must include uppercase, lowercase, number, and special character (min 8 characters)");
    }

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCred.user);

      await setDoc(doc(db, "users", userCred.user.uid), {
        email,
        role,
        approved: role === "organizer" ? false : true,
        emailVerified: false,
        createdAt: serverTimestamp(),
      });

      alert("Account created. Please verify your email before logging in.");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side (image / info panel) */}
      <div className="w-full md:w-1/2 bg-indigo-600 flex items-center justify-center p-10">
        <div className="text-white max-w-md">
          <h1 className="text-4xl font-bold mb-4">Join EventHub</h1>
          <p className="text-lg">Create your account to start organizing and attending amazing events.</p>
        </div>
      </div>

      {/* Right side (form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Register</h2>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Password</label>
            <input
              type="password"
              required
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-400"
            >
              <option value="attendee">Attendee</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 w-full rounded hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 hover:underline">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
