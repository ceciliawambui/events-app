import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const OrganizerProfile = () => {
  const { organizerId } = useParams();
  const [organizer, setOrganizer] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const organizerRef = doc(db, "users", organizerId);
        const organizerSnap = await getDoc(organizerRef);

        if (organizerSnap.exists()) {
          setOrganizer({ id: organizerSnap.id, ...organizerSnap.data() });

          const eventsQuery = query(
            collection(db, "events"),
            where("organizer", "==", organizerRef)
          );
          const eventsSnap = await getDocs(eventsQuery);

          const eventsList = eventsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setEvents(eventsList);
        }
      } catch (error) {
        console.error("Error loading organizer data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [organizerId]);

  if (loading) {
    return <p className="text-center py-20">Loading organizer profile...</p>;
  }

  if (!organizer) {
    return <p className="text-center py-20 text-red-500">Organizer not found.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Organizer Info - Left Side */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {organizer.profilePhoto && (
            <img
              src={organizer.profilePhoto}
              alt={organizer.displayName}
              className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-800">{organizer.displayName}</h1>
          {organizer.email && (
            <p className="text-gray-600 mt-2">{organizer.email}</p>
          )}
          <p className="text-gray-500 mt-1">Organizer Profile</p>

          {/* Small stats section */}
          <div className="mt-6">
            <p className="text-indigo-600 font-semibold">
              {events.length} {events.length === 1 ? "Event" : "Events"} Organized
            </p>
          </div>
        </div>

        {/* Events List - Right Side */}
        <div className="md:col-span-2">
          {events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link
                  key={event.id}
                  to={`/event-details/${event.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-40 w-full object-cover rounded-md mb-4"
                  />
                  <h2 className="text-xl font-semibold text-gray-800">{event.title}</h2>
                  <p className="text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-20">
              No events created by this organizer yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default OrganizerProfile;
