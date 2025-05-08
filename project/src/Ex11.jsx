import { useViewQuery } from "./f/user/userApi";
import React, { useEffect, useState } from "react";

const Ex11 = () => {
    const { data, isLoading, error, isSuccess, refetch } = useViewQuery({});
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (isSuccess) {
            setUserInfo(data?.data);
        }
    }, [isSuccess, data]);

    return (
        <>
            아이디: {userInfo?.userId} <br/>
            이름: {userInfo?.username} <br/>
            이메일: {userInfo?.email}
        </>
    );
}

export default Ex11;