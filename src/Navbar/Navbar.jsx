import React from 'react'
import logo from "../assets/logo.png"
import { Link, useNavigate } from 'react-router-dom'
import { FiPhone, FiMail } from "react-icons/fi";
export default function Navbar() {
  const navigate=useNavigate();
  const items=[
    {
      name:"Home",
      path:"/"
    },
    {
      name:"Risk Assessment",
      path:"/risk"
    },
     {
      name:"Report Analyzer",
      path:"/medicalreportanalyzer"
    },
    {
      name:"Report",
      path:"/report"
    },
     {
      name:"About",
      path:"/about"
    },
    {
      name:"Contact",
      path:"/contact"
    }
  ]
  return (
    <div className='w-full flex items-center h-20 px-4'>
      <img 
        src={logo} 
        alt='logo' 
        className='w-64 object-contain'
      />
      <div className=' flex gap-5 ml-auto '>
      <div className='flex items-center gap-5
        bg-white/30 
        backdrop-blur-md 
        border border-white/20 
        rounded-full 
        px-10 py-3 shadow-lg'>

  {items.map((item, index) => (
    <Link
      key={index}
      to={item.path}
      className='text-gray-200 font-medium hover:text-green-400 transition duration-300 gap-5' 
    >
      {item.name}
    </Link>
  ))}
</div>
<div className='flex items-center gap-4  bg-white/40 border border-white/20 rounded-full px-5'>

  <button
    onClick={() => navigate("/signin")}
    className=' bg-gradient-to-t from-green-600 to-green-900 py-1 rounded-full
     px-5 text-white 
    hover:bg-green-500 transition'
  >
    Sign In
  </button>

  {/* Divider */}
  <div className='h-8 border-r border-white/30'></div>

  {/* Phone Icon */}
<a
  href="tel:+919876543210"
  className='w-8 h-8 rounded-full 
  bg-white/10 border border-white/20
  flex items-center justify-center
  text-white text-base 
  hover:bg-green-500 hover:text-black
  transition duration-300'
>
  <FiPhone />
</a>
   
<a
  href="mailto:healthguard@gmail.com"
  className='w-8 h-8 rounded-full 
  bg-white/10 border border-white/20
  flex items-center justify-center
  text-white text-base 
  hover:bg-green-500 hover:text-black
  transition duration-300'
>
  <FiMail />
</a>

</div>
</div>
    </div>
  )
}