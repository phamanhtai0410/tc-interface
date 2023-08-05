import { addTakeNote } from 'actions/user.actions';
import { Button, FormContainer, FormItem, Input } from 'components/ui';
import { Form, Formik,Field, useFormik } from 'formik';
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
const PopupModalTakenote = ({username,setIsOpenModalNote,isOpenModalNote,getFollowerWatch}) => {
    const dispatch = useDispatch()
    const handleSubmitNoTakeNote = ()=>{
        alert("delete successfully")
        setIsOpenModalNote(false)
        getFollowerWatch()
    }
    const handleAddNote = async(note)=>{
        const payload = {
            username:username,
            note:note
        }
        const response = await dispatch(addTakeNote(payload))
        if(response.meta.requestStatus === "fulfilled"){
            alert("delete successfully")
            setIsOpenModalNote(false)
            getFollowerWatch()
        }
    }
    const formik = useFormik({
        initialValues:{
            note:""
        },
        onSubmit:(values,{resetForm})=>{
            handleAddNote(values.note)
            setIsOpenModalNote(false)
            resetForm({values:""})
            getFollowerWatch()
        }
    })
  return (
    <Modal ariaHideApp={false} isOpen={isOpenModalNote} style={customStyles} className="text-black border-none overflow-y-auto fixed rounded-2xl p-[24px] w-[400px] max-w-[400px] bg-[#fff] top-[15%] left-1/2 -translate-x-1/2 z-50">
        <div>
            <div className='flex items-center justify-end'>
                <img onClick={handleSubmitNoTakeNote} className='cursor-pointer' src='/img/analytics/vertical/Close_round.svg' />
            </div>
            <div className='flex justify-center w-full mb-6 mt-2'>
                <img className='block' src="/img/followerWatch/notes_logo.svg" alt="caution" />
            </div>
            <div>
                <form onSubmit={formik.handleSubmit}>
                    <textarea className='w-full h-52 pt-[10px] pr-[10px] pb-[6px] pl-[16px] border-[1px] rounded bg-[#F9FAFB] mb-4' id='note' name='note' placeholder='Note' onChange={formik.handleChange} value={formik.values.note}></textarea>
                    <div className='flex justify-center'>
                        <button className='px-12 bg-[#0C72FA] py-2 text-white font-semibold rounded' type='submit'> Save</button>
                    </div>
                </form>
            </div>
        </div>
    </Modal>
  )
}

export default PopupModalTakenote