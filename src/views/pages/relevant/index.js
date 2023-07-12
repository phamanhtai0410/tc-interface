import React from 'react'
import { AdaptableCard } from 'components/shared'
import FormRelevantGroup from './components/FormRelevantGroup'
import RelevantTable from './components/RelevantTable'


const Relevant = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <h3 className="mb-4 lg:mb-0">Relevant group</h3>
            <div className='my-[48px]'>
                <FormRelevantGroup />
            </div>

            <div className="lg:flex items-center justify-end mb-4">
                
                {/* table tool here  */}
            </div>
            <RelevantTable />
        </AdaptableCard>
    )
}

export default Relevant
