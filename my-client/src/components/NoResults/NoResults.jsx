import React from "react";

const NoResults = ({ title, content }) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <img
                height={300}
                width={300}
                src="../../public/pictures/no-results-bg.png"
            ></img>
            <h2 style={{ color: "#333333", marginTop:'0px' }}>Người dùng không được tìm thấy</h2>
            <h3 style={{ color: "#CCCCCC", marginTop:'0px', fontWeight:'600' }}>
                Vui lòng tìm lại hoặc tạo người dùng này
            </h3>
        </div>
    );
};

export default NoResults;
