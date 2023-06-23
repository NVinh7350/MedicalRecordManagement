import React, { useEffect } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { useSelector } from "react-redux";
import { loginSelector } from "../../pages/LoginPage/LoginSlice";
import {FaUserShield, FaUserInjured, FaUserMd, FaEdit, FaHourglassEnd} from 'react-icons/fa'
import {AiFillHome,} from 'react-icons/ai'
import '../AdminLayout/AdminLayout.css'
const PatientLayout = ({ element }) => {
    const loginSelect = useSelector(loginSelector);
    const sideItemList = [
        // {
        //     icon: AiFillHome,
        //     label: 'Trang chủ',
        //     link: '/admin/user-list'
        // },
        // {
        //     icon: FaUserInjured,
        //     label: 'Thêm bệnh nhân',
        //     link: '/admin/add-patient'
        // },
        {
            icon: FaUserMd,
            label: 'Danh sách truy cập',
            link: '/patient/access-list'
        },
        {
            icon: FaHourglassEnd,
            label: 'Danh sách yêu cầu',
            link: '/patient/access-request-list'
        },
        {
            icon: FaEdit,
            label: 'Chỉnh sửa thông tin',
            link: '/patient/edit-patient-info'
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

export default PatientLayout;
