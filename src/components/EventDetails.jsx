import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserAlt } from "react-icons/fa"; // Importing icons from react-icons

const events = [
  {
    title: "Music Concert",
    category: "Music",
    description: "A live music concert featuring top artists.",
    date: "2025-05-15",
    time: "7:00 PM",
    venue: "Event Hall A",
    organizer: "ABC Music Group",
    basePrice: 30,
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
    basePrice: 45,
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
    basePrice: 60,
    image: "/event15.jpg",
    id: 3,
  },
];

const ticketTypes = [
  { label: "Regular", value: "regular", multiplier: 1 },
  { label: "VIP", value: "vip", multiplier: 1.8 },
  { label: "Early Bird", value: "earlybird", multiplier: 0.7 },
  { label: "Couple", value: "couple", multiplier: 1.6 }, 
];

const EventDetails = () => {
  const { id } = useParams();
  const event = events.find((e) => e.id === parseInt(id));

  const [ticketType, setTicketType] = useState("regular");
  const [quantity, setQuantity] = useState(1);

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Event not found</p>
      </div>
    );
  }

  const selectedTicket = ticketTypes.find((t) => t.value === ticketType);
  const unitPrice = Math.floor(event.basePrice * selectedTicket.multiplier);
  const totalPrice = unitPrice * quantity;

  const otherEvents = events.filter(
    (e) => e.category === event.category && e.id !== event.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-[400px] object-cover rounded-xl"
          />

          <h1 className="text-4xl font-bold mt-6 text-gray-900">
            {event.title}
          </h1>
          <p className="uppercase text-indigo-500 text-sm font-medium mt-1 mb-6">
            {event.category}
          </p>

          <div className="text-gray-700 space-y-3">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 text-indigo-600" />
              <p>
                <span className="font-semibold">Date:</span> {event.date}
              </p>
            </div>
            <div className="flex items-center">
              <FaClock className="mr-2 text-indigo-600" />
              <p>
                <span className="font-semibold">Time:</span> {event.time}
              </p>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2 text-indigo-600" />
              <p>
                <span className="font-semibold">Venue:</span> {event.venue}
              </p>
            </div>
            <div className="flex items-center">
              <FaUserAlt className="mr-2 text-indigo-600" />
              <p>
                <span className="font-semibold">Organizer:</span>{" "}
                {event.organizer}
              </p>
            </div>
            <p>
              <span className="font-semibold">Description:</span>{" "}
              {event.description}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-md h-fit">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Book Tickets
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Ticket Type
            </label>
            <select
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value)}
            >
              {ticketTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label} – KSh {Math.floor(event.basePrice * type.multiplier)}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </div>

          <div className="mb-4 text-lg">
            <span className="font-semibold text-gray-700">Total:</span>{" "}
            <span className="text-indigo-600 font-bold">KSh {totalPrice}</span>
          </div>

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition">
            Reserve a Spot
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherEvents.map((event) => (
            <div key={event.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.category}</p>
                <p className="mt-2 text-gray-700">{event.description}</p>
                <div className="mt-4">
                  <a
                    href={`/events/${event.id}`}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    View Event Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
