import React from 'react';
import {withRouter} from 'react-router-dom';
import {Card, CardHeader, CardBody} from 'reactstrap';

class AuthLogout extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.timer = setTimeout(() => {
            this.props.history.push('/');
        }, 2000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        return (
            <Card className="card-small">
                <CardHeader>Logged Out</CardHeader>
                <CardBody>
                    <p>You have been logged out. You will be redirected in a moment.</p>
                </CardBody>
            </Card>
        );
    }
};

export default withRouter(AuthLogout);
