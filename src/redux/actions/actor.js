const immutable = require('immutable');
const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();
const {
  SET_TEMPLATE,
  GET_TEMPLATE_SUCCESS,
  FIND_TEMPLATE_SUCCESS,
  CREATE_TEMPLATE_SUCCESS,
  UPDATE_TEMPLATE_SUCCESS,
  SET_EDITED_TEMPLATE,
} = require('../constants');
const { showLoading, hideLoading, showAlert } = require('./ui');

let setTemplate = function setTemplate(uuid, name, desc, avatar, info) {
  return {
    uuid,
    name,
    desc,
    avatar,
    info,
  }
}

let getTemplate = function getTemplate(uuid) {
  return function(dispatch, getState) {
    return api.emit('actor::getTemplate', {uuid}, function(data) {
      if(data.result) {
        let payload = uuid?data.template:data.templates;
        dispatch({type: GET_TEMPLATE_SUCCESS, uuid, payload})
      }else {
        console.error(data.msg);
      }
    })
  }
}

let findTemplate = function findTemplate(searchName) {
  return function (dispatch, getState) {
    return api.emit('actor::findTemplate', {name: searchName}, function(data) {
      console.log(data);
      if(data.result) {
        dispatch({type: FIND_TEMPLATE_SUCCESS, payload: data.templates});
      }else {
        console.error(data.msg);
      }
    })
  }
}

let createTemplate = function createTemplate(name, desc, avatar, info) {
  return function(dispatch, getState) {
    dispatch(showLoading('创建中...'));
    return api.emit('actor::createTemplate', {name, desc, avatar, info}, function(data) {
      dispatch(hideLoading());
      dispatch(showAlert({title: '成功', content: '模板创建完毕'}));
      if(data.result) {
        dispatch({type:CREATE_TEMPLATE_SUCCESS, payload: data.template});
      }else {
        console.error(data.msg);
        dispatch(showAlert(data.msg));
        // dispatch({type:LOGIN_FAILED, payload: data.msg});
      }
    })
  }
}

let updateTemplate = function updateTemplate(uuid, name, desc, avatar, info) {
  return function(dispatch, getState) {
    dispatch(showLoading('保存中...'));
    return api.emit('actor::updateTemplate', {uuid, name, desc, avatar, info}, function(data) {
      dispatch(hideLoading());
      dispatch(showAlert({title: '成功', content: '模板更新完毕'}));
      if(data.result) {
        dispatch({type:UPDATE_TEMPLATE_SUCCESS, payload: data.template});
      }else {
        console.error(data.msg);
        dispatch(showAlert(data.msg));
      }
    })
  }
}

let setEditedTemplate = function setEditedTemplate(obj) {
  return {type: SET_EDITED_TEMPLATE, payload: obj}
}

module.exports = {
  setTemplate,
  getTemplate,
  findTemplate,
  createTemplate,
  updateTemplate,
  setEditedTemplate,
}
