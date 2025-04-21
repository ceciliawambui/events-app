import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const provider = new GoogleAuthProvider();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const hardcodedAdmins = [
    { email: "admin@eventhub.com", password: "SecureAdmin123!" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const matchedAdmin = hardcodedAdmins.find(
        (admin) => admin.email === email && admin.password === password
      );

      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;

      if (!user.emailVerified && !matchedAdmin) {
        setLoading(false);
        return alert("Please verify your email before logging in.");
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const role = matchedAdmin ? "admin" : "attendee";
        await setDoc(userRef, {
          email: user.email,
          role,
          approved: matchedAdmin ? true : false,
          emailVerified: user.emailVerified || matchedAdmin,
          createdAt: serverTimestamp(),
        });
      } else {
        const userData = userSnap.data();
        if (userData.role === "organizer" && !userData.approved) {
          setLoading(false);
          return alert("Your organizer account is pending approval.");
        }
      }

      setTimeout(() => {
        navigate("/redirect");
      }, 300);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          role: "attendee",
          approved: true,
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
        });
      }

      setTimeout(() => {
        navigate("/redirect");
      }, 300);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel */}
      <div className="w-full md:w-1/2 bg-indigo-600 flex items-center justify-center p-10">
        <div className="text-white max-w-md">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg">Log in to manage and attend awesome events at EventHub.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
        <form onSubmit={handleLogin} className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Login</h2>

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

          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 w-full rounded hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="bg-red-600 text-white py-2 w-full rounded mt-3 hover:bg-red-700 transition"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign in with Google"}
          </button>

          <div className="text-sm text-center mt-4">
            <a href="/forgot-password" className="text-indigo-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          <div className="text-sm text-center mt-2">
            Don’t have an account?{" "}
            <a href="/register" className="text-indigo-600 hover:underline font-medium">
              Register here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
