import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  let [count, setCount] = useState(1)

  const addValue = () => {
    if(count >= 10){
      setCount(count = 10)
    }else {
      setCount(count+1)
    }
  }

  const removeValue = () => {
    if(count<=1) {
      setCount(count =1)
    }
    else {
      setCount(count-1)
    }

  }

  return  (
  <>
  <p>Quantity: {count}</p>
  <button onClick={addValue}>Add</button>
  <br/>

  <button onClick={removeValue}>Remove</button>
  </>
  )
}

export default App
