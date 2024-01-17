import React, { useReducer, useEffect, useState, useContext } from "react";
import Input from '../../components/shared/FormElements/input'
import {VALIDATOR_EMAIL, VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_COMPARE_STR} from "../../utils/validators"
import {useForm} from '../../hooks/form-hook'
import { Link, Navigate } from "react-router-dom";
import Button from '../../components/shared/FormElements/button'


// css
import "./signin.css"
import CheckBox from "../../components/shared/FormElements/checkBox";
import { AuthContext } from "../../shared/context/auth-context";



export default function SignIn (props) {
    const auth = useContext(AuthContext)
    const [isLoginMode , setIsLoginMode] = useState(true);
    const [formState, inputHandler, setFormData] = useForm( 
    {
        email : {
        value : '',
        isValid : false
        },

        password : {
            value : '',
            isValid : false
        },
    }, false
    )


    const switchModeHandler = ( ) => {
        if(!isLoginMode) {
            setFormData(
                {
                ...formState.inputs,
                username : undefined,
                role : undefined,
                repassword : undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isVaslid
            )
        }
        else {
            setFormData(
                {
                    ...formState.inputs,
                    username : {
                        value : "",
                        isValid : false,
                    },
                    repassword : {
                        value : "",
                        isValid : false
                    },
                    role: {
                        value : "",
                        isValid : false
                    }
                },
                false
            );
        }
        setIsLoginMode(prev => !prev);
    };

    const authSubmitHandler = (event)=> {
        event.preventDefault();
        console.log(formState.inputs)
        auth.login('001');
    }

    return (
        <>
        { auth.isLoggedIn && (<Navigate to ='/home' replace = {true}/> )}
        <div className="container-fluid d-flex flex-column" id = "form-container">
        
        <form className='signin-form'>
            <div className="form-heading">
            <h3 >Đăng nhập</h3>
            <p>Học Tieng Anh tại HighFiveEnglish </p>
        </div>
        {!isLoginMode &&  
        <>
        <CheckBox
            id = "role"
            title = "Bạn là:"
            options = {[
            {label :"Học sinh", value : "student"}, {label : "Giáo viên" , value : "teacher"}]}
            defaultValue  = {formState.inputs.role.value}
            onInput = {inputHandler}
        />
        <Input
        element = "input"
        id = "username"
        type = "text"
        lable = "Tên người dùng"
        validators = {[VALIDATOR_REQUIRE()]}
        errorText =  { {
            "REQUIRE" : "Ô này không được để trống"
        }}
        onInput = {inputHandler}
        />
        </>
        
        }
        <Input
            element = "input"
            id = "email"
            type = "text"
            lable = "Email"
            validators = {[VALIDATOR_REQUIRE(),VALIDATOR_EMAIL()]}
            errorText =  { {
                "EMAIL": "Vui lòng nhập đúng định dạng của một email",
                "REQUIRE" : "Ô này không được để trống"
            }}
            onInput = {inputHandler}
        />

        <Input
            element = "input"
            id = "password"
            type = "password"
            lable = "Mật khẩu"
            validators = {[VALIDATOR_REQUIRE(),VALIDATOR_MINLENGTH(6)]}
            onInput = {inputHandler}
            errorText = {{
                "REQUIRE" : "Ô này không được để trống",
                'MINLENGTH' : `Mật khẩu phải có độ dài lớn hơn ${6}`
            }}
        />
        
        {!isLoginMode &&
        <>
        <Input
            element = "input"
            id = "repassword"
            type = "password"
            lable = "Nhập lại mật khẩu"
            validators = {[VALIDATOR_REQUIRE(),VALIDATOR_MINLENGTH(6), VALIDATOR_COMPARE_STR(formState.inputs.password.value)]}
            errorText = {{
                "REQUIRE" : "Ô này không được để trống",
                'MINLENGTH' : `Mật khẩu phải có độ dài lớn hơn ${6}`,
                "COMPARE_STR" : "Mật khẩu không trùng khớp"
            }}
            onInput = {inputHandler}
            listenTo = {{
                ele :formState.inputs.password.value ,
                triggers:[VALIDATOR_COMPARE_STR(formState.inputs.password.value)]
            }}
        />
        </>
        }
         <div className="suggest-signup d-flex justify-content-center gap-3">
            <Button
            className = "btn"
            type = "button"
            onClick={switchModeHandler}
            inverse
            >Chuyển sang {isLoginMode? "đăng ký" : "đăng nhập"}
            </Button>  
        </div>
        <div className="submit d-flex justify-content-center">
        <Button type = "submit" disabled = {!formState.isValid} className='btn btn-submit' primary
        onClick = {authSubmitHandler}
        >
        {isLoginMode ? 'Đăng nhập' : 'Đăng ký'}

        </Button >
        
        </div>
    </form>
       
    </div>
    </>
    )
}
