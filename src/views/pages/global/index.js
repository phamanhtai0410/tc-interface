import { AdaptableCard } from 'components/shared'
import { useState } from 'react'
import GlobalForm from './components/GlobalForm'

const Global = () => {
    const [ expand, setExpand ] = useState(false)

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <h3 className="mb-4 lg:mb-0 pb-[24px] border-b-[1px] border-solid border-[#D9D9D9]">Analytics</h3>
            <div>
               <GlobalForm />
            </div>
        </AdaptableCard>
    )
}

export default Global