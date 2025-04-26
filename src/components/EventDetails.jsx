import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserAlt,
} from "react-icons/fa";

const ALL_TICKET_TYPES = [
  { key: "regular", label: "Regular", multiplier: 1 },
  { key: "vip", label: "VIP", multiplier: 1.5 },
  { key: "vvip", label: "VVIP", multiplier: 2 },
  { key: "earlyBird", label: "Early Bird", multiplier: 0.75 },
  { key: "couple", label: "Couple", multiplier: 1.8 },
];

const EventDetails = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [selected, setSelected] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "events", id));
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() };

          if (data.organizer && data.organizer.id) {
            data.organizerId = data.organizer.id;
          }

          setEvent(data);

          // Auto-select first available ticket type
          const counts = data.ticketCounts || {};
          const firstAvailable = ALL_TICKET_TYPES.find(
            (t) => (counts[t.key] || 0) > 0
          );
          setSelected(firstAvailable ? firstAvailable.key : "");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!event) return;

    const target = new Date(event.date).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimer({ days: 0, hours: 0, mins: 0, secs: 0 });
      } else {
        setTimer({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff / 3600000) % 24),
          mins: Math.floor((diff / 60000) % 60),
          secs: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [event]);

  if (loading) return <p className="text-center py-20">Loading…</p>;
  if (!event) return <p className="text-center py-20 text-red-500">Event not found.</p>;

  const counts = event.ticketCounts || {};
  const availableTypes = ALL_TICKET_TYPES.filter((t) => (counts[t.key] || 0) > 0);
  const chosen = ALL_TICKET_TYPES.find((t) => t.key === selected) || {};
  const totalPrice = ((event.price * (chosen.multiplier || 0)) * qty).toFixed(2);
  const isSoldOut = availableTypes.length === 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center flex items-end"
        style={{ backgroundImage: `url(${event.image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 w-full p-6 text-center">
          <div className="inline-flex bg-white bg-opacity-70 rounded-lg px-4 py-2 space-x-4">
            {["days", "hours", "mins", "secs"].map((unit) => (
              <div key={unit}>
                <div className="text-2xl font-bold text-indigo-700">{timer[unit]}</div>
                <div className="text-xs uppercase">{unit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Info */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8 space-y-6">
            <h1 className="text-4xl font-bold text-gray-800">{event.title}</h1>

            <div className="flex flex-wrap text-gray-600 space-x-6 items-center">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-indigo-600" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <FaClock className="mr-2 text-indigo-600" />
                {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-indigo-600" />
                {event.venue}
              </div>

              {event.organizerId && (
                <Link
                  to={`/organizer/${event.organizerId}`}
                  className="flex items-center text-indigo-700 hover:underline"
                >
                  <FaUserAlt className="mr-2" />
                  {event.organizerName || "Organizer"}
                </Link>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {/* RSVP Panel */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get Tickets</h2>

            {isSoldOut ? (
              <div className="text-center">
                <span className="inline-block bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full mb-4">
                  SOLD OUT
                </span>
                <p className="text-gray-500">No tickets available.</p>
              </div>
            ) : (
              <>
                {/* Ticket Type */}
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Type
                </label>
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="w-full mb-4 p-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                >
                  {availableTypes.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.label} — KSh {(event.price * t.multiplier).toFixed(2)} ({counts[t.key]} left)
                    </option>
                  ))}
                </select>

                {/* Quantity */}
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={counts[selected] || 1}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.min(Math.max(1, +e.target.value), counts[selected]))
                  }
                  className="w-full mb-4 p-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                />

                {/* Total */}
                <div className="text-lg font-semibold mb-6">
                  Total: <span className="text-indigo-600">KSh {totalPrice}</span>
                </div>

                {/* RSVP Button */}
                <button
                  disabled={isSoldOut}
                  onClick={() => alert(`Reserved ${qty} × ${chosen.label} for KSh ${totalPrice}`)}
                  className={`w-full py-3 font-medium rounded-md transition ${
                    isSoldOut
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {isSoldOut ? "Sold Out" : "RSVP Now"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
