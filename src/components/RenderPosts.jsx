/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { Tag, Pagination, Spin } from 'antd';
import { HeartFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { connect } from 'react-redux';
import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';
import * as actions from '../actions/index';
import AnimatedHeart from './AnimatedHeart';

const mapStateToProps = (state) => ({
  articles: state.articles,
  requestStatus: state.requestStatus,
  filteredBy: state.filteredBy,
});

const actionCreators = {
  setSlug: actions.setSlug,
  getArticles: actions.getArticles,
  getPageArticles: actions.getPageArticles,
  deleteArticle: actions.deleteArticle,
  fatchFavorite: actions.fatchFavorite,
  unFavorite: actions.unFavorite,
  filterByTag: actions.filterByTag,
  resetFilter: actions.resetFilter,
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
    const title = target.closest('.card__content').getAttribute('data');
    this.setState({ slug: title });
  }

  handleOfGettingArticles = () => {
    const { getArticles, deleteArticle, resetFilter } = this.props;
    deleteArticle();
    getArticles();
    resetFilter();
  }

  componentDidMount = () => {
    this.handleOfGettingArticles();
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
      filteredBy,
    } = this.props;
    return (
      <main className="container padding-top margin-bottom">
        <div className="nav-links margin-bottom">
          <Link onClick={this.handleOfGettingArticles} className="nav-link" to="/">
            Все статьи
            {' >'}
          </Link>
          {filteredBy !== 'none' && (<span className="nav-link">{` ${filteredBy}`}</span>)}
        </div>
        {filteredBy !== 'none' && (
        <div className="margin-bottom">
          Все статьи с меткой
          {' '}
          <Tag color="orangered">{filteredBy}</Tag>
        </div>
        )}
        {requestStatus === 'success' && (
          articles.articles.map((item) => (
            <div key={uniqueId()} className="post-card">
              <img className="avatar" alt="AVATAR" src={item.author.image} />
              <div className="card__content" data={item.slug}>
                <Link
                  onClick={() => setSlug(item.slug)}
                  to={`/articles/${item.slug}`}
                  className="title"
                >
                  {item.title}
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
                      <Tag key={uniqueId()} color="orangered" onClick={() => filterByTag(tag)}>
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
        )}
        {requestStatus === 'requested' && (
          <div className="max-width margin-bottom">
            <Spin className="center" />
          </div>
        )}
        {requestStatus === 'failure' && (
          <div className="max-width margin-bottom">
            <p>Возможно проблемы с интернетом перезагрузите страницу позже</p>
          </div>
        )}
        <div className="max-width">
          <Pagination onChange={getPageArticles} defaultCurrent="1" total={articles.totalCount} />
        </div>
      </main>
    );
  }
}

RenderPosts.propTypes = {
  getArticles: PropTypes.func.isRequired,
  articles: PropTypes.object,
  getPageArticles: PropTypes.func.isRequired,
  setSlug: PropTypes.func.isRequired,
  deleteArticle: PropTypes.func.isRequired,
  requestStatus: PropTypes.string.isRequired,
  fatchFavorite: PropTypes.func.isRequired,
  unFavorite: PropTypes.func.isRequired,
  filterByTag: PropTypes.func.isRequired,
  filteredBy: PropTypes.string.isRequired,
  resetFilter: PropTypes.func.isRequired,
};

RenderPosts.defaultProps = {
  articles: {},
};

export default connect(mapStateToProps, actionCreators)(RenderPosts);
