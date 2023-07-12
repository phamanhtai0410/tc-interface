import React, { useEffect, useImperativeHandle, useState } from 'react'
import { Button, Dialog, Spinner } from 'components/ui'
import { fetchListAnalytic } from 'actions/analytic.actions'
import { selectListAnalytic } from 'store/analytics/analyticSlice'
import { useDispatch, useSelector } from 'react-redux'

const ModalListAnalytic = ({props}) => {

    const {trigger, handleAddTab} = props
    const [dialogIsOpen, setIsOpen] = useState(false)

    const openDialog = () => {
        setIsOpen(true)
    }

    useEffect(() => {
        if (trigger) {
            openDialog();
        }
      }, [trigger]);
    

    const onDialogClose = (e) => {
        setIsOpen(false)
    }

    const onDialogOk = (e) => {
        setIsOpen(false)
    }

    const dispatch = useDispatch();

    const [querySize,setQuerySize] = useState({
      page:1,
      page_size:15
    })

    const [ isLoading, setIsLoading ] = useState(false)
  
    // const fetchAnalytics = async () => {
    //     setIsLoading(true)
    //     const response = await dispatch(fetchListAnalytic({ page: querySize.page, page_size: querySize.page_size }));

    //     if(response.meta.requestStatus === "fulfilled"){
    //         setIsLoading(false)
    //     }
    // };

    // useEffect(() => {
    //     fetchAnalytics();
    // }, [querySize]);

    const data = useSelector(selectListAnalytic);
    
    const handleShowMore = () => {
        setQuerySize(current => ({
            ...current,
            page_size: current.page_size + 10
        }))
    }

    return (
        <div >
            
            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h5 className="mb-4">List Run</h5>

                <ul 
                    className='flex flex-col gap-y-[24px] max-h-[400px] overflow-y-auto'
                >
                    {
                        data?.items.slice(5).map((item) => (
                            <li 
                                className='cursor-pointer '
                                onClick={() => {
                                    handleAddTab(item)
                                    onDialogClose()
                                }}
                            >
                                {item.vertical_name}
                            </li>
                        ))
                    }

                </ul>
                <div className='text-center py-[16px] mt-[24px]'>
                    <span 
                        className=' cursor-pointer  underline text-[#0C72FA]'
                        onClick={() => handleShowMore()}
                    >
                        show more
                    </span>
                </div>
                <div className="text-right">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={onDialogClose}
                    >
                        Cancel
                    </Button>
                </div>
            </Dialog>
                <div>
                    {
                        isLoading && (

                            <div
                                className="fixed justify-center items-center flex bg-black/[0.7] overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none"

                            >
                                <div className="absolute w-auto my-6 z-[9999] mx-auto max-w-3xl">
                                    <Spinner size="3.25rem" />
                                </div>
                            </div>
                        )
                    }
                
                </div>
        </div>
    )
}

export default ModalListAnalytic