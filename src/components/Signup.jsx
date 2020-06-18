import React from 'react';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { Input, Button, Spin } from 'antd';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import * as actions from '../actions/index';

const actionCreators = {
  addUser: actions.addUser,
};

const mapStateToProps = (state) => ({
  errorMsg: state.errorMsg,
  requestStatus: state.requestStatus,
});

const Signup = ({ errorMsg, requestStatus, addUser }) => {
  const singupValidation = Yup.object().shape({
    email: Yup.string()
      .email('Укожите корректный email')
      .required('Обязательное поле'),
    password: Yup.string()
      .required('Вы не ввели пароль')
      .min(8, 'Должно быть не менее 8 символов')
      .matches(/(?=.*[0-9])/, 'Пароль должень содержать хотя бы одну цифру')
      .matches(/(?=.*[a-z])/, 'Пароль должень содержать хотя бы одну букву латинского алфавита'),
    username: Yup.string()
      .required('Вы не ввели имя пользователя'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: singupValidation,
    onSubmit: (values) => {
      addUser(values, 'https://conduit.productionready.io/api/users');
    },
  });

  const {
    values, errors, touched, handleChange, handleSubmit, handleBlur,
  } = formik;

  const renderForm = () => (
    <div className="container padding-top">
      <div className="nav-links margin-bottom">
        <Link className="nav-link" to="/">
          Все статьи
          {' >'}
        </Link>
        <Link className="nav-link" to="/signup">
          {' '}
          Регистрация
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="margin-bottom">
          <Input
            name="email"
            placeholder="E-mail"
            label="E-mail"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errorMsg && <div className="red">{errorMsg.email}</div>}
          {errors.email && touched.email && <div className="red">{errors.email}</div>}
        </div>
        <div className="margin-bottom">
          <Input.Password
            name="password"
            placeholder="Пароль"
            label="Password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errorMsg && <div className="red">{errorMsg.password}</div>}
          {errors.password && touched.password && <div className="red">{errors.password}</div>}
        </div>
        <div className="margin-bottom">
          <Input
            placeholder="Имя Пользователя"
            name="username"
            label="Nickname"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errorMsg && <div className="red">{errorMsg.username}</div>}
          {errors.username && touched.username && <div className="red">{errors.username}</div>}
        </div>
        <Button className="margin-right" type="primary" htmlType="submit">
          Register
        </Button>
        {requestStatus === 'requested' && <Spin className="left-margin" />}
        <Link to="/login">Войти</Link>
      </form>
    </div>
  );

  return renderForm();
};

export default connect(mapStateToProps, actionCreators)(Signup);
