import React, { useEffect } from 'react'
import { Container, DoubleSidedImage } from 'components/shared'
import { selectIdAnalytic, selectIdTab } from 'store/analytics/analyticDetailSlice'
import { Notification, toast } from 'components/ui'
import { useDispatch, useSelector } from "react-redux";
import { runAnalyticsVerticalAction } from 'actions/analytic.actions'

const AccessDenied = ({handleRunAgain}) => {
    const analytic = useSelector(selectIdAnalytic)

    return (
        <Container className="h-full">
            <div className="h-full flex flex-col items-center justify-center">

                <div className='flex w-full justify-end items-end'>
                    <a 
                        className="flex flex-row gap-x-[8px] border-[1px] rounded-[4px] border-[#0C72FA] px-[16px] py-[8px] text-[#0C72FA] cursor-pointer"
                        onClick={() => handleRunAgain(analytic)}
                    >
                        <img src="/img/analytics/metadata/logo_run_again.svg" alt='logo_run_again' />
                        Run Again
                    </a>
                </div>

                <div className="mt-12 text-center">
                    
                    <h3 className="mb-2">Data Is Empty!</h3>
                </div>
            </div>
        </Container>
    )
}

export default AccessDenied
