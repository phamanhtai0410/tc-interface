

import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { selectMetaData } from 'store/analytics/analyticSlice';
import { selectKey, selectOpenModalAddKey, setChangeModalAddKey } from 'store/vertical/verticalSlice';
import FormList from './FormList';




const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        // width:370,
        // height:230,
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


const ModalAddKeyVertical = ({}) => {
    
    const modalIsOpen = useSelector(selectOpenModalAddKey)
    const dispatch = useDispatch()

  







    const closeModal = () =>{
        dispatch(setChangeModalAddKey({
            isOpen:false,
            
        }))
    }

    return (

        <Modal
            isOpen={modalIsOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            className="h-[430px] overflow-y-auto fixed rounded-2xl p-[24px] w-[490px] max-w-[490px] bg-[#fff] top-[15%] left-1/2 -translate-x-1/2 z-50"
        >
            <div >
                <div className='flex items-center justify-end'>
                    <h3 className='text-xl font-bold bg-text_import bg-clip-text text-fill-transparent w-full text-center'>Add key</h3>
                    <img onClick={()=>{closeModal()}} className='cursor-pointer' src='/img/analytics/vertical/Close_round.svg'/>
                </div>

                <div className='mt-[34px] h-[300px] overflow-y-auto'>
                    <FormList />
                </div>
            </div>

        </Modal>
    )
}

export default ModalAddKeyVertical;