import { removeAnalytic } from 'actions/analytic.actions';
import { toast, Notification } from 'components/ui';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { selectDataRemove, selectMetaData, setChangeModalDeleteMetadata } from 'store/analytics/analyticSlice';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width:370,
        height:230,
        overflow:"visible"
        //   zIndex:'1000'
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000
    }
};


const ModalDeleteMeta = ({ modalIsOpen, closeModal }) => {
    const dispatch = useDispatch()

    const metaData = useSelector(selectMetaData)
    
    const _row = useSelector(selectDataRemove)

    const handleRemove = async () => {
        const response = await dispatch(removeAnalytic(_row._id))
        if(response.meta.requestStatus === 'fulfilled'){
            
            // toast.push(
            //     <Notification
            //         title={'Successfuly Deleted'}
            //         type="success"
            //         duration={2500}
            //     >
            //         successfuly deleted
            //     </Notification>,
            //     {
            //         placement: 'top-center',
            //     }
            // )
            // dispatch(setChangeModalDeleteMetadata({
            //     isOpen:false
            // }))
            window.location.reload()
        }
    }

    return (

        <Modal
            isOpen={modalIsOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            ariaHideApp={false}
        >
            <div className='flex justify-end'>
                <img onClick={()=>{closeModal()}} className='w-[24px] h-[24px] cursor-pointer' src="/img/analytics/metadata/Close_round.svg" alt='close' />
            </div>
            <div className='mt-[8px]'>
                <img className='w-[32px] h-[32px] mx-auto' src='/img/analytics/metadata/warning.svg' alt="warning" />
                <p className='mt-[24px] text-[#0A203D] text-base font-normal text-center'>Are you sure you want to delete ?</p>
                <div className='justify-center flex items-center space-x-6 mt-[32px]'>
                    <button 
                        className='bg-[#CF1322] rounded-[4px] text-[#fff] text-[14px] font-semibold py-[8px] px-[16px]'
                        onClick={handleRemove}
                    >Yes, I’m sure
                    </button>
                    <button className=' text-[#262626] rounded-[4px] text-[14px] font-semibold py-[8px] px-[16px] border-solid border-[1px] border-[#9A9FA5]'
                        onClick={()=>{closeModal()}}
                    >No, cancel
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default ModalDeleteMeta;