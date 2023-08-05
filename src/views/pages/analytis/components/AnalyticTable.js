import React, { useEffect, useRef, useState } from 'react'
import { Spinner, Tabs } from 'components/ui'

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { selectListAnalytic } from 'store/analytics/analyticSlice'
import TabList from 'components/ui/Tabs/TabList'
import TabNav from 'components/ui/Tabs/TabNav'
import OrderDetails from '../detail'
import { selectDetailAnalytic, selectIdTab, setAnalyticId, setTabId } from 'store/analytics/analyticDetailSlice'
import AccessDenied from 'views/pages/AccessDenied'
import ModalListAnalytic from '../output/components/ModalListAnalytic'
import moment from 'moment'




const AnalyticTable = ({ stateLoading, setStateLoading, handleDetailAnalytic, data, loading, setLoading, fetchDetailAnalytic }) => {
    const theDateToday = new Date()
    var formattedDate = theDateToday.getTime()/1000;
    const navigate = useNavigate()
    //const tableRef = useRef(null)
    const dispatch = useDispatch()
    // const top_data = data.slice(0, 5);
    /** */
    const { run_id } = useParams()
    const id_tab = useSelector(selectIdTab)
    const [tabValue, setTabvalue] = useState([])
    const datafetch = useSelector(selectListAnalytic);
    const [idDetail, setIdDetail] = useState(run_id || data[0]._id)
    const [date, setDate] = useState(0)
    //--- Temporary not use ---
    /** */

    // const [stateLoading, setStateLoading] = useState(false)
    const [tabDays,setTabDays] = useState([])
    const [hashId, setHashId] = useState(6)
    
    const getListDayWithin5days = () => {
        let currentDate = new Date();
        
        // Create an array to store the result
        let daysWithin5DaysBefore = [];

        // Loop through the past 5 days
        for (let i = 0; i < 5; i++) {
            // Calculate the date by subtracting the number of days
            let date = new Date();
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            date.setDate(currentDate.getDate() - i);

            // Add the date to the array
            daysWithin5DaysBefore.push({ id: i, value: moment(date).format("DD/MM/YYYY"),timestamp: date.getTime() });
        }
        daysWithin5DaysBefore.splice(0, 0, { id: 6, value: 'All',timestamp:null })
        // Print the list of dates
        setTabDays(daysWithin5DaysBefore)
    }

    useEffect(() => {
        getListDayWithin5days()
    }, [])

    useEffect(() => {
        if (idDetail) {
            navigate(`/pages/analytics/output/${idDetail}`)
        }
    },[idDetail])
    
    
    useEffect(() => {
        if (idDetail) {

            handleDetailAnalytic(idDetail)
        }
    },[])


    useEffect(() => {
        setTabvalue(datafetch?.items?.slice(0, 5))
        dispatch(setAnalyticId(datafetch?.items[0]))
    },[datafetch])

    

    const handleDetail = async (id) => {
        
        navigate(`/pages/analytics/output/${id}`)

        // setStateLoading(true)
        setIdDetail(id)

        dispatch(setTabId(id))
        handleDetailAnalytic(id)
        
    }

    const handleRunAgainById = (item) => {
        dispatch(setAnalyticId(item))
    }

    // const [ modalAdd, setModalAdd ] = useState(false)

    const data_detail = useSelector(selectDetailAnalytic);

    const [trigger, setTrigger] = useState(0);
    
    const handleOpenDialog = () => {
        setTrigger((trigger) => trigger + 1)
    }
    
    const handleAddTab = (row) => {
        
            if(tabValue.indexOf(row) === -1) {
                setTabvalue(current => [...current, row])
            }
        
    }

    

    const handleRunAgain = async (item) => {
        navigate(`/pages/analytis/update/${item.analytics_id}`, {
            state: item
        })
    }

    const handleSetHashId = (item) => {
        setHashId(item.id)
        setDate(item.timestamp/1000)
    }

    return (
        <>
            <div>
                <Tabs defaultValue={id_tab} variant="pill">
                    <TabList className="border-solid border-b-[1px] border-[#e8e8e8]">
                        {
                            <div className='text-[#9A9FA5] font-semibold text-[14px]'>
                                {tabDays.map((tab, index) => {
                                    return (
                                        <span onClick={()=>{handleSetHashId(tab)}} key={index} className={`${tab.id === hashId ? 'text-[#1890FF] bg-[#FFFFFF] border-b-[1px] border-[#1890FF] border-solid rounded-none' : ''} py-[10px] inline-block px-[30px] cursor-pointer font-bold`}>
                                            { tab.id === 0 ? 'Today' : tab.value}
                                        </span>
                                    )
                                })}
                            </div>
                           
                        }

                        {
                            datafetch?.items?.length>5 && (
                                <div className='cursor-pointer ml-[24px]'
                                    onClick={() => handleOpenDialog()}
                                >
                                    More
                                </div>
                            )
                        }
                        
                    </TabList>
                    <div className="py-4">
                        {

                            // data_detail?.items.length !=0 ? (
                            //     <OrderDetails run_id={run_id} handleRunAgain={handleRunAgain} />
                            // ): (
                            //     <AccessDenied handleRunAgain={handleRunAgain} />
                            // )
                            <OrderDetails run_id={run_id} handleRunAgain={handleRunAgain} loading={loading} setLoading={setLoading} fetchDetailAnalytics={fetchDetailAnalytic} date={date}/>
                        }
                        
                    </div>
                </Tabs>

                <div>
                    {
                        stateLoading && (

                            <div
                                className="fixed justify-center items-center flex bg-black/[0.7] overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none"

                            >
                                <div className="absolute w-auto my-6 z-[9999] mx-auto max-w-3xl">
                                    <Spinner size="3.25rem" />
                                </div>
                            </div>
                        )
                    }
                
                </div>
                <ModalListAnalytic props={{trigger, handleAddTab}} />
            </div>
            
        </>
    )
}

export default AnalyticTable
