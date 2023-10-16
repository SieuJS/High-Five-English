import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ButtonAppBar from './components/navigations/app-bar'
import Button from '@mui/material/Button'
import Home from './components/pages/Home'
import Auth from './components/users/auth'

import {BrowserRouter,Routes, Route} from 'react-router-dom'
function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <>
    <ButtonAppBar/>
    <Routes>
      <Route path = "/" element = {<Home/>}>
      </Route>
      <Route path = "/login" element = {<Auth/>}></Route>
    </Routes>
      
    </>
    </BrowserRouter>
  )
}

export default App