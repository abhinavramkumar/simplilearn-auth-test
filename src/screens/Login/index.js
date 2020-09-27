import { navigate } from '@reach/router';
import { useAuthDispatch } from 'components/AuthContext';
import React, { useState } from 'react';
import { toast } from 'react-toastify'


const loginUser = async (body) => {
  try {
    const response = await fetch("/api/auth/verify", {
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

const Login = () => {
  const [formState, setFormState] = useState({
    username: "",
    password: ""
  });
  const dispatch = useAuthDispatch();
  const [error, setError] = useState('');

  const onChangeTextInput = e => {
    const { name, value } = e.currentTarget;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const onClickLogin = async e => {
    e.preventDefault();
    if (formState.username && formState.password) {
      const body = {
        ...formState
      };
      const response = await loginUser(body);
      if (response.status === "success") {
        dispatch({
          isAuthenticated: true
        });
      } else {
        console.log("login failed!");
        toast.error(response.message, {});
      }
    } else {
      console.log("fields are empty");
    }
  };

  const onClickSignUp = e => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <div>
      <div className="block max-w-md mx-auto my-8 h-full border border-solid border-gray-300 rounded-lg shadow-lg">
        <div className="py-6 px-4">
          <div className="mb-6">
            <h1 className="text-center text-lg font-semibold">Simplilearn Auth Test - Login</h1>
          </div>
          <form>
            <fieldset className="mb-4">
              <label className="text-xs font-semibold" htmlFor="username">Username<input className="block w-full h-10 px-2 text-sm my-1 border border-solid border-gray-400 rounded-lg" type="text" name="username" value={formState.username} onChange={onChangeTextInput} /></label>
              <p className={`text-red-700 text-xs ${error ? `block` : `hidden`}`} >{error}</p>
            </fieldset>
            <fieldset className="mb-6">
              <label className="text-xs font-semibold" htmlFor="password">Password<input className="block w-full h-10 px-2 text-sm my-1 border border-solid border-gray-400 rounded-lg" type="password" name="password" value={formState.password} onChange={onChangeTextInput} autoComplete="on" /></label>
            </fieldset>
            <fieldset>
              <button className="block w-full h-10 rounded-lg text-center text-sm uppercase font-semibold text-white bg-purple-700 tracking-wide mb-4" type="button" onClick={onClickLogin}>Login</button>
              <button className="block w-full h-10 rounded-lg text-center text-sm uppercase font-semibold text-white bg-green-500 tracking-wide" type="button" onClick={onClickSignUp}>Sign Up</button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;