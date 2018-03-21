import React from 'react';
import {withRouter, NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

// Redux
import {authLogout} from '../../auth/actions';

// UI
import {Container, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav} from 'reactstrap';

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
        };

        this.toggle = this.toggle.bind(this);
    }

    logout() {
        localStorage.removeItem('authToken');
        this.props.authLogout();
    }

    renderNavAuth() {
        if (this.props.loggedIn) {
            return (
                <React.Fragment>
                    <NavLink className="nav-link" to="/app-name/dashboard">Dashboard</NavLink>
                    <NavLink className="nav-link" to="/account">Account</NavLink>
                    <a className="nav-link" href="#" onClick={this.logout.bind(this)}>Logout</a>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <NavLink className="nav-link" exact to="/auth">Login</NavLink>
                    <NavLink className="nav-link" to="/auth/register">Sign up</NavLink>
                </React.Fragment>
            );
        }
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    render() {
        return (
            <Navbar color="primary-dark" dark expand="md" id="header">
                <Container>
                    <NavbarBrand href="#">Dapper Framework</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} className="mr-2" />
                    <Collapse isOpen={!this.state.isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavLink className="nav-link" exact to="/">Home</NavLink>
                        </Nav>
                        <Nav className="ml-auto" navbar>
                            {this.renderNavAuth()}
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        );
    }
}

function mapStateToProps(state) {
    return {
        isConnected: state.app.connected,
        loggedIn: state.account.loggedIn,
        socket: state.app.socket,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({authLogout}, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));