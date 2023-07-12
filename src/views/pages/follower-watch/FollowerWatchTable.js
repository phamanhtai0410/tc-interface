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





const kFormatter = (num) => {
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'K' : Math.sign(num) * Math.abs(num)
}

const FollowerWatchTable = ({ dataList }) => {

    const [rowId, setRowId] = useState([]);


    const handleValue = (value) => {
        if (Number(value) > 0) {
            return (
                <span className='w-[75px] mx-auto flex items-center justify-between'>
                    <img src='/img/followerWatch/caret-up.svg' />
                    <span className='text-[#00AF71] text-left'>{(value).toFixed(2)} %</span>
                </span>
            )
        }
        else if (Number(value) < 0) {
            return (
                <span className='w-[75px] mx-auto flex items-center justify-between'>
                    <img src='/img/followerWatch/caret-down-yellow.svg' />
                    <span className='text-[#FA8C16] text-left'>{(Math.abs(value)).toFixed(2)} %</span>
                </span>
            )
        }
        return (
            <span className='w-[75px] mx-auto flex items-center justify-end'>
                <span className='text-[#FA8C16] text-left'>{(value)} %</span>
            </span>
        )
    }

    const columns = useMemo(
        () => [
            {
                header: '#',
                footer: props => props.column.id,
                accessorKey: "id"
            },
            {
                header: "",
                footer: props => props.column.id,
                accessorKey: "bookmarkStatus",
                cell: (props) => {

                    // const handleWatchList = () => {
                    //     const rowListId = [...rowId];
                    //     const index = rowListId.findIndex(row => row.id === props.row.original.id);
                    //     if(index === -1)
                    //     {
                    //         rowListId.push(props.row.original.id)
                    //         setRowId(rowListId)
                    //     } else{
                    //         rowListId.splice(index,1)
                    //         setRowId(rowListId)
                    //     }
                    // }
                    // const handleRemoveList = () => {
                        
                    // }
                    return (
                        <img className='cursor-pointer w-[24px] h-[24px] mx-auto' src='/img/analytics/metadata/box_tick_true.svg' alt='bookmark icon' />
                    )
                }
            }
            ,
            {
                header: 'Account',
                footer: props => props.column.id,
                accessorKey:"username",
                cell: (props) => {
                    const row = props.row.original.username
                    return (
                        <Link className=' text-[#262626]' to={`https://twitter.com/${row}`} target='_blank'>{`@${row}`}</Link>
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
                header: '3D %',
                footer: props => props.column.id,
                accessorKey: "percent_3d",
                cell: (props) => {
                    return (
                        <span>{handleValue(props.row.original.percent_3d)}</span>
                    )
                }

            }, {
                header: '7D %',
                footer: props => props.column.id,
                accessorKey: "percent_7d",
                cell: (props) => {
                    return (
                        <span>{handleValue(props.row.original.percent_7d)}</span>
                    )
                }

            }, {
                header: '1D',
                footer: props => props.column.id,
                accessorKey: "amount_1d",
                cell: (props) => {
                    return (
                        <span>{kFormatter(props.row.original.amount_1d)}</span>
                    )
                }


            }, {
                header: 'Total',
                footer: props => props.column.id,
                accessorKey: "total"
            },
        ],
        [rowId.length]
    )
    const [sorting, setSorting] = useState([])
    const [data, setData] = useState(dataList.map((item, index) => {
        return { ...item,id: index+1,total:kFormatter(Number(item.total))}
    }))

    useEffect(() => {
        setData(dataList.map((item, index) => {
            return { ...item, id: index + 1, total: kFormatter(Number(item.total)) }
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
    })

   


    return (
        <>
            <div>
                <table className='w-full text-[#262626] font-bold'>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            
                            <tr key={headerGroup.id} className='border-b-[1px] border-solid border-[#e8e8e8]'>
                                {headerGroup.headers.map(header => {
                                    
                                    return (
                                        <th className='py-4' key={header.id} colSpan={header.colSpan}>
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

                                                    {!header.column.getIsSorted() && header.column.id !== 'id' && header.column.id !== 'username' && header.column.id !== "bookmarkStatus" && <img className='inline' src='/img/followerWatch/caret-down.svg' />}
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
                        ))}
                    </thead>

                    <tbody className='text-center font-medium'>
                        {table
                            .getRowModel()
                            .rows.slice(0, 5000)
                            .map(row => {
                                return (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => {
                                            return (
                                                <td className='py-[16px]' key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default FollowerWatchTable
