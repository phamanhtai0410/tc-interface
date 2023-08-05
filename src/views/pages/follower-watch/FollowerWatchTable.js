import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import NewLabel from 'components/ui/NewLabel/NewLabel'
import { deleteFollowerWatchUser } from 'actions/user.actions'
import { actionExcluded } from 'store/excluded/excludeSlice'
import PopupModal from './components/PopupModal'
import PopupModalTakenote from './components/PopupModalTakenote'





const kFormatter = (num) => {
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'K' : Math.sign(num) * Math.abs(num)
}

const FollowerWatchTable = ({ dataList, getFollowerWatch }) => {
    const dispatch = useDispatch()
    const [rowId, setRowId] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isOpenModalNote, setIsOpenModalNote] = useState(false)
    const [username, setUsername] = useState("")

    const handleValue = (value) => {
        if (Number(value) > 0) {
            return (
                <span className='w-fit mx-auto flex items-center justify-between'>
                    <img src='/img/followerWatch/caret-up.svg' />
                    <span className='text-[#00AF71] text-left ml-2'>{(value).toFixed(2)} %</span>
                </span>
            )
        }
        else if (Number(value) < 0) {
            return (
                <span className='w-fit mx-auto flex items-center justify-between'>
                    <img src='/img/followerWatch/caret-down-yellow.svg' />
                    <span className='text-[#FA8C16] text-left ml-2'>{(Math.abs(value)).toFixed(2)} %</span>
                </span>
            )
        }
        return (
            <span className='w-fit mx-auto flex items-center justify-end'>
                <span className='text-[#FA8C16] text-left ml-2'>{(value)} %</span>
            </span>
        )
    }

    const columns = useMemo(
        () => [
            {
                header: '#',
                id: "id",
                footer: props => props.column.id,
                enableSorting:false,
                accessorKey: "id"
            },
            {
                header: "",
                id: "bookmarkStatus",
                footer: props => props.column.id,
                accessorKey: "bookmarkStatus",
                cell: (props) => {
                    const handleOpenModal = () => {
                        setIsOpenModal(true)
                        setUsername(props.row.original.username)
                    }
                    return (
                        <img onClick={handleOpenModal} className='cursor-pointer w-[24px] h-[24px] mx-auto' src='/img/analytics/metadata/box_tick_true.svg' alt='bookmark icon' />
                    )
                }
            }
            ,

            {
                header: 'Account',
                id: "username",
                footer: props => props.column.id,
                accessorKey: "username",
                cell: (props) => {
                    const row = props.row.original.username
                    return (
                        <a className=' text-[#262626]' href={`https://www.twitter.com/${row}`} target='_blank'>{`${row}`}</a>
                    )
                }
            },
            {
                header: '1D %',
                footer: props => props.column.id,
                accessorKey: "percent_1d",
                cell: (props) => {
                    return (
                        <span>{handleValue(props.row.original.percent_1d)}</span>
                    )
                }

            },
            {
                header: '1D',
                id: "amount_1d",
                footer: props => props.column.id,
                accessorKey: "amount_1d",
                cell: (props) => {
                    return (
                        <span>{kFormatter(props.row.original.amount_1d)}</span>
                    )
                }
            },
            
            // {
            //     header: '3D %',
            //     footer: props => props.column.id,
            //     accessorKey: "percent_3d",
            //     cell: (props) => {
            //         return (
            //             <span>{handleValue(props.row.original.percent_3d)}</span>
            //         )
            //     }

            // },
            {
                header: '7D %',
                id: "percent_7d",
                footer: props => props.column.id,
                accessorKey: "percent_7d",
                cell: (props) => {
                    return (
                        <span>{handleValue(props.row.original.percent_7d)}</span>
                    )
                }

            },
            {
                header: '7D',
                id: "amount_7d",
                footer: props => props.column.id,
                accessorKey: "amount_7d",
                cell: (props) => {
                    return (
                        <span>{kFormatter(props.row.original.amount_7d)}</span>
                    )
                }
            },
            {
                header: '30D %',
                id: "percent_30d",
                footer: props => props.column.id,
                accessorKey: "percent_30d",
                cell: (props) => {
                    return (
                        <span>{handleValue(props.row.original.percent_30d)}</span>
                    )
                }

            },
            // {
            //     header: '1D',
            //     footer: props => props.column.id,
            //     accessorKey: "amount_1d",
            //     cell: (props) => {
            //         return (
            //             <span>{kFormatter(props.row.original.amount_1d)}</span>
            //         )
            //     }


            // },

            {
                header: '30D',
                id: "amount_30d",
                footer: props => props.column.id,
                accessorKey: "amount_30d",
                cell: (props) => {
                    return (
                        <span>{kFormatter(props.row.original.amount_30d)}</span>
                    )
                }
            },
            {
                header: 'Total',
                id: "total",
                footer: props => props.column.id,
                accessorKey: "total"
            },
        ],
        [rowId.length]
    )
    const [sorting, setSorting] = useState([{ id:'total',desc:true}])

    const [data, setData] = useState(dataList.map((item, index) => {
        return { ...item, total:(Number(item.total)) }
    }))

    useEffect(() => {
        setData(dataList.map((item, index) => {
            return { ...item, total: (Number(item.total)) }
        }))
    }, [dataList])


    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
        enableSortingRemoval:false
    })

    const renderCellValue = (cell) => {
        if (cell.row.original.id === 'id') {
            return (
                <span>{index + 1}</span>
            )
        }
    }


    return (
        <>
            <div>
                <table className='w-full text-[#262626] font-bold'>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <>
                                <tr key={headerGroup.id} className='border-b-[1px] border-solid border-[#e8e8e8]'>
                                    {headerGroup.headers.map(header => {
                                        return (
                                            <th className={`py-4 ${header.id==='id' && 'pl-2'}`} key={header.id} colSpan={header.colSpan}>
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        {...{
                                                            className: header.column.getCanSort()
                                                                ? 'cursor-pointer select-none flex items-center justify-center'
                                                                : '',
                                                            onClick: header.column.getToggleSortingHandler(),
                                                        }}
                                                    >
                                                        {{
                                                            asc: <img className='inline rotate-180' src='/img/followerWatch/caret-down.svg' />,
                                                            desc: <img className='inline' src='/img/followerWatch/caret-down.svg' />,
                                                        }[header.column.getIsSorted()]}

                                                        {!header.column.getIsSorted() && header.column.id !== 'id' && header.column.id !== "bookmarkStatus" && <img className='inline' src='/img/followerWatch/caret-down.svg' />}
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </div>
                                                )}
                                            </th>
                                        )
                                    })}
                                </tr>
                            </>

                        ))}
                    </thead>

                    <tbody className='text-center font-medium'>
                        {table
                            .getRowModel()
                            .rows.slice(0, 5000)
                            .map((row, index) => {
                                return (
                                    <>
                                        <tr key={row.id} className='relative'>
                                            {row.getVisibleCells().map(cell => {
                                                
                                                return (
                                                    <td className='py-[16px]' key={cell.id}>
                                                        {renderCellValue(cell)}
                                                        {cell.column.id === 'id' && <span className='pl-[8px]'>{index + 1}</span>}
                                                        {cell.column.id === 'total' && kFormatter(cell.row.original.total)}
                                                        {cell.column.id !== 'total' && flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </td>
                                                )
                                            })}
                                            {row.original.is_new && <NewLabel />}
                                        </tr>
                                    </>

                                )
                            })}
                    </tbody>
                </table>
            </div>
            <PopupModal setIsOpenModalNote={setIsOpenModalNote} isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} username={username} />
            <PopupModalTakenote username={username} setIsOpenModalNote={setIsOpenModalNote} isOpenModalNote={isOpenModalNote} getFollowerWatch={getFollowerWatch} />
        </>
    )
}

export default FollowerWatchTable
