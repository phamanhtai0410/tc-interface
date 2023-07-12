
import React, { useState } from 'react'
import { Input, Button, Checkbox, FormItem, FormContainer } from 'components/ui'
import { Field, Form, Formik } from 'formik'
import { HiOutlineEyeOff, HiOutlineEye } from 'react-icons/hi'

import { useDispatch } from 'react-redux'
import { updateUserPassword } from 'actions/user.actions'
import { passwordSchema } from 'utils/schema/schema'

const FormChangePwd = ({id}) => {
    const [pwInputType, setPwInputType] = useState('password')
    const dispatch = useDispatch()
    const onPasswordVisibleClick = (e) => {
        e.preventDefault()
        setPwInputType(pwInputType === 'password' ? 'text' : 'password')
    }

    const passwordVisible = (
        <span
            className="cursor-pointer"
            onClick={(e) => onPasswordVisibleClick(e)}
        >
            {pwInputType === 'password' ? (
                <HiOutlineEyeOff />
            ) : (
                <HiOutlineEye />
            )}
        </span>
    )  

    // Update password
    const handleUpdatePassword = async (data) => {
        const response = await dispatch(updateUserPassword(data));
        if(response.meta.requestStatus==="fulfilled"){
            alert("Update password successfully")
        }
    }


    return (
        <div>
            <Formik
                initialValues={{
                    new_password: '',
                    confirm_password: '',
                }}
                validationSchema={passwordSchema}
                onSubmit={(values, { resetForm, setSubmitting }) => {
                    const {new_password, confirm_password} = values;
                    if(new_password === confirm_password){
                        handleUpdatePassword({
                            id:id,
                            password: new_password
                        })
                    }else{
                        alert("Passwords do not match")
                    }
                }}
            >
                {({ touched, errors, resetForm }) => (
                    <Form>
                        <FormContainer>
                            <div className='w-1/2 gap-y-[24px]'>
                                <FormItem
                                    label="New Password"
                                    asterisk
                                    invalid={errors.password && touched.password}
                                    errorMessage={errors.password}
                                >
                                    <Field
                                        type={pwInputType}
                                        suffix={passwordVisible}
                                        autoComplete="off"
                                        name="new_password"
                                        placeholder="Enter new password"
                                        component={Input}
                                    />
                                    {errors.new_password && touched.new_password ? (
                                        <div className='text-[#ED1C24]'>{errors.new_password}</div>
                                    ) : null}
                                </FormItem>

                                <FormItem
                                    label="Confirm New Password"
                                    asterisk
                                    invalid={errors.password && touched.password}
                                    errorMessage={errors.password}
                                >
                                    <Field
                                        type={pwInputType}
                                        suffix={passwordVisible}
                                        autoComplete="off"
                                        name="confirm_password"
                                        placeholder="Enter new password"
                                        component={Input}
                                    />
                                    {errors.confirm_password && touched.confirm_password ? (
                                        <div className='text-[#ED1C24]'>{errors.confirm_password}</div>
                                    ) : null}
                                </FormItem>

                                <FormItem>

                                    <Button variant="solid" type="submit" className="w-full bg-[#0C72FA]">
                                        Update
                                    </Button>
                                </FormItem>
                            </div>

                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default FormChangePwd

