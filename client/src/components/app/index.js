import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';

// Components
import PageNotFound from '../page/404';
import Home from '../page/home';
import AuthContainer from '../auth';
import AccountContainer from '../account';
import Header from './header';

// UI
import {Container} from 'reactstrap';

// Redux
import {socketConnect} from './actions';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.socketConnect();
    }

    renderAppRoute(component) {
        if (!this.props.isConnected) {
            return <p>Connecting...</p>;
        }

        return component;
    }

    render() {
        return (
            <React.Fragment>
                <Header />
                <main id="main">
                    <Container>
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route path="/auth" render={() => this.renderAppRoute(<AuthContainer/>)} />
                            <Route path="/account" render={() => this.renderAppRoute(<AccountContainer/>)} />
                            <Route component={PageNotFound} />
                        </Switch>
                    </Container>
                </main>
            </React.Fragment>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        socketConnect,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        isConnected: state.app.connected,
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
