import React from 'react'

const Keywords = ({keywords}) => {
  return (
    <div className='flex flex-wrap gap-2 w-[600px]'>
        {keywords.map((keyword, index)=>(
            <div key={index} className='px-2 py-1 rounded border-2 border-[#E8E8E8]'>{keyword}</div>
        ))}
    </div>
  )
}

export default Keywords