import React from 'react';
import './App.scss';
import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Post from './components/Post';
import Header from './components/Header';
import Footer from './components/Footer';
import AddPost from './components/AddPost';

const mapStateToProps = state => ({
  isAuth: state.isAuth,
  slug: state.slug,
});

function App(props) {
  const { slug } = props;
  return (
    <div className="wrapper">
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path={`/articles/${slug}`} component={Post} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" render={() => (props.isAuth ? <Redirect to="/" /> : <Login />)} />
          <Route path="/add" component={AddPost} />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

App.propTypes = {
  slug: PropTypes.string,
  isAuth: PropTypes.bool.isRequired,
};

App.defaultProps = {
  slug: null,
};

export default connect(mapStateToProps)(App);
