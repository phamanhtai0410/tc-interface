import React, { useEffect, useRef, useState } from 'react'
import { Spinner, Tabs } from 'components/ui'

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { selectListAnalytic } from 'store/analytics/analyticSlice'
import { fetchDetailAnalytic, fetchListAnalytic } from 'actions/analytic.actions'
import TabList from 'components/ui/Tabs/TabList'
import TabNav from 'components/ui/Tabs/TabNav'
import OrderDetails from '../detail'
import { selectDetailAnalytic, selectIdTab, setAnalyticId, setTabId } from 'store/analytics/analyticDetailSlice'
import AccessDenied from 'views/pages/AccessDenied'
import ModalListAnalytic from '../output/components/ModalListAnalytic'




const AnalyticTable = ({ stateLoading, setStateLoading, handleDetailAnalytic, data }) => {
    const navigate = useNavigate()
    //const tableRef = useRef(null)
    const dispatch = useDispatch()
    // const top_data = data.slice(0, 5);
    const { run_id } = useParams()
    const id_tab = useSelector(selectIdTab)
    const [tabValue, setTabvalue] = useState([])
    const datafetch = useSelector(selectListAnalytic);
    const [idDetail, setIdDetail] = useState(run_id || data[0]._id)
    // const [stateLoading, setStateLoading] = useState(false)
    

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

    return (
        <>
            <div>
                <Tabs defaultValue={id_tab} variant="pill">
                    <TabList >
                        {
                            tabValue?.map((item, index) => (
                                <div className='border-r-[1px] border-[#E8E8E8]'>
                                    <TabNav
                                        className={(item._id?.toLowerCase() === idDetail?.toLowerCase()) ? `bg-[#1890FF] text-[#FFFFFF] ` : 'bg-transparent text-[#262626]'}
                                        value={item._id}
                                        key={index}
                                        onClick={() => {
                                            handleDetail(item._id)
                                            handleRunAgainById(item)
                                        }}
                                    // onClick={() => handleDetail(item)}
                                    >
                                        {
                                            (item.status !== "DONE") && (
                                                <Spinner className="mr-[12px]" />
                                            )
                                        }
                                        {item.vertical_name}
                                    </TabNav>
                                </div>
                            ))                            
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
                    <div className="p-4">
                        {

                            // data_detail?.items.length !=0 ? (
                            //     <OrderDetails run_id={run_id} handleRunAgain={handleRunAgain} />
                            // ): (
                            //     <AccessDenied handleRunAgain={handleRunAgain} />
                            // )
                            <OrderDetails run_id={run_id} handleRunAgain={handleRunAgain} />
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
