import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-toastify";

const TICKET_TYPES = [
  { key: "regular", label: "Regular" },
  { key: "vip", label: "VIP" },
  { key: "vvip", label: "VVIP" },
  { key: "earlyBird", label: "Early Bird" },
  { key: "couple", label: "Couple" },
];

const CATEGORIES = [
  "Music",
  "Business",
  "Art",
  "Sports",
  "Tech",
  "Other",
];

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dx6xmqvcy/image/upload";
const UPLOAD_PRESET = "eventhub_upload";

const CreateEvent = ({ currentUser }) => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const [eventDetails, setEventDetails] = useState({
    title: "",
    category: "",
    customCategory: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    price: "",
    image: "",
    ticketCounts: TICKET_TYPES.reduce((acc, t) => ({ ...acc, [t.key]: "" }), {}),
    ticketPrices: TICKET_TYPES.reduce((acc, t) => ({ ...acc, [t.key]: "" }), {}),
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    (async () => {
      try {
        const ref = doc(db, "events", eventId);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          toast.error("Event not found");
          return navigate("/events");
        }
        const data = snap.data();
        setEventDetails({
          ...data,
          customCategory: "",
          ticketCounts: {
            ...TICKET_TYPES.reduce((acc, t) => ({ ...acc, [t.key]: "" }), {}),
            ...data.ticketCounts,
          },
          ticketPrices: {
            ...TICKET_TYPES.reduce((acc, t) => ({ ...acc, [t.key]: "" }), {}),
            ...data.ticketPrices,
          },
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load event");
      }
    })();
  }, [eventId, navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);
    setLoading(true);
    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.secure_url) {
        setEventDetails((prev) => ({ ...prev, image: data.secure_url }));
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleTicketCount = (key, value) => {
    setEventDetails((prev) => ({
      ...prev,
      ticketCounts: { ...prev.ticketCounts, [key]: value },
    }));
  };

  const handleTicketPrice = (key, value) => {
    setEventDetails((prev) => ({
      ...prev,
      ticketPrices: { ...prev.ticketPrices, [key]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Please log in first");
      return navigate("/login");
    }
    if (!eventDetails.image) {
      toast.error("Upload an image");
      return;
    }

    setLoading(true);

    const finalCategory =
      eventDetails.category === "Other"
        ? eventDetails.customCategory
        : eventDetails.category;

    const payload = {
      ...eventDetails,
      category: finalCategory,
      customCategory: "",
      price: parseFloat(eventDetails.price) || 0,
      ticketCounts: TICKET_TYPES.reduce((acc, t) => {
        const n = parseInt(eventDetails.ticketCounts[t.key], 10);
        acc[t.key] = isNaN(n) ? 0 : n;
        return acc;
      }, {}),
      ticketPrices: TICKET_TYPES.reduce((acc, t) => {
        const p = parseFloat(eventDetails.ticketPrices[t.key]);
        acc[t.key] = isNaN(p) ? 0 : p;
        return acc;
      }, {}),
      organizer: doc(db, "users", currentUser.uid),
      ...(eventId
        ? { updatedAt: serverTimestamp() }
        : { createdAt: serverTimestamp() }),
    };

    try {
      if (eventId) {
        await updateDoc(doc(db, "events", eventId), payload);
        toast.success("Event updated!");
        navigate("/events");
      } else {
        const newDoc = await addDoc(collection(db, "events"), payload);
        toast.success("Event created!");
        navigate(`/event-details/${newDoc.id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!eventId || !window.confirm("Delete this event?")) return;
    try {
      await deleteDoc(doc(db, "events", eventId));
      toast.success("Event deleted");
      navigate("/events");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-5 bg-white rounded-xl my-5 shadow-lg">
      <h2 className="text-3xl font-bold text-indigo-600 mb-2 text-center">
        {eventId ? "Edit Event" : "Create Event"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Title */}
          <input
            name="title"
            type="text"
            placeholder="Event Title"
            value={eventDetails.title}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
            required
          />

          {/* Category Selection */}
          <div>
            <select
              name="category"
              value={eventDetails.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {/* Show custom input if "Other" is selected */}
            {eventDetails.category === "Other" && (
              <input
                name="customCategory"
                type="text"
                placeholder="Enter custom category"
                value={eventDetails.customCategory}
                onChange={handleChange}
                className="mt-4 w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                required
              />
            )}
          </div>

          {/* Venue */}
          <input
            name="venue"
            type="text"
            placeholder="Venue"
            value={eventDetails.venue}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
            required
          />

          {/* Price */}
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Base Price (KSh)"
            value={eventDetails.price}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
            required
          />

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="date"
              type="date"
              value={eventDetails.date}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              name="time"
              type="time"
              value={eventDetails.time}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Event Image</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
            />
            {eventDetails.image && (
              <img
                src={eventDetails.image}
                alt="Preview"
                className="mt-4 w-full h-48 object-cover rounded-md shadow"
              />
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Description */}
          <textarea
            name="description"
            placeholder="Event Description"
            value={eventDetails.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
            rows="6"
            required
          />

          {/* Ticket Counts & Prices */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Tickets Available & Prices</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {TICKET_TYPES.map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium">{label}</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Count"
                    value={eventDetails.ticketCounts[key]}
                    onChange={(e) => handleTicketCount(key, e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price (KSh)"
                    value={eventDetails.ticketPrices[key]}
                    onChange={(e) => handleTicketPrice(key, e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
      
        </div>

        {/* Submit and Delete Buttons */}
        <div className="lg:col-span-2 flex flex-col md:flex-row gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
          >
            {loading ? "Saving..." : eventId ? "Update Event" : "Create Event"}
          </button>

          {eventId && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              Delete Event
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
