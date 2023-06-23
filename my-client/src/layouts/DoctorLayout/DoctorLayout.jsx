import React, { useEffect } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { useSelector } from "react-redux";
import { loginSelector } from "../../pages/LoginPage/LoginSlice";
import {FaUserShield, FaUserInjured, FaUserMd, FaEdit, FaHourglassEnd} from 'react-icons/fa'
import {AiFillHome, AiOutlineFileAdd} from 'react-icons/ai'
import {MdPersonSearch} from 'react-icons/md'
import '../AdminLayout/AdminLayout.css'
const DoctorLayout = ({ element }) => {
    const loginSelect = useSelector(loginSelector);
    const sideItemList = [
        {
            icon: AiOutlineFileAdd,
            label: 'Tạo bệnh án',
            link: '/doctor/create-mr'
        },
        
        {
            icon: MdPersonSearch,
            label: 'Tìm bệnh nhân',
            link: '/doctor/find-patient'
        },
        {
            icon: FaUserInjured,
            label: 'Danh sách truy cập',
            link: '/doctor/access-list'
        },
        {
            icon: FaHourglassEnd,
            label: 'Danh sách yêu cầu',
            link: '/doctor/access-request-list'
        },
        {
            icon: FaEdit,
            label: 'Chỉnh sửa thông tin',
            link: '/doctor/edit-doctor-info'
        },
    ]
    return (
        <div className="layout-container">
            <SideBar sideItemList={sideItemList}></SideBar>
            <div className="layout-body">
                <div className="layout-title">
                    <div className="layout-role-title">
                        <i><FaUserShield size={'20px'}></FaUserShield></i>
                        <h4>{loginSelect.user?.role}</h4>
                    </div>
                    <h4>{loginSelect.user?.fullName}</h4>
                </div>
                <div className="main-content">{element}</div>
            </div>
        </div>
    );
};

export default DoctorLayout;
