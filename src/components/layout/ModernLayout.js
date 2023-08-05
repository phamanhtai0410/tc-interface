import React, { useState } from 'react'
import Header from 'components/template/Header'
import SidePanel from 'components/template/SidePanel'
import UserDropdown from 'components/template/UserDropdown'
import LanguageSelector from 'components/template/LanguageSelector'
import { PasswordInput, ActionLink } from 'components/shared'
import SideNavToggle from 'components/template/SideNavToggle'
import MobileNav from 'components/template/MobileNav'
import Search from 'components/template/Search'
import SideNav from 'components/template/SideNav'
import View from 'views'
import ModalCreateUser from './ModalCreateUser'
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
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCreateUser, getListUsersAction } from 'actions/user.actions'
import { selectUserRole } from 'store/role/roleSlice'

const optionsSuperAdmin = [
    { value: 'admin', label: 'Admin' },
    { value: 'users', label: 'Users' },
]
const optionAdmin = [
    { value: 'users', label: 'Users' },
]
const validationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter your name'),
    username: Yup.string().required('Please enter your username (Email)'),
    password: Yup.string().required('Please enter your password'),
    role: Yup.string().required('Please select role'),
})



const HeaderActionsStart = () => {
    return (
        <>
            <MobileNav />
            <SideNavToggle />
            <Search />
        </>
    )
}

const HeaderActionsEnd = ({ handleCreateuser }) => {
    const user = useSelector(selectUserRole)

    return (
        <>
            {user?.roles?.[0] !== 'users' && <>
                <button className='bg-[#0C72FA] text-[#FFFFFF] text-[14px] w-[145px] h-[40px] rounded-[4px] px-[16px] py-[10px]'
                    onClick={handleCreateuser}
                >
                    Create user
                </button>
            </>}
            <UserDropdown hoverable={false} />
        </>
    )
}

const ModernLayout = (props) => {

    const [ submiting, setSubmiting ] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const disableSubmit = false
    const [message, setMessage] = useTimeOutMessage()
    const user = useSelector(selectUserRole)

    const handleCreateuser = () => {
        setIsOpen(true)
    }

    const [dialogIsOpen, setIsOpen] = useState(false)

    const onDialogClose = (e) => {
        setIsOpen(false)
    }

    const checkOptions = () => {
        if (user?.roles?.indexOf('super_admin') !== -1) {
            return optionsSuperAdmin;
        }
        return optionAdmin;
    }

    const onCreateUser = async (values, setSubmitting) => {
        
        const { name, username, password, role } = values
        setSubmitting(true)
        const result = await fetchCreateUser({ name, username, password, role })
        console.log(result)

        if (result.status === 'failed') {
            setMessage(result.message)
        }else {
            setMessage([])
            setIsOpen(false)
            dispatch(getListUsersAction({page:1, page_size:15}))
            navigate('/pages/user-management')
            toast.push(
                <Notification
                    title={'Successfully Create'}
                    type="success"
                    style={{ right:0}}
                    duration={1000}
                >
                    Successfuly Create
                </Notification>,
                {
                    placement: 'top-end',
                }
            )
        }
        setSubmitting(false)
    }

    
    return (
        <>
            <div className="app-layout-modern flex flex-auto flex-col">
                <div className="flex flex-auto min-w-0">
                    <SideNav />
                    <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                        <Header
                            className="border-b border-gray-200 dark:border-gray-700"
                            headerEnd={<HeaderActionsEnd handleCreateuser={handleCreateuser}/>}
                            headerStart={<HeaderActionsStart />}
                        />
                        <View {...props} />
                    </div>
                </div>
            </div>
        
            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                // className="absolute"
            >
                <h5 className="mb-4">Add user</h5>
                
                        <div className="relative p-6 flex-auto">
                            {message && message.length > 0 && (
                                <Alert classNa me="mb-4" type="danger" showIcon>
                                    
                                    { Array.isArray(message) ? message?.map((mess) => {
                                        return <>
                                            - {mess} <br/>
                                        </>
                                    }) : message}
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
                                                label="User Name (Email)"
                                                asterisk
                                                invalid={errors.username && touched.username}
                                                errorMessage={errors.username}
                                            >
                                                <Field
                                                    type="email"
                                                    autoComplete="off"
                                                    name="username"
                                                    placeholder="Enter username (Email)"
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
                                                    options={checkOptions()}
                                                            isSearchable={false}
                                                    value={checkOptions().filter(
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
                                                {isSubmitting ? 'Adding...' : ' + Add'}
                                            </Button>
                                            
                                        </FormContainer>
                                    </Form>
                                )}
                            </Formik>

                        </div>
            </Dialog>

        </>
    )
}

export default ModernLayout
