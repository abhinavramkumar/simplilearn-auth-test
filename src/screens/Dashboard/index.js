import { useAuthDispatch } from 'components/AuthContext';
import React, { useEffect, useState } from 'react';

const getUserData = async () => {
  try {
    const response = await fetch("/api/auth/get-user", {
      method: "get",
      headers: {
        "content-type": "application/json"
      },
    });
    const responseJson = await response.json();
    return responseJson;

  } catch (error) {
    return {
      status: "failure",
      message: "failed to fetch"
    };
  }
};

const logoutUser = async () => {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
    });
    const responseJson = await response.json();
    return responseJson;

  } catch (error) {
    return {
      status: "failure",
      message: "failed to fetch"
    };
  }
};

const Dashboard = () => {
  const [account, setAccount] = useState({});
  const dispatch = useAuthDispatch();

  useEffect(() => {
    getUserData().then((response) => {
      if (response.status === "success") {
        setAccount(response.account);
      } else {
        console.log("cant find user");
      }
    });
  }, []);

  const onClickLogout = async () => {
    logoutUser().then(() => {
      dispatch({
        isAuthenticated: false
      });
    });
  };

  return (
    <div className="max-w-md mx-auto my-8">
      <p className="text-sm mb-4 text-center">If you're seeing this then congrats! You've logged in successfully.</p>

      {!!account.name && (
        <div className="text-sm w-full border border-solid border-gray-300 px-4 py-6 rounded-lg mb-4">
          <h1 className="text-lg text-center mb-4">Account Details</h1>
          <p><span className="font-semibold mr-2 mb-2">Username:</span>{account.username}</p>
          <p><span className="font-semibold mr-2 mb-2">Email:</span>{account.email}</p>
          <p><span className="font-semibold mr-2 mb-2">Name:</span>{account.name}</p>
        </div>
      )}


      <div className="max-w-xs mx-auto">
        <button className="block w-full h-10 rounded-lg text-center text-sm uppercase font-semibold text-white bg-gray-700 tracking-wide" type="button" onClick={onClickLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;