////////////////////////////////////////////////////////////////////////////////
//
// TakeTestView.jsx
//
// This component is the view to which a user navigates in order to
// take a test.
//
////////////////////////////////////////////////////////////////////////////////


import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import TestprepDataModel from './../../data-model';



// This component is the take test view for the test prep application.
//
class TakeTestView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            msgAlert: props.msgAlert,
            test: {},
            user: props.user
        };

        this.dataModel = new TestprepDataModel();
    };


    // A React.js lifecycle method that is invoked immediately after a
    // component is mounted (inserted into the tree). 
    //
    async componentDidMount() {
        try {
            const { match } = this.props;
            const testId = match.params.id;

            const response = await this.dataModel
                                       .getATest(this.state.user.token, testId);

            this.setState({ test: response.data.test } );
        }
        catch(err) {

            this.state.msgAlert(
                {heading: 'Foo', message: 'bar', variant: 'danger'});
        }
    };


    buttonClickHandler = () => {


        this.state.msgAlert(
            {heading: 'Foo', message: 'click worked', variant: 'success'});        
    }


    // A React.js lifecyle method that is invoked whenever state changes and
    // renders the component.
    //
    render() {


        return (
            <Fragment>
                <h3>{this.state.test.name}</h3>
                {/* <div>
                    {this.state.tests.map(test => {
                        return (
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title>
                                        {test.name}
                                    </Card.Title>
                                    <Card.Text>
                                        {test.description}
                                    </Card.Text>
                                    <Button variant="primary" 
                                            onClick={this.buttonClickHandler}>
                                                Go somewhere
                                    </Button>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </div> */}
            </Fragment>
        );
    };
}


export default withRouter(TakeTestView);