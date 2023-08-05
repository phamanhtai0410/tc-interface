import React, { useEffect, useMemo, useRef, useState } from 'react'
import { DataTable } from 'components/shared'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { addFollowerWatchUser, deleteFollowerWatchUser } from 'actions/user.actions'
import { actionExcluded } from 'store/excluded/excludeSlice'
import NewLabel from 'components/ui/NewLabel/NewLabel'
import PopupModal from './PopupModal'
import PopupModalTakenote from './PopupModalTakenote'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import { Table } from 'components/ui'
import { BsCheckCircle } from "react-icons/bs"
import { setNotes } from 'store/analytics/analyticSlice'
import { fetchResultAnalytic } from 'actions/analytic.actions'


const kFormatter = (num) => {
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'K' : Math.sign(num) * Math.abs(num)
}

const DetailAnalyticTable = ({ data, fetchDetailAnalytics, date, loading, setLoading }) => {
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isOpenModalNote, setIsOpenModalNote] = useState(false)
    const [checkIsDelete, setCheckIsDelete] = useState(false)
    const [username, setUsername] = useState(null)

    const dispatch = useDispatch()
    const ourRef = useRef(null)

    

    const renderBookmark = (item) => {

        const handleOpenModal = () => {
            setIsOpenModal(true)
            setCheckIsDelete(true)
            setUsername(item)
        }
        const handleAddFollowWatchUser = async (props) => {
            const payload = {
                username: props.username
            }
            const response = await dispatch(addFollowerWatchUser(payload))
            if (response.meta.requestStatus === "fulfilled") {
                // setLoading(false)
                alert("add user successfully")
                window.location.reload()
            }
        }

        if (!item.exclude_account && !item.in_watch_account) {
            return <img onClick={() => handleAddFollowWatchUser(item)} className='w-[24px] h-[24px] cursor-pointer' src="/img/analytics/metadata/box_tick.svg" alt='box_tick' />
            // return <img className='w-[24px] h-[24px] cursor-pointer' src="/img/analytics/caret-red.svg" alt='box_tick_true' />
        }
        else if (item.in_watch_account && !item.exclude_account) {
            return <img onClick={() => { handleOpenModal() }} className='w-[24px] h-[24px] cursor-pointer' src="/img/analytics/metadata/box_tick_true.svg" alt='box_tick_true' />
        }
        
        return <img className='w-[24px] h-[24px] cursor-pointer' src="/img/analytics/caret-red.svg" alt='box_tick_true' />
    }

    const columns = useMemo(
        () => [
            {
                header: '#',
                id: "id",
                accessorKey: "id",
                footer: props => props.column.id,
                enableSorting: false,
                // cell: (props) => {
                //     const row = props.row.index
                //     const check_tick = props.row.original.in_watch_account
                //     const handleAddFollowWatchUser = async(props)=>{
                //         const payload = { 
                //             username:props.row.original.username
                //         }
                //         const response = await dispatch(addFollowerWatchUser(payload))
                //         if(response.meta.requestStatus==="fulfilled"){
                //             alert("add user successfully")
                //             fetchDetailAnalytics(date)
                //         }
                //     }
                //     const handleOpenModal = () => {
                //         setIsOpenModal(true)
                //         setCheckIsDelete(true)
                //         setUsername(props.row.original)
                //     }
                //     const handleDeleteFollowWatchUser = async(props)=>{
                //          const payload = {
                //             username:props.row.original.username
                //         } 
                //          const response = await dispatch(deleteFollowerWatchUser(payload))
                //         // console.log(response)
                //         if(response.meta.requestStatus==="fulfilled"){
                //             alert("delete user succesfully")
                //             fetchDetailAnalytics()
                //         }

                //         // console.log(dateDiff);
                //         // console.log(props);
                //     }
                //     return (
                //             <div className="flex items-center">
                //                 <span className={`ml-2 rtl:mr-2 font-semibold`}>{row+1}</span>
                //                 {
                //                     check_tick ? (
                //                     <img onClick={handleOpenModal} className='w-[24px] h-[24px] ml-[20px] cursor-pointer' src="/img/analytics/metadata/box_tick_true.svg" alt='box_tick_true' />
                //                     ) 
                //                     :                                                                                                            
                //                     (
                //                         <img onClick={()=>handleAddFollowWatchUser(props)} className='w-[24px] h-[24px] ml-[20px] cursor-pointer' src="/img/analytics/metadata/box_tick.svg" alt='box_tick' />
                //                     )
                //                 }
                //                 {props.row.original.New && <NewLabel/>}
                //             </div>
                //     )
                // }
            },
            {
                header: "",
                id: "bookmark",
                accessorKey: "bookmark",
                footer: props => props.column.id,
                cell: (props) => {
                    const row = props.row.index

                    const check_tick = props.row.original.in_watch_account
                    
                    
                    const handleDeleteFollowWatchUser = async (props) => {
                        const payload = {
                            username: props.row.original.username
                        }
                        const response = await dispatch(deleteFollowerWatchUser(payload))
                        // console.log(response)
                        if (response.meta.requestStatus === "fulfilled") {
                            alert("delete user succesfully")
                        }

                        // console.log(dateDiff);
                        // console.log(props);
                    }
                    return (
                        <div className='w-fit'>
                            {renderBookmark(props.row.original)}
                            {props.row.original.New && <NewLabel />}
                        </div>
                    )

                }
            },
            {
                header: 'Username',
                id: "username",
                accessorKey: "username",
                footer: props => props.column.id,
                cell: (props) => {
                    const row = props.row.original.username
                    const handleOpenTakeNote = () => {
                        setUsername(props.row.original)
                        setIsOpenModalNote(true)
                    }

                    return (
                        <div className='group flex items-center justify-between w-36 relative'>
                            <a className='text-[#262626]' href={`https://twitter.com/${row}`} target='_blank'>{row}</a>
                            <img className='cursor-pointer' onClick={() => { handleOpenTakeNote() }} src="/img/analytics/edit_analystics.svg" alt="" />
                            <span className='group-hover:visible px-1 line-clamp-3 invisible bg-black text-[#fff] text-left absolute w-fit top-full text-[13px] right-0 rounded-md'>{props.row.original.note || " "}</span>
                        </div>
                    )
                }
            },
            // {
            //     header: 'Twitter url',
            //     accessorKey: 'twitter_url',
            //     cell: (props) => {
            //         const row = props.row.original.twitter_url
            //         return (
            //             <a className='underline text-[#0C72FA]' href={`https://twitter.com/${row}`} target='_blank'>{row}</a>
            //         ) 
            //     }
            // },
            {
                header: (props) => {
                    return (
                        <p className='text-left w-[inherit]'>Name</p>
                    )
                },
                id: "name",
                accessorKey: "name",
                footer: props => props.column.id
            },
            {
                header: "Verified",
                id: "verified",
                accessorKey: "verified",
                enableSorting: false,
                footer: props => props.column.id,
                cell: (props) => {
                    const verified = props.row.original.verified
                    const verified_type = props.row.original.verified_type
                    return (
                        <div className='flex justify-start'>
                            {verified && <BsCheckCircle size={20} color={verified_type} />}
                        </div>
                    )
                }
            },
            {
                header: "Followers Count",
                id: "followers_count",
                accessorKey: "followers_count",
                // enableSorting: false,
                footer: props => props.column.id,
                cell: (props) => {
                    return (
                        <div className='text-center'>
                            <span className='block'>{(kFormatter(props.row.original.followers_count))}</span>
                            {/* <span className='block'>following_count:{props.row.original.public_metrics.following_count}</span> */}
                        </div>
                    )
                }
            },
            {
                header: "Description",
                id: "description",
                accessorKey: "description",
                footer: props => props.column.id,
                enableSorting: false,
                cell: (props) => {
                    return (
                        <p className='text-left'>{props.row.original.description}</p>
                    )
                }
            },
            // {
            //     header:"Created at",
            //     id:"created_at",
            //     accessorKey:"created_at",
            //     footer:props=>props.column.id,
            //     cell:(props)=>{
            //         return(
            //             <span>{moment.unix(props.row.original.created_at).format('MMM YYYY')}</span>
            //         )
            //     }
            // },
            {
                header: "crawl time",
                id: "created_time",
                accessorKey: "created_time",
                footer: props => props.column.id,
                cell: (props) => {
                    return (
                        <span>{moment.unix(props.row.original.created_time).format('DD MMM YYYY')}</span>
                    )
                }
            },
            // {
            //     header: 'Keyword relevance',
            //     id: "keyword_relevance",
            //     accessorKey: "keyword_relevance",
            //     footer: props => props.column.id,
            //     cell: (props) => {
            //         return (
            //             <span className='text-center block'>{props.row.original.keyword_relevance}</span>
            //         )
            //     }
            // },
            // {
            //     header: 'Follower quality',
            //     id: "follower_quality",
            //     accessorKey: "follower_quality",
            //     footer: props => props.column.id,
            //     cell: (props) => {
            //         return (
            //             <span className='text-center block'>{props.row.original.follower_quality}</span>
            //         )
            //     }
            // },
            // {
            //     header: 'Verification status',
            //     accessorKey: 'verification_status',
            //     cell: (props) => {
            //         const row = props.row.original.public_metrics
            //         const row_key = Object.keys(row);
            //         const row_value = Object.values(row);
            //         return (
            //             <div className="grid grid-cols-1">
            //                 {
            //                     row_key.map((item, index) => (
            //                         <p className={`ml-2 rtl:mr-2`}>{item}: {row_value[index]}</p>
            //                     ))
            //                 }
            //             </div>
            //         )
            //     },
            // },

            // {
            //     header: 'Verification status',
            //     id: "verification_status",
            //     accessorKey: "verification_status",
            //     sortable: true,
            //     footer: props => props.column.id,
            //     cell: (props) => {
            //         return (
            //             <span className='text-center block'>{props.row.original.verification_status}</span>
            //         )
            //     }
            // },
            // {
            //     header: 'created_at',
            //     accessorKey: 'created_at',
            //     cell: (props) => {
            //         return moment.unix(props.row.original.created_at).format("YYYY/MM/DD")
            //     }
            // },
            {
                header: 'Recency',
                id: "recency",
                accessorKey: "recency",
                footer: props => props.column.id,
                cell: (props) => {
                    const row = props.row.original.recency
                    return (
                        <span className='text-center block'>{moment.unix(row).format('MMM YYYY')}</span>
                    )
                }
            },
            // {
            //     header: 'In watch account',
            //     id: "in_watch_account",
            //     accessorKey: "in_watch_account",
            //     footer: props => props.column.id,
            //     cell: (props) => {
            //         return (
            //             <span className='text-center block'>{props.row.original.in_watch_account.toString()}</span>
            //         )
            //     }
            // },
            {
                header: 'Score keyword relevance',
                id: "score_keyword_relevance",
                accessorKey: "score_keyword_relevance",
                footer: props => props.column.id,
                cell: (props) => {
                    return (
                        <span className='text-center block'>{props.row.original.score_keyword_relevance}</span>
                    )
                }
            },
            {
                header: 'Score follower quality',
                id: "score_follower_quality",
                accessorKey: "score_follower_quality",
                footer: props => props.column.id,
                cell: (props) => {
                    return (
                        <span className='text-center block'>{props.row.original.score_follower_quality}</span>
                    )
                }
            },
            {
                header: 'Score verification status',
                id: "score_verification_status",
                accessorKey: "score_verification_status",
                footer: props => props.column.id,
                cell: (props) => {
                    return (
                        <span className='text-center block'>{props.row.original.score_verification_status}</span>
                    )
                }
            },
            {
                header: 'Score recency',
                id: "score_recency",
                accessorKey: "score_recency",
                footer: props => props.column.id,
                cell: (props) => {
                    return (
                        <span className='text-center block'>{props.row.original.score_recency}</span>
                    )
                }
            },
            {
                header: 'Total score',
                id: "total_score",
                accessorKey: "total_score",
                footer: props => props.column.id,
                cell: (props) => {
                    return (
                        <span className='text-center block'>{props.row.original.total_score}</span>
                    )
                }
            },
        ],
        [data]
    )
    const [sorting, setSorting] = useState([{ id: "total_score", desc: true }])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
        enableSortingRemoval: false
    })


    return (
        <div>
            {/* <DataTable
                ref={tableRef}
                columns={columns}
                data={data}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                // loading={loading}
                // pagingData={tableData}
                // onPaginationChange={onPaginationChange}
                // onSelectChange={onSelectChange}
                onSort={onSort}
            /> */}

            <Table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className='border-b-[1px] border-solid border-[#e8e8e8]'>

                            {headerGroup.headers.map(header => {

                                return (
                                    <th className="bg-[#fff]" key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                {...{
                                                    className: `${header.id === 'id' ? 'ml-[22px] w-[24px]' : 'ml-[12px]'} ${header.id !== 'public_metrics' && 'flex w-24 gap-x-2'} font-semibold text-[14px] text-[#262626] capitalize cursor-pointer select-none point`,
                                                    onClick: header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {{
                                                    asc: <img className='inline rotate-180' src='/img/followerWatch/caret-down.svg' />,
                                                    desc: <img className='inline' src='/img/followerWatch/caret-down.svg' />,
                                                }[header.column.getIsSorted()]}

                                                {!header.column.getIsSorted() && header.column.id !== 'id' && header.column.id !== 'bookmark' && header.column.id !== "verified" && header.column.id !== "public_metrics" && header.column.id !== "description" && <img className='inline' src='/img/followerWatch/caret-down.svg' />}
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

                {data.length > 0 ? <tbody className='text-center font-medium'>
                    {table
                        .getRowModel()
                        .rows.slice(0, 5000)
                        .map((row, index) => {

                            return (
                                <tr key={row.id} className='relative h-24 text-left'>

                                    {row.getVisibleCells().map(cell => {
                                        return (
                                            <td className='text-[#0A203D]' key={cell.id}>
                                                {cell.column.id === 'id' ? <span className='block text-left ml-[10px]'>{index + 1}</span> : flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        )
                                    })}
                                    {row.original.New && <NewLabel />}
                                </tr>
                            )
                        })}
                </tbody> : <></>}
            </Table>


            <PopupModal setIsOpenModalNote={setIsOpenModalNote} isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} username={username} />
            <PopupModalTakenote username={username} isOpenModalNote={isOpenModalNote} setIsOpenModalNote={setIsOpenModalNote} fetchDetailAnalytics={fetchDetailAnalytics} date={date} checkIsDelete={checkIsDelete} setCheckIsDelete={setCheckIsDelete} />
        </div>
    )
}

export default DetailAnalyticTable
