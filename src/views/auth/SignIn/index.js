import React from 'react'
import SignInForm from './SignInForm'

const SignIn = () => {
    return (
        <div className='bg-[#fff] p-[48px] w-[496px] rounded-xl shadow-[0_4px_24px_rgba(20,42,74,0.12)]'>
            <div className="mb-8 flex justify-center">
                <img
                    src="/img/dashboard/logo_login.svg"
                    alt="logo_login"
                />
            </div>
            <SignInForm disableSubmit={false} />
        </div>
    )
}

export default SignIn
