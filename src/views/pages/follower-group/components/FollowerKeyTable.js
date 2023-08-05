import React, { useEffect, useMemo, useRef, useState } from 'react'
import { DataTable } from 'components/shared'
import { useDispatch, useSelector } from 'react-redux'
import useThemeClass from 'utils/hooks/useThemeClass'
import { useNavigate } from 'react-router-dom'
import { removeFollower } from 'actions/follower.actions'
import { setEditFollower } from 'store/follower/followerSlice'
import { selectUserRole } from 'store/role/roleSlice'
import Keywords from './Keywords'
import PopupDelete from './PopupDelete'

const ActionColumn = ({ row,setIsOpenModal,setGroupName }) => {
    const dispatch = useDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()
    const user = useSelector(selectUserRole)


    const onEdit = () => {
        dispatch(setEditFollower(row))
    }

    const onDelete = async () => {
        const response = await dispatch(removeFollower(row._id))
       if(response.meta.requestStatus==="fulfilled"){
            alert("Remove successfully")
            window.location.reload()
       }
    }
    const handleOpenModal = ()=>{
        setIsOpenModal(true)
        setGroupName({
            name:row.name,
            id:row._id
        })
    }
    return (
        <div className="flex w-[150px] ml-auto gap-4">
           
            
            {user?.roles?.length >= 1 && user?.roles?.[0] !== 'users' && <>
                <span
                    className="text-[#FA8C16] text-[12px] font-medium cursor-pointer"
                    onClick={onEdit}
                >
                    Edit
                </span>
                <span
                    className="text-[#F5222D] text-[12px] font-medium cursor-pointer"
                    onClick={handleOpenModal}
                >
                    Remove
                </span>
            </>}
            
        </div>
    )
}

const AccountComponent = ({row}) => {
   
    return <div className='w-[600px]'>
        {row.accounts.toString().replace('\n',',')}
    </div>
}

const FollowerGroupNameComponent = ({ row }) => {
    
    return (
        <div className='w-[150px]'>
            {row.name}
        </div>
    )
}


const FollowerKeyTable = ({followerData,fetchFollowerData}) => {
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [groupName, setGroupName] = useState({
        name:"",
        id:""
    })
    const tableRef = useRef(null)
    //load when component did mount
   
    const columns = useMemo(
        () => [
            {
                header: '#',
                accessorKey: 'index',
            },
            {
                header: 'Follower Group Name',
                accessorKey: 'name',
                cell: (props) => <FollowerGroupNameComponent row={props.row.original} />
            },
            {
                header: 'Follower Accounts',
                accessorKey: 'accounts',
                cell: (props) => {
                    return(
                        <Keywords keywords={props.row.original.accounts}/>
                        // <AccountComponent row={props.row.original} />
                    )
                }
            },
            {
                // header: 'Action',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} setIsOpenModal={setIsOpenModal} setGroupName={setGroupName}/>,
            },
        ],
        []
    )

    const onPaginationChange = (page) => {
    }

    const onSelectChange = (value) => {
    }

    const onSort = (sort, sortingColumn) => {
    }

    return (
        <>
            <DataTable
                ref={tableRef}
                columns={columns}
                data={followerData}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                // loading={loading}
                // pagingData={tableData}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
            />
            <PopupDelete fetchFollowerData={fetchFollowerData} isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} groupName={groupName}/>
        </>
    )
}

export default FollowerKeyTable
