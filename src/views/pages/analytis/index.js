import { AdaptableCard } from 'components/shared'
import { useEffect, useState } from 'react'
import AnalytisForm from './components/AnalytisForm'
import { Switcher } from 'components/ui'
import { fetchGetAnalyticsVertical } from 'actions/analytic.actions'
import { useDispatch } from 'react-redux'

const Analytis = () => {
    const [ expand, setExpand ] = useState(false)
    const [autoConvert, setAutoConvert] = useState(null)
    const dispatch = useDispatch()
    const [globalData, setGlobalData] = useState([])
    const [tags, setTags] = useState([])
    const fetchGlobalData = async () => {
        const response = await dispatch(fetchGetAnalyticsVertical({}))
        setGlobalData(response.payload)
        setTags(response.payload.exclude_account)
    }

    useEffect(() => {
        fetchGlobalData()
    }, [])



    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
             <div className="flex justify-between mb-4 lg:mb-0 pb-[24px] border-b-[1px] border-solid border-[#D9D9D9]">
                <h3>Input</h3>
                <div className="flex items-center gap-x-2 text-[#262626] font-semibold">
                    <p>Convert to Follower Watch</p>
                    {Object.keys(globalData).length > 0 && <Switcher setAutoConvert={setAutoConvert} type="Input" color="[#0C72FA]" defaultChecked={globalData?.auto} />}
                </div>
            </div>
            {/* <h3 className="mb-4 lg:mb-0 pb-[24px] border-solid border-b-[1px] border-[#d9d9d9]">Input</h3> */}
            <div className='mt-[24px]'>
                {globalData && <AnalytisForm autoConvert={autoConvert} globalData={globalData} tags={tags} setTags={setTags}/>}
            </div>

        </AdaptableCard>
    )
}

export default Analytis