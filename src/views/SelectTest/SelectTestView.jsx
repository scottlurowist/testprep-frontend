////////////////////////////////////////////////////////////////////////////////
//
// SelectTestView.jsx
//
// This component is the view to which a user is directed after signin. From
// here they may select a test to take.
//
////////////////////////////////////////////////////////////////////////////////


import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import TestprepDataModel from './../../api/data-model';



// This component is the view to which a user is directed after signin.
// From here they may select a test to take.
class TakeTestView extends React.Component {

    constructor(props) {
        super(props);

        // AuthenticatedRoute needs the user prop set. Otherwise, it doesn't
        // need to be in state.
        this.state = {
            tests: [],
            user: props.user
        };

        this.msgAlert = props.msgAlert;
        this.dataModel = new TestprepDataModel();
    };


    // A React.js lifecycle method that is invoked immediately after a
    // component is mounted (inserted into the DOM). 
    //
    async componentDidMount() {
        try {
            const response = await this.dataModel
                                       .getAllTests(this.state.user.token);

            this.setState({ tests: response.data.tests } );
        }
        catch(err) {

            this.msgAlert(
                {heading: 'Foo', message: 'bar', variant: 'danger'});
        }
    };


    // Handles the click to navigate to a particular test.
    //
    buttonClickHandler = (test) => {

        const { history } = this.props;

        const url = `/take-test/${test._id}`;
        history.push(url);
    }


    // A React.js lifecyle method that is invoked whenever state changes and
    // renders the component.
    //
    render() {
        return (
            <Fragment>
                <h3>Select a Test</h3>
                <div>
                    {this.state.tests.map(test => {
                        return (
                            <Card key={test._id} style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title>
                                        {test.name}
                                    </Card.Title>
                                    <Card.Text>
                                        {test.description}
                                    </Card.Text>
                                    <Button variant="primary" 
                                            onClick={() => this.buttonClickHandler(test)}>
                                                Take the test!
                                    </Button>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </div>
            </Fragment>
        );
    };
}


export default withRouter(TakeTestView);
