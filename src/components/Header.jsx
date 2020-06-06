import React from 'react';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../actions/index';

const mapStateToProps = (state) => ({
  isAuth: state.isAuth,
});

const actionCreators = {
  setAuth: actions.setAuth,
  deleteArticle: actions.deleteArticle,
};

const Header = (props) => {
  const handleAuth = () => {
    const { setAuth, isAuth } = props;
    setAuth(isAuth);
    localStorage.clear();
  };

  const { deleteArticle } = props;

  return (
    <header>
      <div className="header__wrapper container">
        <Link onClick={() => deleteArticle()} to="/">
          <h1 className="logo">Blog</h1>
        </Link>
        <div className="user">
          {localStorage.getItem('user') && (
            <Link className="user-btn margin-right" to="/add">
              Добавить пост
            </Link>
          )}
          <div className="user-name">
            <Avatar icon={<UserOutlined />} />
            {localStorage.getItem('user') ? (
              <span className="user-nick">{localStorage.getItem('user')}</span>
            ) : (
              <span className="user-nick">Вы не авторизованы</span>
            )}
          </div>
          {localStorage.getItem('user') ? (
            <Link onClick={handleAuth} className="user-btn" to="/">
              Выйти
            </Link>
          ) : (
            <Link className="user-btn" to="/login">
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  setAuth: PropTypes.func.isRequired,
  deleteArticle: PropTypes.func,
};

Header.defaultProps = {
  deleteArticle: null,
};

export default connect(mapStateToProps, actionCreators)(Header);
