const appConfig = {
    // apiPrefix: '/api',
    apiPrefix: process.env.REACT_API_ENDPOINT,
    authenticatedEntryPath: 'pages/analytics/output',
    unAuthenticatedEntryPath: '/sign-in',
    tourPath: '/',
    locale: 'en',
    enableMock: false,
}

export default appConfig
