import React, { useEffect, useMemo, useRef } from 'react'
import { DataTable } from 'components/shared'
import moment from 'moment'

const DetailAnalyticTable = ({data}) => {

    const tableRef = useRef(null)
    const columns = useMemo(
        () => [
            {
                header: '#',
                cell: (props) => {
                    const row = props.row.index
                    const check_tick = props.row.original.in_watch_account
                    
                    return (
                            <div className="flex items-center">
                                <span className={`ml-2 rtl:mr-2 font-semibold`}>{row+1}</span>
                                
                                {
                                    check_tick ? (
                                        <img className='w-[24px] h-[24px] ml-[20px] cursor-pointer' src="/img/analytics/metadata/box_tick_true.svg" alt='box_tick_true' />
                                    ) 
                                    : 
                                    (
                                        <img className='w-[24px] h-[24px] ml-[20px] cursor-pointer' src="/img/analytics/metadata/box_tick.svg" alt='box_tick' />
                                    )
                                }
                                
                            </div>
                    )
                }
            },
            {
                header: 'Username',
                accessorKey: 'username',
                cell: (props) => {
                    const row = props.row.original.username
                    return (
                        <a className='text-[#262626]' href={`https://twitter.com/${row}`} target='_blank'>{row}</a>
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
                header: 'Keyword relevance',
                accessorKey: 'keyword_relevance',
            },
            {
                header: 'Follower quality',
                accessorKey: 'follower_quality',
            },
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
            
            {
                header: 'Verification status',
                accessorKey: 'verification_status',
                sortable: true,
            },
            // {
            //     header: 'created_at',
            //     accessorKey: 'created_at',
            //     cell: (props) => {
            //         return moment.unix(props.row.original.created_at).format("YYYY/MM/DD")
            //     }
            // },
            {
                header: 'Recency',
                accessorKey: 'recency',
                cell: (props) => {
                    const row = props.row.original.recency
                    return (
                        <span>{moment.unix(row).format('MMM YYYY')}</span>
                    )
                }
            },
            {
                header: 'In watch account',
                accessorKey: 'in_watch_account',
            },
            {
                header: 'Score keyword relevance',
                accessorKey: 'score_keyword_relevance',
            },
            {
                header: 'Score follower quality',
                accessorKey: 'score_follower_quality',
            },
            {
                header: 'Score verification status',
                accessorKey: 'score_verification_status',
            },
            {
                header: 'Score recency',
                accessorKey: 'score_recency',
            },
            {
                header: 'Total score',
                accessorKey: 'total_score',
            },
        ],
        []
    )

    return (
        <>
            <DataTable
                ref={tableRef}
                columns={columns}
                data={data}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                // loading={loading}
                // pagingData={tableData}
                // onPaginationChange={onPaginationChange}
                // onSelectChange={onSelectChange}
                // onSort={onSort}
            />
            
        </>
    )
}

export default DetailAnalyticTable
