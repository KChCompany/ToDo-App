import React, {useEffect} from 'react';
import {deleteTask, getTasks, updateTask} from "../services/taskServices";
import {connect} from "react-redux";
import {Button, Checkbox, Popover} from "antd";
import UpdateTaskForm from "./UpdateTaskForm";

function TaskList(props) {
    useEffect( () => {
        async function fetchData() {
            try {
                const { data } = await getTasks(1, '-_id');
                props.updateList(data)
            } catch (e) {
                console.error(e);
            }
        }
        fetchData()
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    async function handleDelete(id) {
        try {
            await deleteTask(id, props.token)
            const { data } = await getTasks(props.pageCount < props.currentPage ? props.pageCount : props.currentPage, props.sort);
            props.updateList(data)
        } catch (e) {
            console.error(e);
        }
    }

    async function handleEdit(task) {
        props.inputTextChanged(task.text)
        props.setTaskIdForUpdate(task._id)
    }

    async function handleUpdate(id, completed) {
        try {
            await updateTask(id, {
                completed
            }, props.token)
            const { data } = await getTasks(props.currentPage, props.sort);
            props.updateList(data);
            props.setEditPopoverVisibility(false)
        } catch (e) {
            console.error(e);
        }
    }



    const { items } = props
    return(
        <div>
            {items.map((task) => (
                <div
                    key={task._id}
                    className="task_container"
                >
                    <div className={"task_header"}>
                        <div className={"task_user"}>
                            <div className={"task_name"}>
                                {task.name}
                            </div>
                            <div className={"task_email"}>
                                {task.email}
                            </div>
                        </div>
                        <div className={"task_checkbox"}>
                            <Checkbox
                                checked={task.completed}
                                disabled={props.token === ''}
                                onClick={() => handleUpdate(task._id, !task.completed)}
                                color="primary"
                            />
                        </div>
                    </div>
                    <div className={task.completed ? "task_text line_through" : "task_text"}>
                        {task.text}
                    </div>
                    <div className={'task_footer'}>
                        <div className={'task_changed'}>{task.changed && 'edited by admin'}</div>
                        {
                            props.token &&
                            <div className={'task_button_container'}>
                                <div className={'update_button'}>
                                    <Popover
                                        content={<UpdateTaskForm/>}
                                        trigger={'click'}
                                        onVisibleChange={() => props.setEditPopoverVisibility(!props.editPopoverVisibility)}
                                        visible={props.editPopoverVisibility && task._id === props.updateTaskId}
                                    >
                                        <Button
                                            type={"dashed"}
                                            shape={"round"}
                                            size={"small"}
                                            onClick={() => handleEdit(task)}
                                        >
                                            Edit
                                        </Button>
                                    </Popover>

                                </div>
                                <div>
                                    <Button
                                        onClick={() => handleDelete(task._id)}
                                        danger={true}
                                        shape={"round"}
                                        size={"small"}

                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            ))}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        items: state.items,
        count: state.count,
        token: state.token,
        currentPage: state.currentPage,
        pageCount: state.pageCount,
        sort: state.sort,
        editPopoverVisibility: state.editPopoverVisibility,
        updateTaskId: state.updateTaskId,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateList: (data) => {
            const action = {type: 'LIST_UPDATE', data }
            dispatch(action)
        },
        inputTextChanged: (text) => {
            const action = {type: 'INPUT_TEXT_UPDATE_CHANGE', text}
            dispatch(action)
        },
        setTaskIdForUpdate: (text) => {
            const action = {type: 'SET_TASK_ID_FOR_UPDATE', text}
            dispatch(action)
        },
        setEditPopoverVisibility: (visibility) => {
            const action = {type: 'SET_EDIT_POPOVER_VISIBILITY', visibility }
            dispatch(action)
        },

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList)
