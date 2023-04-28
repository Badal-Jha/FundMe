import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Sidebar, Navbar } from './components';
import Sidebar2 from "./components/Sidebar2"
import { CampaignDetails, CreateCampaign, Home, Profile } from './pages';
// 13131a
const App = () => {
  return (
    <div className="relative sm:-8 p-4  min-h-screen flex flex-row bg-[#06373A]">
   
      <div className="sm:flex hidden mr-10 relative w-[76px]">
        <Sidebar2 />
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/campaign-details/:id" element={<CampaignDetails />} />
        </Routes>
      </div>
    </div>
  )
}

export default App