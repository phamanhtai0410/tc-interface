import React from 'react'
import { Menu, Tooltip } from 'components/ui'
import VerticalMenuIcon from './VerticalMenuIcon'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { AuthorityCheck } from 'components/shared'

const { MenuItem } = Menu

const CollapsedItem = ({ title, translateKey, children, direction }) => {
    const { t } = useTranslation()

    return (
        <Tooltip
            title={t(translateKey) || title}
            placement={direction === 'rtl' ? 'left' : 'right'}
        >
            {children}
        </Tooltip>
    )
}

const convertIcon = (key) => {
    if(key === 'pages.vertical_keyword') {
        return (
            <img
                src="/img/dashboard/logo_vertical.svg"
                alt="logo_vertical"
            />
        )
    }
    if(key === 'pages.follower_group') {
        return (
            <img
                src="/img/dashboard/logo_relevant.svg"
                alt="logo_relevant"
            />
        )
    }
    if(key === 'pages.user') {
        return (
            <img
                src="/img/dashboard/logo_user.svg"
                alt="logo_user"
            />
        )
    }
    if(key === 'pages.change_pwd') {
        return (
            <img
                src="/img/dashboard/logo_lock.svg"
                alt="logo_lock"
            />
        )
    }
    if(key === 'pages.global') {
        return (
            <img
                src="/img/dashboard/logo_global.svg"
                alt="logo_global"
            />
        )
    }
    if (key === 'pages.follower_watch') {
        return (
            <img
                src="/img/followerWatch/flWatch.svg"
                alt="logo_global"
            />
        )
    }
}

const DefaultItem = (props) => {
    const { nav, onLinkClick, sideCollapsed, userAuthority } = props

    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            <MenuItem key={nav.key} eventKey={nav.key} className="mb-2">
                <Link
                    to={nav.path}
                    onClick={() =>
                        onLinkClick?.({
                            key: nav.key,
                            title: nav.title,
                            path: nav.path,
                        })
                    }
                    className="flex items-center h-full w-full"
                >
                    {/* <VerticalMenuIcon icon={nav.icon} /> */}
                    <div className='flex mr-[8px]'>
                        {convertIcon(nav.key)}
                    </div>
                    {!sideCollapsed && (
                        <span>
                            <Trans
                                i18nKey={nav.translateKey}
                                defaults={nav.title}
                            />
                        </span>
                    )}
                </Link>
            </MenuItem>
        </AuthorityCheck>
    )
}

const VerticalSingleMenuItem = ({
    nav,
    onLinkClick,
    sideCollapsed,
    userAuthority,
    direction,
}) => {
    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            {sideCollapsed ? (
                <CollapsedItem
                    title={nav.title}
                    translateKey={nav.translateKey}
                    direction={direction}
                >
                    <DefaultItem
                        nav={nav}
                        sideCollapsed={sideCollapsed}
                        onLinkClick={onLinkClick}
                        userAuthority={userAuthority}
                    />
                </CollapsedItem>
            ) : (
                <DefaultItem
                    nav={nav}
                    sideCollapsed={sideCollapsed}
                    onLinkClick={onLinkClick}
                    userAuthority={userAuthority}
                />
            )}
        </AuthorityCheck>
    )
}

export default VerticalSingleMenuItem
