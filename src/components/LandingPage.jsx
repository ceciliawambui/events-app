import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase"; // <-- make sure your firebase config is imported correctly
import { collection, getDocs } from "firebase/firestore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const LandingPage = () => {
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "events"));
                const eventsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setEvents(eventsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching events:", error);
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const categories = ["All", ...new Set(events.map((event) => event.category))];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const filteredEvents = events.filter((event) => {
        const isSearchMatch =
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.venue.toLowerCase().includes(searchQuery.toLowerCase());
        const isCategoryMatch =
            selectedCategory === "All" || event.category === selectedCategory;
        return isSearchMatch && isCategoryMatch;
    });

    return (
        <div>
            {/* Carousel */}
            <div className="relative mb-8 mt-5 px-4 md:px-10">
                <Slider {...settings}>
                    {/* You can either fetch banners dynamically later or leave these hardcoded */}
                    <div>
                        <img src="/event9.jpg" alt="Event 1" className="w-full h-96 object-cover rounded-xl shadow-md" />
                    </div>
                    <div>
                        <img src="/event2.jpg" alt="Event 2" className="w-full h-96 object-cover rounded-xl shadow-md" />
                    </div>
                    <div>
                        <img src="/event3.jpg" alt="Event 3" className="w-full h-96 object-cover rounded-xl shadow-md" />
                    </div>
                    <div>
                        <img src="/event4.jpg" alt="Event 4" className="w-full h-96 object-cover rounded-xl shadow-md" />
                    </div>
                </Slider>
            </div>

            {/* Search Input */}
            <div className="my-8 text-center">
                <input
                    type="text"
                    className="p-3 w-1/2 text-gray-700 rounded-full border-2 border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                    placeholder="Search for events"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Category Buttons */}
            <div className="my-8 text-center">
                <div className="flex flex-wrap justify-center space-x-2">
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => handleCategoryClick(category)}
                            className={`px-4 py-2 m-1 rounded-full text-sm font-medium ${
                                selectedCategory === category
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-indigo-500 hover:text-white"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Events List */}
            <div className="my-12 px-4">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
                    Upcoming Events
                </h2>

                {loading ? (
                    <p className="text-center text-gray-500">Loading events...</p>
                ) : filteredEvents.length === 0 ? (
                    <p className="text-center text-gray-500">No events found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.slice(0, 6).map((event) => (
                            <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-600 mt-2">
                                        {event.description?.slice(0, 100)}...
                                    </p>
                                    <div className="mt-4">
                                        <span className="text-lg font-bold text-indigo-600">${event.price}</span>
                                        <p className="text-gray-500">Venue: {event.venue}</p>
                                        <p className="text-gray-500">Date: {event.date}</p>
                                    </div>
                                    <div className="mt-4 flex justify-between">
                                        <Link
                                            to={`/event-details/${event.id}`}
                                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                        >
                                            View Details
                                        </Link>
                                    
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingPage;
