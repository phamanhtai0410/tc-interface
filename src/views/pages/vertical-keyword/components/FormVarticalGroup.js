import React, { useEffect, useState } from "react";
import { Field, Form, Formik, useFormik } from "formik";
import { Input, Button, FormItem, FormContainer } from "components/ui";
import InputKeywords from "./InputKeywords";
import { verticalSchema } from "utils/schema/schema";
import { useDispatch, useSelector } from "react-redux";
import { createVerticalGroup, updateVertical } from "actions/vertical.actions";
import {
    resetState,
    selectKey,
    selectVerticalEdit,
    setChangeModalAddKey,
    setKeyValue,
} from "store/vertical/verticalSlice";
import * as Yup from "yup";
import ModalAddKeyVertical from "./ModalAddKeyVertical";
import { selectUserRole } from "store/role/roleSlice";
import _ from "lodash";

function validateName(value) {
    if (!value) {
        return "Required";
    }

    return;
}

function validateWeight(value) {
    if (!value) {
        return "Required";
    } else if (!Number(value)) {
        return "Weight must be number";
    }

    return;
}

function validateKeys(value) {
    return value.length === 0 ? true : false;
}

const FormVarticalGroup = ({ fetchVerticalData }) => {
    const [tags, setTags] = useState([])
    const [errorKeyword, setErrorKeyword] = useState(false)
    const [switchButton, setSwitchButton] = useState(false)
    const dispatch = useDispatch();

    const keyStore = useSelector(selectKey);
    const objEdit = useSelector(selectVerticalEdit)
    const user = useSelector(selectUserRole)
    ///Api save vertical key group
    const handleSaveVerticalGroup = async (value, tags) => {
        const payload = {
            name: value.name,
            keywords: tags
        }
        // console.log(payload);
        // console.log("---payload", payload)
        const response = await dispatch(createVerticalGroup(payload));
        if (response.meta.requestStatus === "fulfilled") {
            alert("Save Keyword Group Successfully");
            fetchVerticalData();
        } else {
            alert("Keyword group name existed!");
        }
    };


    ///Api update vertical
    const handleUpdate = async (value) => {

        const payload = {
            id: value?.id,
            name: value?.values?.name,
            // keywords: value?.values?.keys.split(',')
            keywords: value?.values?.keys
        }
        const response = await dispatch(updateVertical(payload))
        if (response.meta.requestStatus === "fulfilled") {
            alert("Update successfully")
            fetchVerticalData()
        }else{
            alert("Keyword group name existed!");
        }
    }
    const handleOpenModalAddKey = () => {
        dispatch(
            setChangeModalAddKey({
                isOpen: true,
            })
        );
    };

    const handleSetKey = (value) => {
        dispatch(
            setKeyValue({
                key: value,
            })
        );
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            keys: [],
        },  
        validationSchema: Yup.object().shape({
            name: Yup.string()
                .required("Keyword Group Name is required"),
            keys: Yup.array().min(1,'Keys is required')
        }),
        onSubmit: (values, { resetForm }) => {
            values.keys = tags
            if (objEdit && objEdit.id) {
                handleUpdate({
                    id: objEdit.id,
                    values: { ...values, keys: tags }
                })
                setTags([])
                resetForm({ values: "" });
                setSwitchButton(true)
                dispatch(resetState())
                return;
            }
            // setErrorKeyword(false)
            setTags([])
            resetForm({ values: "" });
            handleSaveVerticalGroup(values, tags);
        }


    })
    const onKeyDown = (keyEvent)=>{
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
        }
    }
    useEffect(()=>{
        if(tags.length === 0){
            setErrorKeyword(true)
        }else{
            setErrorKeyword(false)
        }
        formik.values.keys = tags
    },[tags,formik.values])
    useEffect(() => {
        if (keyStore?.length > 0) {
            formik.setFieldValue("keys", keyStore)
        }
    }, [keyStore])
    useEffect(() => {
        formik.setFieldValue("keys", objEdit.key)
        formik.setFieldValue("name", objEdit.name)
        if(tags.length === 0 && objEdit?.key.length === 0){
            setSwitchButton(true)
        }
        else{
            setSwitchButton(false)
        }
        setTags(objEdit?.key)
    }, [objEdit])


    return (
        <div>
            <form onSubmit={formik.handleSubmit} onKeyDown={onKeyDown}>
                <div className="grid grid-cols-1 gap-8">
                    <div>
                        <p className="font-semibold text-[14px] text-[#262626]">Keyword Group Name</p>
                        <input
                            className="mt-2 w-full h-[44px] py-3 px-4 bg-[#F9FAFB] border-solid border-[1px] border-[#E8E8E8] outline-none rounded-[4px]"
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter Keyword Group Name"
                            onChange={formik.handleChange}
                            value={formik.values.name}
                        />
                        {formik.errors.name && formik.touched.name && (
                            <p className="text-red-500">{formik.errors.name}</p>
                        )}
                    </div>

                    <div>
                        <div className="relative">
                            <p className="font-semibold text-[14px] text-[#262626]">Keys</p>
                            {/* <input  
                                className="mt-2 w-full h-[44px] py-3 px-4 bg-[#F9FAFB] border-solid border-[1px] border-[#E8E8E8] outline-none rounded-[4px]"
                                id="keys"
                                name="keys"
                                type="keys"
                                placeholder="Enter Keys or click Add icon"
                                onChange={formik.handleChange}
                                value={formik.values.keys}
                            /> */}
                            <InputKeywords tags={tags} setTags={setTags} />

                            
                            {/* <img
                                onClick={() => {
                                    handleOpenModalAddKey()
                                    handleSetKey(formik.values.keys)
                                }}
                                className='absolute top-[47%] right-0 cursor-pointer' src='/img/analytics/vertical/ic_add.svg' alt='icon add' /> */}
                        </div>
                        {formik.errors.keys && formik.touched.keys && errorKeyword &&(
                            <p className="text-red-500">{formik.errors.keys}</p>)}
                        {/* {errorKeyword && <p className="text-red-500">Keys is required</p>} */}
                            
                        <ModalAddKeyVertical />
                    </div>
                </div>

                {switchButton===true ? <button className="w-[130px] h-[44px] bg-[#0C72FA] text-[#fff] mx-auto mt-8 block rounded-[4px] text-[14px] font-bold" type="submit">
                    Save
                </button> : <button className="w-[130px] h-[44px] bg-[#0C72FA] text-[#fff] mx-auto mt-8 block rounded-[4px] text-[14px] font-bold" type="submit">
                    Update
                </button>}
            </form>

            {/* <Formik
                initialValues={formik.initialValues}
                handleSubmit={formik.onSubmit}
            >
                {({ errors, touched, handleChange, isValidating, values, setFieldValue }) => (
                    <Form>
                        <FormContainer>
                            <div className='grid grid-cols-2 gap-x-[32px] w-full'>
                                <FormItem
                                    label="Name"
                                    invalid={errors.name && touched.name}
                                    errorMessage={errors.name}
                                >
                                    <Field
                                        type="text"
                                        name="name"
                                        placeholder="ABC"
                                        component={Input}
                                        validate={validateName}
                                        defaultValue={nameStore}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Weight"
                                    invalid={errors.weight && touched.weight}
                                    errorMessage={errors.weight}
                                >
                                    <Field
                                        defaultValue={weightStore}
                                        type="text"
                                        name="weight"
                                        placeholder="Enter weight"
                                        component={Input}
                                        validate={validateWeight}
                                    />
                                </FormItem>
                            </div>

                            <FormItem
                                label="Key"
                                invalid={errors.keys && touched.keys}
                                errorMessage={errors.keys}
                                className="relative"
                                validate={validateKeys}

                            >
                                <Field
                                    type="text"
                                    name="keys"
                                    placeholder={"A,B"}
                                    component={Input}
                                    value={keyStore}
                                    readOnly={true}

                                />
                                <img onClick={() => {
                                    handleOpenModalAddKey()
                                    // handleSetKey(values.keys)

                                    // setKey(values.keys)
                                }} className='absolute top-[47%] right-0 cursor-pointer' src='/img/analytics/vertical/ic_add.svg' alt='icon add' />

                                <ModalAddKeyVertical />

                            </FormItem>

                            <FormItem>
                                <div className='w-full flex justify-center mt-[32px]'>
                                    <button onSubmit={formik.onSubmit} className="bg-[#0C72FA] text-[#fff] px-[48px] py-[12px] text-[14px] rounded-[4px]" type="submit" >
                                        Save
                                    </button>
                                </div>
                            </FormItem>

                        </FormContainer>
                    </Form>
                )}
            </Formik> */}
        </div>
    );
};

export default FormVarticalGroup;
