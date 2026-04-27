import React from 'react'
import "./Navbar.css"
const Navbar = () => {
  return (
    <>
      <div className='container header'>
        <div className='header-profile'>
          <img src="https://via.placeholder.com/40" alt="Profile" />
          <span className='header-profile-text'>
            <span>BrewHaven</span>
            <span>Specialty Coffee market</span>
          </span>
        </div>
        <div className="header-body">
          <ul>
            <li>Home</li>
            <li>Shop</li>
            <li>About</li>
            <li>Contact</li>
            <li>Profile</li>
          </ul>
        </div>
        <div  className="header-search">
          <div>
            <input type="text" placeholder='Search...' />
            <button>Search</button>
          </div>
          <div>
            <button>Cart (0)</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar