import moment from "moment";
import React, { useEffect, useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";


const kFormatter = (num) => {
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'K' : Math.sign(num) * Math.abs(num)
}

const BtnExportCSV = (props) => {
    
    const { dataAnalyst } = props;
   
    const headers = [
        { label: 'ID', key: 'id' },
        { label: 'UserName', key: 'username' },
        { label: 'Name', key: 'name' },
        { label: 'Verified', key: 'verified' },
        { label: 'Followers Count', key: 'public_metrics' },
        { label: 'Description', key:'description' },
        { label: 'Crawl Time', key: 'created_time' },
        { label: 'Keyword Relevance', key: 'keyword_relevance' },
        { label: 'Follower Quality', key: 'follower_quality' },
        { label: 'Verification Status', key: 'verification_status' },
        { label: 'Recency', key: 'recency' },
        { label: 'In Watch Account', key: 'in_watch_account' },
        { label: 'Score Keyword Relevance', key: 'score_keyword_relevance' },
        { label: 'Score Follower Quality', key: 'score_follower_quality' },
        { label: 'Score Verification Status', key: 'score_verification_status' },
        { label: 'Score Recency', key: 'score_recency' },
        { label: 'Total Score', key: 'total_score' },



    ];

    return (
        <>
            <CSVLink
                data={dataAnalyst.map((item, index) => {
                    return {
                        ...item,
                        id:index+1,
                        friendship: item.friendship.flat(),
                        public_metrics: kFormatter(item.public_metrics.followers_count),
                        updated_at: moment.unix(item.updated_at).format('DD/MM/YYYY'),
                        created_time: moment.unix(item.created_time).format('DD/MM/YYYY'),
                        update_time: moment.unix(item.update_time).format('DD/MM/YYYY'),
                        recency: moment.unix(item.recency).format('DD/MM/YYYY'),
                    }
                })}
                headers={headers}
                filename={"analytics.csv"}
                className={`${dataAnalyst.length > 0 ? 'cursor-pointer' : 'opacity-50 pointer-events-none'} flex flex-row gap-x-[8px] border-[1px] rounded-[4px] border-[#0C72FA] px-[16px] py-[8px] text-[#0C72FA]`}>
                <img src="/img/analytics/metadata/logo_export.svg" alt='logo_export' />
                Export CSV
            </CSVLink>
        </>
        
    )
}
export default BtnExportCSV;