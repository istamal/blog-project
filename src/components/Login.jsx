/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { Input, Button, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import * as actions from '../actions/index';

const actionCreators = {
  authenticate: actions.authenticate,
};

const mapStateToProps = (state) => ({
  errorMsg: state.errorMsg,
  requestStatus: state.requestStatus,
});

const Login = (props) => {
  const loginValidation = Yup.object().shape({
    email: Yup.string()
      .email('Укожите корректный email')
      .required('Обязательное поле'),
    password: Yup.string()
      .required('Вы не ввели пароль')
      .min(8, 'Должно быть не менее 8 символов')
      .matches(/(?=.*[0-9])/, 'Пароль должень содержать хотя бы одну цифру')
      .matches(/(?=.*[a-z])/, 'Пароль должень содержать хотя бы одну букву латинского алфавита'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidation,
    onSubmit: (values) => {
      const { authenticate } = props;
      authenticate(values, 'https://conduit.productionready.io/api/users/login');
    },
  });

  const {
    errors, values, touched, handleBlur, handleChange, handleSubmit,
  } = formik;

  const { errorMsg, requestStatus } = props;

  return (
    <div className="container padding-top">
      <div className="nav-links margin-bottom">
        <Link className="nav-link" to="/">
          Все статьи
          {' >'}
        </Link>
        <Link className="nav-link" to="/login">
          {' '}
          Войти
        </Link>
      </div>
      <form name="normal_login" onSubmit={handleSubmit}>
        <div className="margin-bottom">
          <Input
            name="email"
            placeholder="E-mail"
            prefix={<UserOutlined className="site-form-item-icon" />}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && touched.email && <div className="red">{errors.email}</div>}
        </div>
        <div className="margin-bottom">
          <Input.Password
            name="password"
            placeholder="Пароль"
            prefix={<LockOutlined className="site-form-item-icon" />}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.password && touched.password && <div className="red">{errors.password}</div>}
        </div>
        {errorMsg && <div className="red">{errorMsg.emailOrPassword}</div>}
        <Button
          disabled={requestStatus === 'requested'}
          htmlType="submit"
          className="margin-right"
          type="primary"
        >
          Войти
        </Button>
        {requestStatus === 'requested' && <Spin className="left-margin margin-right" />}
        <Link to="/signup">Регистрация</Link>
      </form>
    </div>
  );
};

Login.propTypes = {
  authenticate: PropTypes.func.isRequired,
  emailOrPassword: PropTypes.string,
  requestStatus: PropTypes.string.isRequired,
  errorMsg: PropTypes.object,
};

Login.defaultProps = {
  errorMsg: null,
  emailOrPassword: '',
};

export default connect(mapStateToProps, actionCreators)(Login);
