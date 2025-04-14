import React, { useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const events = [
    {
        title: "Music Concert",
        category: "Music",
        description: "A live music concert featuring top artists.",
        date: "2025-05-15",
        time: "7:00 PM",
        venue: "Event Hall A",
        organizer: "ABC Music Group",
        price: 30,
        image: "/event17.jpg",
        id: 1,
    },
    {
        title: "Tech Expo",
        category: "Technology",
        description: "A technology exhibition showcasing the latest innovations.",
        date: "2025-06-10",
        time: "9:00 AM",
        venue: "Convention Center",
        organizer: "TechWorld",
        price: 45,
        image: "/event16.jpg",
        id: 2,
    },
    {
        title: "Art Gallery Exhibition",
        category: "Art",
        description: "An exhibition of contemporary artworks by renowned artists.",
        date: "2025-07-01",
        time: "6:00 PM",
        venue: "City Gallery",
        organizer: "ArtWorks Studio",
        price: 60,
        image: "/event15.jpg",
        id: 3,
    },
];

const LandingPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

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

    // Filter events based on search query and selected category
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
            <div className="relative mb-8 mt-5 px-4 md:px-10">
                <Slider {...settings}>
                    <div>
                        <img
                            src="/event9.jpg"
                            alt="Event 1"
                            className="w-full h-96 object-cover rounded-xl shadow-md"
                        />
                    </div>
                    <div>
                        <img
                            src="/event2.jpg"
                            alt="Event 2"
                            className="w-full h-96 object-cover rounded-xl shadow-md"
                        />
                    </div>
                    <div>
                        <img
                            src="event3.jpg"
                            alt="Event 3"
                            className="w-full h-96 object-cover rounded-xl shadow-md"
                        />
                    </div>
                    <div>
                        <img
                            src="event4.jpg"
                            alt="Event 4"
                            className="w-full h-96 object-cover rounded-xl shadow-md"
                        />
                    </div>
                    <div>
                        <img
                            src="event5.jpg"
                            alt="Event 5"
                            className="w-full h-96 object-cover rounded-xl shadow-md"
                        />
                    </div>
                    <div>
                        <img
                            src="event6.jpg"
                            alt="Event 6"
                            className="w-full h-96 object-cover rounded-xl shadow-md"
                        />
                    </div>
                    <div>
                        <img
                            src="event7.jpg"
                            alt="Event 7"
                            className="w-full h-96 object-cover rounded-xl shadow-md"
                        />
                    </div>
                </Slider>
            </div>


            <div className="my-8 text-center">
                <input
                    type="text"
                    className="p-3 w-1/2 text-gray-700 rounded-full border-2 border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                    placeholder="Search for events"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="my-8 text-center">
                <div className="flex justify-center space-x-4">
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => handleCategoryClick(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === category
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-indigo-500 hover:text-white"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="my-12 px-4">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
                    Upcoming Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.slice(0, 6).map((event, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {event.title}
                                </h3>
                                <p className="text-gray-600 mt-2">{event.description.slice(0, 100)}...</p>
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
                                    <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">
                                        Get Tickets
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
