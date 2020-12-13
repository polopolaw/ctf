import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { loadAuth } from '../thunks/auth'

import '../assets/scss/app.scss';

class App extends Component {

  componentDidMount(){    
    this.props.loadAuth();
  }

  render() {    
    return this.props.children;
  }
}

function mapStateToProps(state) {
  return { 
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadAuth
  }, dispatch);
}

App.propTypes = {};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
