import { useSelector, useDispatch } from 'react-redux'
import { setUser, initialState } from 'store/auth/userSlice'
import { apiSignIn, apiSignOut, apiSignUp } from 'services/AuthService'
import { onSignInSuccess, onSignOutSuccess } from 'store/auth/sessionSlice'
import appConfig from 'configs/app.config'
import { REDIRECT_URL_KEY } from 'constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import { authService } from 'services/auth.service'
import { LocalStorageService } from 'helpers'
import { getMeRole } from 'actions/auth.actions'
import { setRoleUser } from 'store/role/roleSlice'
import { useEffect } from 'react'

function useAuth() {
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const query = useQuery()

    const { token, signedIn } = useSelector((state) => state.auth.session)

    const fetchGetRole = async () => {
        await dispatch(getMeRole())
    }

    useEffect(() => {
        if (LocalStorageService.getAccessToken()) {
            fetchGetRole()
        }
    }, [])


    const signIn = async (values) => {

        try {
            // const resp = await apiSignIn(values)
            const resp = await authService.login(values)
            if (resp.data) {
                const { access_token } = resp.data
                dispatch(onSignInSuccess(access_token))
 
                LocalStorageService.setToken(resp.data)

                if (values.rememberMe) {
                    localStorage.setItem('account', JSON.stringify({
                        username: values.username,
                        password: values.password,
                        rememberMe: values.rememberMe
                    }))
                }

                await dispatch(getMeRole({}));
                // if (response.payload && response.payload.data) {
                //     dispatch(setRoleUser({
                //         role: response.payload.data
                //     }))
                // }
                // const user = jwt(token);

                // if (user) {
                //     dispatch(
                //         setUser(
                //             {
                //                 avatar: '',
                //                 userName: 'admin',
                //                 authority: ['ADMIN'],
                //                 email: '',
                //             }
                //         )
                //     )
                // }
                
                navigate(
                    appConfig.authenticatedEntryPath
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
        } catch (err) {
            return {
                status: 'failed',
                // message: err?.msg || err.toString(),
                message: 'Email or Password not correct'
            }
        }
    }

    const signUp = async (values) => {
        try {
            const resp = await apiSignUp(values)
            if (resp.data) {
                const { token } = resp.data
                dispatch(onSignInSuccess(token))
                if (resp.data.user) {
                    dispatch(
                        setUser(
                            resp.data.user || {
                                avatar: '',
                                userName: 'Anonymous',
                                authority: ['USER'],
                                email: '',
                            }
                        )
                    )
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
        } catch (errors) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const handleSignOut = () => {
        dispatch(onSignOutSuccess())
        dispatch(setUser(initialState))
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        await apiSignOut()
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        signIn,
        signUp,
        signOut,
    }
}

export default useAuth
