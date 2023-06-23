import React, { useEffect, useState } from "react";
import "../../AdminPage/UserList/UserList.css";
import { useDispatch, useSelector } from "react-redux";
import { getAge, getDate, getDateTime } from "../../../utils/TimeUtils";
import Search from "../../../components/Search/Search";
import TabIndex from "../../../components/TabIndex/TabIndex";
import { MdCancel, MdCheckCircle } from "react-icons/md"
import { BsFillEyeFill} from 'react-icons/bs'
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import {
    patientSelector,
    getAccessList,
    revokeAccess,
    getDetailDoctor,
} from "../PatientSlice";
import { getUser } from "../../../utils/LocalStorage";
export const PatientAccessList = () => {
    const dispatch = useDispatch();
    const patientSelect = useSelector(patientSelector);
    const citizenId = JSON.parse(getUser())?.citizenId;
    const navigate = useNavigate();
    const [searchContent, setSearchContent] = useState("");
    useEffect(() => {
        dispatch(getAccessList());
    }, []);

    const handleShowDetailUser = async(userId, path) => {
        console.log(userId)
        console.log(path)
        dispatch(getDetailDoctor(userId));
        navigate(path)
    }

    return (
        <div className="main-content-container">
            <div className="main-content-header">
                <Search
                    onClick={() => {
                        dispatch(findPatientBySearch(searchContent));
                    }}
                    setSearchContent={setSearchContent}
                    planceHolder={"Tìm bác sĩ"}
                ></Search>
                <TabIndex></TabIndex>
            </div>
            <div className="line"></div>
            {patientSelect.isLoading ? (
                <ReactLoading
                    color="blue"
                    height="40px"
                    width="40px"
                    type={"spinningBubbles"}
                ></ReactLoading>
            ) : (
                <></>
            )}
            <table className="table">
                <thead>
                    <th>CMNN</th>
                    <th>Họ và Tên</th>
                    <th>Giới tính</th>
                    <th>Ngày sinh</th>
                    <th>Chức vụ</th>
                    <th>Khoa</th>
                    <th>Bệnh viện</th>
                    <th>Chi tiết</th>
                    <th>Thu hồi</th>
                </thead>
                <tbody>
                    {patientSelect.accessList?.map((request, index) => {
                        return (
                            <tr key={index}>
                                <td>{request?.doctor?.citizenId}</td>
                                <td>{request?.doctor?.user?.fullName}</td>
                                <td>
                                    {request?.doctor?.user?.gender === "MALE"
                                        ? "Nam"
                                        : "Nữ"}
                                </td>
                                <td>
                                    {`${getDate(request?.doctor?.user?.birthDay)} (${getAge(request?.doctor?.user?.birthDay)})`}
                                </td>
                                <td>{request?.doctor?.position}</td>
                                <td>{request?.doctor?.specialty}</td>
                                <td>{request?.doctor?.hospital}</td>
                                <td>
                                    {
                                        <BsFillEyeFill
                                            color="#695cfe"
                                            fontSize="20px"
                                            onClick={() =>  handleShowDetailUser(request?.doctor?.citizenId, '/patient/detail-doctor')}
                                        ></BsFillEyeFill>
                                    }
                                </td>
                                <td>
                                    {
                                        <MdCancel
                                            className="icon"
                                            color="red"
                                            fontSize="20px"
                                            onClick={() => dispatch(revokeAccess(request?.doctor?.citizenId))}
                                        ></MdCancel>
                                    }
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
