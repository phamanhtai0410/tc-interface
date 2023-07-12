import { AdaptableCard } from 'components/shared'
import { useEffect, useState } from 'react'
import AnalyticTable from '../components/AnalyticTable'
import { fetchDetailAnalytic, fetchListAnalytic } from 'actions/analytic.actions'
import { useDispatch, useSelector } from 'react-redux'
import { selectListAnalytic } from 'store/analytics/analyticSlice'
import { Pagination } from 'components/ui'
import { useNavigate, useParams } from 'react-router-dom'
import { setTabId } from 'store/analytics/analyticDetailSlice'
import { idea } from 'react-syntax-highlighter/dist/esm/styles/hljs'

const AnalytisData = () => {
  const dispatch = useDispatch();
  const [callCount, setCallCount] = useState(0)

  const navigate = useNavigate()
  const [stateLoading, setStateLoading] = useState(false)
  const data = useSelector(selectListAnalytic);

  const checkResult = () => {
    console.log(data?.items.every(item => item.status === "DONE"))
    return data?.items.every(item => item.status === "DONE")
  }


  const fetchAnalytics = async () => {
    await dispatch(fetchListAnalytic());
  };

  const max_count = 50;
  useEffect(() => {
    const interval = setInterval(() => {
      // Gọi API ở đây
      if (callCount > 0) {
        fetchAnalytics()
        checkResult()
        setCallCount(prevCount => prevCount + 1);
      }
      if (checkResult()) {
        clearInterval(interval);
      }
    }, 20000);
    return () => {
      clearInterval(interval);
    };
  }, [callCount]);



  useEffect(() => {
    if (callCount === 0) {
      fetchAnalytics()
      setCallCount(prevCount => prevCount + 1);
    }
  },[])


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


  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      {/* <div className="lg:flex items-center justify-end mb-4">
                 table tool 
            </div> */}
      {data.items.length > 0 && <AnalyticTable data={data.items} handleDetailAnalytic={handleDetailAnalytic} />}

      {/* <div className='mt-[32px] flex justify-center'>
              <Pagination currentPage={data.page} total={data.num_of_page} setQuerySize={setQuerySize}/>
            </div> */}
    </AdaptableCard>
  )
}

export default AnalytisData