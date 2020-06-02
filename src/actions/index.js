import axios from 'axios';

export const setSlug = slug => ({
  type: 'SET_SLUG',
  payload: {
    slug,
  },
});

export const requestSend = () => ({
  type: 'REQUEST_SEND',
});

export const requestSuccess = () => ({
  type: 'REQUEST_SUCCESS',
});

export const requestFailure = () => ({
  type: 'REQUEST_FAILURE',
});

export const setArticles = articles => ({
  type: 'SET_ARTICLES',
  payload: {
    articles,
  },
});

export const setArticle = article => ({
  type: 'SET_ARTICLE',
  payload: {
    article,
  },
});

export const deleteArticle = () => ({
  type: 'DELETE_ARTICLE',
});

export const getArticles = () => async dispatch => {
  dispatch(requestSend());
  try {
    const response = await axios.get('https://conduit.productionready.io/api/articles?limit=10');
    dispatch(setArticles(response.data.articles));
    dispatch(requestSuccess());
  } catch (err) {
    dispatch(requestFailure());
  }
};

export const setLike = liked => ({
  type: 'SET_LIKE',
  payload: {
    liked,
  },
});

export const addErrorMsg = err => ({
  type: 'ADD_ERROR_MESSAGE',
  payload: {
    err,
  },
});

export const getPageArticles = page => async dispatch => {
  dispatch(requestSend());
  try {
    const offsetVal = (page - 1) * 10;
    const response = await axios.get(
      `https://conduit.productionready.io/api/articles?limit=10&offset=${offsetVal}`,
    );
    dispatch(setArticles(response.data.articles));
    dispatch(requestSuccess());
  } catch (err) {
    dispatch(requestFailure());
  }
};

export const getTargetArticle = endpoint => async dispatch => {
  dispatch(requestSend());
  try {
    const response = await axios.get(`https://conduit.productionready.io/api${endpoint}`);
    dispatch(setArticle(response.data.article));
    dispatch(requestSuccess());
  } catch (err) {
    dispatch(requestFailure());
  }
};

export const setAuth = () => ({
  type: 'SET_AUTH',
});

export const authenticate = (values, path) => async dispatch => {
  dispatch(requestSend());
  try {
    const response = await axios.post(path, { user: values });
    localStorage.setItem('user', response.data.user.username);
    localStorage.setItem('token', response.data.user.token);
    dispatch(requestSuccess());
    await dispatch(setAuth());
  } catch (error) {
    dispatch(requestFailure());
    dispatch(addErrorMsg(error.response.data.errors));
  }
};

export const postChangeRequest = () => ({
  type: 'POST_CHANGE_REQUESTED',
});

export const postChangeSuccess = () => ({
  type: 'POST_CHANGE_SUCCESS',
});

export const postChangeFailure = () => ({
  type: 'POST_CHANGE_FAILURE',
});

export const setPostChangeStatusToNone = () => ({
  type: 'SET_POSTCHANGE_STATUS_TO_NONE',
});

export const addPost = values => async dispatch => {
  dispatch(postChangeRequest());
  try {
    const token = localStorage.getItem('token');
    const options = {
      headers: { Authorization: `Token ${token}` },
      method: 'Post',
      data: { article: values },
      url: 'https://conduit.productionready.io/api/articles',
    };
    axios(options).then(response => {
      if (response.status === 200) {
        return dispatch(postChangeSuccess());
      }
      return dispatch(postChangeFailure());
    });
  } catch (err) {
    dispatch(postChangeFailure());
  }
};

export const deletePost = slug => async dispatch => {
  dispatch(postChangeRequest());
  try {
    const token = localStorage.getItem('token');
    const options = {
      headers: { Authorization: `Token ${token}` },
      method: 'Delete',
      url: `https://conduit.productionready.io/api/articles/${slug}`,
    };
    axios(options).then(response => {
      if (response.status === 200) {
        return dispatch(postChangeSuccess());
      }
      return dispatch(postChangeFailure());
    });
  } catch (err) {
    dispatch(postChangeFailure());
  }
};

export const addUserName = username => ({
  type: 'ADD_USERNAME',
  payload: {
    name: username,
  },
});

export const addUser = (values, path) => async dispatch => {
  dispatch(requestSend());
  try {
    const response = await axios.post(path, { user: values });
    dispatch(addUserName(response.data.user.username));
    localStorage.setItem('user', response.data.user.username);
    dispatch(requestSuccess());
    dispatch(setAuth());
  } catch (error) {
    dispatch(addErrorMsg(error.response.data.errors));
    dispatch(requestFailure());
  }
};
