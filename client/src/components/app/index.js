import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';
import Yaml from 'js-yaml';

// Components
import Page from '../page';
import PageNotFound from '../page/404';
import AuthContainer from '../auth';
import AccountContainer from '../account';
import Header from './header';

// UI
import {Container} from 'reactstrap';
import Icon from '@fortawesome/react-fontawesome';
import Loading from '../ui/loading';

// Redux
import {socketConnect} from './actions';
import Verified from '../verified';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pages: [],
        };
    }

    componentWillMount() {
        this.getPages();
    }

    componentDidMount() {
        this.props.socketConnect();
    }

    componentWillReceiveProps(nextProps) {
        // if the user is logged in, and the socket reconnected, re-authticate..
        if (this.props.loggedIn && !this.props.isConnected && nextProps.isConnected) {
            this.props.history.push('/auth');
        }
    }

    parsePageMeta(str) {
        if (str.slice(0, 3) !== '---') return;

        const matcher = /\n(\.{3}|-{3})/g;
        const metaEnd = matcher.exec(str);

        return metaEnd && [str.slice(0, metaEnd.index), str.slice(matcher.lastIndex)];
    }

    getPages() {
        const pages = [];
        const webpackRequireContext = require.context(
            '!raw-loader!../../pages',
            false,
            /\.md$/,
        );

        webpackRequireContext.keys().forEach((fileName) => {
            const file = webpackRequireContext(fileName);
            const page = {
                raw: file,
                meta: null,
                markdown: '',
            };

            if (! page.raw) return;

            const split = this.parsePageMeta(page.raw);
            if (split) {
                page.meta = Yaml.safeLoad(split[0]);
                page.markdown = split[1];
            }

            pages.push(page);
        });

        pages.sort((pageA, pageB) => {
            return (pageA.meta.path > pageB.meta.path) ? 1 : 0;
        });

        this.setState({pages});
    }

    renderSocketRoute(component) {
        if (!this.props.isConnected) {
            return <p>Connecting...</p>;
        }

        return component;
    }

    render() {
        return (
            <React.Fragment>
                <Header pages={this.state.pages} />
                <main id="main">
                    <Container>
                        <Switch>
                            {
                                this.state.pages.map((page, index) => {
                                    return <Route exact path={'/' + page.meta.path} key={index} component={() => {
                                        return <Page page={page}/>;
                                    }} />;
                                })
                            }
                            <Route path="/auth" render={() => this.renderSocketRoute(<AuthContainer/>)} />
                            <Route path="/verified" component={Verified} />
                            <Route path="/account" render={() => this.renderSocketRoute(<AccountContainer/>)} />
                            <Route component={PageNotFound} />
                        </Switch>
                    </Container>
                </main>
                <a href={this.state.issueUrl} target="_blank" className="btn btn-primary" id="bug"><Icon icon="bug" />Found a bug?</a>
                <Loading />
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
        loggedIn: state.account.loggedIn || false,
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
