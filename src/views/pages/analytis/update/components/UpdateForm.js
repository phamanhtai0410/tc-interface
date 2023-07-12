import React, { useEffect, useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { Input, Button, FormItem, FormContainer, Select, DatePicker, Alert, toast, Notification } from 'components/ui'
import { getListVerticalGroup, getListVerticalGroupById } from 'actions/vertical.actions'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { runAnalyticsVerticalAction, updateAnalytics } from 'actions/analytic.actions'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import { useNavigate } from 'react-router-dom'
import { getListFollowerGroup, getListFollowerGroupById } from 'actions/follower.actions'

const dateFormat = 'DD-MM-YYYY'

const validationSchema = Yup.object().shape({
    vertical_name: Yup.string().required('Please enter vertical name'),

    follower_group_id: Yup.string().required('Please enter Vertical Keyword Group Weight'),

    vertical_keyword_groups_weight: Yup.string().required('Please enter Vertical Keyword Group Weight'),
    follower_quality_weight: Yup.string().required('Please enter Follower Group Weight'),

    recency_weight: Yup.string().required('Please enter Recency weight'),
    engagement_weight: Yup.string().required('Please enter Engagement weight'),
    account_verified_weight: Yup.string().required('Please enter Account verified weight'),
    end_date: Yup.string().required('Please enter End Date'),

    followers_count_end: Yup.string().when("followers_count_start", {
        is: (followers_count_start) => followers_count_start != undefined,
        then: Yup.string().required('I am required now the followers_count')
    }).when("$followers_count_start", followers_count_start => {
        return followers_count_start &&
          Yup.number().min(followers_count_start)
    }),

    following_count_end: Yup.string().when("following_count_start", {
        is: (following_count_start) => following_count_start != undefined,
        then: Yup.string().required('I am required now the following_count')
    }).when("$following_count_start", following_count_start => {
        return following_count_start &&
          Yup.number().min(following_count_start)
    }),
    

    tweet_count_end: Yup.string().when("tweet_count_start", {
        is: (tweet_count_start) => tweet_count_start != undefined,
        then: Yup.string().required('I am required now the tweet_count')
    }).when("$tweet_count_start", tweet_count_start => {
        return tweet_count_start &&
          Yup.number().min(tweet_count_start)
    }),
    

    listed_count_end: Yup.string().when("listed_count_start", {
        is: (listed_count_start) => listed_count_start != undefined,
        then: Yup.string().required('I am required now the listed_count')
    }).when("$listed_count_start", listed_count_start => {
        return listed_count_start &&
          Yup.number().min(listed_count_start)
    }),
    

    // account_age_range_start: Yup.string().when("account_age_range_end", {
    //     is: (account_age_range_end) => account_age_range_end != undefined,
    //     then: Yup.string().required('Please enter Start date')
    // }),
    account_age_range_start: Yup.date().required('Please enter Account Age Range start').nullable().default(undefined),
    account_age_range_end: Yup.date()
        // .min('Account Age Range end must be greater than or equal to Account Age Range start')
        .required('Please enter Account Age Range end')
        .nullable().default(undefined),

    // tweet_date_start: Yup.string().when("tweet_date_end", {
    //     is: (tweet_date_end) => tweet_date_end != undefined,
    //     then: Yup.string().required('Please enter Start date')
    // }),

    tweet_date_start: Yup.date().nullable().default(undefined),
    tweet_date_end: Yup.date().nullable().default(undefined),

    retweet_count_end: Yup.string().when("retweet_count_start", {
        is: (retweet_count_start) => retweet_count_start != undefined,
        then: Yup.string().required('I am required now the Retweet_count')
    }).when("$retweet_count_start", retweet_count_start => {
        return retweet_count_start &&
          Yup.number().min(retweet_count_start)
    }),
   

    reply_count_end: Yup.string().when("reply_count_start", {
        is: (reply_count_start) => reply_count_start != undefined,
        then: Yup.string().required('I am required now the reply_count')
    }).when("$reply_count_start", reply_count_start => {
        return reply_count_start &&
          Yup.number().min(reply_count_start)
    }),


    like_count_end: Yup.string().when("like_count_start", {
        is: (like_count_start) => like_count_start != undefined,
        then: Yup.string().required('I am required now the like_count')
    }).when("$like_count_start", like_count_start => {
        return like_count_start &&
          Yup.number().min(like_count_start)
    }),
    

    quote_count_end: Yup.string().when("quote_count_start", {
        is: (quote_count_start) => quote_count_start != undefined,
        then: Yup.string().required('I am required now the quote_count_rate_quantity')
    }).when("$quote_count_start", quote_count_start => {
        return quote_count_start &&
          Yup.number().min(quote_count_start)
    }),
    

    impression_count_end: Yup.string().when("impression_count_start", {
        is: (impression_count_start) => impression_count_start != undefined,
        then: Yup.string().required('I am required now the impression_count_rate_quantity')
    }).when("$impression_count_start", impression_count_start => {
        return impression_count_start &&
          Yup.number().min(impression_count_start)
    }),
   
})

const UpdateAnalytisForm = ({data}) => {

    const navigate = useNavigate()
    const [stateLoading, setStateLoading] = useState(false)

    const [expand, setExpand] = useState(false)

    function convert_date(date) {
        var _date = date.split("-");
        var date_timestamp = new Date( _date[2], _date[1] - 1, _date[0]);
        return Math.floor(date_timestamp.getTime() /1000)
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
        return new Date(timestamp*1000)
    }   

    function convert_array(str_data) {
        return str_data.split(',');
    }

    function arr_id_vertical_keyword(value) {
        const _arr_vertical = []
        if (value ) {
            _arr_vertical.push(value)
        }
        return _arr_vertical
    }

    const dispatch = useDispatch()
    const [querySize,setQuerySize] = useState({
        page:1,
        page_size:10
    })
    const [ verticalData,setVerticalData ] = useState([]);
    const [ verticalKeyword, setVerticalKeyword ] = useState([])
    const [ defaultVertical, setDefaultVertical ] = useState([])

    const fetchVerticalData = async () => {
        const response = await dispatch(getListVerticalGroup(querySize))

        if(response.payload && response.payload.data.items.length > 0){
            const verticalDataUpdate = response.payload.data.items.map((item,index)=>(
                {value: item._id, label: item.name, keyword: item.keywords}
            ))
            setVerticalData(verticalDataUpdate)
        }
    }


    const handleOnchangeVerticalKeyword = (option) => {
        setDefaultVertical(option)
    }


    // load when component did updated
    const [message, setMessage] = useTimeOutMessage()

    useEffect(()=>{
        fetchVerticalData()
    },[])

    const fetchVerticalDataById = async ({params}) => {
        const response = await dispatch(getListVerticalGroupById(params))
        if(response.payload && response.payload.data.items.length > 0){
            const verticalDataDefault = response.payload.data.items.map((item,index)=>(
                {value: item._id, label: item.name, keyword: item.keywords}
            ))
            setDefaultVertical(verticalDataDefault)
            handleOnchangeVerticalKeyword(verticalDataDefault)
        }
    }

    useEffect(() => {
        const params = {
            ids: data.vertical_keyword_groups.toString()
        }
       fetchVerticalDataById({params})
    }, [])


    // fetch list follower data 
    const [ followerData, setFollowerData ] = useState([])

    const fetchFollowerData = async () => {
        const response = await dispatch(getListFollowerGroup(querySize))

        if(response.payload && response.payload.data.items.length > 0){
            const followerDataUpdate = response.payload.data.items.map((item,index)=>(
                {value: item._id, label: item.name}
            ))
            setFollowerData(followerDataUpdate)
        }
    }

    useEffect(() => {
        fetchFollowerData()
    }, [])


    const handleOnchangeFollower = (option) => {
        setdDefaultFollowerData(option)
    }



    const [ defaultFollowerData, setdDefaultFollowerData ] = useState([])
    const fectFollowerGroupById = async ({params}) => {
        const response = await dispatch(getListFollowerGroupById(params))

        if(response.payload && response.payload.data.items.length > 0){
            const followerDataDefault = response.payload.data.items.map((item,index)=>(
                {value: item._id, label: item.name}
            ))
            setdDefaultFollowerData(followerDataDefault)
        }
    }

    // const params = {}
    useEffect(() => {
        const params = {
            ids: data.follower_group_id.toString()
        }
        fectFollowerGroupById({params})
    }, [])
    

    const [showParameter, setShowParameter] = useState(false);
    const handleChangeShowParameter = () => {
        setShowParameter(!showParameter)
    }

    const [showPublicMetric, setShowPublicMetric] = useState(false);
    const handlerChangeShowPublicMetrics = () => {
        setShowPublicMetric(!showPublicMetric)
    }

    const [ showTweetParameter, setShowTweetParameter ] = useState(false)
    const handlerShowTweetParameter = () => {
        setShowTweetParameter(!showTweetParameter)
    }

    const [ showPublicMetricTweet, setShowPublicMetricTweet ] = useState(false)
    const handlerShowPublicMetricTweet = () => {
        setShowPublicMetricTweet(!showPublicMetricTweet)
    }

    const [ showEntities, setShowEntities ] = useState(true)
    const handlerShowEntities = () => {
        setShowEntities(!showEntities)
    }

    const checkIsValidEndStart = (_start,_end) => {
        if (_start > _end) return false;
        return true;
    }

    const onUpdate = async (values, setSubmitting) => {

        
        if(values.vertical_keyword_groups_weight + values.recency_weight + values.engagement_weight + values.follower_quality_weight + values.account_verified_weight != 100) {
            setSubmitting(true)
            setMessage('Total of weight must be equal 100')
            setSubmitting(false)
        } else {

        const dataReq = {
            id: data.analytics_id,
            vertical_name: values.vertical_name,
            vertical_keyword_groups: values.vertical_keyword_groups,
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


        const params = {
            _id: data.analytics_id
        }

        const result = await updateAnalytics(dataReq)
        if (result.status === 'failed') {
            setMessage(result.message)
        } else {
            setStateLoading(true)
            const response = await dispatch(runAnalyticsVerticalAction(params))
            if (response.meta.requestStatus === 'fulfilled') {
                setStateLoading(false)
            }

            navigate('/pages/analytics/output')
            toast.push(
                <Notification
                    title={'Successfuly run again'}
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

    return (
        <div >
            <Formik
                enableReinitialize
                initialValues={{
                    vertical_name: data.vertical_name || '',
                    note: data.note || '',
                    vertical_keyword_groups: data.vertical_keyword_groups,
                    follower_group_id: data.follower_group_id || '',

                    vertical_keyword_groups_weight: data.vertical_keyword_groups_weight || 0,
                    account_verified_weight: data.account_verified_weight || 0,

                    follower_quality_weight: data.follower_quality_weight || '',

                    exclude_account: data.exclude_account?.length === 0 ? '' : data.exclude_account,

                    account_verified_point: data.account_verified_point || 0,
                    account_no_verified_point: data.account_no_verified_point || 0,
                    account_business_point: data.account_business_point || 0,

                    recency_point: data.recency_point || 0,
                    recency_weight: data.recency_weight || 0,
                    engagement_weight: data.engagement_weight || 0,
                    end_date: revertDate(data.end_date) || 0,

                    followers_count_start: data.followers_count? data.followers_count.start : '',
                    followers_count_end: data.followers_count? data.followers_count.end : '',
                    
                    
                    following_count_start: data.following_count? data.following_count.start : '',
                    following_count_end: data.following_count? data.following_count.end : '',
                   

                    tweet_count_start: data.tweet_count? data. tweet_count.start : '',
                    tweet_count_end: data.tweet_count? data. tweet_count.end : '',
                   

                    listed_count_start: data.listed_count? data.listed_count.start : '',
                    listed_count_end: data.listed_count? data.listed_count.end : '',
                    

                    account_age_range_start: data.account_age_range? revertDate(data.account_age_range.start) : '',
                    account_age_range_end: data.account_age_range? revertDate(data.account_age_range.end) : '',
                    tweet_date_start: data.tweet_date? revertDate(data.tweet_date.start) : '',
                    tweet_date_end: data.tweet_date? revertDate(data.tweet_date.end) : '',

                    retweet_count_start: data.retweet_count? data.retweet_count.start : '',
                    retweet_count_end: data.retweet_count? data.retweet_count.end : '',
                    

                    reply_count_start: data.reply_count? data.reply_count.start : '',
                    reply_count_end: data.reply_count? data.reply_count.end : '',
                    

                    like_count_start: data.like_count? data.like_count.start : '',
                    like_count_end: data.like_count? data.like_count.end : '',
                    

                    quote_count_start: data.quote_count? data.quote_count.start : '',
                    quote_count_end: data.quote_count? data.quote_count.end : '',
                   

                    impression_count_start: data.impression_count? data.impression_count.start : '',
                    impression_count_end: data.impression_count? data.impression_count.end : '',
                    

                    hashtags: data.hashtags ? data.hashtags.toString() : '',

                    mentions: data.mentions ? data.mentions.toString() : '',

                    
                    cashtags: data.cashtags ? data.cashtags.toString() : '',

                    annotations: data.annotations ? data.annotations.toString() : '',

                }}

                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                   
                        if (values && checkIsValidEndStart(values.account_age_range_start,values.account_age_range_end) && checkIsValidEndStart(values.tweet_date_start,values.tweet_date_end)) {
                            onUpdate(values, setSubmitting)
                        
                        } else {
                            alert("Error")
                            setSubmitting(false)
                        }
                    }}
                >
                {({ values, errors, touched, isSubmitting }) => (
                    <Form>
                    <FormContainer>

                        <FormItem
                            label="Vertical Name"
                            asterisk
                            invalid={errors.vertical_name && touched.vertical_name}
                            errorMessage={errors.vertical_name}
                        >
                            <Field
                                type="text"
                                disabled
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
                                    name="note"
                                    placeholder="Enter note"
                                    textArea
                                    component={Input}
                                />

                            </FormItem>

                            <div className='grid grid-cols-2 gap-x-[16px]'>
                                <FormItem
                                    label="Vertical Keyword Group"
                                    
                                >
                                    <Field name="vertical_keyword_groups">
                                        {({ field, form }) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                options={verticalData}
                                                value={defaultVertical || []}
                                                onChange={(option) =>{
                                                    form.setFieldValue(
                                                        field.name,
                                                        option.value
                                                    )
                                                    handleOnchangeVerticalKeyword(option)
                                                }
                                                    
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
                                        type="number"
                                        name="vertical_keyword_groups_weight"
                                        placeholder="Enter Vertical Keyword Group Weight"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    label="Follower Group"
                                    
                                >
                                    <Field name="follower_group_id">
                                        {({ field, form }) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                options={followerData}
                                                value={defaultFollowerData || []}
                                                onChange={(option) =>{
                                                    form.setFieldValue(
                                                        field.name,
                                                        option.value
                                                    )
                                                    handleOnchangeFollower(option)
                                                }
                                                }
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                <FormItem
                                    label="Follower Group Weight"
                                    asterisk
                                    invalid={errors.follower_quality_weight && touched.follower_quality_weight}
                                    errorMessage={errors.follower_quality_weight}
                                >
                                    <Field
                                        type="number"
                                        name="follower_quality_weight"
                                        placeholder="Enter Follower Group Weight"
                                        component={Input}
                                    />
                                </FormItem>

                            </div>
                            


                            {/* <AnalytisSegment /> */}
                            
                            <div className='flex items-center justify-between mt-[34px]'>
                                <h5 className="mb-4 text-[#262626]">Parameter</h5>
                                <div onClick={()=>{handleChangeShowParameter()}} className='flex items-center space-x-[6px] cursor-pointer'>
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
                                    <Field name="end_date" >
                                        {({ field, form }) => (
                                            <DatePicker
                                                placeholder="DD/MM/YYYY"
                                                field={field}
                                                end_date={true}
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
                                        type="text"
                                        name="exclude_account"
                                        placeholder="Enter Exclude Account"
                                        component={Input}
                                    />
                                </FormItem>
                                
                            </div>


                            <div className={`${showPublicMetric ? "" : "mb-[40px]"} flex flex-row justify-between `}>
                                <p className='text-[#0C72FA] text-[16px] font-bold'>Public Metrics</p>
                                <div onClick={()=>{handlerChangeShowPublicMetrics()}} className='flex items-center space-x-[6px] cursor-pointer'>
                                    <span className='text-[14px] text-[#595959] font-normal'>Advance</span>
                                    <img className={`${showPublicMetric && "rotate-180"}`} src="/img/analytics/metadata/vector_down.svg" />
                                </div>
                            </div>                   
                            
                            <div className={` ${showPublicMetric ? "block h-full" : "hidden h-0"} transition-all duration-300 ease-linear col-span-2`}>
                                <div className='grid grid-cols-1 gap-x-[32px] w-full mt-[20px]'>
                                    <FormItem
                                        label="Followers Count"
                                    >
                                        <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>

                                            <Field
                                                type="number"
                                                name="followers_count_start"
                                                placeholder="From"
                                                component={Input}
                                            />


                                            <Field
                                                type="number"
                                                name="followers_count_end"
                                                placeholder="To"
                                                component={Input}
                                            />

                                        </div>
                                    </FormItem>
                                </div>

                                <div className='grid grid-cols-1 gap-x-[32px] w-full mt-[20px]'>
                                    <FormItem
                                        label="Following Count"
                                    >
                                        <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>

                                            <Field
                                                type="number"
                                                name="following_count_start"
                                                placeholder="From"
                                                component={Input}
                                            />

                                            <Field
                                                type="number"
                                                name="following_count_end"
                                                placeholder="To"
                                                component={Input}
                                            />

                                        </div>
                                    </FormItem>
                                </div>


                                <div className='grid grid-cols-1 gap-x-[32px] w-full mt-[16px]'>
                                    <FormItem
                                        label="Tweet Count"

                                    >
                                        <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>

                                            <Field
                                                type="number"
                                                name="tweet_count_start"
                                                placeholder="From"
                                                component={Input}
                                            />


                                            <Field
                                                type="number"
                                                name="tweet_count_end"
                                                placeholder="To"
                                                component={Input}

                                            />

                                        
                                        </div>
                                    </FormItem>
                                </div>

                                <div className='grid grid-cols-1 gap-x-[32px] w-full mt-[16px]'>
                                    <FormItem
                                        label="Listed Count"
                                    
                                    >
                                        <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>
                                            <Field
                                                type="number"
                                                name="listed_count_start"
                                                placeholder="From"
                                                component={Input}
                                            />


                                            <Field
                                                type="number"
                                                name="listed_count_end"
                                                placeholder="To"
                                                component={Input}
                                            />

                                            
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
                                    <div onClick={()=>{handlerShowTweetParameter()}} className='flex items-center space-x-[6px] cursor-pointer'>
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

                                    <div className={`${showPublicMetricTweet ? "" : "mb-[40px]"} flex flex-row justify-between`}>
                                        <p className='text-[#0C72FA] mt-[34px] text-[16px] font-bold'>Public Metrics</p>
                                        <div onClick={()=>{handlerShowPublicMetricTweet()}} className='flex items-center space-x-[6px] cursor-pointer'>
                                            <span className='text-[14px] text-[#595959] font-normal'>Advance</span>
                                            <img className={`${showPublicMetricTweet && "rotate-180"}`} src="/img/analytics/metadata/vector_down.svg" />
                                        </div>
                                    </div>                           
                                    
                                    <div className={`${showPublicMetricTweet ? "block h-full" : "hidden h-0"}`}>
                                        <div className=' grid grid-cols-1 gap-x-[32px] w-full mt-[20px]'>
                                            <FormItem
                                                label="Retweet Count"
                                            
                                            >
                                                <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>

                                                    <Field
                                                        type="number"
                                                        name="retweet_count_start"
                                                        placeholder="From"
                                                        component={Input}
                                                    // validate={validateName}
                                                    />

                                                    <Field
                                                        type="number"
                                                        name="retweet_count_end"
                                                        placeholder="To"
                                                        component={Input}
                                                    />


                                                </div>
                                            </FormItem>


                                            <FormItem
                                                label="Reply Count"
                                            
                                            >
                                                <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>
                                                    <Field
                                                        type="number"
                                                        name="reply_count_start"
                                                        placeholder="From"
                                                        component={Input}

                                                    />

                                                    <Field
                                                        type="number"
                                                        name="reply_count_end"
                                                        placeholder="To"
                                                        component={Input}

                                                    />

                                                    
                                                </div>
                                            </FormItem>


                                            <FormItem
                                                label="Like Count"
                                          
                                            >
                                                <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>
                                                    <Field
                                                        type="number"
                                                        name="like_count_start"
                                                        placeholder="From"
                                                        component={Input}
                                                    // validate={validateName}
                                                    />

                                                    <Field
                                                        type="number"
                                                        name="like_count_end"
                                                        placeholder="To"
                                                        component={Input}
                                                    // validate={validateName}
                                                    />

                                                    
                                                </div>
                                            </FormItem>



                                            <FormItem
                                                label="Quote Count"

                                            >
                                                <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>
                                                    <Field
                                                        type="number"
                                                        name="quote_count_start"
                                                        placeholder="From"
                                                        component={Input}
                                                    />

                                                    <Field
                                                        type="number"
                                                        name="quote_count_end"
                                                        placeholder="To"
                                                        component={Input}
                                                    />

                                                    
                                                </div>
                                            </FormItem>


                                            <FormItem
                                                label="Impression Count"
                                            >
                                                <div className='grid grid-cols-2 gap-y-[8px] gap-x-[32px]'>
                                                    <Field
                                                        type="number"
                                                        name="impression_count_start"
                                                        placeholder="From"
                                                        component={Input}
                                                    />

                                                    <Field
                                                        type="number"
                                                        name="impression_count_end"
                                                        placeholder="To"
                                                        component={Input}
                                                    />

                                                    
                                                </div>
                                            </FormItem>
                                        </div>        
                                    </div>             
                                </div>
                                
                                
                                <div className={`${showPublicMetricTweet ? "" : "mb-[40px]"} flex flex-row justify-between`}>
                                    <p className='text-[#0C72FA] text-[16px] font-bold'>Entities</p>
                                    <div onClick={()=>{handlerShowEntities()}} className='flex items-center space-x-[6px] cursor-pointer'>
                                        <span className='text-[14px] text-[#595959] font-normal'>Advance</span>
                                        <img className={`${showEntities && "rotate-180"}`} src="/img/analytics/metadata/vector_down.svg" />
                                    </div>
                                </div>
                                <div className={`${showEntities ? "block h-full" : "hidden h-0"}`}>
                                    <div className='grid grid-cols-2 gap-x-[32px] w-full mt-[20px]'>
                                        <FormItem
                                            label="Hashtags"
                                        >
                                            <Field
                                                type="text"
                                                name="hashtags"
                                                placeholder="Enter hashtags"
                                                component={Input}
                                            />

                                        </FormItem>
                                        

                                        <FormItem
                                            label="Mentions"
                                        >
                                            <Field
                                                type="text"
                                                name="mentions"
                                                placeholder="Enter mentions"
                                                component={Input}
                                            />

                                        </FormItem>
                                        

                                        <FormItem
                                            label="Cashtags"
                                        >
                                            <Field
                                                type="text"
                                                name="cashtags"
                                                placeholder="Enter cashtags"
                                                component={Input}
                                            />

                                        </FormItem>
                                        

                                        <FormItem
                                            label="Annotations"
                                        >
                                            <Field
                                                type="text"
                                                name="annotations"
                                                placeholder="Enter annotations"
                                                component={Input}
                                            />

                                        </FormItem>
                                        
                                    </div>
                                </div>
                            </div>

                            <FormItem>
                                <div className='w-full flex justify-start '>
                                    <Button style={{ background: "#0C72FA" }} type="submit" variant="solid">
                                        {isSubmitting ? 'Run again ...' : 'Run again'}
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
        </div>
    )
}

export default UpdateAnalytisForm


