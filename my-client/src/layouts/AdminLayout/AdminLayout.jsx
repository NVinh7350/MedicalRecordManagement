import React, { useEffect } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { useSelector } from "react-redux";
import { loginSelector } from "../../pages/LoginPage/LoginSlice";
import { FaUserShield, FaUserInjured, FaUserMd, FaEdit } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import "./AdminLayout.css";
import { adminSelector } from "../../pages/AdminPage/AdminSlice";
import {ToastContainer, toast} from 'react-toastify'
const AdminLayout = ({ element}) => {
    const loginSelect = useSelector(loginSelector);
    const adminSelect = useSelector(adminSelector);
    const sideItemList = [
        {
            icon: AiFillHome,
            label: "Trang chủ",
            link: "/admin/user-list",
        },
        {
            icon: FaUserInjured,
            label: "Thêm bệnh nhân",
            link: "/admin/add-patient",
        },
        {
            icon: FaUserMd,
            label: "Thêm bác sĩ",
            link: "/admin/add-doctor",
        },
        {
            icon: FaEdit,
            label: "Chỉnh sửa thông tin",
            link: "/admin/edit-info",
        },
    ];

    useEffect(() => {
        if (adminSelect.isLoading == true) console.log("this i loading");
        if (adminSelect.error) {
            toast.error(adminSelect.error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        if(adminSelect.success){
            toast.success(adminSelect.success, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
        }
    }, [adminSelect.isLoading, adminSelect.error, adminSelect.success]);

    return (
        <div className="layout-container">
             <ToastContainer/>
            <SideBar sideItemList={sideItemList}></SideBar>
            <div className="layout-body">
                <div className="layout-title">
                    <div className="layout-role-title">
                        <i className="role-title">
                            <FaUserShield size={"20px"}></FaUserShield>
                        </i>
                        <h4 className="role-title">{loginSelect.user?.role}</h4>
                    </div>
                    <h4 className="role-title">{loginSelect.user?.fullName}</h4>
                </div>
                <div className="main-content">{element}</div>
            </div>
        </div>
    );
};

export default AdminLayout;
