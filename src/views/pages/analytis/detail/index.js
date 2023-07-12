import { AdaptableCard } from "components/shared"
import { Container } from "postcss"
import { useDispatch, useSelector } from "react-redux";
import { selectDetailAnalytic, selectIdAnalytic, selectIdTab, selectNumOfPage } from "store/analytics/analyticDetailSlice";
import DetailAnalyticTable from "./components/DetailTable";
import { Notification, Pagination, toast } from "components/ui";
import { useEffect, useState } from "react";
import { exportDetailAnalytic, fetchDetailAnalytic, fetchResultAnalytic, runAnalyticsVerticalAction } from "actions/analytic.actions";
import appConfig from "configs/app.config";

const baseURL = appConfig.apiPrefix

const OrderDetails = ({ handleRunAgain, run_id }) => {
    const dispatch = useDispatch();
    
    const id_tab = useSelector(selectIdTab)
    const analytic = useSelector(selectIdAnalytic)

    const [querySize,setQuerySize] = useState({
        page:1,
        page_size:1000
    })

    // useEffect(() => {
    //     fetchDetailAnalytics();
    // }, [querySize]);

    // const fetchDetailAnalytics = async () => {
    //     await dispatch(fetchDetailAnalytic({ analytic_log_id: run_id, page: querySize.page, page_size: querySize.page_size }));
    // };
    // const data = useSelector(selectDetailAnalytic);

    useEffect(() => {
        fetchDetailAnalytics();
    }, [querySize]);

    const fetchDetailAnalytics = async () => {
        await dispatch(fetchResultAnalytic({ from_time:'1672531200', page: querySize.page, page_size: querySize.page_size }));
    };
    const data = useSelector(selectDetailAnalytic);

    const num_of_page = useSelector(selectNumOfPage)

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
             <div className="lg:flex items-center justify-end mb-4 gap-x-[24px]">
                
                <a 
                    className="flex flex-row gap-x-[8px] border-[1px] rounded-[4px] border-[#0C72FA] px-[16px] py-[8px] text-[#0C72FA] cursor-pointer"
                    onClick={() => handleRunAgain(analytic)}
                >
                    <img src="/img/analytics/metadata/logo_run_again.svg" alt='logo_run_again' />
                    Run Again
                </a>

                <a 
                    className="flex flex-row gap-x-[8px] border-[1px] rounded-[4px] border-[#0C72FA] px-[16px] py-[8px] text-[#0C72FA] cursor-pointer"
                    href={`${baseURL}/analytics/vertical/result/export?analytic_log_id=${id_tab}`}
                    target="_blank"
                >
                    <img src="/img/analytics/metadata/logo_export.svg" alt='logo_export' />
                    Export CSV
                </a>

            </div>
            <DetailAnalyticTable data={data.items}/>

            {/* <div className='mt-[32px] flex justify-center'>
              <Pagination currentPage={data.page} total={data.num_of_page} setQuerySize={setQuerySize}/>
            </div> */}
        </AdaptableCard>
    )
}

export default OrderDetails