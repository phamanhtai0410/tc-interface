import { removeVertical } from 'actions/vertical.actions';
import React from 'react'
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        // width:370,
        // height:230,
        overflow: "visible"
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
const PopupDelete = ({isOpenModal,setIsOpenModal,groupName,fetchVerticalData}) => {
    const dispatch = useDispatch()
    const handleDeleteGroup = async()=>{
        const response = await dispatch(removeVertical(groupName.id))
        if (response.meta.requestStatus === "fulfilled") {
            setIsOpenModal(false)
            fetchVerticalData()
            alert("Remove successfully")
        }
    }
  return (
    <Modal ariaHideApp={false} isOpen={isOpenModal} style={customStyles} className="text-black border-none overflow-y-auto fixed rounded-2xl p-[24px] w-[400px] max-w-[400px] bg-[#fff] top-[15%] left-1/2 -translate-x-1/2 z-50">
        <div>
            <div className='flex items-center justify-end'>
                <img onClick={()=>setIsOpenModal(false)} className='cursor-pointer' src='/img/analytics/vertical/Close_round.svg' />
            </div>
            <div className='flex justify-center w-full mb-6 mt-2'>
                <img className='block' src="/img/followerWatch/caution_icon.svg" alt="caution" />
            </div>
            <p className='text-center text-[1rem] mb-8'>Are you sure you want to remove <span className='font-bold'>{groupName.name}</span> from Keyword Group?</p>
            <div className='flex justify-center gap-x-6'>
                <button onClick = {handleDeleteGroup} className='px-4 py-2 bg-[#CF1322] text-white rounded font-semibold'>Yes, I'm sure</button>
                <button onClick={()=>setIsOpenModal(false)} className='px-4 py-2 rounded font-semibold border-[#9A9FA5] border-2'>No, cancel</button>
            </div>
        </div>
    </Modal>
  )
}

export default PopupDelete