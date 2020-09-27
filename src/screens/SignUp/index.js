import SelectUsername from 'components/SelectUsername';
import React, { useState } from 'react';
import { toast } from 'react-toastify';


const userSignUp = async (body) => {
  try {
    const response = await fetch("/api/auth/signup", {
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

const SignUp = () => {
  const [userId, setUserId] = useState(null);
  const [isShowLoginButton, setIsShowLoginButton] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    password: "",
    email: "",
    confirmPassword: ""
  });
  const [formErrorState, setFormErrorState] = useState({
    name: "",
    password: "",
    email: "",
    confirmPassword: ""
  });

  const onChangeTextInput = e => {
    const { name, value } = e.currentTarget;
    // debugger;
    if (name === "password" || name === "confirmPassword") {
      setFormState(prevState => ({
        ...prevState,
        [name]: value
      }));
      if (value && value.length >= 8) {
        setFormErrorState(prevState => ({
          ...prevState,
          [name]: ""
        }));
      } else {
        setFormErrorState(prevState => ({
          ...prevState,
          [name]: "Password should have minimum 8 characters"
        }));
      }
    } else
      setFormState(prevState => ({
        ...prevState,
        [name]: value
      }));
  };

  const onBlurTextInput = e => {
    const { name, value } = e.currentTarget;

    if (!value) {
      setFormErrorState(prevState => ({
        ...prevState,
        [name]: `Field cannot be empty`
      }));
    } else if (name === "confirmPassword" && formState.password) {
      if (value !== formState.password) {
        setFormErrorState(prevState => ({
          ...prevState,
          confirmPassword: "Password dont match"
        }));
      }
    } else {
      setFormErrorState((prevState) => ({
        ...prevState,
        [name]: ""
      }));
    }

    const showLoginButton = formErrorState.confirmPassword.length > 0 && formErrorState.password.length > 0 && formErrorState.email.length > 0 && formErrorState.name.length > 0;

    console.log(showLoginButton);

    setIsShowLoginButton(showLoginButton);
  };

  const onSubmitForm = async e => {
    e.preventDefault();
    const { name, password, email, confirmPassword } = formState;

    if (name && password && email && confirmPassword) {
      if (!formErrorState.name && !formErrorState.email && !formErrorState.confirmPassword && !formErrorState.password) {
        const body = {
          name, password, email
        };

        const response = await userSignUp(body);

        console.log(response);
        if (response.status === "success") {
          setUserId(response.userId);
          toast.success("User created successfully", {});
        } else {
          toast.error(response.message, {});
        }
      }
    }
  };

  console.log({ formErrorState });

  return (
    <div>
      <div className="block max-w-md mx-auto my-8 h-full border border-solid border-gray-300 rounded-lg shadow-lg">
        <div className="py-6 px-4">
          <div className="mb-6">
            <h1 className="text-center text-lg font-semibold">Simplilearn Auth Test - Sign Up</h1>
          </div>
          {!userId ? (
            <form onSubmit={onSubmitForm}>
              <fieldset className="mb-4">
                <label className="text-xs font-semibold" htmlFor="name">Name<input className="block w-full h-10 px-2 text-sm my-1 border border-solid border-gray-400 rounded-lg" type="text" name="name" value={formState.name} onChange={onChangeTextInput} onBlur={onBlurTextInput} /></label>
                <p className={`text-red-700 text-xs ${formErrorState.name ? `block` : `hidden`}`} >{formErrorState.name}</p>
              </fieldset>

              <fieldset className="mb-6">
                <label className="text-xs font-semibold" htmlFor="email">Email<input className="block w-full h-10 px-2 text-sm my-1 border border-solid border-gray-400 rounded-lg" type="email" name="email" value={formState.email} onChange={onChangeTextInput} autoComplete="on" onBlur={onBlurTextInput} /></label>
                <p className={`text-red-700 text-xs ${formErrorState.email ? `block` : `hidden`}`} >{formErrorState.email}</p>
              </fieldset>

              <fieldset className="mb-6">
                <label className="text-xs font-semibold" htmlFor="password">Password<input className="block w-full h-10 px-2 text-sm my-1 border border-solid border-gray-400 rounded-lg" type="password" name="password" value={formState.password} onChange={onChangeTextInput} autoComplete="on" onBlur={onBlurTextInput} /></label>
                <p className={`text-red-700 text-xs ${formErrorState.password ? `block` : `hidden`}`} >{formErrorState.password}</p>
              </fieldset>

              <fieldset className="mb-4">
                <label className="text-xs font-semibold" htmlFor="confirmPassword">Confirm Password<input className="block w-full h-10 px-2 text-sm my-1 border border-solid border-gray-400 rounded-lg" type="password" name="confirmPassword" value={formState.confirmPassword} onChange={onChangeTextInput} onBlur={onBlurTextInput} autoComplete="on" /></label>
                <p className={`text-red-700 text-xs ${formErrorState.confirmPassword ? `block` : `hidden`}`} >{formErrorState.confirmPassword}</p>
              </fieldset>

              <fieldset>
                <button className={`block w-full h-10 rounded-lg text-center text-sm uppercase font-semibold text-white  tracking-wide bg-purple-700 ${isShowLoginButton ? '' : 'cursor-not-allowed '}`} type="submit">Login</button>
              </fieldset>
            </form>
          ) : (
              <SelectUsername userId={userId} />
            )}

        </div>
      </div>
    </div>
  );
};

export default SignUp;