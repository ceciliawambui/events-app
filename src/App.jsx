import LandingPage from "./components/LandingPage"
import Navbar from "./components/Navbar"
import { Route, Routes } from "react-router-dom"
import EventDetails from "./components/EventDetails"
import Footer from "./components/Footer"

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path="/event-details/:id" element={<EventDetails/>}/>
      </Routes>
      <Footer/>

    </>
  )
}

export default App
