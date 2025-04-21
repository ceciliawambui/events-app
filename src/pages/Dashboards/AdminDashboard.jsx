import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { db } from "../../firebase";

const AdminDashboard = () => {
  const [organizers, setOrganizers] = useState([]);

  useEffect(() => {
    const fetchOrganizers = async () => {
      const q = query(collection(db, "users"), where("role", "==", "organizer"), where("approved", "==", false));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrganizers(data);
    };

    fetchOrganizers();
  }, []);

  const approveOrganizer = async (id) => {
    await updateDoc(doc(db, "users", id), { approved: true });
    setOrganizers(prev => prev.filter(org => org.id !== id));
    alert("Organizer approved!");
  };

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <h1 className="text-2xl font-bold text-indigo-600 mb-6">Admin Dashboard</h1>
      <h2 className="text-xl mb-4">Pending Organizers</h2>
      {organizers.length === 0 ? (
        <p>No pending organizers.</p>
      ) : (
        organizers.map(org => (
          <div key={org.id} className="border p-4 mb-3 rounded">
            <p><strong>Email:</strong> {org.email}</p>
            <button onClick={() => approveOrganizer(org.id)} className="mt-2 bg-indigo-600 text-white py-1 px-4 rounded">Approve</button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
