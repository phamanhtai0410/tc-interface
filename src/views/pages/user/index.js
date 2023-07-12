import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'

import { getListUsersAction } from 'actions/user.actions'
import { selectNumPagesUsers, selectUsers } from 'store/users/usersSlice'

import { AdaptableCard } from 'components/shared'
import UserTable from './components/UserTable'
import { Pagination } from 'components/ui'


const UsertList = () => {

    const dispatch = useDispatch()
    const num_page_list_user = useSelector(selectNumPagesUsers)
    const [querySize,setQuerySize] = useState({
        page:1,
        page_size:5000
    })
    // const [userData,setUserData] = useState([])
    const userData = useSelector(selectUsers)?.map((item, index) => {
        return {
            ...item,
            id: item._id,
            index: index + 1,
            created_time: moment.unix(item.created_time).format("YYYY/MM/DD")
            }
    })

    const getListUsers = async () =>{
        const response = await dispatch(getListUsersAction({ page: querySize.page, page_size: querySize.page_size }))
        return response;
    }

    useEffect(()=>{
        getListUsers()
    },[querySize])



    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-end mb-4">
            </div>
            <UserTable userData={userData}/>

            <div className='mt-[32px] flex justify-center'>
                <Pagination currentPage={querySize.page} total={num_page_list_user} setQuerySize={setQuerySize}/>
            </div>

        </AdaptableCard>
    )
}

export default UsertList
