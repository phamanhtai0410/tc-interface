import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Pagination } from 'components/ui'

import { getListVerticalGroup } from 'actions/vertical.actions'

import { AdaptableCard } from 'components/shared'
import FormVarticalGroup from './components/FormVarticalGroup'
import VerticalKeyTable from './components/VerticalKeyTable'
import { selectNumpagesVertical, selectOpenModalAddKey } from 'store/vertical/verticalSlice'
import ModalAddKeyVertical from './components/ModalAddKeyVertical'
import { checkRoles } from 'utils/lib/lib'
import { selectUserRole } from 'store/role/roleSlice'

    
const VerticalKeyword = () => {

    const [querySize,setQuerySize] = useState({
        page:1,
        page_size:5000
    })
    const [verticalData,setVerticalData] = useState([]);

    const dispatch = useDispatch()
    //get num page of vertical keywords 
    const numPages = useSelector(selectNumpagesVertical)
    const user = useSelector(selectUserRole)
    // load data
    const fetchVerticalData = async () =>{
        const response = await dispatch(getListVerticalGroup({page:querySize.page,page_size:querySize.page_size}))

        if(response.payload && response.payload.data.items.length > 0){
            const verticalDataUpdate = response.payload.data.items.map((item,index)=>(
                {...item,index: index + 1}
            ))
            setVerticalData(verticalDataUpdate)
        }
    }

    // load when component did updated

    useEffect(()=>{
        fetchVerticalData()
    },[querySize.page])





    return (
        <div className="h-full" bodyClass="h-full">
            <div className='bg-[#fff] mb-[32px] py-[24px] px-[32px] rounded-lg shadow-[0_4px_20px_0_rgba(0,0,0,0.03)]'>
                <h3 className="mb-4 lg:mb-6">Keyword Group</h3>
                <hr />
                <div className='my-[48px]'>
                    {checkRoles(user?.roles) && <FormVarticalGroup fetchVerticalData={fetchVerticalData} />}
                </div>
            </div>
            <div className='bg-[#fff] shadow-[0_4px_20px_0_rgba(0,0,0,0.03)]'>
                <VerticalKeyTable verticalData={verticalData} fetchVerticalData={fetchVerticalData} />
            </div>
        </div>
    )
}

export default VerticalKeyword
