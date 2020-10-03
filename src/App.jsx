import React from 'react';
import './App.scss';
import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import RenderPosts from './components/RenderPosts';
import Login from './components/Login';
import Signup from './components/Signup';
import Post from './components/Post';
import Header from './components/Header';
import Footer from './components/Footer';
import AddPost from './components/AddPost';
import * as actions from './actions/index';
import EditPost from './components/EditPost';

const mapStateToProps = state => ({
  isAuth: state.isAuth,
  slug: state.slug,
});

const actionCreators = {
  authenticateWithToken: actions.authenticateWithToken,
};

class App extends React.Component {
  componentDidMount = () => {
    const { authenticateWithToken } = this.props;
    if (localStorage.getItem('token')) {
      authenticateWithToken();
    }
  };

  render() {
    const { slug, isAuth } = this.props;
    return (
      <div className="wrapper">
        <Router basename="/blog">
          <Header />
          <Switch>
            <Route exact path="/" component={RenderPosts} />
            <Route exact path={`/articles/${slug}`} component={Post} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" render={() => (isAuth ? <Redirect to="/" /> : <Login />)} />
            <Route path="/add" render={() => (isAuth ? <AddPost /> : <Redirect to="/Login" />)} />
            <Route path={`/articles/${slug}/edit`} component={EditPost} />
          </Switch>
          <Footer />
        </Router>
      </div>
    );
  }
}

App.propTypes = {
  slug: PropTypes.string,
  isAuth: PropTypes.bool.isRequired,
  authenticateWithToken: PropTypes.func.isRequired,
};

App.defaultProps = {
  slug: null,
};

export default connect(mapStateToProps, actionCreators)(App);
