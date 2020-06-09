import React from 'react';
import { HeartFilled } from '@ant-design/icons';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

const mapStateToProps = (state) => ({
  favoriteRequestsStatus: state.favoriteRequestsStatus,
});

const AnimatedHeart = ({ favoriteRequestsStatus }) => (
  favoriteRequestsStatus === 'requested'
  && <HeartFilled style={{ color: 'red' }} className="animated" />
);

AnimatedHeart.propTypes = {
  favoriteRequestsStatus: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(AnimatedHeart);
