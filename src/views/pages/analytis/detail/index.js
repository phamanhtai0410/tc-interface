import { AdaptableCard } from "components/shared"
import { Container } from "postcss"
import { useDispatch, useSelector } from "react-redux";
import { selectDetailAnalytic, selectIdAnalytic, selectIdTab, selectNumOfPage } from "store/analytics/analyticDetailSlice";
import DetailAnalyticTable from "./components/DetailTable";
import { Notification, Pagination, Spinner, Switcher, toast } from "components/ui";
import { useEffect, useState } from "react";
import { exportDetailAnalytic, fetchDetailAnalytic, fetchResultAnalytic, runAnalyticsVerticalAction } from "actions/analytic.actions";
import appConfig from "configs/app.config";
import moment from "moment";
import BtnExportCSV from "./components/BtnExport";

const baseURL = appConfig.apiPrefix

const OrderDetails = ({ run_id, date, fetchDetailAnalytics, loading, setLoading }) => {
  
    const data = useSelector(selectDetailAnalytic);

    const [dataAnalyst, setDataAnalyst] = useState(data.items)
    const [dataTemp, setDataTemp] = useState(dataAnalyst)
    const [flag, setFlag] = useState(false);

    const [querySize,setQuerySize] = useState({
        page:1,
        page_size:1000
    })

    useEffect(() => {
        setDataAnalyst(data.items)
    },[data.items])

    
    const userSameDay = (data)=>{
        const recency = data.created_time;
        return recency >= date;
    }
    
    useEffect(()=>{
        if(date === 0){
            setDataAnalyst(data.items)
        }else{
            const dataFilterDay = dataTemp.filter(userSameDay)
            setDataAnalyst(dataFilterDay)
        }
    }, [date])


    return (
        <div className="h-full" bodyClass="h-full">
            <div className={`${dataAnalyst?.length>0 || flag ? 'justify-between' : 'justify-end'} flex items-center lg:px-[32px] px-4`}>
                {(dataAnalyst && dataAnalyst.length > 0 || flag) && <div className="flex items-center space-x-4">
                    <span className="text-[#262626] font-semibold text-[14px]">Follower Watch</span>
                    <Switcher setFlag={setFlag} date={date} dataTemp={dataTemp} dataAnalyst={dataAnalyst} setDataAnalyst={setDataAnalyst} defaultChecked={false} type="filter_analytics" />
                </div>}
                <div className="lg:flex items-center justify-end mb-4 gap-x-[24px]">
                    <BtnExportCSV dataAnalyst={dataAnalyst} />
                </div>
            </div>
                <div className="relative">
                    <DetailAnalyticTable data={dataAnalyst} fetchDetailAnalytics={fetchDetailAnalytics} date={date} loading={loading} setLoading={setLoading} />
                    {(dataAnalyst.length === 0 || dataTemp.length === 0) && <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">No data</p>} 
                </div>
                
               
            {/* <DetailAnalyticTable querySize={querySize} data={data.items} fetchDetailAnalytics={fetchDetailAnalytics}/> */}

            {/* <div className='mt-[32px] flex justify-center'>
              <Pagination currentPage={data.page} total={data.num_of_page} setQuerySize={setQuerySize}/>
            </div> */}
        </div>
    )
}

export default OrderDetails