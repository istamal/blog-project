/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { HeartFilled } from '@ant-design/icons';
import { Tag, Spin, Button } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../actions/index';
import AnimatedHeart from './AnimatedHeart';

const actionCreaters = {
  getTargetArticle: actions.getTargetArticle,
  deletePost: actions.deletePost,
  unFavorite: actions.unFavorite,
  fatchFavorite: actions.fatchFavorite,
  setPostChangeStatusToNone: actions.setPostChangeStatusToNone,
};

const mapStateToProps = (state) => ({
  article: state.article,
  slug: state.slug,
  changePostStatus: state.changePostStatus,
  requestStatus: state.requestStatus,
});

class Post extends React.Component {
  componentDidMount = () => {
    const { getTargetArticle, slug } = this.props;
    return getTargetArticle(`/articles/${slug}`);
  };

  render() {
    const {
      article,
      changePostStatus,
      setPostChangeStatusToNone,
      slug,
      deletePost,
      unFavorite,
      fatchFavorite,
    } = this.props;

    if (changePostStatus === 'success') {
      return (
        <div className="container post-card padding-top">
          <p className="margin-right">Пост успешно удолен</p>
          <br />
          <Link onClick={() => setPostChangeStatusToNone()} to="/">
            ok
          </Link>
        </div>
      );
    }
    return article ? (
      <main className="padding-top">
        <div className="post-card container">
          <img className="avatar" alt="AVATAR" src={`${article.author.image}`} />
          <div className="card__content">
            <h1 className="title">{article.title}</h1>
            <div className="meta">
              <span className="date">
                {formatDistance(new Date(article.createdAt), Date.now(), { addSuffix: true })}
              </span>
              <span className="author">{article.author.username}</span>
            </div>
            <p>{article.body}</p>
            <div className="links">
              {article.tagList.length
                ? article.tagList.map((tag) => <Tag color="orangered">{tag}</Tag>)
                : null}
              <span className="favorites-count">{article.favoritesCount}</span>
              {article.favorited ? (
                <span className="heart-container">
                  <HeartFilled style={{ color: 'red' }} onClick={() => unFavorite(article.slug)} className="like" />
                  <AnimatedHeart />
                </span>
              ) : (
                <span className="heart-container">
                  <HeartFilled onClick={() => fatchFavorite(article.slug)} className="like" />
                  <AnimatedHeart />
                </span>
              )}
            </div>
            {article.author.username === localStorage.getItem('user') && (
              <div className="remove">
                <Button
                  className="margin-right"
                  disabled={changePostStatus === 'sended'}
                  onClick={() => deletePost(slug)}
                  type="primary"
                  danger
                >
                  Удолить
                </Button>
                {changePostStatus === 'sended' && <Spin className="margin-right" />}
                <Button
                  disabled={changePostStatus === 'sended'}
                  type="primary"
                >
                  <Link to={`/articles/${slug}/edit`}>Изменить</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    ) : (
      <div className="padding-top max-width margin-bottom">
        <Spin className="center" />
      </div>
    );
  }
}

Post.propTypes = {
  article: PropTypes.object,
  changePostStatus: PropTypes.string.isRequired,
  setPostChangeStatusToNone: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
  deletePost: PropTypes.func.isRequired,
  getTargetArticle: PropTypes.func.isRequired,
  unFavorite: PropTypes.func.isRequired,
  fatchFavorite: PropTypes.func.isRequired,
};

Post.defaultProps = {
  article: null,
};

export default connect(mapStateToProps, actionCreaters)(Post);
