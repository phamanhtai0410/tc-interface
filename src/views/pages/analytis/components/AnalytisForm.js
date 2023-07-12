import React, { useEffect, useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { Input, Button, FormItem, FormContainer, Select, DatePicker, Alert, toast, Notification, Spinner } from 'components/ui'
import AnalytisSegment from './AnalytisSegment'
import { getListVerticalGroup } from 'actions/vertical.actions'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { runAnalytics, runAnalyticsVerticalAction } from 'actions/analytic.actions'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import { useNavigate } from 'react-router-dom'
import { fetchGlobalAnalytic } from 'actions/global.actions'
import { getListFollowerGroup } from 'actions/follower.actions'


const dateFormat = 'DD-MM-YYYY'


const validationSchema = Yup.object().shape({
    vertical_name: Yup.string().required('Please enter vertical name'),
    vertical_keyword_groups: Yup.string().required('Please select one!'),
    follower_group_id: Yup.string().required('Please select one!'),
    vertical_keyword_groups_weight: Yup.string().required('Please enter Vertical Keyword Group Weight'),
    follower_group_weight: Yup.string().required('Please enter Follower Group Weight'),

    recency_weight: Yup.string().required('Please enter Recency weight'),
    engagement_weight: Yup.string().required('Please enter Engagement weight'),
    account_verified_weight: Yup.string().required('Please enter Account verified weight'),
    end_date: Yup.string().required('Please enter End Date'),

    account_no_verified_point: Yup.string().required('Please enter Account no verified weight'),
    account_verified_point: Yup.string().required('Please enter Account verified point'),
    account_business_point: Yup.string().required('Please enter Account business point'),

    followers_count_end: Yup.number().when("followers_count_start", {
        is: (followers_count_start) => followers_count_start != undefined,
        then: Yup.number().required('I am required now the followers_count')
    }).when("$followers_count_start", followers_count_start => {
        return followers_count_start &&
            Yup.number().min(followers_count_start)
    }),


    // tweet_date_start: Yup.string().ensure().when('tweet_date_end', {
    //     is: (tweet_date_end) => tweet_date_end,
    //     then: Yup.string().required('Please enter Start date')
    // }),
    tweet_date_start: Yup.date()
        // .required("Please enter  Tweet Date start")
        .nullable().default(undefined),
    tweet_date_end: Yup.date()
        // .required('Please enter Tweet Date end')
        .nullable().default(undefined),

    // account_age_range_start: Yup.date().ensure().when('account_age_range_end', {
    //     is: (account_age_range_end) => account_age_range_end,
    //     then: Yup.date().required('Please enter Start date')
    // }),

    account_age_range_start: Yup.date().nullable().default(undefined),
    account_age_range_end: Yup.date()
        // .min('Account Age Range end must be greater than or equal to Account Age Range start')
        // .required('Please enter Account Age Range end')
        .nullable().default(undefined),
})

const AnalytisForm = () => {
    const navigate = useNavigate()

    const [stateLoading, setStateLoading] = useState(false)
    const [expand, setExpand] = useState(false)

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

    function revertDate(timestamp) {
        return new Date(timestamp * 1000)
    }

    function convert_array(str_data) {
        return str_data.split(',').filter(item => item !== null && item !== undefined && item !== '' && item !== ' ');
    }

    function arr_id_vertical_keyword(value) {
        const _arr_vertical = []
        _arr_vertical.push(value)
        return _arr_vertical
    }


    const dispatch = useDispatch()
    const [querySize, setQuerySize] = useState({
        page: 1,
        page_size: 10
    })
    const [verticalData, setVerticalData] = useState([]);

    const [numPage, setNumPage] = useState();
    const [verticalKeyword, setVerticalKeyword] = useState([])

    const fetchVerticalData = async () => {
        const response = await dispatch(getListVerticalGroup(querySize))

        if (response.payload && response.payload.data.items.length > 0) {
            const verticalDataUpdate = response.payload.data.items.map((item, index) => (
                { value: item._id, label: item.name, keyword: item.keywords }
            ))
            setVerticalData([...verticalData, ...verticalDataUpdate])
            setNumPage(response.payload.data.num_of_page)
        }
    }

    const handleOnchangeVerticalKeyword = (keyword_data) => {
        let _keyword = []
        let _keyword_unique = []
        if (keyword_data != []) {

            keyword_data?.map((items) => {
                items?.keyword.map((item) => {
                    _keyword.push(item)
                })
            })

            _keyword_unique = [...new Set(_keyword)]
        }

        setVerticalKeyword(_keyword_unique)
    }

    // load when component did updated
    const [message, setMessage] = useTimeOutMessage()

    useEffect(() => {
        fetchVerticalData()
    }, [])

    useEffect(() => {
        if (querySize.page <= numPage) {
            fetchVerticalData()
        }
    }, [querySize])

    const [loading, setIsLoading] = useState(false);

    const handleScrolltoBottom = () => {
        setIsLoading(true)
        if (querySize.page <= numPage) {
            setQuerySize({ ...querySize, page: querySize.page + 1 })
        }
        if (querySize.page === numPage) {
            setIsLoading(false)
        }
    }

    // fetch follower-group data
    const [queryFollowerSize, setQueryFollowerSize] = useState({
        page: 1,
        page_size: 10
    })
    const [followerGroupData, setFollowerGroupData] = useState([]);
    const [numFollowerPage, setNumFollowerPage] = useState();

    const fetchFollowerGroupData = async () => {
        const response = await dispatch(getListFollowerGroup(queryFollowerSize))

        if (response.payload && response.payload.data.items.length > 0) {
            const followerGroupDataUpdate = response.payload.data.items.map((item, index) => (
                { value: item._id, label: item.name, keyword: item.keywords }
            ))
            setFollowerGroupData([...followerGroupData, ...followerGroupDataUpdate])
            setNumFollowerPage(response.payload.data.num_of_page)
        }
    }

    useEffect(() => {
        fetchFollowerGroupData()
    }, [])

    useEffect(() => {
        if (queryFollowerSize.page <= numFollowerPage) {
            fetchFollowerGroupData()
        }
    }, [queryFollowerSize])


    // handleScrollBottom Follower
    const [loadingFollower, setIsLoadingFollower] = useState(false);
    const handleScrolltoBottomFollower = () => {
        setIsLoadingFollower(true)
        if (queryFollowerSize.page <= numFollowerPage) {
            setQuerySize({ ...queryFollowerSize, page: queryFollowerSize.page + 1 })
        }
        if (queryFollowerSize.page === numFollowerPage) {
            setIsLoadingFollower(false)
        }
    }


    // set default global data
    const [globalData, setGlobalData] = useState({})

    const fetchGlobalData = async () => {
        const response = await dispatch(fetchGlobalAnalytic())
        setGlobalData(response.payload.data)
    }

    useEffect(() => {
        fetchGlobalData()
    }, [])



    const onRun = async (values, setSubmitting) => {

        if (values.vertical_keyword_groups_weight + values.recency_weight + values.engagement_weight + values.follower_quality_weight + values.account_verified_weight != 100) {
            setSubmitting(true)
            setMessage('Total of weight must be equal 100')
            setSubmitting(false)
        } else {

            const dataReq = {
                vertical_name: values.vertical_name,
                vertical_keyword_groups: arr_id_vertical_keyword(values.vertical_keyword_groups),
                follower_group_id: values.follower_group_id,
                note: values.note,


                end_date: formatDate(values.end_date),
                recency_weight: values.recency_weight,
                engagement_weight: values.engagement_weight,
                account_verified_weight: values.account_verified_weight,

                follower_quality_weight: values.follower_quality_weight,
                vertical_keyword_groups_weight: values.vertical_keyword_groups_weight
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

            if (values.hashtags) {
                dataReq['hashtags'] = convert_array(values.hashtags)
            } else {
                dataReq['hashtags'] = null
            }

            if (values.mentions) {
                dataReq['mentions'] = convert_array(values.mentions)
            } else {
                dataReq['mentions'] = null
            }

            if (values.cashtags) {
                dataReq['cashtags'] = convert_array(values.cashtags)
            } else {
                dataReq['cashtags'] = null
            }

            if (values.annotations) {
                dataReq['annotations'] = convert_array(values.annotations)
            } else {
                dataReq['annotations'] = null
            }

            if (values.exclude_account) {
                dataReq['exclude_account'] = convert_array(values.exclude_account)
            } else {
                dataReq['exclude_account'] = null
            }


            if (values.account_no_verified_point) {
                dataReq['account_no_verified_point'] = values.account_no_verified_point
            } else {
                dataReq['account_no_verified_point'] = null
            }

            if (values.account_verified_point) {
                dataReq['account_verified_point'] = values.account_verified_point
            } else {
                dataReq['account_verified_point'] = null
            }

            if (values.account_business_point) {
                dataReq['account_business_point'] = values.account_business_point
            } else {
                dataReq['account_business_point'] = null
            }

            setSubmitting(true)

            const result = await runAnalytics(dataReq)

            if (result.status === 'failed') {
                setMessage(result.message)
            } else {
                setStateLoading(true)
                const response = await dispatch(runAnalyticsVerticalAction(result))
                if (response.meta.requestStatus === 'fulfilled') {
                    setStateLoading(false)
                }

                navigate('/pages/analytics/output')
                toast.push(
                    <Notification
                        title={'Successfuly save'}
                        type="success"
                        duration={2500}
                    >
                        Successfuly run
                    </Notification>,
                    {
                        placement: 'top-center',
                    }

                )
            }

            setSubmitting(false)
        }
    }

    const [showParameter, setShowParameter] = useState(false);
    const handleChangeShowParameter = () => {
        setShowParameter(!showParameter)
    }

    const [showPublicMetric, setShowPublicMetric] = useState(false);
    const handlerChangeShowPublicMetrics = () => {
        setShowPublicMetric(!showPublicMetric)
    }

    const [showTweetParameter, setShowTweetParameter] = useState(false)
    const handlerShowTweetParameter = () => {
        setShowTweetParameter(!showTweetParameter)
    }

    const [showPublicMetricTweet, setShowPublicMetricTweet] = useState(true)
    const handlerShowPublicMetricTweet = () => {
        setShowPublicMetricTweet(!showPublicMetricTweet)
    }

    const [showEntities, setShowEntities] = useState(true)
    const handlerShowEntities = () => {
        setShowEntities(!showEntities)
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
                    vertical_name: '',
                    note: '',
                    vertical_keyword_groups: '',
                    vertical_keyword_groups_weight: '',

                    follower_group_id: '',
                    follower_group_weight: '',

                    end_date: '',
                    engagement_weight: '',
                    recency_weight: '',
                    account_verified_weight: '',
                    

                    exclude_account: '',
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

                    hashtags_list: '',
                    hashtags_weight: '',

                    mentions_list: '',
                    mentions_weight: '',

                    cashtags_list: '',
                    cashtags_weight: '',


                    annotations_list: '',
                    annotations_weight: '',

                    account_no_verified_point: globalData ? globalData.account_no_verified_point : '',
                    account_verified_point: globalData ? globalData.account_verified_point : '',
                    account_business_point: globalData ? globalData.account_business_point : '',
                    // account_verified_point: globalData ? globalData.account_verified_point : 0,


                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {

                    // if (values && checkIsValidEndStart(values.account_age_range_start,values.account_age_range_end) && checkIsValidEndStart(values.tweet_date_start,values.tweet_date_end)) {
                    //     onRun(values, setSubmitting)

                    // } else {
                    //     setSubmitting(false)
                    // }
                }}
            >
                {({ values, errors, touched, isSubmitting, handleChange }) => (
                    <Form>
                        <FormContainer>

                            <FormItem
                                label="Vertical Name"
                                asterisk
                                invalid={errors.vertical_name && touched.vertical_name}
                                errorMessage={errors.vertical_name}
                            >
                                <Field
                                    className="bg-[#F9FAFB] text-[#9A9FA5]"
                                    type="text"
                                    name="vertical_name"
                                    placeholder="Vertical Name"
                                    component={Input}
                                />
                            </FormItem>

                            <div className={expand ? `hidden` : `text-[#262626]`}>

                                <FormItem
                                    label="Note"
                                >
                                    <Field
                                        className="bg-[#F9FAFB] text-[#9A9FA5]"
                                        name="note"
                                        placeholder="Enter note"
                                        textArea
                                        component={Input}
                                    />

                                </FormItem>

                                {/* vertical keyword group */}
                                <div>
                                    <div className='flex items-center justify-between mb-[16px]'>
                                        <h2 className='text-[16px] text-[#0C72FA] font-bold'>Vertical Keyword Group</h2>
                                        <img className='cursor-pointer' src="/img/analytics/input/Plus.svg" />
                                    </div>

                                    <div className='grid grid-cols-2 gap-x-[16px]'>
                                        <FormItem
                                            label="Vertical Keyword Group"
                                            asterisk
                                            invalid={errors.vertical_keyword_groups && touched.vertical_keyword_groups}
                                            errorMessage={errors.vertical_keyword_groups}
                                        >

                                            <Field name="vertical_keyword_groups">
                                                {({ field, form }) => (
                                                    <Select
                                                        placeholder="Enter Vertical Keyword Group Name"
                                                        field={field}
                                                        form={form}
                                                        options={verticalData}
                                                        isLoading={loading}
                                                        onMenuScrollToBottom={handleScrolltoBottom}
                                                        value={verticalData.filter(
                                                            (option) =>
                                                                option.value ===
                                                                values.vertical_keyword_groups
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

                                        <FormItem
                                            label="Vertical Keyword Group Weight"
                                            asterisk
                                            invalid={errors.vertical_keyword_groups_weight && touched.vertical_keyword_groups_weight}
                                            errorMessage={errors.vertical_keyword_groups_weight}
                                        >
                                            <Field
                                                className="bg-[#F9FAFB] text-[#9A9FA5]"
                                                type="number"
                                                name="vertical_keyword_groups_weight"
                                                placeholder="Enter Vertical Keyword Group Weight"
                                                component={Input}
                                            />
                                        </FormItem>

                                    </div>

                                </div>
                                {/* Follower group */}
                                <div>
                                    <div className='flex items-center justify-between mb-[16px]'>
                                        <h2 className='text-[16px] text-[#0C72FA] font-bold'>Follower Group</h2>
                                        <img className='cursor-pointer' src="/img/analytics/input/Plus.svg" />
                                    </div>

                                    <div className='grid grid-cols-2 gap-x-[16px]'>
                                        <FormItem
                                            label="Follower Group"
                                            asterisk
                                            invalid={errors.follower_group_id && touched.follower_group_id}
                                            errorMessage={errors.follower_group_id}
                                        >
                                            <Field name="follower_group_id">
                                                {({ field, form }) => (
                                                    <Select
                                                        field={field}
                                                        form={form}
                                                        className="bg-[#F9FAFB] text-[#9A9FA5]"
                                                        placeholder="Enter Follower Group Weight"
                                                        options={followerGroupData}
                                                        isLoading={loadingFollower}
                                                        onMenuScrollToBottom={handleScrolltoBottomFollower}
                                                        value={followerGroupData.filter(
                                                            (option) =>
                                                                option.value ===
                                                                values.follower_group_id
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

                                        <FormItem
                                            label="Follower Group Weight"
                                            asterisk
                                            invalid={errors.follower_group_weight && touched.follower_group_weight}
                                            errorMessage={errors.follower_group_weight}
                                        >
                                            <Field
                                                type="number"
                                                className="bg-[#F9FAFB] text-[#9A9FA5]"
                                                name="follower_group_weight"
                                                placeholder="Enter Follower Group Weight"
                                                component={Input}
                                            />
                                        </FormItem>

                                    </div>
                                </div>





                                {/* <AnalytisSegment /> */}

                                <div className='flex items-center justify-between mt-[34px]'>
                                    <h5 className="mb-4 text-[#262626]">Parameter</h5>
                                    <div onClick={() => { handleChangeShowParameter() }} className='flex items-center space-x-[6px] cursor-pointer'>
                                        <span className='text-[14px] text-[#595959] font-normal'>Advance</span>
                                        <img className={`${showParameter && "rotate-180"}`} src="/img/analytics/metadata/vector_down.svg" />
                                    </div>
                                </div>


                                <div className='grid grid-cols-2 gap-x-[32px] w-full text-[#262626]'>

                                    <FormItem
                                        label="End Date"
                                        asterisk
                                        invalid={errors.end_date && touched.end_date}
                                        errorMessage={errors.end_date}
                                    >
                                        <Field name="end_date"
                                            >
                                            {({ field, form }) => (
                                                <DatePicker
                                                    end_date={true}
                                                    placeholder="DD/MM/YYYY"
                                                    field={field}
                                                    form={form}
                                                    value={field.value}
                                                    inputFormat={dateFormat}
                                                    onChange={(end_date) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            end_date
                                                        )
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>

                                    <FormItem
                                        label="Engagement weight"
                                        asterisk
                                        invalid={errors.engagement_weight && touched.engagement_weight}
                                        errorMessage={errors.engagement_weight}
                                    >
                                        <Field
                                            className="bg-[#F9FAFB] text-[#9A9FA5]"
                                            type="number"
                                            name="engagement_weight"
                                            placeholder="Enter engagement weight"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        label="Recency weight"
                                        asterisk
                                        invalid={errors.recency_weight && touched.recency_weight}
                                        errorMessage={errors.recency_weight}
                                    >
                                        <Field
                                            className="bg-[#F9FAFB] text-[#9A9FA5]"
                                            type="number"
                                            name="recency_weight"
                                            placeholder="Enter recency weight"
                                            component={Input}
                                        // validate={validateWeight}
                                        />
                                    </FormItem>

                                    <FormItem
                                        label="Account verified weight"
                                        asterisk
                                        invalid={errors.account_verified_weight && touched.account_verified_weight}
                                        errorMessage={errors.account_verified_weight}
                                    >
                                        <Field
                                            className="bg-[#F9FAFB] text-[#9A9FA5]"
                                            type="number"
                                            name="account_verified_weight"
                                            placeholder="Enter account verified point"
                                            component={Input}
                                        // validate={validateWeight}
                                        />
                                    </FormItem>

                                    <div className={` ${showParameter ? "block h-full" : "hidden h-0"} transition-all duration-300 ease-linear col-span-2`}>
                                        <div className=' grid grid-cols-1 gap-x-[32px] w-full'>
                                            <FormItem
                                                label="Account no verification point"
                                                asterisk
                                                invalid={errors.account_no_verified_point && touched.account_no_verified_point}
                                                errorMessage={errors.account_no_verified_point}
                                            >
                                                <Field
                                                    type="number"
                                                    name="account_no_verified_point"
                                                    placeholder="Enter account no verification point"
                                                    component={Input}
                                                // validate={validateWeight}
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
                                                    placeholder="Enter Account verified business point"
                                                    component={Input}
                                                // validate={validateName}
                                                />
                                            </FormItem>

                                        </div>
                                    </div>


                                </div>


                                <h5 className="mb-4 mt-[34px]">Account Parameter</h5>
                                <p className='text-[#0C72FA] text-[16px] font-bold'>Account properties</p>
                                <div className='grid grid-cols-1 w-full mt-[20px]'>
                                    <FormItem
                                        label="Exclude Account"
                                    >
                                        <Field
                                            className="bg-[#F9FAFB] text-[#9A9FA5]"
                                            type="text"
                                            name="exclude_account"
                                            placeholder="Enter Exclude Account"
                                            component={Input}
                                        />
                                    </FormItem>

                                </div>


                                <div className={`${showPublicMetric ? "" : "mb-[40px]"} flex flex-row justify-between `}>
                                    <p className='text-[#0C72FA] text-[16px] font-bold'>Public Metrics</p>
                                    <div onClick={() => { handlerChangeShowPublicMetrics() }} className='flex items-center space-x-[6px] cursor-pointer'>
                                        <span className='text-[14px] text-[#595959] font-normal'>Advance</span>
                                        <img className={`${showPublicMetric && "rotate-180"}`} src="/img/analytics/metadata/vector_down.svg" />
                                    </div>
                                </div>

                                <div className={` ${showPublicMetric ? "block h-full" : "hidden h-0"} transition-all duration-300 ease-linear col-span-2`}>
                                    <div className='grid grid-cols-1 gap-x-[32px] w-full mt-[20px]'>
                                        <FormItem
                                        >
                                            <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>
                                                <div>
                                                    <span className='text-[14px] font-semibold inline-block mb-[8px]'>Total Follower Weight</span>
                                                    <Field
                                                        className="bg-[#F9FAFB] text-[#9A9FA5]"
                                                        type="number"
                                                        name="total_follower_weight"
                                                        placeholder="Enter Total Follower Weight"
                                                        component={Input}
                                                    />
                                                </div>

                                                <div>
                                                    <span className='text-[14px] font-semibold inline-block mb-[8px]'>Total Following Weight</span>
                                                    <Field
                                                        className="bg-[#F9FAFB] text-[#9A9FA5]"
                                                        type="number"
                                                        name="total_following_weight"
                                                        placeholder="Enter Total Following Weight"
                                                        component={Input}
                                                    // value={values.followers_count_end}
                                                    />
                                                </div>
                                            </div>
                                        </FormItem>
                                    </div>

                                    <div className='grid grid-cols-1 gap-x-[32px] w-full mt-[20px]'>
                                        <FormItem
                                        >
                                            <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>
                                                <div>
                                                    <span className='text-[14px] font-semibold inline-block mb-[8px]'>Total Tweet Weight</span>
                                                    <Field
                                                        className="bg-[#F9FAFB] text-[#9A9FA5]"
                                                        type="number"
                                                        name="total_tweet_weight"
                                                        placeholder="Enter Total Tweet Weight"
                                                        component={Input}
                                                    />
                                                </div>

                                                <div>
                                                    <span className='text-[14px] font-semibold inline-block mb-[8px]'>Total Listed Weight</span>
                                                    <Field
                                                        className="bg-[#F9FAFB] text-[#9A9FA5]"
                                                        type="number"
                                                        name="total_listed_weight"
                                                        placeholder="Enter Total Listed Weight"
                                                        component={Input}
                                                    // value={values.followers_count_end}
                                                    />
                                                </div>
                                            </div>
                                        </FormItem>
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
                                            <FormItem>
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
                                        <div onClick={() => { handlerShowTweetParameter() }} className='flex items-center space-x-[6px] cursor-pointer'>
                                            <span className='text-[14px] text-[#595959] font-normal'>Advance</span>
                                            <img className={`${showTweetParameter && "rotate-180"}`} src="/img/analytics/metadata/vector_down.svg" />
                                        </div>
                                    </div>

                                    <div className={` ${showTweetParameter ? "block h-full" : "hidden h-0"} transition-all duration-300 ease-linear col-span-2`}>
                                        <p className='text-[#0C72FA] text-[16px] font-bold'>Tweet Date</p>
                                        <div className='grid grid-cols-1 gap-x-[32px] w-full mt-[6px]'>

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
                                                <FormItem>
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

                                        {/* PUBLIC METRICS TWEET PARAMETER */}
                                        <div className={`${showPublicMetricTweet ? "" : "mb-[40px]"} flex flex-row justify-between`}>
                                            <p className='text-[#0C72FA] mt-[34px] text-[16px] font-bold'>Public Metrics</p>
                                            <div onClick={() => { handlerShowPublicMetricTweet() }} className='flex items-center space-x-[6px] cursor-pointer'>
                                                <span className='text-[14px] text-[#595959] font-normal'>Advance</span>
                                                <img className={`${showPublicMetricTweet && "rotate-180"}`} src="/img/analytics/metadata/vector_down.svg" />
                                            </div>
                                        </div>

                                        <div className={`${showPublicMetricTweet ? "block h-full" : "hidden h-0"}`}>
                                            <div className=' grid grid-cols-1 gap-x-[32px] w-full mt-[20px]'>
                                                <FormItem
                                                // invalid={errors.Follower_quality_score && touched.Follower_quality_score}
                                                // errorMessage={errors.Follower_quality_score}
                                                >
                                                    <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>
                                                        <div>
                                                            <span className='text-[14px] font-semibold inline-block mb-[8px]'>Total Like Weight</span>
                                                            <Field
                                                                
                                                                className="bg-[#F9FAFB] text-[#9A9FA5]"
                                                                type="number"
                                                                name="total_like_weight"
                                                                placeholder="Enter Total Like Weight"
                                                                component={Input}
                                                            />
                                                        </div>

                                                        <div>
                                                            <span className='text-[14px] font-semibold inline-block mb-[8px]'>Total Quote Weight</span>
                                                            <Field
                                                                className="bg-[#F9FAFB] text-[#9A9FA5]"
                                                                type="number"
                                                                name="total_quote_weight"
                                                                placeholder="Enter Total Quote Weight"
                                                                component={Input}
                                                                value={values.total_quote_weight}
                                                            />
                                                        </div>
                                                    </div>
                                                </FormItem>
                                                <FormItem
                                                // invalid={errors.Follower_quality_score && touched.Follower_quality_score}
                                                // errorMessage={errors.Follower_quality_score}
                                                >
                                                    <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>
                                                        <div>
                                                            <span className='text-[14px] font-semibold inline-block mb-[8px]'>Total Retweet Weight</span>
                                                            <Field
                                                                className="bg-[#F9FAFB] text-[#9A9FA5]"
                                                                type="number"
                                                                name="total_retweet_weight"
                                                                placeholder="Enter Total Retweet Weight"
                                                                component={Input}
                                                            />
                                                        </div>

                                                        <div>
                                                            <span className='text-[14px] font-semibold inline-block mb-[8px]'>Total Reply Weight</span>
                                                            <Field
                                                                className="bg-[#F9FAFB] text-[#9A9FA5]"
                                                                type="number"
                                                                name="total_reply_weight"
                                                                placeholder="Enter Total Reply Weight"
                                                                component={Input}
                                                            // value={values.followers_count_end}
                                                            />
                                                        </div>
                                                    </div>
                                                </FormItem>


                                                <FormItem
                                                // invalid={errors.Follower_quality_score && touched.Follower_quality_score}
                                                // errorMessage={errors.Follower_quality_score}
                                                >
                                                    <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>
                                                        <div>
                                                            <span className='text-[14px] font-semibold inline-block mb-[8px]'>Total Impression Weight</span>
                                                            <Field
                                                                className="bg-[#F9FAFB] text-[#9A9FA5]"
                                                                type="number"
                                                                name="total_impression_weight"
                                                                placeholder="Enter Total Impression Weight"
                                                                component={Input}
                                                            // value={values.followers_count_end}
                                                            />
                                                        </div>
                                                    </div>
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>


                                    <div className={`${showPublicMetricTweet ? "" : "mb-[40px]"} flex flex-row justify-between`}>
                                        <p className='text-[#0C72FA] text-[16px] font-bold'>Entities</p>
                                        <div onClick={() => { handlerShowEntities() }} className='flex items-center space-x-[6px] cursor-pointer'>
                                            <span className='text-[14px] text-[#595959] font-normal'>Advance</span>
                                            <img className={`${showEntities && "rotate-180"}`} src="/img/analytics/metadata/vector_down.svg" />
                                        </div>
                                    </div>
                                    <div className={`${showEntities ? "block h-full" : "hidden h-0"}`}>
                                        <div className='grid grid-cols-2 gap-x-[32px] w-full mt-[20px]'>

                                            <div>
                                                <FormItem
                                                    label="Hashtags"
                                                >
                                                    <Field
                                                        type="text"
                                                        className="col-span-1 mb-[8px] bg-[#F9FAFB] text-[#9A9FA5]"
                                                        name="hashtags_list"
                                                        placeholder="Enter Hashtag List"
                                                        component={Input}
                                                    />
                                                    <Field
                                                        type="text"
                                                        className="col-span-1 bg-[#F9FAFB] text-[#9A9FA5]"
                                                        name="hashtags_weight"
                                                        placeholder="Enter Hashtags Weight"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                            </div>
                                            <div>
                                                <FormItem
                                                    label="Mentions"
                                                >
                                                    <Field
                                                        type="text"
                                                        className="col-span-1 mb-[8px] bg-[#F9FAFB] text-[#9A9FA5]"
                                                        name="mentions_list"
                                                        placeholder="Enter mentions list"
                                                        component={Input}
                                                    />
                                                    <Field
                                                        type="text"
                                                        className="col-span-1 bg-[#F9FAFB] text-[#9A9FA5]"
                                                        name="mentions_weight"
                                                        placeholder="Enter mentions Weight"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                            </div>


                                            <div>
                                                <FormItem
                                                    label="Cashtags"
                                                >
                                                    <Field
                                                        type="text"
                                                        className="col-span-1 mb-[8px] bg-[#F9FAFB] text-[#9A9FA5]"
                                                        name="cashtags_list"
                                                        placeholder="Enter Cashtags List"
                                                        component={Input}
                                                    />
                                                    <Field
                                                        type="text"
                                                        className="col-span-1 bg-[#F9FAFB] text-[#9A9FA5]"
                                                        name="cashtags_weight"
                                                        placeholder="Enter Cashtags Weight"
                                                        component={Input}
                                                    />

                                                </FormItem>
                                            </div>

                                            
                                            <div>
                                                <FormItem
                                                    label="Annotations"
                                                >
                                                    <Field
                                                        type="text"
                                                        className="col-span-1 mb-[8px] bg-[#F9FAFB] text-[#9A9FA5]"
                                                        name="annotations_list"
                                                        placeholder="Enter Annotations List"
                                                        component={Input}
                                                    />
                                                    <Field
                                                        type="text"
                                                        className="col-span-1 bg-[#F9FAFB] text-[#9A9FA5]"
                                                        name="annotations_weight"
                                                        placeholder="Enter Annotations Weight"
                                                        component={Input}
                                                    />

                                                </FormItem>
                                            </div>
                                            
                                            

                                        </div>
                                    </div>
                                </div>

                                <FormItem>
                                    <div className='w-full flex justify-start '>
                                        <Button style={{ background: "#0C72FA" }} type="submit" variant="solid">
                                            {isSubmitting ? 'Run ...' : 'Run'}
                                        </Button>
                                    </div>
                                </FormItem>
                            </div>

                            <div className='text-center flex flex-row justify-center text-[#262626]'>
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

export default AnalytisForm