import {Button, Input} from "antd";
import React from "react";
import {connect} from "react-redux";
import {getTasks, updateTask} from "../services/taskServices";

function UpdateTaskForm(props) {

    async function handleUpdate() {
        try {
            await updateTask(props.updateTaskId, {
                text: props.inputUpdateTaskText,
                changed: true
            },  props.token)
            const { data } = await getTasks(props.currentPage, props.sort);
            props.updateList(data);
            props.setEditPopoverVisibility(false)
        } catch (e) {
            console.error(e);
        }
    }

    return(
        <div className={'update_task_form'}>
            <Input
                value={props.inputUpdateTaskText}
                onChange={event => props.inputTextChanged(event.target.value)}
            />
            <Button onClick={handleUpdate}>
                Update
            </Button>
        </div>

    )
}

const mapStateToProps = (state) => {
    return {
        inputUpdateTaskText: state.inputUpdateTaskText,
        updateTaskId: state.updateTaskId,
        token: state.token,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        inputTextChanged: (text) => {
            const action = {type: 'INPUT_TEXT_UPDATE_CHANGE', text}
            dispatch(action)
        },
        updateList: (data) => {
            const action = {type: 'LIST_UPDATE', data }
            dispatch(action)
        },
        setEditPopoverVisibility: (visibility) => {
            const action = {type: 'SET_EDIT_POPOVER_VISIBILITY', visibility }
            dispatch(action)
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateTaskForm)
