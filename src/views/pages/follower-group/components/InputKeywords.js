import React from 'react'
import {IoIosClose} from "react-icons/io"
const InputKeywords = ({tags, setTags}) => {
    const addTags = (e)=>{
        if(e.target.value !== ""){
            setTags([...tags,e.target.value])
            e.target.value = ""
        }
    }
    const removeTag = (index) =>{
        setTags(tags.filter((_,id)=>id!==index))
    }
  return (
    <div className='flex items-center flex-wrap min-h-[48px] px-2 border-2 border-[#E8E8E8] rounded-md bg-[#F9FAFB] mt-2'>
        <ul className='flex flex-wrap p-0 my-2 items-center'>
            {tags.map((tag,index)=>(
                <li key={index} className='w-auto h-full py-1 flex items-center gap-x-2 justify-center text-[#262626] font-medium px-2 list-none rounded m-1 border-2 border-[#E8E8E8] hover:text-[#0C72FA] hover:border-[#0C72FA] transition-all duration-500'>
                    <span>{tag}</span>
                    <IoIosClose className='block text-center text-2xl bg-white cursor-pointer' onClick={()=>removeTag(index)}/>
                </li>
            ))}
            <input type="text" className='flex-1 border-none h-full bg-[#F9FAFB] focus:outline-none my-2 mx-3' placeholder='Press enter to add tags' onKeyUp={(e)=>e.key==="Enter" ? addTags(e):null}/>
        </ul>
    </div>
  )
}

export default InputKeywords