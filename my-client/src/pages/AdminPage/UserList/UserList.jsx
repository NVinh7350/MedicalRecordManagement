import React, { useEffect, useState } from "react";
import "./UserList.css";
import { useDispatch, useSelector } from "react-redux";
import adminSlice, {
    adminSelector,
    getDetailUser,
    getUserList,
    getUserListBySearch,
} from "../AdminSlice";
import { getAge, getDateTime } from "../../../utils/TimeUtils";
import Search from "../../../components/Search/Search";
import TabIndex from "../../../components/TabIndex/TabIndex";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import LoadingTable from "../../../components/LoadingTable/LoadingTable";
import NoResults from "../../../components/NoResults/NoResults";
export const UserList = () => {
    const dispatch = useDispatch();
    const adminSelect = useSelector(adminSelector);
    const navigate = useNavigate();
    const [searchContent, setSearchContent] = useState("");
    useEffect(() => {
        dispatch(getUserList());
    }, []);
    console.log(searchContent);
    const handleShowDetailUser = async (userId, path) => {
        dispatch(getDetailUser(userId));
        navigate(path);
    };
    return (
        <div className="main-content-container">
            <div className="main-content-header">
                <Search
                    onClick={() => {
                        dispatch(getUserListBySearch(searchContent));
                    }}
                    setSearchContent={setSearchContent}
                    planceHolder={"Tìm người dùng"}
                ></Search>
                <TabIndex></TabIndex>
            </div>
            <div className="line"></div>

            {adminSelect.isLoading ? (
                <table className="table">
                    <thead>
                        <th>CMNN</th>
                        <th>Họ và Tên</th>
                        <th>Giới tính</th>
                        <th>Ngày sinh</th>
                        <th>Loại</th>
                        <th>Ngày tạo</th>
                        <th>Chi tiết</th>
                    </thead>
                    <LoadingTable columnCount={7} rowCount={9}></LoadingTable>{" "}
                </table>
            ) : (
                adminSelect.userList.length >0 ?
                <table className="table">
                    <thead>
                        <th>CMNN</th>
                        <th>Họ và Tên</th>
                        <th>Giới tính</th>
                        <th>Ngày sinh</th>
                        <th>Loại</th>
                        <th>Ngày tạo</th>
                        <th>Chi tiết</th>
                    </thead>
                    <tbody>
                        {adminSelect.userList?.map((user, index) => (
                            <tr key={index}>
                                <td>{user.citizenNumber}</td>
                                <td>{user.fullName}</td>
                                <td>{user.gender === "MALE" ? "Nam" : "Nữ"}</td>
                                <td>{getAge(user.birthDay)}</td>
                                <td>{user.role}</td>
                                <td>{getDateTime(user.createDate)}</td>
                                <td>
                                    <BsFillEyeFill
                                        color="#695cfe"
                                        fontSize="20px"
                                        onClick={() =>
                                            handleShowDetailUser(
                                                user.citizenNumber,
                                                "/admin/detail-user"
                                            )
                                        }
                                    ></BsFillEyeFill>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                : <NoResults content={'Vui lòng tìm lại hoặc tạo người dùng này'} title={'Ngườ dùng không được tim thấy'}/>
            )}
        </div>
    );
};
