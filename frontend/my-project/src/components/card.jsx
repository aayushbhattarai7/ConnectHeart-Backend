import React, {useState} from 'react'
import ReactDOM from 'react-dom'


function Card(props, ) {
let [isLike, setIsLike] = useState('')
    const like = () => {
        setIsLike(isLike ===null ? "liked":null)
        
      } 
  return (

    <div> <div class="w-[300px] rounded-md border mb-4 ">
    <img
      src="https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGJsb2d8ZW58MHx8MHx8&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=60"
      alt="Laptop"
      class="h-[200px] w-full rounded-md object-cover"
    />
    <div class="p-4">
      <h1 class="text-lg font-semibold">{props.name}</h1>
      <p class="mt-3 text-sm text-gray-600">
       {props.desc}
      </p>
      <button
        type="button"
        class="mt-4 rounded-sm bg-black px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        Read
      </button>
      <button
        type="button"
        class=" ml-16 mt-4 rounded-sm bg-black px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      onClick={like}>
        Like
      </button>

      <p className='ml-28 '>{isLike}</p>

    </div>
  </div></div>
  )
}

export default Card