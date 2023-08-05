import React, { useEffect } from 'react'
import { AdaptableCard } from 'components/shared'
import FormChangePwd from '../components/FormChangePwd'
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserRole } from 'store/role/roleSlice';



const ChangePwd = () => {

    const location = useLocation();
    const user = useSelector(selectUserRole)
    const navigate = useNavigate();

    useEffect(() => { 
        if (!location.state?.row?.id && user?._id) {
            navigate(`/pages/user/change-pwd/${user._id}`)
        }
    }, [location.state?.row?.id])
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div>
                <h3 className='mb-[32px]'>Change Password</h3>
                {<FormChangePwd id={location.state?.row?.id || user?._id}/>}
            </div>
            
        </AdaptableCard>
    )
}

export default ChangePwd