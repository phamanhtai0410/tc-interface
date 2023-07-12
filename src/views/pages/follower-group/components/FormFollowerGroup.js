import React, { useEffect, useState } from "react";
import {  useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import ModalAddKeyFollowers from "./ModalAddKeyFollowers";
import { selectFollowerEdit, selectKeyFollower, setChangeModalAddKeyFollower, setKeyValueFollower } from "store/follower/followerSlice";
import { createFollowerGroup, updateFollower } from "actions/follower.actions";
import { selectUserRole } from "store/role/roleSlice";



function validateKeys(value) {
    if (value.length === 0) {
        return "Keys invalid";
    }
}

const FormFollowerGroup = ({ fetchFollowerData }) => {
    const dispatch = useDispatch();
    
    const keyStore = useSelector(selectKeyFollower);
    const objEdit = useSelector(selectFollowerEdit)
    const user = useSelector(selectUserRole)


    ///Api save vertical key group
    const handleSaveFollowerGroup = async (value) => {
        const payload = {
            name:value.name,
            accounts: value.keys.split(",").filter(item => item !== null && item !== undefined && item !== '' && item !== ' ')
        }

        const response = await dispatch(createFollowerGroup(payload));
        if (response.meta.requestStatus === "fulfilled") {
            alert("Save Followers Group Successfully");
            fetchFollowerData();
        } else {
            alert(response.payload.error_code);
        }
    };

    ///Api update vertical
    const handleUpdateFollowerGroup = async (value) =>{
        
        const payload = {
            id: value?.id,
            name: value?.values?.name,
            accounts: value?.values?.keys.split(',')
        }

        const response = await dispatch(updateFollower(payload))
        if(response.meta.requestStatus === "fulfilled"){
            alert("Update successfully")
            location.reload()
        }
    }
    const handleOpenModalAddKey = () => {
        dispatch(
            setChangeModalAddKeyFollower({
                isOpen: true,
            })
        );
    };

    const handleSetKey = (value) => {
        dispatch(
            setKeyValueFollower({
                key: value,
            })
        );
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            keys: "",
        },
        validationSchema: Yup.object().shape({
            name: Yup.string()
                .required("Follower Group Name is required"),
            keys: Yup.string().required("Follower Account is required")
        }),
        onSubmit: (values, { resetForm }) => {
            if (objEdit && objEdit.id) {
                handleUpdateFollowerGroup({
                id: objEdit.id,
                values
               })
               return;
            }
            
            handleSaveFollowerGroup(values);
            resetForm({values: ""})
        }
    })


    useEffect(() => {
        if (keyStore?.length > 0) {
            formik.setFieldValue("keys", keyStore.toString())
        }
    }, [keyStore])

    useEffect(()=>{
        formik.setFieldValue("keys", objEdit.key?.toString())
        formik.setFieldValue("name", objEdit.name)

    },[objEdit])

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <p> Follower Group Name</p>
                        <input
                            className="mt-2 w-full h-[44px] py-3 px-4 bg-[#F9FAFB] border-solid border-[1px] border-[#E8E8E8] outline-none rounded-[4px]"
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter Follower Group Name"
                            onChange={formik.handleChange}
                            value={formik.values.name}
                        />
                        {formik.errors.name && formik.touched.name && (
                            <p className="text-red-500">{formik.errors.name}</p>
                        )}
                    </div>

                    <div >
                        
                        <div className="relative">
                            
                            <p>Follower Accounts</p>
                            <input
                                className="mt-2 w-full h-[44px] py-3 px-4 bg-[#F9FAFB] border-solid border-[1px] border-[#E8E8E8] outline-none rounded-[4px]"
                                id="keys"
                                name="keys"
                                type="keys"
                                placeholder="Enter Follower Accounts or click Add icon"
                                onChange={formik.handleChange}
                                value={formik.values.keys}
                            />
                            <img
                                onClick={() => {
                                    handleOpenModalAddKey()
                                    handleSetKey(formik.values.keys)
                                }}
                                className='absolute top-[47%] right-0 cursor-pointer' src='/img/analytics/vertical/ic_add.svg' alt='icon add' />
                        </div>
                        
                        {formik.errors.keys && formik.touched.keys && (
                            <p className="text-red-500">{formik.errors.keys}</p>)}
                        

                        <ModalAddKeyFollowers />
                    </div>
                </div>

                {!objEdit.id ? <button className="w-[130px] h-[44px] bg-[#0C72FA] text-[#fff] mx-auto mt-8 block rounded-[4px] text-[14px] font-bold" type="submit">
                    Save
                </button> : <button className="w-[130px] h-[44px] bg-[#0C72FA] text-[#fff] mx-auto mt-8 block rounded-[4px] text-[14px] font-bold" type="submit">
                    Update
                </button>}
            </form>

            
        </div>
    );
};

export default FormFollowerGroup;
