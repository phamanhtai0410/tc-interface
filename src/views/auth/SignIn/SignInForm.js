import React from 'react'
import {
    Input,
    Button,
    Checkbox,
    FormItem,
    FormContainer,
    Alert,
} from 'components/ui'
import { PasswordInput, ActionLink } from 'components/shared'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import useQuery from 'utils/hooks/useQuery'
import { useNavigate } from 'react-router-dom'
import useAuth from 'utils/hooks/useAuth'

const validationSchema = Yup.object().shape({
    username: Yup.string().required('Please enter your Email'),
    password: Yup.string().required('Please enter your password'),
    rememberMe: Yup.bool(),
})

const style_custom = "text-[#262626]"

const SignInForm = (props) => {

    const query = useQuery()
    const navigate = useNavigate()
    const { signIn } = useAuth()
    const {
        disableSubmit = false,
        className,
        forgotPasswordUrl = '/forgot-password',
        signUpUrl = '/sign-up',
    } = props

    const [message, setMessage] = useTimeOutMessage()

    const account = JSON.parse(localStorage.getItem('account'))

    const onSignIn = async (values, setSubmitting) => {
        const { username, password, rememberMe } = values
        setSubmitting(true)

        const result = await signIn({ username, password, rememberMe })
        if (result.status === 'failed') {
            setMessage(result.message)
        }
        setSubmitting(false)
    }

    return (
        <div className={className}>
            {message && (
                <Alert className="mb-4" type="danger" showIcon>
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    username: account? account['username'] : '',
                    password: account? account['password'] : '',
                    rememberMe: account? account['rememberMe'] : false,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSignIn(values, setSubmitting)
                    
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Your Email"
                                asterisk
                                style={{ color: "#262626" }}
                                invalid={errors.username && touched.username}
                                errorMessage={errors.username}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="username"
                                    placeholder="User Name"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Password"
                                asterisk
                                style={{ color: "#262626" }}
                                invalid={errors.password && touched.password}
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="off"
                                    name="password"
                                    placeholder="Password"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <div className="flex text-[#0C72FA] justify-between mb-6">
                                <Field
                                    className="mb-0"
                                    name="rememberMe"
                                    style={{ color: "#0C72FA" }}
                                    component={Checkbox}
                                    children="Remember Me"
                                />
                                
                            </div>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                style={{ background: "#0C72FA" }}
                                type="submit"
                            >
                                {isSubmitting ? 'Logging...' : 'Login'}
                            </Button>
                            
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignInForm
