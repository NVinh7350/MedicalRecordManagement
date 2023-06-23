import React, { useEffect } from "react";
import "./DetailUser.css";
import { useDispatch, useSelector } from "react-redux";
import { adminSelector, getDetailUser } from "../AdminSlice";
import { getAge, getDate } from "../../../utils/TimeUtils";
import ReactLoading from "react-loading"
export const DetailUser = () => {
    const adminSelect = useSelector(adminSelector);
    const detailUser = adminSelect.detailUser;
    const dispatch = useDispatch();
    return (
        <>
            {adminSelect.isLoading ? (
                <ReactLoading color="blue" height='40px' width='40px' type={"spinningBubbles"}></ReactLoading>
            ) : (
                <>
                    <div className="main-content-containe">
                        <h4>Thông tin cá nhân</h4>
                        <div className="user-info-container">
                            <div className="content-info">
                                <label>Số CMND:</label>
                                <p>{detailUser?.citizenId}</p>
                            </div>
                            <div className="content-info">
                                <label>HỌ TÊN:</label>
                                <p>{detailUser?.fullName}</p>
                            </div>
                            <div className="content-info">
                                <label>ĐIỆN THOẠI:</label>
                                <p>{detailUser?.phoneNumber}</p>
                            </div>
                        </div>
                        <div className="user-info-container">
                            <div className="content-info">
                                <label>DÂN TỘC:</label>
                                <p>{detailUser?.ethnicity}</p>
                            </div>
                            <div className="content-info">
                                <label>GIỚI TÍNH:</label>
                                <p>
                                    {detailUser?.gender === "MALE"
                                        ? "Nam"
                                        : "Nữ"}
                                </p>
                            </div>
                            <div className="content-info">
                                <label>EMAIL:</label>
                                <p>{detailUser?.email}</p>
                            </div>
                        </div>
                        <div className="user-info-container">
                            <div className="content-info">
                                <label>NGÀY SINH:</label>
                                <p>{`${getDate(
                                    detailUser?.birthDay
                                )}  (${getAge(detailUser?.birthDay)})`}</p>
                            </div>
                            <div className="content-info fg-2">
                                <label>ĐỊA CHỈ:</label>
                                <p>{detailUser?.address}</p>
                            </div>
                        </div>
                        <div className="doctor-info-container"></div>
                        <div className="patient-info-container"></div>
                    </div>
                    {detailUser?.role === "PATIENT" ? (
                        <div className="main-content-containe">
                            <h4>Thông tin bệnh nhân</h4>
                            <div className="user-info-container">
                                <div className="content-info fg-1">
                                    <label style={{ width: "160px" }}>
                                        Số BẢO HIỂM Y TẾ:
                                    </label>
                                    <p>{detailUser?.patient?.HICNumber}</p>
                                </div>
                                <div className="content-info fg-3">
                                    <label style={{ width: "150px" }}>
                                        HỌ TÊN NHÂN THÂN:
                                    </label>
                                    <p>{detailUser?.patient?.guardianName}</p>
                                </div>
                            </div>
                            <div className="user-info-container ">
                                <div className="content-info fg-1">
                                    <label style={{ width: "160px" }}>
                                        ĐIỆN THOẠI NHÂN THÂN:
                                    </label>
                                    <p>{detailUser?.patient?.guardianPhone}</p>
                                </div>

                                <div className="content-info fg-3">
                                    <label style={{ width: "150px" }}>
                                        ĐỊA CHỈ NHÂN THÂN:
                                    </label>
                                    <p>
                                        {detailUser?.patient?.guardianAddress}
                                    </p>
                                </div>
                            </div>
                            <div className="doctor-info-container"></div>
                            <div className="patient-info-container"></div>
                        </div>
                    ) : (
                        <></>
                    )}
                    {detailUser?.role === "DOCTOR" ? (
                        <div className="main-content-containe">
                            <h4>Thông tin bác sĩ</h4>
                            <div className="user-info-container">
                                <div className="content-info fg-1">
                                    <label style={{ width: "160px" }}>
                                        CHỨC VỤ:
                                    </label>
                                    <p>{detailUser?.doctor?.position}</p>
                                </div>
                                <div className="content-info fg-1">
                                    <label style={{ width: "150px" }}>
                                        KHOA: 
                                    </label>
                                    <p>{detailUser?.doctor?.specialty}</p>
                                </div>
                                <div className="content-info fg-1">
                                    <label style={{ width: "160px" }}>
                                        BỆNH VIỆN
                                    </label>
                                    <p>{detailUser?.doctor?.hospital}</p>
                                </div>
                            </div>
                            
                            <div className="doctor-info-container"></div>
                            <div className="patient-info-container"></div>
                        </div>
                    ) : (
                        <></>
                    )}
                </>
            )}
        </>
    );
};
