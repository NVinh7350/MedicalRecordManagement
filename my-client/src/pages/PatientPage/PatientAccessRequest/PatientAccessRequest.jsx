import React, { useEffect, useState } from "react";
import "../../AdminPage/UserList/UserList.css";
import { useDispatch, useSelector } from "react-redux";
import { getAge, getDate, getDateTime } from "../../../utils/TimeUtils";
import Search from "../../../components/Search/Search";
import TabIndex from "../../../components/TabIndex/TabIndex";
import { MdCancel, MdCheckCircle } from "react-icons/md"
import { TbSend, TbSendOff } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import {
    cancelAccessRequest,
    patientSelector,
    getAccessRequestList,
    grantAccess,
} from "../PatientSlice";
import { getUser } from "../../../utils/LocalStorage";
export const PatientAccessRequest = () => {
    const dispatch = useDispatch();
    const patientSelect = useSelector(patientSelector);
    const citizenId = JSON.parse(getUser())?.citizenId;
    const navigate = useNavigate();
    const [searchContent, setSearchContent] = useState("");
    useEffect(() => {
        dispatch(getAccessRequestList());
    }, []);

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
                    <th>Chức vụ</th>
                    <th>Khoa</th>
                    <th>Bệnh viện</th>
                    <th>Thời gian yêu cầu</th>
                    <th>Chấp nhận</th>
                    <th>Hủy yêu cầu</th>
                </thead>
                <tbody>
                    {patientSelect.accessRequestList?.map((request, index) => {
                        return (
                            <tr key={index}>
                                <td>{request?.doctor?.citizenId}</td>
                                <td>{request?.doctor?.user?.fullName}</td>
                                <td>
                                    {request?.doctor?.user?.gender === "MALE"
                                        ? "Nam"
                                        : "Nữ"}
                                </td>
                                <td>{request?.doctor?.position}</td>
                                <td>{request?.doctor?.specialty}</td>
                                <td>{request?.doctor?.hospital}</td>
                                <td>
                                    {getDateTime(request?.doctor?.requestTime)}
                                </td>
                                <td>
                                    {
                                        <MdCheckCircle
                                            className="icon"
                                            color="green"
                                            fontSize="20px"
                                            onClick={() => dispatch(grantAccess(request?.doctor?.citizenId))}
                                        ></MdCheckCircle>
                                    }
                                </td>
                                <td>
                                    {
                                        <MdCancel
                                            className="icon"
                                            color="red"
                                            fontSize="20px"
                                            onClick={() => dispatch(cancelAccessRequest(request?.doctor?.citizenId))}
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
