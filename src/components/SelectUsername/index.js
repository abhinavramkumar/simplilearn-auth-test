import { useAuthDispatch } from 'components/AuthContext';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const selectUsername = async (body) => {
  try {
    const response = await fetch("/api/auth/select-username", {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(body)
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

const SelectUsername = ({ userId }) => {
  const [username, setUsername] = useState("");
  const [hasUsernameError, setHasUsernameError] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const dispatch = useAuthDispatch();

  const onChangeTextInput = e => {
    const { value } = e.currentTarget;
    setUsername(value);
  };


  const onSubmitUsername = async e => {
    e.preventDefault();
    if (username) {
      const response = await selectUsername({ username, userId });
      if (response.status === "success") {

        toast.success("Username successfully updated", {

        });
        dispatch({
          isAuthenticated: true
        });
      }
    }
  };

  // if username isnt empty check if username exists
  // if exists then throw error
  // else log user
  return (
    <form onSubmit={onSubmitUsername}>
      <fieldset className="mb-4">
        <label className="text-xs font-semibold" htmlFor="username">Username<input className="block w-full h-10 px-2 text-sm my-1 border border-solid border-gray-400 rounded-lg" type="text" name="name" value={username} onChange={onChangeTextInput} /></label>
        <p className={`text-red-700 text-xs ${hasUsernameError ? `block` : `hidden`}`} >{usernameError}</p>
      </fieldset>

      <fieldset>
        <button className="block w-full h-10 rounded-lg text-center text-sm uppercase font-semibold text-white bg-purple-700 tracking-wide" type="submit">Verify Username</button>
      </fieldset>
    </form>
  );
};

export default SelectUsername;