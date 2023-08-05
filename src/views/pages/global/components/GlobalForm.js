import React, { useEffect, useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { Input, Button, FormItem, FormContainer, Select, DatePicker, Alert, Segment, toast, Notification, Spinner } from 'components/ui'
import { getListVerticalGroup } from 'actions/vertical.actions'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import { useNavigate } from 'react-router-dom'
import { createGlobalAnalytic, fetchGlobalAnalytic } from 'actions/global.actions'
import { useFormik } from "formik";
import { checkRoles } from 'utils/lib/lib'
import { selectUserRole } from 'store/role/roleSlice'



const dateFormat = 'DD-MM-YYYY'

const validationSchema = Yup.object().shape({


    account_verified_point: Yup.string().required('Please enter Account verified point'),
    account_no_verified_point: Yup.string().required('Please enter Account no verified point'),
    account_business_point: Yup.string().required('Please enter Account business point'),

    total_follower_weight: Yup.string()
        .nullable()
        .required('Please enter Total follower weight'),

    total_following_weight: Yup.string().required('Please enter Total following weight'),


    total_tweet_weight: Yup.string().required('Please enter Total tweet weight'),
    total_listed_weight: Yup.string().required('Please enter Total Listed weight'),

    // account_age_range_start: Yup.string().when("account_age_range_end", {
    //     is: (account_age_range_end) => account_age_range_end != undefined,
    //     then: Yup.string().required('I am required now the account_age_range_end')
    // }),
    account_age_range_start: Yup.date().nullable().default(undefined),
    account_age_range_end: Yup.date()
        // .min('Account Age Range end must be greater than or equal to Account Age Range start')
        // .required('Please enter Account Age Range end')
        .nullable().default(undefined),

    // tweet_date_start: Yup.string().when("tweet_date_end", {
    //     is: (tweet_date_end) => tweet_date_end != undefined,
    //     then: Yup.string().required('I am required now the tweet_date_end')
    // }),
    tweet_date_start: Yup.date().nullable().default(undefined),

    total_retweet_weight: Yup.string().required('Please enter Total retweet weight'),

    total_reply_weight: Yup.string().required('Please enter Total reply weight'),
    total_like_weight: Yup.string().required('Please enter Total like weight'),
    total_quote_weight: Yup.string().required('Please enter Total quote weight'),

    total_impression_weight: Yup.string().required('Please enter Total impression weight'),


})

const GlobalForm = () => {
    const navigate = useNavigate()

    const [stateLoading, setStateLoading] = useState(false)
    const [expand, setExpand] = useState(false)
    const user = useSelector(selectUserRole)


    function convert_date(date) {
        var _date = date.split("-");
        var date_timestamp = new Date(_date[2], _date[1] - 1, _date[0]);
        return Math.floor(date_timestamp.getTime() / 1000)
    }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return convert_date([day, month, year].join('-'))
    }

    function convert_array(str_data) {
        return str_data.split(',');
    }

    function revertDate(timestamp) {
        return new Date(timestamp * 1000)
    }

    function arr_id_vertical_keyword(value) {
        const _arr_vertical = []
        value?.map((item) => {
            _arr_vertical.push(item.value)
        })

        return _arr_vertical
    }

    const dispatch = useDispatch()
    const [querySize, setQuerySize] = useState({
        page: 1,
        page_size: 10
    })
    const [verticalData, setVerticalData] = useState([]);

    const fetchVerticalData = async () => {
        const response = await dispatch(getListVerticalGroup(querySize))

        if (response.payload && response.payload.data.items.length > 0) {
            const verticalDataUpdate = response.payload.data.items.map((item, index) => (
                { value: item._id, label: item.name, keyword: item.keywords }
            ))
            setVerticalData(verticalDataUpdate)

        }
    }


    // load when component did updated
    const [message, setMessage] = useTimeOutMessage()

    const [globalData, setGlobalData] = useState({})

    const fetchGlobalData = async () => {
        const response = await dispatch(fetchGlobalAnalytic())
        setGlobalData(response.payload.data)
    }

    useEffect(() => {
        fetchGlobalData()
    }, [])


    const [showParameterGlobal, setShowParameterGlobal] = useState(true)
    const handleSetShowParameterGlobal = () => {
        setShowParameterGlobal(!showParameterGlobal)
    }

    const [showAccountParameterGlobal, setShowAccountParameterGlobal] = useState(true)
    const handleShowAccountParameterGlobal = () => {
        setShowAccountParameterGlobal(!showAccountParameterGlobal)
    }

    const [showPublicMetricsGlobal, setShowPublicMetricsGlobal] = useState(true)
    const handleShowPublicMetricsGlobal = () => {
        setShowPublicMetricsGlobal(!showPublicMetricsGlobal)
    }

    const [showTweetParameteGlobal, setShowTweetParameteGlobal] = useState(true)
    const handleShowTweetParameteGlobal = () => {
        setShowTweetParameteGlobal(!showTweetParameteGlobal)
    }

    const [showPublicMetricsParameterGlobal, setShowPublicMetricsParameterGlobal] = useState(true)
    const handleShowPublicMetricsParameterGlobal = () => {
        setShowPublicMetricsParameterGlobal(!showPublicMetricsParameterGlobal)
    }

    const [showTweetDate, setShowTweetDate] = useState(true);
    const handleShowTweetDate = () => {
        setShowTweetDate(!showTweetDate)
    }


    const onSaveGlobal = async (values, setSubmitting) => {

        const dataReq = {


            account_verified_point: values.account_verified_point,
            account_no_verified_point: values.account_no_verified_point,
            account_business_point: values.account_business_point,
        }

        if (values.followers_count_start) {
            dataReq['followers_count'] = {
                start: values.followers_count_start,
                end: values.followers_count_end
            }

        } else {
            dataReq['followers_count'] = null
        }

        if (values.following_count_start) {
            dataReq['following_count'] = {
                start: values.following_count_start,
                end: values.following_count_end
            }
        } else {
            dataReq['following_count'] = null
        }

        if (values.tweet_count_start) {
            dataReq['tweet_count'] = {
                start: values.tweet_count_start,
                end: values.tweet_count_end
            }
        } else {
            dataReq['tweet_count'] = null
        }


        if (values.listed_count_start) {
            dataReq['listed_count'] = {
                start: values.listed_count_start,
                end: values.listed_count_end
            }
        } else {
            dataReq['listed_count'] = null
        }

        if (values.retweet_count_start) {
            dataReq['retweet_count'] = {
                start: values.retweet_count_start,
                end: values.retweet_count_end
            }
        } else {
            dataReq['retweet_count'] = null
        }

        if (values.reply_count_start) {
            dataReq['reply_count'] = {
                start: values.reply_count_start,
                end: values.reply_count_end
            }
        } else {
            dataReq['reply_count'] = null
        }

        if (values.like_count_start) {
            dataReq['like_count'] = {
                start: values.like_count_start,
                end: values.like_count_end
            }
        } else {
            dataReq['like_count'] = null
        }

        if (values.quote_count_start) {
            dataReq['quote_count'] = {
                start: values.quote_count_start,
                end: values.quote_count_end
            }
        } else {
            dataReq['quote_count'] = null
        }

        if (values.impression_count_start) {
            dataReq['impression_count'] = {
                start: values.impression_count_start,
                end: values.impression_count_end
            }
        } else {
            dataReq['impression_count'] = null
        }

        if (values.account_age_range_end) {
            dataReq['account_age_range'] = {
                start: formatDate(values.account_age_range_start).toString(),
                end: formatDate(values.account_age_range_end).toString()
            }
        } else {
            dataReq['account_age_range'] = null
        }

        if (values.tweet_date_end) {
            dataReq['tweet_date'] = {
                start: formatDate(values.tweet_date_start).toString(),
                end: formatDate(values.tweet_date_end).toString()
            }
        } else {
            dataReq['tweet_date'] = null
        }

        setSubmitting(true)

        // handle create
        const res = dispatch(createGlobalAnalytic(dataReq))
        // if(res.meta.requestStatus ===  "fulfilled") {
        toast.push(
            <Notification
                title={'Successfuly save'}
                type="success"
                duration={2500}
            >
                Successfuly save
            </Notification>,
            {
                placement: 'top-end',
            }
        )
        // }

        setSubmitting(false)
    }

    const checkIsValidEndStart = (_start, _end) => {
        if (_start > _end) return false;
        return true;
    }



    return (
        <div >
            <Formik
                enableReinitialize
                initialValues={{

                    _id: globalData ? globalData._id : '',
                    account_verified_point: globalData ? globalData.account_verified_point : '',
                    account_no_verified_point: globalData ? globalData.account_no_verified_point : '',
                    account_business_point: globalData ? globalData.account_business_point : '',

                    total_follower_weight: globalData ? globalData.total_follower_weight : '',
                    total_following_weight: globalData ? globalData.total_following_weight : '',
                    total_tweet_weight: globalData ? globalData.total_tweet_weight : '',
                    total_listed_weight: globalData ? globalData.total_listed_weight : '',

                    account_age_range_start: globalData ? revertDate(globalData.account_age_range?.start) : '',
                    account_age_range_end: globalData ? revertDate(globalData.account_age_range?.end) : '',

                    tweet_date_start: globalData ? revertDate(globalData.tweet_date?.start) : null,
                    tweet_date_end: globalData ? revertDate(globalData.tweet_date?.end) : '',

                    total_like_weight: globalData ? globalData.total_like_weight : '',
                    total_quote_weight: globalData ? globalData.total_quote_weight : '',
                    total_retweet_weight: globalData ? globalData.total_retweet_weight : '',
                    total_reply_weight: globalData ? globalData.total_reply_weight : '',
                    total_impression_weight: globalData ? globalData.total_impression_weight : '',

                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {

                    // if (values && checkIsValidEndStart(values.account_age_range_start, values.account_age_range_end) && checkIsValidEndStart(values.tweet_date_start, values.tweet_date_end)) {

                    //     onSaveGlobal(values, setSubmitting)

                    // } else {
                    //     setSubmitting(false)
                    // }
                }}
            >
                {({ values, errors, touched, isSubmitting }) => (
                    <Form>
                        <FormContainer className="text-[#262626]">
                            <Field
                                className="hidden"
                                type="text"
                                name="_id"
                                component={Input}
                            />


                            <div className={expand ? `hidden` : ``}>

                                <div className='flex flex-row justify-between'>
                                    <h5 className="mb-4 mt-[34px] font-bold ">Parameter</h5>
                                    <div onClick={() => { handleSetShowParameterGlobal() }} className='flex items-center space-x-[6px] cursor-pointer'>
                                        <span className='text-[14px] text-[#595959] font-normal'>Advance</span>
                                        <img className={`${showParameterGlobal && "rotate-180"}`} src="/img/analytics/metadata/vector_down.svg" />
                                    </div>
                                </div>


                                <div className={` ${showParameterGlobal ? "block h-full" : "hidden h-0"} transition-all duration-300 ease-linear col-span-2`}>

                                    <div className='grid grid-cols-3 gap-x-[32px]'>

                                        <FormItem
                                            label="Account no verification point"
                                            asterisk
                                            invalid={errors.account_no_verified_point && touched.account_no_verified_point}
                                            errorMessage={errors.account_no_verified_point}
                                        >
                                            <Field
                                                type="number"
                                                step="0.1"
                                                name="account_no_verified_point"
                                                placeholder="Enter account no verification point"
                                                component={Input}
                                            // validate={validateName}
                                            />
                                        </FormItem>

                                        <FormItem
                                            label="Account verified point"
                                            asterisk
                                            invalid={errors.account_verified_point && touched.account_verified_point}
                                            errorMessage={errors.account_verified_point}
                                        >
                                            <Field
                                                type="number"
                                                step="0.1"
                                                name="account_verified_point"
                                                placeholder="Enter account verified point"
                                                component={Input}
                                            // validate={validateName}
                                            />
                                        </FormItem>

                                        <FormItem
                                            label="Account verified business point"
                                            asterisk
                                            invalid={errors.account_business_point && touched.account_business_point}
                                            errorMessage={errors.account_business_point}
                                        >
                                            <Field
                                                type="number"
                                                step="0.1"
                                                name="account_business_point"
                                                placeholder="Enter account verified business point"
                                                component={Input}
                                            // validate={validateName}
                                            />
                                        </FormItem>
                                    </div>
                                </div>
                                <div className='flex flex-row justify-between'>
                                    <h5 className="mb-4 mt-[34px]">Account Parameter</h5>
                                </div>

                                <div className={` col-span-2`}>
                                    <div className={`${showPublicMetricsGlobal ? "" : "mb-[40px]"} flex flex-row justify-between `}>
                                        <p className='text-[#0C72FA] text-[16px] font-bold'>Public Metrics</p>
                                        <div onClick={() => { handleShowPublicMetricsGlobal() }} className='flex items-center space-x-[6px] cursor-pointer'>
                                            <span className='text-[14px] text-[#595959] font-normal'>Advance</span>
                                            <img className={`${showPublicMetricsGlobal && "rotate-180"}`} src="/img/analytics/metadata/vector_down.svg" />
                                        </div>
                                    </div>
                                    <div className={` ${showPublicMetricsGlobal ? "block h-full" : "hidden h-0"} transition-all duration-300 ease-linear col-span-2`}>
                                        <div className='grid grid-cols-1 gap-x-[32px] w-full mt-[20px]'>

                                            <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>
                                                <div>
                                                    <span className='text-[14px] font-semibold mb-2 inline-block'>Total Follower Weight</span>

                                                    <FormItem
                                                        invalid={errors.total_follower_weight && touched.total_follower_weight}
                                                        errorMessage={errors.total_follower_weight}
                                                    >
                                                        <Field
                                                            type="number"
                                                            name="total_follower_weight"
                                                            className="bg-[#F9FAFB]"
                                                            placeholder="Enter Total Follower Weight"
                                                            component={Input}
                                                        />
                                                    </FormItem>

                                                </div>
                                                <div>
                                                    <span className='text-[14px] font-semibold inline-block mb-2'>Total Following Weight</span>

                                                    <FormItem
                                                        invalid={errors.total_following_weight && touched.total_following_weight}
                                                        errorMessage={errors.total_following_weight}
                                                    >
                                                        <Field
                                                            type="number"
                                                            className="bg-[#F9FAFB]"
                                                            name="total_following_weight"
                                                            placeholder="Enter Total Following Weight"
                                                            component={Input}
                                                        />
                                                    </FormItem>


                                                </div>
                                            </div>

                                        </div>

                                        <div className='grid grid-cols-1 gap-x-[32px] w-full mt-[20px]'>

                                            <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>

                                                <div>
                                                    <span className='text-[14px] font-semibold mb-2 inline-block'>Total Tweet Weight</span>
                                                    <FormItem
                                                        invalid={errors.total_tweet_weight && touched.total_tweet_weight}
                                                        errorMessage={errors.total_tweet_weight}
                                                    >
                                                        <Field
                                                            className="bg-[#F9FAFB]"
                                                            type="number"
                                                            name="total_tweet_weight"
                                                            placeholder="Enter Total Tweet Weight"
                                                            component={Input}
                                                        />
                                                    </FormItem>

                                                </div>
                                                <div>
                                                    <span className='text-[14px] font-semibold mb-2 inline-block'>Total Listed Weight</span>
                                                    <FormItem
                                                        invalid={errors.total_listed_weight && touched.total_listed_weight}
                                                        errorMessage={errors.total_listed_weight}
                                                    >
                                                        <Field
                                                            type="number"
                                                            className="bg-[#F9FAFB]"
                                                            name="total_listed_weight"
                                                            placeholder="Enter Total Listed Weight"
                                                            component={Input}
                                                        />
                                                    </FormItem>

                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <p className='text-[#0C72FA] text-[16px] font-bold'>Account Age Range</p>
                                    <div className='grid grid-cols-1 gap-x-[32px] w-full mt-[6px]'>

                                        <div className='grid grid-cols-2 gap-x-[32px]'>
                                            <FormItem

                                                invalid={errors.account_age_range_start && touched.account_age_range_start}
                                                errorMessage={errors.account_age_range_start}
                                            >
                                                <Field name="account_age_range_start" placeholder="DD/MM/YYYY">
                                                    {({ field, form }) => (
                                                        <DatePicker
                                                            className="bg-[#F9FAFB]"
                                                            placeholder="DD/MM/YYYY"
                                                            field={field}
                                                            form={form}
                                                            value={field.value}
                                                            onChange={(account_age_range_start) => {
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    account_age_range_start
                                                                )
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                            <FormItem
                                                invalid={errors.account_age_range_end && touched.account_age_range_end}
                                                errorMessage={errors.account_age_range_end}
                                            >
                                                <Field name="account_age_range_end" placeholder="DD/MM/YYYY">
                                                    {({ field, form }) => (
                                                        <DatePicker
                                                            placeholder="DD/MM/YYYY"
                                                            field={field}
                                                            form={form}
                                                            value={field.value}
                                                            onChange={(account_age_range_end) => {
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    account_age_range_end
                                                                )
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                                {!checkIsValidEndStart(values.account_age_range_start, values.account_age_range_end) && <span className='text-red-500'>To Date should be greater than From Date</span>}
                                            </FormItem>
                                        </div>
                                    </div>

                                </div>


                                <div className='pt-[34px] mt-[34px] border-[#D9D9D9] border-t-[1px]'>
                                    <div className='flex flex-row justify-between'>
                                        <h5 className="mb-4">Tweet Parameter</h5>
                                        <div onClick={() => { handleShowTweetParameteGlobal() }} className='flex items-center space-x-[6px] cursor-pointer'>
                                            <span className='text-[14px] text-[#595959] font-normal'>Advance</span>
                                            <img className={`${showTweetParameteGlobal && "rotate-180"}`} src="/img/analytics/metadata/vector_down.svg" />
                                        </div>
                                    </div>

                                    <div className={`${showTweetParameteGlobal ? "h-full" : 'h-0 hidden'} col-span-2`}>
                                        <div className='flex flex-row justify-between items-center'>
                                            <p className='text-[#0C72FA] text-[16px] font-bold'>Tweet Date</p>
                                        </div>
                                        <div className={`grid-cols-1 gap-x-[32px] w-full mt-[6px]`}>

                                            <div className='grid grid-cols-2 gap-x-[32px]'>
                                                <FormItem

                                                    invalid={errors.tweet_date_start && touched.tweet_date_start}
                                                    errorMessage={errors.tweet_date_start}
                                                >
                                                    <Field name="tweet_date_start" placeholder="DD/MM/YYYY">
                                                        {({ field, form }) => (
                                                            <DatePicker
                                                                placeholder="DD/MM/YYYY"
                                                                field={field}
                                                                form={form}
                                                                value={field.value}
                                                                onChange={(tweet_date_start) => {
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        tweet_date_start
                                                                    )
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </FormItem>
                                                <FormItem
                                                    invalid={errors.tweet_date_end && touched.tweet_date_end}
                                                    errorMessage={errors.tweet_date_end}
                                                >
                                                    <Field name="tweet_date_end" placeholder="DD/MM/YYYY">
                                                        {({ field, form }) => (
                                                            <DatePicker
                                                                placeholder="DD/MM/YYYY"
                                                                field={field}
                                                                form={form}
                                                                value={field.value}
                                                                onChange={(tweet_date_end) => {
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        tweet_date_end
                                                                    )
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                    {!checkIsValidEndStart(values.tweet_date_start, values.tweet_date_end) && <span className='text-red-500'>To Date should be greater than From Date</span>}

                                                </FormItem>
                                            </div>
                                        </div>

                                        {/* <div className={`${showPublicMetricsParameterGlobal ? "" : "mb-[40px]"} mt-[34px] flex flex-row justify-between items-center`}>
                                            <p className='text-[#0C72FA] text-[16px] font-bold'>Public Metrics</p>
                                            <div onClick={() => { handleShowPublicMetricsParameterGlobal() }} className='flex items-center space-x-[6px] cursor-pointer'>
                                                <span className='text-[14px] text-[#595959] font-normal'>Advance</span>
                                                <img className={`${showPublicMetricsParameterGlobal && "rotate-180"}`} src="/img/analytics/metadata/vector_down.svg" />
                                            </div>
                                        </div> */}

                                        {/* <div className={` ${showPublicMetricsParameterGlobal ? "block h-full" : "hidden h-0"} transition-all duration-300 ease-linear col-span-2`}>
                                            <div className='grid grid-cols-1 gap-x-[32px] w-full mt-[20px]'>

                                                <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>
                                                    <div>
                                                        <span className='text-[14px] font-semibold inline-block'>Total Retweet Weight</span>
                                                        <FormItem
                                                            invalid={errors.total_retweet_weight && touched.total_retweet_weight}
                                                            errorMessage={errors.total_retweet_weight}
                                                        >
                                                            <Field
                                                                className="bg-[#F9FAFB]"
                                                                type="number"
                                                                name="total_retweet_weight"
                                                                placeholder="Enter Total Like Weight"
                                                                component={Input}
                                                            // validate={validateName}
                                                            />
                                                        </FormItem>

                                                    </div>

                                                    <div>
                                                        <span className='text-[14px] font-semibold mb-2 inline-block'>Total Reply Weight</span>
                                                        <FormItem
                                                            invalid={errors.total_reply_weight && touched.total_reply_weight}
                                                            errorMessage={errors.total_reply_weight}
                                                        >
                                                            <Field
                                                                className="bg-[#F9FAFB]"
                                                                type="number"
                                                                name="total_reply_weight"
                                                                placeholder="Enter Total Reply Weight"
                                                                component={Input}
                                                            />
                                                        </FormItem>

                                                    </div>


                                                    {!checkIsValidEndStart(Number(values.retweet_count_start), Number(values.retweet_count_end)) && <span className='text-red-500'>To value should be greater than From value</span>}

                                                </div>




                                                <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>
                                                    <div>
                                                        <span className='text-[14px] font-semibold mb-2 inline-block'>Total Like Weight</span>
                                                        <FormItem
                                                            invalid={errors.total_like_weight && touched.total_like_weight}
                                                            errorMessage={errors.total_like_weight}
                                                        >
                                                            <Field
                                                                className="bg-[#F9FAFB]"
                                                                type="number"
                                                                name="total_like_weight"
                                                                placeholder="Enter Total Like Weight"
                                                                component={Input}
                                                            />
                                                        </FormItem>

                                                    </div>

                                                    <div>
                                                        <span className='text-[14px] font-semibold mb-2 inline-block'>Total Quote Weight</span>
                                                        <FormItem
                                                            invalid={errors.total_quote_weight && touched.total_quote_weight}
                                                            errorMessage={errors.total_quote_weight}
                                                        >
                                                            <Field
                                                                className="bg-[#F9FAFB]"
                                                                type="number"
                                                                name="total_quote_weight"
                                                                placeholder="Enter Total Quote Weight"
                                                                component={Input}

                                                            />
                                                        </FormItem>

                                                    </div>
                                                </div>


                                                <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>
                                                    <div>
                                                        <span className='text-[14px] font-semibold mb-2 inline-block'>Total Impression Weight</span>
                                                        <FormItem 
                                                            invalid={errors.total_impression_weight && touched.total_impression_weight}
                                                            errorMessage={errors.total_impression_weight}
                                                        >
                                                            <Field
                                                                className="bg-[#F9FAFB]"
                                                                type="number"
                                                                name="total_impression_weight"
                                                                placeholder="Enter Total Impression Weight"
                                                                component={Input}
                                                            />
                                                        </FormItem>

                                                    </div>
                                                </div>

                                            </div>
                                        </div> */}

                                    </div>


                                </div>

                                <FormItem>
                                    {checkRoles(user?.roles) && <div className='w-full flex justify-start '>
                                        {
                                            globalData && globalData._id ? (
                                                <Button style={{ background: "#0C72FA" }} type="submit" variant="solid">
                                                    {isSubmitting ? 'Update ...' : 'Update'}
                                                </Button>

                                            ) : (
                                                <Button style={{ background: "#0C72FA" }} type="submit" variant="solid">
                                                    {isSubmitting ? 'Save ...' : 'Save'}
                                                </Button>
                                            )
                                        }

                                    </div>}
                                </FormItem>
                            </div>

                            <div className='text-center flex flex-row justify-center'>
                                <span
                                    className='flex flex-row cursor-pointer gap-x-[6px]'
                                    onClick={() => setExpand(!expand)}
                                >
                                    {
                                        expand ? (
                                            <>
                                                Expand
                                                <img src="/img/analytics/metadata/vector_down.svg" alt='down' />
                                            </>
                                        ) :
                                            (
                                                <>
                                                    Collapse
                                                    <img src="/img/analytics/metadata/vector_up.svg" alt='up' />
                                                </>
                                            )
                                    }

                                </span>

                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>

            {message && (
                <Alert className="mb-4" type="danger" showIcon>
                    {message}
                </Alert>
            )}

            <div>
                {
                    stateLoading && (

                        <div
                            className="fixed justify-center items-center flex bg-black/[0.7] overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none"

                        >
                            <div className="absolute w-auto my-6 z-[9999] mx-auto max-w-3xl">
                                <Spinner size="3.25rem" />
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default GlobalForm