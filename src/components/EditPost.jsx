/* eslint-disable react/forbid-prop-types */
import React from 'react';
import {
  Formik,
  Form,
  FieldArray,
  Field,
} from 'formik';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Input, Button, Spin } from 'antd';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import * as actions from '../actions/index';

const mapStateToProps = (state) => ({
  changePostStatus: state.changePostStatus,
  article: state.article,
  slug: state.slug,
});

const actionCreators = {
  editPost: actions.editPost,
  setPostChangeStatusToNone: actions.setPostChangeStatusToNone,
};

const EditPost = (props) => {
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

  const {
    changePostStatus,
    setPostChangeStatusToNone,
    editPost,
    article,
    slug,
  } = props;

  return changePostStatus === 'success' ? (
    <main className="container post-card padding-top">
      <p className="margin-right">Изменения добавлены</p>
      <br />
      <Link onClick={() => setPostChangeStatusToNone()} to="/">
        ok
      </Link>
    </main>
  ) : (
    <Formik
      initialValues={{
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: [...article.tagList],
      }}
      validationSchema={postValuesValidation}
      onSubmit={(values) => {
        editPost(values, slug);
      }}
      render={({
        values,
        handleChange,
        errors,
        handleBlur,
        touched,
      }) => (
        <Form className="form">
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
          <div className="margin-bottom">
            <FieldArray
              placeholder="Метки"
              name="tagList"
              render={(arrayHelpers) => (
                <div>
                  {values.tagList && values.tagList.length > 0 ? (
                    values.tagList.map((tag, index) => (
                      <div key={Math.random(100)}>
                        <Field
                          className="input margin-bottom m-right-gap"
                          name={`tagList[${index}]`}
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
                      Add a friend
                    </Button>
                  )}
                  <div>
                    <Button
                      className="margin-right"
                      disabled={changePostStatus === 'sended'}
                      type="primary"
                      htmlType="submit"
                    >
                      Submit
                    </Button>
                    {changePostStatus === 'sended' && <Spin className="margin-right" />}
                  </div>
                </div>
              )}
            />
          </div>
        </Form>
      )}
    />
  );
};

EditPost.propTypes = {
  changePostStatus: PropTypes.func.isRequired,
  setPostChangeStatusToNone: PropTypes.func.isRequired,
  editPost: PropTypes.func.isRequired,
  article: PropTypes.object,
  slug: PropTypes.string.isRequired,
};

EditPost.defaultProps = {
  article: null,
};

export default connect(mapStateToProps, actionCreators)(EditPost);
