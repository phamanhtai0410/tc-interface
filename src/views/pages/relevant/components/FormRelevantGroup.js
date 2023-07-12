import React from 'react'
import { Field, Form, Formik } from 'formik'
import { Input, Button, FormItem, FormContainer } from 'components/ui'

function validateName(value) {
    if (!value) {
        return 'Required'
    }
    
    return
}

function validateWeight(value) {
    if (!value) {
        return 'Required'
    }
    
    return
}
function validateNote(value) {
    if (!value) {
        return 'Required'
    }
    
    return
}

const FormRelevantGroup = () => {
    return (
        <div className>
            <Formik
                initialValues={{
                    username: '',
                    email: '',
                }}
                onSubmit={(values) => {
                    console.log(values)
                }}
            >
                {({ errors, touched, isValidating }) => (
                    <Form>
                        <FormContainer>
                            <div className='grid grid-cols-2 gap-x-[32px] w-full'>
                                <FormItem
                                    label="Name"
                                    invalid={errors.email && touched.email}
                                    errorMessage={errors.email}
                                >
                                    <Field
                                        type="text"
                                        name="name"
                                        placeholder="ABC"
                                        component={Input}
                                        validate={validateName}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Weight"
                                    invalid={errors.username && touched.username}
                                    errorMessage={errors.username}
                                >
                                    <Field
                                        type="text"
                                        name="weight"
                                        placeholder="Enter weight"
                                        component={Input}
                                        validate={validateWeight}
                                    />
                                </FormItem>
                            </div>

                            <FormItem
                                    label="Note"
                                    invalid={errors.email && touched.email}
                                    errorMessage={errors.email}
                            >
                                <Field
                                    type="text"
                                    name="note"
                                    placeholder="Enter note..."
                                    component={Input}
                                    validate={validateNote}
                                />
                            </FormItem>

                            <FormItem>
                                <div className='w-full flex justify-center mt-[32px]'>
                                    <Button type="submit" variant="solid">
                                        Submit
                                    </Button>
                                </div>
                            </FormItem>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default FormRelevantGroup
