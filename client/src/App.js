import './App.css';
import {Button, Pagination, Popover, Select} from "antd";
import AddNewTaskForm from "./components/AddNewTaskForm";
import TaskList from "./components/TaskList";
import {connect} from "react-redux";
import {getTasks} from "./services/taskServices";
import LoginForm from "./components/LoginForm";

const { Option } = Select;

const ITEMS_PER_PAGE = 3;

function App(props) {

    async function handleChangePage(page, sort) {
        try {
            const { data } = await getTasks(page, sort);
            props.updateList(data)
        } catch (error) {
            console.log(error);
        }
    }

    async function handleChangeSort(sort) {
        try {
            props.setSort(sort.value)
            await handleChangePage(props.currentPage, sort.value)
        } catch (error) {
            console.log(error);
        }
    }

    function handleChangeVisibility(popoverName) {
        switch (popoverName) {
            case 'ADD_TASK_POPOVER': props.setAddTaskPopoverVisibility(!props.addTaskPopoverVisibility); break;
            case 'LOGIN_POPOVER': props.setLoginPopoverVisibility(!props.loginPopoverVisibility); break
        }
    }

    function handleSignOut() {
        try {
            props.resetToken()
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div className="App flex">
            <div className="container">
                <div className="heading">TO-DO</div>
                <div className="header_buttons">
                    <div>
                        <Popover
                            content={<AddNewTaskForm/>}
                            title={'New task'}
                            trigger={'click'}
                            onVisibleChange={() => handleChangeVisibility('ADD_TASK_POPOVER')}
                            visible={props.addTaskPopoverVisibility}
                        >
                            <Button
                                type={"primary"}
                                shape={"round"}
                            >Create new task</Button>
                        </Popover>
                    </div>
                    { props.token === '' ?
                        <div>
                            <Popover
                                content={<LoginForm/>}
                                title={'Sign In'}
                                trigger={'click'}
                                onVisibleChange={() => handleChangeVisibility('LOGIN_POPOVER')}
                                visible={props.loginPopoverVisibility}
                            >
                                <Button
                                    type={"primary"}
                                    shape={"round"}
                                >Sign In</Button>
                            </Popover>
                        </div>
                        :
                        <div>
                            <Button
                                type={"primary"}
                                shape={"round"}
                                onClick={handleSignOut}
                            >Sign Out</Button>
                        </div>
                    }

                </div>
                <div className={'sort_picker'}>
                    <div className={'sort_label'}>Sort by:</div>
                    <Select
                        labelInValue
                        defaultValue={'-_id' || null}
                        style={{ width: 120 }}
                        onChange={handleChangeSort}>
                        <Option value={"-_id"}>Default</Option>
                        <Option value={"name"}>Name [A-Z]</Option>
                        <Option value={"-name"}>Name [Z-A]</Option>
                        <Option value={"email"}>E-mail [A-Z]</Option>
                        <Option value={"-email"}>E-mail [Z-A]</Option>
                        <Option value={"-completed"}>Completed</Option>
                        <Option value={"completed"}>Uncompleted</Option>
                    </Select>
                </div>
                <TaskList/>
                <Pagination
                    className={"pagination"}
                    onChange={(count) => {
                        handleChangePage(count, props.sort)
                    }}
                    total={props.pageCount * ITEMS_PER_PAGE}
                    pageSize={ITEMS_PER_PAGE}/>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        items: state.items,
        count: state.count,
        pageCount: state.pageCount,
        sort: state.sort,
        currentPage: state.currentPage,
        addTaskPopoverVisibility: state.addTaskPopoverVisibility,
        loginPopoverVisibility: state.loginPopoverVisibility,
        token: state.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateList: (data) => {
            const action = {type: 'LIST_UPDATE', data }
            dispatch(action)
        },
        setSort: (sort) => {
            const action = {type: 'SET_SORT', sort }
            dispatch(action)
        },
        setAddTaskPopoverVisibility: (visibility) => {
            const action = {type: 'SET_ADD_POPOVER_VISIBILITY', visibility }
            dispatch(action)
        },
        setLoginPopoverVisibility: (visibility) => {
            const action = {type: 'SET_LOGIN_POPOVER_VISIBILITY', visibility }
            dispatch(action)
        },
        resetToken: () => {
            const action = {type: 'SET_TOKEN', token: '' }
            dispatch(action)
        },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
