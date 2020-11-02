////////////////////////////////////////////////////////////////////////////////
//
// MyTestsView.jsx
//
// This component is the view for which a user goes to select a personal test
// for performing CRUD operations on it.
//
////////////////////////////////////////////////////////////////////////////////


import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import TestprepDataModel from './../../api/data-model';



// This component is the view to which a user is directed after signin.
// From here they may select a test to take.
class MyTestsView extends React.Component {

    constructor(props) {
        super(props);

        // AuthenticatedRoute needs the user prop set. Otherwise, it doesn't
        // need to be in state.
        this.state = {
            tests: [],
            user: props.user
        };

        this.tests = [];
        this.selectedTest = null;
        this.msgAlert = props.msgAlert;
        this.dataModel = new TestprepDataModel();
    };


    // A React.js lifecycle method that is invoked immediately after a
    // component is mounted (inserted into the DOM). 
    //
    async componentDidMount() {
        try {
            const response = await this.dataModel
                                       .getMyTests(this.state.user);

            this.tests = response.data.tests;

            this.setState({ tests: response.data.tests } );
        }
        catch(err) {

            this.msgAlert(
                {heading: 'Foo', message: err.message, variant: 'danger'});
        }
    };


    // Handles the click to navigate to a particular test.
    //
    buttonClickHandler = async (event) => {
        const foo = 100;

        if (event.target.value === 'delete') {

            const selectedTest = this.selectedTest;

            const filteredTests = this.tests.filter(currentTest => {
                if (currentTest.name !== selectedTest.name) {
                    return currentTest;    
                }
            });

            try {
                await this.dataModel.deleteATest(this.selectedTest._id, this.state.user.token);

                this.setState({ tests: filteredTests });

                this.msgAlert({
                    heading: 'Delete a Test',
                    message: 'Your delete was successful',
                    variant: 'success'
                });            
            }
            catch(err) {
                this.msgAlert({
                    heading: 'Delete a Test',
                    message: 'Your delete failed',
                    variant: 'danger'
                });                  
            }

            return;
        }

        const { history } = this.props;
        const id = this.selectedTest === 'new' ? 'new' : this.selectedTest._id;

        history.push(`/edit-test/${id}`);
    }


    // A React.js lifecyle method that is invoked whenever state changes and
    // renders the component.
    //
    render() {
        return (
            <Fragment>
                <h3>Select a Test To Edit</h3>
                <div>
                    <Card key={12345} 
                          className='mb-4'
                          style={{width: '18rem'}}>
                        <Card.Body>
                            <Card.Title>
                                New Test
                            </Card.Title>
                            <Card.Text>
                                Create a new test.
                            </Card.Text>
                            <Button variant="primary"
                                    onClick={ event => {
                                        this.selectedTest = 'new';
                                        this.buttonClickHandler(event);
                                    }}>
                                Create a new test!
                            </Button>
                        </Card.Body>
                    </Card>
                    {this.state.tests.map(test => {
                        return (
                            <Card key={test._id}  
                                  className='mb-4'
                                  style={{width: '18rem'}}>
                                <Card.Body>
                                    <Card.Title>
                                        {test.name}
                                    </Card.Title>
                                    <Card.Text>
                                        {test.description}
                                    </Card.Text>
                                    <Button variant="primary"
                                            block={false}
                                            className='mr-3'
                                            value='edit'
                                            onClick={ event =>  {
                                                this.selectedTest = test;
                                                this.buttonClickHandler(event)
                                            }}>
                                        Edit
                                    </Button>
                                    <Button variant="primary" 
                                            block={false}
                                            value='delete'
                                            onClick={ event => {
                                                this.selectedTest = test;
                                                this.buttonClickHandler(event);
                                            }}>
                                        Delete
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


export default withRouter(MyTestsView);
