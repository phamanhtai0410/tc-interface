import { AdaptableCard } from 'components/shared'
import { useState } from 'react'
import GlobalForm from './components/GlobalForm'
import { Switcher } from 'components/ui'

const Global = () => {
    const [ expand, setExpand ] = useState(false)

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex justify-between mb-4 lg:mb-0 pb-[24px] border-b-[1px] border-solid border-[#D9D9D9]">
                <h3>Global Setting</h3>
                <div className="flex items-center gap-x-2 text-[#262626] font-semibold">
                    <p>Convert to Follower Watch</p>
                    <Switcher color="[#0C72FA]" checked={true}/>
                </div>
            </div>
            <div>
               <GlobalForm />
            </div>
        </AdaptableCard>
    )
}

export default Global