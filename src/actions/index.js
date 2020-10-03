import axios from 'axios';

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    const newConfig = config;
    if (token) {
      newConfig.headers.common.Authorization = `Token ${token}`;
    }
    return newConfig;
  },
  error => Promise.reject(error),
);

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

export const setArticles = data => ({
  type: 'SET_ARTICLES',
  payload: {
    data,
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
    dispatch(setArticles(response.data));
    dispatch(requestSuccess());
  } catch (err) {
    dispatch(requestFailure());
  }
};

export const setFilteredArticles = (data, tag) => ({
  type: 'SET_FILTERED_ARTICLES',
  payload: {
    data,
    tag,
  },
});

export const resetFilter = () => ({
  type: 'RESET_FILTER',
});

export const filterByTag = tag => async dispatch => {
  dispatch(requestSend());
  try {
    const response = await axios.get(
      `https://conduit.productionready.io/api/articles?limit=10&tag=${tag}`,
    );
    dispatch(setFilteredArticles(response.data, tag));
    dispatch(requestSuccess());
  } catch (err) {
    dispatch(requestFailure());
  }
};

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
    dispatch(setArticles(response.data));
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

export const setAuth = auth => ({
  type: 'SET_AUTH',
  payload: {
    auth,
  },
});

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
    const options = {
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

export const editPost = (values, slug) => async dispatch => {
  const newValues = values;
  if (!newValues.tagList.length > 0) {
    newValues.tagList = [''];
  }
  dispatch(postChangeRequest());
  try {
    const options = {
      method: 'Put',
      data: { article: newValues },
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

export const deletePost = slug => async dispatch => {
  dispatch(postChangeRequest());
  try {
    const options = {
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

export const addUserData = user => ({
  type: 'ADD_USERDATA',
  payload: {
    user,
  },
});

export const addUser = (values, path) => async dispatch => {
  dispatch(requestSend());
  try {
    const response = await axios.post(path, { user: values });
    dispatch(addUserData(response.data));
    localStorage.setItem('user', response.data.user.username);
    dispatch(requestSuccess());
    dispatch(setAuth());
  } catch (error) {
    dispatch(addErrorMsg(error.response.data.errors));
    dispatch(requestFailure());
  }
};

export const authenticate = (values, path) => async dispatch => {
  dispatch(requestSend());
  try {
    const response = await axios.post(path, { user: values });
    dispatch(addUserData(response.data.user));
    localStorage.setItem('user', response.data.user.username);
    localStorage.setItem('token', response.data.user.token);
    dispatch(requestSuccess());
    await dispatch(setAuth(false));
  } catch (error) {
    dispatch(requestFailure());
    dispatch(addErrorMsg(error.response.data.errors));
  }
};

export const authenticateWithToken = () => async dispatch => {
  try {
    const response = await axios.get('https://conduit.productionready.io/api/user');
    localStorage.setItem('token', response.data.user.token);
    dispatch(addUserData(response.data.user));
    dispatch(setAuth(false));
  } catch (error) {
    localStorage.clear();
    dispatch(setAuth(true));
    throw error;
  }
};

export const setFavorited = article => ({
  type: 'SET_FAVORITED',
  payload: {
    article,
  },
});

export const deleteFavorited = article => ({
  type: 'DELETE_FAVORITED',
  payload: {
    article,
  },
});

export const requestFavorite = () => ({
  type: 'FAVORITE_REQUESTED',
});

export const favoriteSuccess = () => ({
  type: 'FAVORITE_SUCCESS',
});

export const favoriteFailure = () => ({
  type: 'FAVORITE_FAILURE',
});

export const fatchFavorite = slug => async dispatch => {
  dispatch(requestFavorite());
  try {
    const response = await axios.post(
      `https://conduit.productionready.io/api/articles/${slug}/favorite`,
    );
    dispatch(setFavorited(response.data.article));
    dispatch(favoriteSuccess());
  } catch (err) {
    dispatch(favoriteFailure());
    alert('Вы не авторизованы, войдите чтобы отметить запись.');
  }
};

export const unFavorite = slug => async dispatch => {
  dispatch(requestFavorite());
  try {
    const response = await axios.delete(
      `https://conduit.productionready.io/api/articles/${slug}/favorite`,
    );
    dispatch(deleteFavorited(response.data.article));
    dispatch(favoriteSuccess());
  } catch (err) {
    dispatch(favoriteFailure());
  }
};
