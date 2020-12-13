import { isMobile } from 'react-device-detect';
import request from '../../helpers/request';
import * as actionTypes from '../actionTypes';

const apiHost = isMobile
  ? 'http://192.168.2.106:3001/task'
  : 'http://localhost:3001/task';

export const getTasks = () => (dispatch) => {
  dispatch({ type: actionTypes.LOADING });

  request(apiHost)
    .then((tasks) => dispatch({ type: actionTypes.GET_TASKS_SUCCESS, tasks }))
    .catch((err) => dispatch({ type: actionTypes.ERROR, error: err.message }));
};

export const getSingleTask = (taskId) => (dispatch) => {
  dispatch({ type: actionTypes.LOADING });

  request(`${apiHost}/${taskId}`)
    .then((task) =>
      dispatch({ type: actionTypes.GET_SINGLE_PAGE_TASK_SUCCESS, task })
    )
    .catch((err) => dispatch({ type: actionTypes.ERROR, error: err.message }));
};

export const editTask = (taskId, data, fromSingleTask) => (dispatch) => {
  dispatch({ type: actionTypes.LOADING });

  request(`${apiHost}/${taskId}`, 'PUT', data)
    .then((editedTask) => {
      fromSingleTask
        ? dispatch({
            type: actionTypes.EDIT_SINGLE_PAGE_TASK_SUCCESS,
            editedTask,
          })
        : dispatch({ type: actionTypes.EDIT_TASK_SUCCESS, editedTask });
    })
    .catch((err) => {
      dispatch({ type: actionTypes.ERROR, error: err.message });
    });
};

export const addTask = (data) => (dispatch) => {
  dispatch({ type: actionTypes.LOADING });

  request(apiHost, 'POST', data)
    .then((task) => dispatch({ type: actionTypes.ADD_TASK_SUCCESS, task }))
    .catch((err) => dispatch({ type: actionTypes.ERROR, error: err.message }));
};

export const removeTask = (taskId, task) => (dispatch) => () => {
  dispatch({ type: actionTypes.LOADING });
  request(`${apiHost}/${taskId}`, 'DELETE')
    .then(() => {
      task
        ? dispatch({ type: actionTypes.REMOVE_TASK_SUCCESS, task })
        : dispatch({ type: actionTypes.REMOVE_SINGLE_PAGE_TASK_SUCCESS });
    })
    .catch((err) => dispatch({ type: actionTypes.ERROR, error: err.message }));
};

export const removeSelectedTasks = (checkedTasks) => (dispatch) => {
  dispatch({ type: actionTypes.LOADING });

  request(apiHost, 'PATCH', { tasks: [...checkedTasks] })
    .then(() => {
      dispatch({
        type: actionTypes.REMOVE_SELECTED_TASKS_SUCCESS,
        checkedTasks,
      });
    })
    .catch((err) => dispatch({ type: actionTypes.ERROR, error: err.message }));
};
