import { deleteUser } from "actions/user.actions";
import React from "react";
import Modal from 'react-modal';
import { useDispatch } from "react-redux";

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
const ModalDeleteUser = ({ isOpenModal, setIsOpenModal, username}) => {
    const dispatch = useDispatch()
    const handleRemoveUser = async () => {
       const res = await dispatch(deleteUser(username))
        if (res.meta.requestStatus === 'fulfilled') {
            alert("Delete user successfully")
            window.location.reload()
            setIsOpenModal(false)
        }
    }
    return (
        <Modal ariaHideApp={false} isOpen={isOpenModal} style={customStyles} className="text-black border-none overflow-y-auto fixed rounded-2xl p-[24px] w-[400px] max-w-[400px] bg-[#fff] top-[15%] left-1/2 -translate-x-1/2 z-50">
            <div>
                <div className='flex items-center justify-end'>
                    <img onClick={() => setIsOpenModal(false)} className='cursor-pointer' src='/img/analytics/vertical/Close_round.svg' />
                </div>
                <div className='flex justify-center w-full mb-6 mt-2'>
                    <img className='block' src="/img/followerWatch/caution_icon.svg" alt="caution" />
                </div>
                <p className='text-center text-[1rem] mb-8'>Are you sure you want to delete this {`'${username?.name}'`}?</p>
                <div className='flex justify-center gap-x-6'>
                    <button onClick={handleRemoveUser} className='px-4 py-2 bg-[#CF1322] text-white rounded font-semibold'>Yes, I'm sure</button>
                    <button onClick={() => setIsOpenModal(false)} className='px-4 py-2 rounded font-semibold border-[#9A9FA5] border-2'>No, cancel</button>
                </div>
            </div>
        </Modal>
    )
}

export default ModalDeleteUser