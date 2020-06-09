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
  if (action.type === 'SET_FAVORITED' || action.type === 'DELETE_FAVORITED') {
    return action.payload.article;
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
    return !action.payload.auth;
  }
  return state;
};

const favoriteRequestsStatus = (state = 'none', action) => {
  if (action.type === 'FAVORITE_REQUESTED') {
    return 'requested';
  }
  if (action.type === 'FAVORITE_SUCCESS') {
    return 'success';
  }
  if (action.type === 'FAVORITE_FAILURE') {
    return 'failure';
  }
  return state;
};

const articles = (state = [], action) => {
  if (action.type === 'SET_ARTICLES') {
    return action.payload.articles;
  }
  if (action.type === 'SET_FAVORITED' || action.type === 'DELETE_FAVORITED') {
    return state.map((item) => {
      if (item.slug === action.payload.article.slug) {
        return action.payload.article;
      }
      return item;
    });
  }
  if (action.type === 'SET_FILTERED_ARTICLES') {
    return state.filter((item) => item.tagList.includes(action.payload.tag));
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
  favoriteRequestsStatus,
  errorMsg,
  isAuth,
  slug,
  changePostStatus,
});
