import React from 'react'
import "./login.css"
import { NavLink } from 'react-router-dom';
import UseLogin from '../../../userContext/UseLogin';
const Login = () => {
  const {handleLogin
  ,dataUser,setDataUser
  } = UseLogin();


  return (
    <div className='header-login'>
      <div className='form-login'>
        <form onSubmit={handleLogin}>
          
          <div className='title-login'>
            <p>Welcome Back 👋</p>
            <span className='subtitle'>
              Please login to your account
            </span>
          </div>

          <div>
            <input 
              type="email" 
              name="email" 
              value={dataUser.email}
              placeholder='Enter your email' 
              onChange={(e) => setDataUser((prev) => ({...prev, email: e.target.value}))}
            />
          </div>

          <div>
            <input 
              type="password" 
              name="password" 
              placeholder='Enter your password' 
              value={dataUser.password}
              onChange={(e) => setDataUser((prev) => ({...prev, password: e.target.value}))}
            />
          </div>

          {/* Extra text */}
          <div className='extra-options'>
            <a href="#"><NavLink to="/forgot">Forgot password?</NavLink></a>
          </div>
          <button type="submit">Login</button>

          {/* Bottom text */}
          <div className='register-text'>
            <p>
              Don’t have an account? <a href="#"><NavLink to={"/register"}>Register</NavLink></a>
            </p>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Login