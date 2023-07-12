import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Pagination } from 'components/ui'

import { AdaptableCard } from 'components/shared'
import { selectNumpagesVertical } from 'store/vertical/verticalSlice'
import FormFollowerGroup from './components/FormFollowerGroup'
import FollowerKeyTable from './components/FollowerKeyTable'
import { getListFollowerGroup } from 'actions/follower.actions'
import { selectNumpagesFollower } from 'store/follower/followerSlice'
import { selectUserRole } from 'store/role/roleSlice'
import { checkRoles } from 'utils/lib/lib'

    
const FollowerGroup = () => {

    const [querySize,setQuerySize] = useState({
        page:1,
        page_size:5000
    })
    const [followerData,setFollowerData] = useState([]);

    const dispatch = useDispatch()
    //get num page of vertical keywords 
    const numPages = useSelector(selectNumpagesFollower)
    const user = useSelector(selectUserRole)
    
    // load data
    const fetchFollowerData = async () =>{

        const response = await dispatch(getListFollowerGroup({page:querySize.page,page_size:querySize.page_size}))

        if(response.payload && response.payload.data.items.length > 0){
            const verticalDataUpdate = response.payload.data.items.map((item,index)=>(
                {...item,index: index + 1}
            ))
            setFollowerData(verticalDataUpdate)
        }
    }

    // load when component did updated

    useEffect(()=>{
        fetchFollowerData()
    },[querySize])


    return (
        <AdaptableCard className="h-full py-[24px] px-[32px]" bodyClass="h-full">
            <h3 className="mb-4 lg:mb-0">Follower Group</h3>
            <div className='my-[48px]'>
                {/* {user?.roles?.length >= 1 && user?.roles?.[0] !== 'users' && <FormFollowerGroup fetchFollowerData={fetchFollowerData} />} */}
                {checkRoles(user?.roles) && <FormFollowerGroup fetchFollowerData={fetchFollowerData} />}
            </div>

            <FollowerKeyTable followerData={followerData}/>

            <div className='flex justify-center mt-[32px]'>
                <Pagination currentPage={querySize.page} total={numPages} setQuerySize={setQuerySize}/>
            </div>

        </AdaptableCard>
    )
}

export default FollowerGroup
