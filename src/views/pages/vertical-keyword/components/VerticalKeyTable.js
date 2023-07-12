import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Badge } from 'components/ui'
import { DataTable } from 'components/shared'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import useThemeClass from 'utils/hooks/useThemeClass'
import { useNavigate } from 'react-router-dom'
import { productsData } from 'mock/data/salesData'
import { getListVerticalGroup, removeVertical } from 'actions/vertical.actions'
import { setEdit } from 'store/vertical/verticalSlice'
import { selectUserRole } from 'store/role/roleSlice'


const inventoryStatusColor = {
    0: {
        label: 'In Stock',
        dotClass: 'bg-emerald-500',
        textClass: 'text-emerald-500',
    },
    1: {
        label: 'Limited',
        dotClass: 'bg-amber-500',
        textClass: 'text-amber-500',
    },
    2: {
        label: 'Out of Stock',
        dotClass: 'bg-red-500',
        textClass: 'text-red-500',
    },
}

const ActionColumn = ({ row }) => {
    const dispatch = useDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()
    const user = useSelector(selectUserRole)

    const onEdit = () => {

        dispatch(setEdit(row))
    }

    const onDelete = async () => {

        const response = await dispatch(removeVertical(row._id))
        if (response.meta.requestStatus === "fulfilled") {
            alert("Remove successfully")
            window.location.reload()
        }
    }

    return (
        <div className="flex justify-around w-[200px] ml-auto">
            <span
                className="text-[#0C72FA] text-[12px] font-medium cursor-pointer"
            >
                Detail
            </span>

            {user?.roles?.length >=1 && user?.roles?.[0] !== 'users' && <>
                <span
                    className="text-[#FA8C16] text-[12px] font-medium cursor-pointer"
                    onClick={onEdit}
                >
                    Edit
                </span>
                <span
                    className="text-[#F5222D] text-[12px] font-medium cursor-pointer"
                    onClick={onDelete}
                >
                    Remove
                </span>
            </>}
            

        </div>
    )
}

// const VerticalColumn = ({ row }) => {
//     const avatar = row.img ? (
//         <Avatar src={row.img} />
//     ) : (
//         <Avatar icon={<FiPackage />} />
//     )

//     return (
//         <div className="flex items-center">
//             {/* {avatar} */}
//             <span className={`ml-2 rtl:mr-2 font-semibold`}>{row.name}</span>
//         </div>
//     )
// }

const VerticalKeyTable = ({ verticalData }) => {

    const tableRef = useRef(null)
    //load when component did mount

    const columns = useMemo(
        () => [
            {
                header: '#',
                accessorKey: 'index',
            },
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Keys',
                accessorKey: 'keywords'
            },
            {
                // header: 'Action',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
        ],
        []
    )

    const onPaginationChange = (page) => {
        // const newTableData = cloneDeep(tableData)
        // newTableData.pageIndex = page
        // dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value) => {
        // const newTableData = cloneDeep(tableData)
        // newTableData.pageSize = Number(value)
        // newTableData.pageIndex = 1
        // dispatch(setTableData(newTableData))
    }

    const onSort = (sort, sortingColumn) => {
        // const newTableData = cloneDeep(tableData)
        // newTableData.sort = sort
        // dispatch(setTableData(newTableData))
    }

    return (
        <>
            <DataTable
                ref={tableRef}
                columns={columns}
                data={verticalData}
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

export default VerticalKeyTable
