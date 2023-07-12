import { useEffect, useState } from "react"
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import {
    Input,
    Button,
    Checkbox,
    FormItem,
    FormContainer,
    Alert,
    Select,
    Notification,
    toast,
    Dialog,
} from 'components/ui'
import { PasswordInput, ActionLink } from 'components/shared'
import { fetchCreateUser, getListUsersAction } from "actions/user.actions"
import useTimeOutMessage from "utils/hooks/useTimeOutMessage"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

const options = [
    // { value: 'admin', label: 'Admin' },
    { value: 'users', label: 'Users' },
]
const validationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter your name'),
    username: Yup.string().required('Please enter your username'),
    password: Yup.string().required('Please enter your password'),
    role: Yup.string().required('Please select role'),
})

const ModalCreateUser = ({handleCreateuser}) => {
    const [ submiting, setSubmiting ] = useState(false)
    const navigate = useNavigate()
    
    const dispatch = useDispatch()
    const disableSubmit = false
    const [message, setMessage] = useTimeOutMessage()
    
    const onCreateUser = async (values, setSubmitting) => {
        const { name, username, password, role } = values
        setSubmitting(true)
        const result = await fetchCreateUser({ name, username, password, role })
        if (result.status === 'failed') {
            setMessage(result.message)
        }else {

            handleCreateuser()
            await dispatch(getListUsersAction({page:1, page_size:15}))
            navigate('/pages/user-management')
            toast.push(
                <Notification
                    title={'Successfuly create'}
                    type="success"
                    duration={2500}
                >
                    successfuly create
                </Notification>,
                {
                    placement: 'top-right',
                }
            )
        }
        setSubmitting(false)
    }

    const [dialogIsOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* <div
                className="fixed justify-center items-center flex bg-black/[0.7] overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none"
                onClick={() => handleCreateuser()}
            >
                <div className="absolute w-auto my-6 z-[9999] mx-auto max-w-3xl">

                    <div className="border-0 rounded-lg w-[496px] shadow-lg z-[51] bg-white flex flex-col outline-none focus:outline-none">

                        <div className="flex items-start justify-between p-5 rounded-t">
                            <h3 className="text-3xl font-semibold">
                                Add user
                            </h3>
                            <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => handleCreateuser()}
                            >
                                Close
                            </button>
                        </div>
                        <div className="relative p-6 flex-auto">
                            {message && (
                                <Alert className="mb-4" type="danger" showIcon>
                                    {message}
                                </Alert>
                            )}
                            <Formik
                                initialValues={{
                                    name: '',
                                    username: '',
                                    password: '',
                                    role: 'users'
                                }}
                                validationSchema={validationSchema}
                                onSubmit={(values, { setSubmitting }) => {
                                    if (!disableSubmit) {
                                        onCreateUser(values, setSubmitting)
                                    
                                    } else {
                                        setSubmitting(false)
                                    }
                                }}
                            >
                                {({ values, touched, errors, isSubmitting }) => (
                                    <Form>
                                        <FormContainer>
                                            <FormItem
                                                label="Name"
                                                asterisk
                                                invalid={errors.name && touched.name}
                                                errorMessage={errors.name}
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="name"
                                                    placeholder="Enter name"
                                                    component={Input}
                                                />
                                            </FormItem>
                                            <FormItem
                                                label="User Name"
                                                asterisk
                                                invalid={errors.username && touched.username}
                                                errorMessage={errors.username}
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="username"
                                                    placeholder="Enter username"
                                                    component={Input}
                                                />
                                            </FormItem>

                                            <FormItem
                                                label="Password"
                                                asterisk
                                                invalid={errors.password && touched.password}
                                                errorMessage={errors.password}
                                            >
                                                <Field
                                                    autoComplete="off"
                                                    name="password"
                                                    placeholder="Enter password"
                                                    component={PasswordInput}
                                                />
                                            </FormItem>

                                            <FormItem
                                                label="Role"
                                                asterisk
                                                invalid={errors.role && touched.role}
                                                errorMessage={errors.role}
                                            >
                                                <Field name="role">
                                                    {({ field, form }) => (
                                                        <Select
                                                            field={field}
                                                            form={form}
                                                            options={options}
                                                            value={options.filter(
                                                                (option) =>
                                                                    option.value ===
                                                                    values.role
                                                            )}
                                                            onChange={(option) =>
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    option.value
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                            
                                            <Button
                                                style = {{background: "#0C72FA"}}
                                                block
                                                loading={isSubmitting}
                                                variant="solid"
                                                type="submit"
                                            >
                                                {isSubmitting ? 'Add in...' : ' + Add'}
                                            </Button>
                                            
                                        </FormContainer>
                                    </Form>
                                )}
                            </Formik>

                        </div>
                        
                    </div>
                </div>
            </div> */}
            
        </>
        )
    }
export default ModalCreateUser
