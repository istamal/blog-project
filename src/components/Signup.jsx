import React from 'react';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { Input, Button, Spin } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../actions/index';

const actionCreators = {
  addUser: actions.addUser,
};

const mapStateToProps = state => ({
  errorMsg: state.errorMsg,
  requestStatus: state.requestStatus,
});

const Signup = props => {
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    onSubmit: values => {
      props.addUser(values, 'https://conduit.productionready.io/api/users');
    },
  });

  const { values, handleChange, handleSubmit } = formik;

  const { errorMsg, requestStatus } = props;

  const renderForm = () => (
    <form className="form" onSubmit={handleSubmit}>
      <div className="margin-bottom">
        <Input
          name="email"
          placeholder="E-mail"
          label="E-mail"
          type="email"
          value={values.email}
          onChange={handleChange}
        />
        {errorMsg && <div className="red">{errorMsg.email}</div>}
      </div>
      <div className="margin-bottom">
        <Input.Password
          name="password"
          placeholder="Пароль"
          label="Password"
          type="password"
          value={values.password}
          onChange={handleChange}
        />
        {errorMsg && <div className="red">{errorMsg.password}</div>}
      </div>
      <div className="margin-bottom">
        <Input
          placeholder="Имя Пользователя"
          name="username"
          label="Nickname"
          value={values.username}
          onChange={handleChange}
        />
        {errorMsg && <div className="red">{errorMsg.username}</div>}
      </div>
      <Button className="left-margin" type="primary" htmlType="submit">
        Register
      </Button>
      {requestStatus === 'requested' && <Spin className="left-margin" />}
      <Link to="/login">Войти</Link>
    </form>
  );

  return renderForm();
};

export default connect(mapStateToProps, actionCreators)(Signup);
