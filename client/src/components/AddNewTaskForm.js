import React from 'react';
import { connect } from 'react-redux'
import {Button, Form, Input, notification} from "antd";
import {addTask, getTasks} from "../services/taskServices";
const { TextArea } = Input;



function AddNewTaskForm(props) {

    const [form] = Form.useForm();

    const openNotification = (text) => {
        notification.open({
            message: 'New task added',
            description: text
        });
    };

    async function handleSubmit() {
        try {
            const task = await addTask({
                text: props.inputText,
                name: props.inputName,
                email: props.inputEmail,
            });
            const { data } = await getTasks(props.currentPage, props.sort);
            props.updateList(data)
            form.resetFields()
            props.setAddTaskPopoverVisibility()
            openNotification(task.data.text)

        } catch (e) {
            console.error(e);
        }
    }

    return(
        <div>
            <Form form={form} onFinish={handleSubmit}>
                <Form.Item
                    name={'name'}
                    label={'Name'}
                    rules={[{
                        required: true,
                        message: 'Please input your name!'
                    }]}>
                    <Input
                        value={props.inputName}
                        onChange={event => props.inputNameChanged(event.target.value)}
                        placeholder={'Enter your name'}/>
                </Form.Item>
                <Form.Item
                    name={'email'}
                    label={'E-mail'}
                    rules={[
                        { required: true, message: 'Please input your e-mail!' },
                        { type: "email", message: 'Wrong e-mail' }
                    ]}>
                    <Input
                        value={props.inputEmail}
                        onChange={event => props.inputEmailChanged(event.target.value)}
                        placeholder={'you@example.com'}/>
                </Form.Item>
                <Form.Item name={'text'} rules={[{required: true, message: 'Please input some test'}]}>
                    <TextArea
                        rows={3}
                        autoSize={{ minRows: 3, maxRows: 3 }}
                        value={props.inputText}
                        onChange={event => props.inputTextChanged(event.target.value)}
                        placeholder={"Add New TO-DO"}/>
                </Form.Item>
                <Form.Item>
                    <Button
                        htmlType="submit">
                        Add
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        inputName: state.inputName,
        inputEmail: state.inputEmail,
        inputText: state.inputText,
        items: [],
        currentPage: state.currentPage,
        sort: state.sort
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        inputNameChanged: (text) => {
            const action = {type: 'INPUT_NAME_CHANGE', text}
            dispatch(action)
        },
        inputEmailChanged: (text) => {
            const action = {type: 'INPUT_EMAIL_CHANGE', text}
            dispatch(action)
        },
        inputTextChanged: (text) => {
            const action = {type: 'INPUT_TEXT_CHANGE', text}
            dispatch(action)
        },
        updateList: (data) => {
            const action = {type: 'LIST_UPDATE', data }
            dispatch(action)
        },
        setAddTaskPopoverVisibility: () => {
            const action = {type: 'SET_ADD_POPOVER_VISIBILITY', visibility: false}
            dispatch(action)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewTaskForm)

