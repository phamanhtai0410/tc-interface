import React, { useEffect, useMemo, useRef, useState } from 'react'
import { DataTable } from 'components/shared'
import { useNavigate } from 'react-router-dom' 


const ActionColumn = ({ row }) => {
    const navigate = useNavigate()

    const onEdit = () => {
       navigate(`/pages/user/change-pwd/${row.id}`,{state:{row}})
    }

    const onDelete = () => {
        
    }

    return (
        <div className="flex justify-around">
            <span
                className="text-[12px] font-medium text-[#0C72FA] cursor-pointer"
                onClick={onEdit}
            >
                Change password
            </span>
            <span
                className="text-[12px] font-medium text-[#F5222D] cursor-pointer"
                onClick={onDelete}
            >
                Delete
            </span>
        </div>
    )
}


const UserTable = ({userData}) => {

    const tableRef = useRef(null)

    const columns = useMemo(
        () => [
            {
                header:"#",
                accessorKey:"index",
            
            },
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Password',
                accessorKey: 'password',
            },
            {
                header: 'Date created',
                accessorKey: 'created_time',
            },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
        ],
        []
    )

    const onPaginationChange = (page) => {
        
    }

    const onSelectChange = (value) => {
        // console.log("value change",value)
    }

    const onSort = (sort, sortingColumn) => {
        
    }

    return (
        <>
            <DataTable
                ref={tableRef}
                columns={columns}
                data={userData}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                // loading={loading}
                // pagingData={tableData}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
            />
        </>
    )
}

export default UserTable
