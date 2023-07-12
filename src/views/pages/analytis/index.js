import { AdaptableCard } from 'components/shared'
import { useState } from 'react'
import AnalytisForm from './components/AnalytisForm'

const Analytis = () => {
    const [ expand, setExpand ] = useState(false)

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <h3 className="mb-4 lg:mb-0 pb-[24px] border-solid border-b-[1px] border-[#d9d9d9]">Analytics</h3>
            <div className='mt-[24px]'>
                <AnalytisForm />
            </div>

        </AdaptableCard>
    )
}

export default Analytis