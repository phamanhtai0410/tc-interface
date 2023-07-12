import React from 'react'
import { AdaptableCard } from 'components/shared'
import FormChangePwd from '../components/FormChangePwd'
import { useLocation } from 'react-router-dom';


const ChangePwd = () => {

    const location = useLocation();
    console.log(location)
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div>
                <h3 className='mb-[32px]'>Change Password</h3>
                {location.state?.row?.id && <FormChangePwd id={location.state.row.id}/>}
            </div>
            
        </AdaptableCard>
    )
}

export default ChangePwd