import authRoute from './authRoute'
import pagesRoute from './pagesRoute'

export const publicRoutes = [...authRoute]

export const protectedRoutes = [
    ...pagesRoute,
]
