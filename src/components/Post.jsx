/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { HeartFilled } from '@ant-design/icons';
import { Tag, Spin, Button } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../actions/index';

const actionCreaters = {
  getTargetArticle: actions.getTargetArticle,
  setLike: actions.setLike,
  deletePost: actions.deletePost,
  setPostChangeStatusToNone: actions.setPostChangeStatusToNone,
};

const mapStateToProps = state => ({
  article: state.article,
  slug: state.slug,
  changePostStatus: state.changePostStatus,
  requestStatus: state.requestStatus,
});

class Post extends React.Component {
  componentDidMount = () => {
    const { getTargetArticle } = this.props;
    return getTargetArticle(window.location.pathname);
  };

  handleLIke = () => {
    const { setLike } = this.props;
    setLike();
  };

  render() {
    const { article, changePostStatus, setPostChangeStatusToNone, slug, deletePost } = this.props;

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
                ? article.tagList.map(tag => <Tag color="orangered">{tag}</Tag>)
                : null}
              {article.favorited ? (
                <HeartFilled style={{ color: 'red' }} onClick={this.handleLIke} className="like" />
              ) : (
                <HeartFilled onClick={this.handleLIke} className="like" />
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
  article: PropTypes.object.isRequired,
  changePostStatus: PropTypes.func.isRequired,
  setPostChangeStatusToNone: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
  deletePost: PropTypes.func.isRequired,
  getTargetArticle: PropTypes.func.isRequired,
  setLike: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actionCreaters)(Post);
