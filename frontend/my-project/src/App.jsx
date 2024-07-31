import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from './components/card'

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
     <h1 className='bg-green-500 text-black rounded-xl mb-4 ,'>Hello</h1>
    <Card desc ="MacBook Macbook macbook macbook" name= "Mackboom"/>
    </>
  )
}

export default App
