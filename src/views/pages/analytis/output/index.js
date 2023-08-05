import { AdaptableCard } from 'components/shared'
import { useEffect, useState } from 'react'
import AnalyticTable from '../components/AnalyticTable'
import { fetchDetailAnalytic, fetchListAnalytic, fetchResultAnalytic } from 'actions/analytic.actions'
import { useDispatch, useSelector } from 'react-redux'
import { selectListAnalytic } from 'store/analytics/analyticSlice'
import { Pagination, Spinner } from 'components/ui'
import { useNavigate, useParams } from 'react-router-dom'
import { selectDetailAnalytic, setTabId } from 'store/analytics/analyticDetailSlice'
import { idea } from 'react-syntax-highlighter/dist/esm/styles/hljs'

const AnalytisData = () => {
  const dispatch = useDispatch();
  const [callCount, setCallCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [stateLoading, setStateLoading] = useState(false)
  // const data = useSelector(selectListAnalytic);
  const data = useSelector(selectDetailAnalytic);


  const checkResult = () => {
    return data?.items.every(item => item.status === "DONE")
  }


  const fetchAnalytics = async () => {
    await dispatch(fetchListAnalytic());
  };




  const handleDetailAnalytic = async (_id) => {

    try {
      if (_id) {
        const response = await dispatch(fetchDetailAnalytic({
          analytic_log_id: _id
        }))
      }
    } catch (e) {
      console.log("errr:", e)
    }
  }



  useEffect(() => {
    // if (data.items[0]?._id && !id) {
    //   dispatch(setTabId(data.items[0]?._id))
    //   navigate(`/pages/analytics/output/${data.items[0]?._id}`)
    //   handleDetailAnalytic(data.items[0]?._id)
    // } 
  }, [])

  


  const fetchDetailAnalytics = async () => {
    setLoading(true)
    const response = await dispatch(fetchResultAnalytic({ from_time: '1672531200', page: 1, page_size: 5000 }));
    if (response.payload && response.payload.items.length > 0) {
      setLoading(false)
      // if ((date) === 0) {
      //     setDataAnalyst(response.payload.items)
      // }
      // else{
      //     // const dataFilterDay = response.payload.items.filter(userSameDay)
      //     // setDataAnalyst(dataFilterDay)
      //     setDataTemp(response.payload.items)
      //     const dataFilterDay = response.payload.items.filter(userSameDay)
      //     setDataAnalyst(dataFilterDay)
      // }
    }
  };
  useEffect(() => {
    fetchDetailAnalytics()
  }, []);


  return (
    <div className="h-full p-0 bg-[#fff]">
      {/* <div className="lg:flex items-center justify-end mb-4">
                 table tool 
            </div> */}
      {(data.items.length > 0 && !loading) ? <AnalyticTable fetchDetailAnalytic={fetchDetailAnalytic} data={data.items} handleDetailAnalytic={handleDetailAnalytic} /> : <Spinner className="mx-auto"/>}

      {/* <div className='mt-[32px] flex justify-center'>
              <Pagination currentPage={data.page} total={data.num_of_page} setQuerySize={setQuerySize}/>
            </div> */}
    </div>
  )
}

export default AnalytisData