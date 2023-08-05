import { combineReducers } from 'redux'
import theme from './theme/themeSlice'
import auth from './auth'
import base from './base'
import locale from './locale/localeSlice'
import vertical from './vertical/verticalSlice'
import analytic from './analytics/analyticSlice'
import users from './users/usersSlice'
import analytic_detail from './analytics/analyticDetailSlice'
import follower from './follower/followerSlice'
import role from './role/roleSlice'
import followerWatch from './followerWatch/followerWatchSlice'
import excluded from './excluded/excludeSlice'
const rootReducer = (asyncReducers) => (state, action) => {
    const combinedReducer = combineReducers({
        theme,
        auth,
        base,
        locale,
        vertical,
        analytic,
        users,
        analytic_detail,
        follower,
        role,
        followerWatch,
        excluded,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}

export default rootReducer
