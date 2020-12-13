import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import '../assets/scss/app.scss';
import { loadAuth } from '../thunks/auth';

class App extends Component {
    componentDidMount() {
        this.props.loadAuth();
    }

    render() {
        return this.props.children;
    }
}

function mapStateToProps(state) {
    return {};
}

App.propTypes = {};

export default withRouter(connect(mapStateToProps, { loadAuth })(App));
