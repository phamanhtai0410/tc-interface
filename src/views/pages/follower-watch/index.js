import { AdaptableCard } from "components/shared"
import FollowerWatchTable from "./FollowerWatchTable"
import { useDispatch, useSelector } from "react-redux"
import { getListFollowerWatch } from "actions/user.actions";
import { useEffect, useState } from "react";
import { Pagination, Spinner, Switcher } from "components/ui";
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
        
        if (response.payload && response.payload.data.items?.length > 0) {
            setFollowerWatch(response.payload.data.items)
            setLoading(false)
        }
    }

   
    useEffect(() => {
        getFollowerWatch()
    }, [querySize.page])

    return (
        <div>
             <div className="mb-4 lg:mb-6 flex justify-between items-center">
                <h3>Follower Watch</h3>
                <div className="flex items-center gap-x-2 text-[#262626] font-semibold">
                    <p>New Follower</p>
                    <Switcher type="follower_watch" color="[#0C72FA]" followerWatch={followerWatch} lstFollowerWatch={lstFollowerWatch} setFollowerWatch={setFollowerWatch} />
                </div>
            </div>
            <div className="h-fit bg-[#fff] rounded-t-lg">
                { !loading ? <FollowerWatchTable dataList={lstFollowerWatch} getFollowerWatch={getFollowerWatch}/> : <div className="flex items-center justify-center"> <Spinner /></div> }
                {/* <div className="my-[32px] flex justify-center">
                    <Pagination currentPage={querySize.page} total={followerWatch.num_of_page} setQuerySize={setQuerySize} />
                </div> */}
            </div>
        </div>
    )
}

export default FollowerWatch
