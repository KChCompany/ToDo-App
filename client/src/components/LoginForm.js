import {Button, Form, Input} from "antd";
import React from "react";
import {connect} from "react-redux";
import {loginUser} from "../services/loginServices";

function LoginForm(props) {

    async function handleLogin() {
        const { data } = await loginUser({
            login: props.inputLogin,
            password: props.inputPassword,
        })
        if (data.user) {
            props.setToken(data.user)
        } else {
            alert('Wrong login or password')
        }
    }

    return(
        <div>
            <Form onFinish={handleLogin}>
                <Form.Item
                    name={'login'}
                    label={'Login'}
                    rules={[{
                        required: true,
                        message: 'Login is empty!'
                    }]}>
                    <Input
                        value={props.inputLogin}
                        onChange={props.inputLoginChanged}
                        placeholder={'Enter your login'}/>
                </Form.Item>
                <Form.Item
                    name={'password'}
                    label={'Password'}
                    rules={[{
                        required: true,
                        message: 'Password is empty!'
                    }]}>
                    <Input.Password
                        value={props.inputPassword}
                        onChange={props.inputPasswordChanged}
                        placeholder={'password'}/>
                </Form.Item>
                <Form.Item>
                    <Button htmlType={"submit"}>
                        Sign In
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        token: state.token,
        inputLogin: state.inputLogin,
        inputPassword: state.inputPassword,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setToken: (token) => {
            const action = {type: 'SET_TOKEN', token }
            dispatch(action)
        },
        inputLoginChanged: (event) => {
            const action = {type: 'INPUT_LOGIN_CHANGE', text: event.target.value}
            dispatch(action)
        },
        inputPasswordChanged: (event) => {
            const action = {type: 'INPUT_PASSWORD_CHANGE', text: event.target.value}
            dispatch(action)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
