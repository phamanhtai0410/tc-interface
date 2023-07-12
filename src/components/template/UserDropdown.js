import React from 'react'
import { Avatar, Dropdown } from 'components/ui'
import withHeaderItem from 'utils/hoc/withHeaderItem'
import useAuth from 'utils/hooks/useAuth'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { HiOutlineUser, HiOutlineLogout } from 'react-icons/hi'
import { selectUserRole } from 'store/role/roleSlice'

const dropdownItemList = []

export const UserDropdown = ({ className }) => {
    // bind this
    const userInfo = useSelector((state) => state.auth.user)
    const user = useSelector(selectUserRole)
    
    const UserAvatar = (
      <div className={classNames(className, "flex items-center gap-2")}>
        <Avatar size={32} shape="circle" icon={<HiOutlineUser />} />
        <div className="hidden md:block">
                <div className="text-xs capitalize">{user?.roles?.[0]}</div>
          <div className="font-bold">{userInfo?.payload?.name}</div>
        </div>
      </div>
    );
    
    const handleSignOut = () =>{
        // window.localStorage.clear();
        window.localStorage.removeItem('admin')
        window.localStorage.removeItem('accessToken')
        location.reload();
    }

    return (
        <div>
            <Dropdown
                menuStyle={{ minWidth: 240 }}
                renderTitle={UserAvatar}
                placement="bottom-end"
            >
                
                <Dropdown.Item
                    onClick={()=>{handleSignOut()}}
                    eventKey="Sign Out"
                    className="gap-2"
                >
                    <span className="text-xl opacity-50">
                        <HiOutlineLogout />
                    </span>
                    <span>Sign Out</span>
                </Dropdown.Item>
            </Dropdown>
        </div>
    )
}

export default withHeaderItem(UserDropdown)
