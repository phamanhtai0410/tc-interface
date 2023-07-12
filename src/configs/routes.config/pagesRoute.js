import React from 'react'
import { PAGES_PREFIX_PATH } from 'constants/route.constant'
import { ADMIN, USER } from 'constants/roles.constant'

const pagesRoute = [
    {
        key: 'pages.user',
        path: `${PAGES_PREFIX_PATH}/user-management`,
        component: React.lazy(() => import('views/pages/user')),
        authority: [ADMIN, USER],
    },
    {
        key: 'pages.follower_watch',
        path: `${PAGES_PREFIX_PATH}/follower-watch`,
        component: React.lazy(() => import('views/pages/follower-watch')),
        authority: [ADMIN, USER],
    },
    {
        key: 'pages.vertical_keyword',
        path: `${PAGES_PREFIX_PATH}/vertical-keyword`,
        component: React.lazy(() => import('views/pages/vertical-keyword')),
        authority: [ADMIN, USER],
    },
    {
        key: 'pages.follower_group',
        path: `${PAGES_PREFIX_PATH}/follower-group`,
        component: React.lazy(() => import('views/pages/follower-group')),
        authority: [ADMIN, USER],
    },
    {
        key: 'pages.relevant',
        path: `${PAGES_PREFIX_PATH}/relevant-group`,
        component: React.lazy(() => import('views/pages/relevant')),
        authority: [ADMIN, USER],
    },
    {
        key: 'pages.analytis.input',
        path: `${PAGES_PREFIX_PATH}/analytics/input`,
        component: React.lazy(() => import('views/pages/analytis')),
        authority: [ADMIN, USER],
    },
    {
        key: 'pages.analytis.output',
        path: `${PAGES_PREFIX_PATH}/analytics/output`,
        component: React.lazy(() => import('views/pages/analytis/output')),
        authority: [ADMIN, USER],
    },
    {
        key: 'pages.analytis.output',
        path: `${PAGES_PREFIX_PATH}/analytics/output/:run_id`,
        component: React.lazy(() => import('views/pages/analytis/output')),
        authority: [ADMIN, USER],
    },
    // {
    //     key: 'pages.analytis.metadata',
    //     path: `${PAGES_PREFIX_PATH}/analytics/metadata`,
    //     component: React.lazy(() => import('views/pages/analytis/metadata')),
    //     authority: [ADMIN, USER],
    // },
    {
        key: 'pages.user.change_pwd',
        path: `${PAGES_PREFIX_PATH}/user/change-pwd/:id`,
        component: React.lazy(() => import('views/pages/user/change-pwd')),
        authority: [ADMIN, USER],
    },
    {
        key: 'pages.accessDenied',
        path: '/access-denied',
        component: React.lazy(() => import('views/pages/AccessDenied')),
        authority: [ADMIN, USER],
    },

    {
        key: 'pages.analytic.detail',
        path: `${PAGES_PREFIX_PATH}/analytis/detail/:id`,
        component: React.lazy(() => import('views/pages/analytis/detail')),
        authority: [ADMIN, USER],
    },

    {
        key: 'pages.analytic.update',
        path: `${PAGES_PREFIX_PATH}/analytis/update/:id`,
        component: React.lazy(() => import('views/pages/analytis/update')),
        authority: [ADMIN, USER],
    },
    {
        key: 'pages.global',
        path: `${PAGES_PREFIX_PATH}/global`,
        component: React.lazy(() => import('views/pages/global')),
        authority: [ADMIN, USER],
    },
]

export default pagesRoute
