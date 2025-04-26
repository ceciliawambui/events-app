import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const snap = await getDocs(collection(db, "events"));
            setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        })();
    }, []);

    const categories = ["All", ...new Set(events.map(e => e.category))];

    const filtered = events.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategory === "All" || e.category === selectedCategory)
    );

    const handleDelete = async id => {
        if (!window.confirm("Delete this event?")) return;
        try {
            await deleteDoc(doc(db, "events", id));
            toast.success("Event deleted!");
            setEvents(prev => prev.filter(e => e.id !== id));
        } catch {
            toast.error("Delete failed");
        }
    };

    const calcDaysLeft = dateStr => {
        const diff = new Date(dateStr) - Date.now();
        return diff > 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0;
    };

    return (
        <div className="bg-gray-50 py-12">
            {/* <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
        Events Portal
      </h2> */}

            {/* Search & Filters */}
            {/* Search Row */}
            <div className="mb-4 px-4 flex justify-center">
                <input
                    className="w-full md:w-1/3 p-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-400"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Filters Row */}
            <div className="mb-8 px-4 flex flex-wrap justify-center gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === cat
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-indigo-100"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>


            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                {filtered.length ? (
                    filtered.map(evt => {
                        const daysLeft = calcDaysLeft(evt.date);
                        return (
                            <div
                                key={evt.id}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
                            >
                                {/* Image + badge */}
                                <div className="relative">
                                    <img
                                        src={evt.image}
                                        alt={evt.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <span className="absolute top-3 left-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        {daysLeft > 0 ? `${daysLeft}d left` : "Ended"}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-indigo-700 mb-2">
                                        {evt.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                        {evt.description}
                                    </p>
                                    <div className="flex justify-between text-gray-500 mb-4 text-sm">
                                        <span className="capitalize">{evt.category}</span>
                                        <span>{new Date(evt.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="mb-4 text-gray-700 text-sm">
                                        Tickets left:{" "}
                                        <span className="font-semibold text-indigo-600">
                                            {evt.ticketsAvailable ?? "N/A"}
                                        </span>
                                    </p>

                                    {/* Actions: inline small buttons */}
                                    <div className="mt-auto flex justify-between space-x-2">
                                        <button
                                            onClick={() => navigate(`/event-details/${evt.id}`)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition"
                                        >
                                            <FaEye /> View Details
                                        </button>
                                        <button
                                            onClick={() => navigate(`/edit-event/${evt.id}`)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-yellow-400 text-white rounded-md text-sm hover:bg-yellow-500 transition"
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(evt.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No events found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Events;
