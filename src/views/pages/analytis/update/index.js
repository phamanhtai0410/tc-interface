import { AdaptableCard } from 'components/shared'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import UpdateAnalytisForm from './components/UpdateForm'

const AnalytisUpdate = () => {
    const [ expand, setExpand ] = useState(false)
    const { state } = useLocation();


    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <h3 className="mb-4 lg:mb-0">Analytics Update</h3>
            <div className='my-[48px]'>
                <UpdateAnalytisForm data = {state} />
            </div>

        </AdaptableCard>
    )
}

export default AnalytisUpdate