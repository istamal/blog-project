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

const mapStateToProps = (state) => ({
  articles: state.articles,
  slug: state.slug,
});

const actionCreators = {
  setSlug: actions.setSlug,
  setLike: actions.setLike,
  getArticles: actions.getArticles,
  getPageArticles: actions.getPageArticles,
};

class RenderPosts extends React.Component {
  componentDidMount = () => {
    const { getArticles } = this.props;
    getArticles();
  };

  handleLIke = (evt) => {
    const { setLike } = this.props;
    const { target } = evt;
    setLike(target.parentNode.parentNode.parentNode.parentNode.firstChild.textContent);
  };

  render() {
    const { articles, getPageArticles, setSlug } = this.props;
    return (
      <main className="container padding-top margin-bottom">
        {articles[0] ? (
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
                      <Tag key={shortid.generate()} color="orangered">
                        {tag}
                      </Tag>
                    ))
                    : null}
                  {item.favorited ? (
                    <HeartFilled style={{ color: 'red' }} onClick={this.handleLIke} />
                  ) : (
                    <HeartFilled onClick={this.handleLIke} />
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
  setLike: PropTypes.func.isRequired,
  articles: PropTypes.array,
  getPageArticles: PropTypes.func.isRequired,
  setSlug: PropTypes.func.isRequired,
};

RenderPosts.defaultProps = {
  articles: null,
};

export default connect(mapStateToProps, actionCreators)(RenderPosts);
