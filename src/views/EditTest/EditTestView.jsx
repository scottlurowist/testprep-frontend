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

import TestprepDataModel from './../../api/data-model';
import questionTypeEnum from '../../lib/questionTypeEnum';




// This component is the take test view for the test prep application.
//
class EditTestView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            currentQuestion: null,
            checkAnswerButtonDisabled: false,
            nextQuestionButtonDisabled: true,
            user: props.user
        };

        this.test = null;
        this.currentQuestionIndex = -1;
        this.numberOfQuestions = -1; 
        this.msgAlert =  props.msgAlert;
        this.dataModel = new TestprepDataModel();
    };


    // A React.js lifecycle method that is invoked immediately after a
    // component is mounted (inserted into the DOM). 
    //
    async componentDidMount() {
        try {
            const { match } = this.props;
            const testId = match.params.id;

            const response = await this.dataModel
                                       .getATest(this.state.user.token, testId);

            this.test = response.data.test; 
            // this.currentQuestionIndex = 0;
            // this.numberOfQuestions = this.test.questions.length; 
            // this.answersToTheQuestion = null;

            // this.setState({
            //     loaded: true,
            //     currentQuestion: this.test.questions[this.currentQuestionIndex],
            // }); 
        }
        catch(err) {

            this.msgAlert(
                {heading: 'Error', message: err.message, variant: 'danger'});
        }
    };

    // A React.js lifecyle method that is invoked whenever state changes and
    // renders the component.
    //
    render() {
        return (
            <Fragment>
                <h3>Edit A Test</h3>
                {/* { this.state.loaded &&
                  <div>
                    <h2>{this.test.name}</h2>
                  </div>
                } */}
            </Fragment>
        );
    };
}


export default withRouter(EditTestView);