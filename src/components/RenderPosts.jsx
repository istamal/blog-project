/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { Tag, Pagination, Spin } from 'antd';
import { HeartFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { connect } from 'react-redux';
import shortid from 'shortid';
import PropTypes from 'prop-types';
import * as actions from '../actions/index';
import AnimatedHeart from './AnimatedHeart';

const mapStateToProps = (state) => ({
  articles: state.articles,
  requestStatus: state.requestStatus,
});

const actionCreators = {
  setSlug: actions.setSlug,
  setLike: actions.setLike,
  getArticles: actions.getArticles,
  getPageArticles: actions.getPageArticles,
  deleteArticle: actions.deleteArticle,
  fatchFavorite: actions.fatchFavorite,
  unFavorite: actions.unFavorite,
  filterByTag: actions.filterByTag,
};

class RenderPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slug: '',
    };
  }

  handleLike = (evt) => {
    const { target } = evt;
    const title = target.closest('.card__content').firstChild.textContent;
    this.setState({ slug: title });
  }

  componentDidMount = () => {
    const { getArticles, deleteArticle } = this.props;
    deleteArticle();
    getArticles();
  };

  render() {
    const { slug } = this.state;

    const {
      articles,
      getPageArticles,
      setSlug,
      requestStatus,
      fatchFavorite,
      unFavorite,
      filterByTag,
    } = this.props;
    return (
      <main className="container padding-top margin-bottom">
        {requestStatus === 'success' ? (
          articles.map((item) => (
            <div key={shortid.generate()} className="post-card">
              <img className="avatar" alt="AVATAR" src={`${item.author.image}`} />
              <div className="card__content">
                <Link
                  onClick={() => setSlug(item.slug)}
                  to={`/articles/${item.slug}`}
                  className="title"
                >
                  {item.slug}
                </Link>
                <div className="meta">
                  <span className="date">
                    {formatDistance(new Date(item.createdAt), Date.now(), { addSuffix: true })}
                  </span>
                  <span className="author">{item.author.username}</span>
                </div>
                <p>{item.body}</p>
                <div className="links">
                  {item.tagList.length
                    ? item.tagList.map((tag) => (
                      <Tag key={shortid.generate()} color="orangered" onClick={() => filterByTag(tag)}>
                        {tag}
                      </Tag>
                    ))
                    : null}
                  <span className="favorites-count">{item.favoritesCount}</span>
                  {item.favorited ? (
                    <span className="heart-container" onClick={this.handleLike}>
                      <HeartFilled style={{ color: 'red' }} onClick={() => unFavorite(item.slug)} />
                      {item.slug === slug && <AnimatedHeart />}
                    </span>
                  ) : (
                    <span className="heart-container" onClick={this.handleLike}>
                      <HeartFilled onClick={() => fatchFavorite(item.slug)} />
                      {item.slug === slug && <AnimatedHeart />}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="max-width margin-bottom">
            <Spin className="center" />
          </div>
        )}
        <div className="max-width">
          <Pagination onChange={getPageArticles} defaultCurrent="1" total="500" />
        </div>
      </main>
    );
  }
}

RenderPosts.propTypes = {
  getArticles: PropTypes.func.isRequired,
  articles: PropTypes.array,
  getPageArticles: PropTypes.func.isRequired,
  setSlug: PropTypes.func.isRequired,
  deleteArticle: PropTypes.func.isRequired,
  requestStatus: PropTypes.string.isRequired,
  fatchFavorite: PropTypes.func.isRequired,
  unFavorite: PropTypes.func.isRequired,
  filterByTag: PropTypes.func.isRequired,
};

RenderPosts.defaultProps = {
  articles: null,
};

export default connect(mapStateToProps, actionCreators)(RenderPosts);
