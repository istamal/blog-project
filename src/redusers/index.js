import { combineReducers } from 'redux';

const requestStatus = (state = 'none', action) => {
  switch (action.type) {
    case 'REQUEST_SEND':
      return 'requested';
    case 'REQUEST_SUCCESS':
      return 'success';
    case 'REQUEST_FAILURE':
      return 'failure';
    default:
      return state;
  }
};

const article = (state = null, action) => {
  if (action.type === 'SET_ARTICLE') {
    return action.payload.article;
  }
  if (action.type === 'DELETE_ARTICLE') {
    return null;
  }
  return state;
};

const slug = (state = null, action) => {
  if (action.type === 'SET_SLUG') {
    return action.payload.slug;
  }
  return state;
};

const changePostStatus = (state = 'none', action) => {
  if (action.type === 'POST_CHANGE_REQUESTED') {
    return 'sended';
  }
  if (action.type === 'POST_CHANGE_SUCCESS') {
    return 'success';
  }
  if (action.type === 'POST_CHANGE_FAILURE') {
    return 'failure';
  }
  if (action.type === 'SET_POSTCHANGE_STATUS_TO_NONE') {
    return 'none';
  }
  return state;
};

const isAuth = (state = false, action) => {
  if (action.type === 'SET_AUTH') {
    return !state;
  }
  return state;
};

const articles = (state = [], action) => {
  if (action.type === 'SET_ARTICLES') {
    return action.payload.articles;
  }
  if (action.type === 'SET_LIKE') {
    return state.map(item => {
      if (item.slug === action.payload.liked) {
        return { ...item, favorited: !item.favorited };
      }
      return item;
    });
  }
  return state;
};

const errorMsg = (state = null, action) => {
  if (action.type === 'ADD_ERROR_MESSAGE') {
    const { email, username, password } = action.payload.err;
    return {
      email,
      username,
      password,
      emailOrPassword: 'Email or password is invalid',
    };
  }
  return state;
};

export default combineReducers({
  requestStatus,
  articles,
  article,
  errorMsg,
  isAuth,
  slug,
  changePostStatus,
});
