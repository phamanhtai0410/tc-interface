import { AdaptableCard } from "components/shared"
import FollowerWatchTable from "./FollowerWatchTable"
import { useDispatch, useSelector } from "react-redux"
import { getListFollowerWatch } from "actions/user.actions";
import { useEffect, useState } from "react";
import { Pagination, Spinner } from "components/ui";
import { selectFollowerWatch } from "store/followerWatch/followerWatchSlice";



const FollowerWatch = () => {


    const dispatch = useDispatch();
    const { followerWatch } = useSelector(selectFollowerWatch)
    
    const [lstFollowerWatch, setFollowerWatch] = useState(followerWatch.listFollowerWatch)
    const [loading,setLoading] = useState(false)
    const [querySize, setQuerySize] = useState({
        page: 1,
        page_size:5000
    })

    const getFollowerWatch = async () => {
        setLoading(true)
        const response = await dispatch(getListFollowerWatch({...querySize,sort_field:'total',sort_direction:'des'}))
        console.log(response)
        if (response.payload && response.payload.data.items?.length > 0) {
            setFollowerWatch(response.payload.data.items)
            setLoading(false)
        }
    }

   
    useEffect(() => {
        getFollowerWatch()
    }, [querySize.page])

    return (
        <div className="h-fit bg-[#fff] rounded-t-lg">
            {lstFollowerWatch?.length > 0 && !loading ? <FollowerWatchTable dataList={lstFollowerWatch} /> : <div className="flex items-center justify-center"> <Spinner /></div> }
            <div className="my-[32px] flex justify-center">
                <Pagination currentPage={querySize.page} total={followerWatch.num_of_page} setQuerySize={setQuerySize} />
            </div>
        </div>
    )
}

export default FollowerWatch
