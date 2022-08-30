import { configureStore} from "@reduxjs/toolkit";
import { createStateSyncMiddleware, initStateWithPrevTab } from 'redux-state-sync';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const initialState = {
    inputName: '',
    inputEmail: '',
    inputText: '',
    inputUpdateTaskText: '',
    updateTaskId: '',
    items: [],
    count: 1,
    currentPage: 1,
    pageCount: 1,
    sort: '-_id',
    token: '',
    inputLogin: '',
    inputPassword: '',
    addTaskPopoverVisibility: false,
    loginPopoverVisibility: false,
    editPopoverVisibility: false,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INPUT_NAME_CHANGE':
            return Object.assign({}, state, {inputName: action.text});
        case 'INPUT_EMAIL_CHANGE':
            return Object.assign({}, state, {inputEmail: action.text});
        case 'INPUT_TEXT_CHANGE':
            return Object.assign({}, state, {inputText: action.text});
        case 'INPUT_TEXT_UPDATE_CHANGE':
            return Object.assign({}, state, {inputUpdateTaskText: action.text});
        case 'SET_TASK_ID_FOR_UPDATE':
            return Object.assign({}, state, {updateTaskId: action.text});
        case 'LIST_UPDATE': {
            return Object.assign({}, state, {
                items: action.data.items,
                count: action.data.pagination.count,
                pageCount: action.data.pagination.pageCount,
                currentPage: action.data.pagination.currentPage
            });
        }
        case 'SET_SORT':
            return Object.assign({}, state, {sort: action.sort});
        case 'SET_TOKEN':
            return Object.assign({}, state, {token: action.token});
        case 'INPUT_LOGIN_CHANGE':
            return Object.assign({}, state, {inputLogin: action.text});
        case 'INPUT_PASSWORD_CHANGE':
            return Object.assign({}, state, {inputPassword: action.text});
        case 'SET_ADD_POPOVER_VISIBILITY':
            return Object.assign({}, state, {addTaskPopoverVisibility: action.visibility});
        case 'SET_LOGIN_POPOVER_VISIBILITY':
            return Object.assign({}, state, {loginPopoverVisibility: action.visibility});
        case 'SET_EDIT_POPOVER_VISIBILITY':
            return Object.assign({}, state, {editPopoverVisibility: action.visibility});
        default: return state;
    }
}

const config = {
    whitelist: ['SET_TOKEN']
};

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, reducer)


const middleware = [createStateSyncMiddleware(config)];
const store = configureStore({reducer: persistedReducer, middleware});

initStateWithPrevTab(store);

export default store;
