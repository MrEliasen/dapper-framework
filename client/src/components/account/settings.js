import React from 'react';
import timezones from 'moment-timezone';

// UI
import {Col, Card, CardHeader, CardBody, Button, Form, FormGroup, Label, Input} from 'reactstrap';

class AccountSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            timezones: [],
        };
    }

    componentDidMount() {
        this.setState({
            timezones: timezones.tz.names(),
        });
    }

    render() {
        return (
            <Card>
                <CardHeader>Settings</CardHeader>
                <CardBody>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate minus dignissimos earum alias enim pariatur veritatis qui veniam quo, facilis perferendis quod praesentium dolorum consectetur nihil, reprehenderit, laborum eum? Ipsa!</p>
                    <hr/>
                    <Form>
                        <FormGroup row>
                            <Label for="settings-language" sm="3">Language</Label>
                            <Col col="9">
                                <Input type="select" name="language" id="settings-language">
                                    <option>Select option</option>
                                    <option>English</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                    <option>German</option>
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="settings-timezone" sm="3">Timezone</Label>
                            <Col col="9">
                                <Input type="select" name="timezone" id="settings-timezone">
                                    <option value="">Select option</option>
                                    {
                                        this.state.timezones.map((zoneName) => <option key={zoneName} value={zoneName}>{zoneName}</option>)
                                    }
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col sm={{size: 9, offset: 3}}>
                                <Button color="primary">Save changes</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </CardBody>
            </Card>
        );
    }
}

export default AccountSettings;
