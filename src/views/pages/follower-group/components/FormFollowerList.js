import { Formik, Form, Field, FieldArray } from "formik";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectKeyFollower, setChangeModalAddKeyFollower, setKeyValueFollower } from "store/follower/followerSlice";



const FormFollowerList = () => {


    const keyStore = useSelector(selectKeyFollower)


    const dispatch = useDispatch();

    const formInitialValues = { key: keyStore || "" };

    const handleAddKeys = (value) => {
        let keys = [];

        if (value.forms.length === 1) {
            keys.push(value.forms[0].key)
        } else {
            keys = value.forms.map((item) => {
                return item.key
            })
        }

        dispatch(setKeyValueFollower({
            key: keys
        })) 

        dispatch(setChangeModalAddKeyFollower({
            isOpen: false
        }))

    }



    return (
        <>


            <Formik
                initialValues={{ forms: [formInitialValues] }}
                onSubmit={(values) =>
                    handleAddKeys(values)
                }
                render={({ values }) => (
                    <Form>
                        <FieldArray
                            name="forms"
                            render={(arrayHelpers) => (
                                <div>
                                    {values.forms.map((formItem, index) => (
                                        <div className="relative mb-[16px]" key={index}>
                                            <Field name={`forms.${index}.key`} placeholder="Enter Follower Accounts" className="pl-[60px] pr-[24px] border-solid border-[1px] border-[#9A9FA5] outline-none h-[48px] w-full rounded-lg text-[14px] font-medium text-[#9A9FA5]" />
                                            <img onClick={() => { arrayHelpers.remove(index) }}
                                                className="absolute top-0 left-0" src="/img/analytics/vertical/closeKey.png" />
                                        </div>
                                    ))}

                                    <div>
                                        <div
                                            className="w-[139px] min-w-[139px] flex font-bold items-center py-[14px] mt-6 cursor-pointer  rounded-lg px-4 border-solid border-[1px] border-[#0C72FA] text-[#0C72FA]"
                                            onClick={() => {
                                                arrayHelpers.push({ formInitialValues, value: "" })
                                            }}
                                        >
                                            <img src="/img/analytics/vertical/plus.svg" />
                                            Add More
                                        </div>
                                    </div>
                                </div>
                            )}


                        />
                        <button className="mt-8 w-full bg-[#0C72FA] rounded-[4px] py-[12px] text-[#fff] text-[14px] font-bold">
                            Add
                        </button>
                    </Form>
                )}

            />

        </>

    );
};

export default FormFollowerList;
