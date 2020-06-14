/* eslint-disable react/no-array-index-key */
import React from 'react';
import {
  Formik, Form, FieldArray, Field,
} from 'formik';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Input, Button, Spin } from 'antd';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import * as actions from '../actions/index';

const mapStateToProps = (state) => ({
  changePostStatus: state.changePostStatus,
});

const actionCreators = {
  addPost: actions.addPost,
  setPostChangeStatusToNone: actions.setPostChangeStatusToNone,
};

const AddPost = ({ changePostStatus, setPostChangeStatusToNone, addPost }) => {
  const postValuesValidation = Yup.object().shape({
    title: Yup.string()
      .required('Обязательное поле')
      .min(3, 'Не менее 3 символов'),
    description: Yup.string()
      .required('Обязательное поле')
      .min(10, 'Не менее 10 символов'),
    body: Yup.string()
      .required('Обязательное поле')
      .min(20, 'Не менее 20 символов'),
  });

  return changePostStatus === 'success' ? (
    <main className="container post-card padding-top">
      <p className="margin-right">Пост успешно добавлен</p>
      <br />
      <Link onClick={() => setPostChangeStatusToNone()} to="/">
        ok
      </Link>
    </main>
  ) : (
    <div className="container padding-top">
      <div className="nav-links margin-bottom">
        <Link className="nav-link" to="/">
          Все статьи
          {' >'}
        </Link>
        <Link className="nav-link" to="/add">
          {' '}
          Добавить статью
        </Link>
      </div>
      <Formik
        initialValues={{
          title: '',
          description: '',
          body: '',
          tagList: [],
        }}
        validationSchema={postValuesValidation}
        onSubmit={(values) => {
          addPost(values);
        }}
        render={({
          values, handleChange, errors, handleBlur, touched,
        }) => (
          <Form>
            <div className="margin-bottom">
              <Input
                placeholder="Заголовок"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.title && touched.title && <div className="red s-size">{errors.title}</div>}
            </div>
            <div className="margin-bottom">
              <Input
                placeholder="Описание"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.description && touched.description && (
              <div className="red s-size">{errors.description}</div>
              )}
            </div>
            <div className="margin-bottom">
              <Input.TextArea
                placeholder="Текст"
                name="body"
                value={values.body}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.body && touched.body && <div className="red s-size">{errors.body}</div>}
            </div>
            <FieldArray
              placeholder="Метки"
              name="tagList"
              render={(arrayHelpers) => (
                <div>
                  {values.tagList && values.tagList.length > 0 ? (
                    values.tagList.map((tag, index) => (
                      <div key={index}>
                        <Field
                          className="input margin-bottom m-right-gap"
                          name={`tagList.${index}`}
                        />
                        <Button
                          type="button"
                          className="m-right-gap"
                          danger
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          -
                        </Button>
                        <Button type="button" onClick={() => arrayHelpers.insert(index, '')}>
                          +
                        </Button>
                      </div>
                    ))
                  ) : (
                    <Button
                      className="margin-bottom"
                      type="primary"
                      onClick={() => arrayHelpers.push('')}
                    >
                      Добавить тег
                    </Button>
                  )}
                  <div>
                    <Button
                      className="margin-right"
                      disabled={changePostStatus === 'sended'}
                      type="primary"
                      htmlType="submit"
                    >
                      Отправить
                    </Button>
                    {changePostStatus === 'sended' && <Spin className="margin-right" />}
                  </div>
                </div>
              )}
            />
          </Form>
        )}
      />
    </div>
  );
};

AddPost.propTypes = {
  changePostStatus: PropTypes.string.isRequired,
  setPostChangeStatusToNone: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actionCreators)(AddPost);
