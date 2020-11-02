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

import Question from './../../components/Question/Question';

import TestprepDataModel from './../../api/data-model';




// This component is the take test view for the test prep application.
//
class TakeTestView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            currentQuestion: null,
            checkAnswerButtonDisabled: false,
            nextQuestionButtonDisabled: true,
            questionsAnswered: 0,
            questionsAnsweredCorrectly: 0,
            user: props.user
        };

        this.test = null;
        this.currentQuestionIndex = -1;
        this.numberOfQuestions = -1; 
        this.questionsAnswered = 0;
        this.questionsAnsweredCorrectly = 0;
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
            this.currentQuestionIndex = 0;
            this.numberOfQuestions = this.test.questions.length; 
            this.answersToTheQuestion = null;

            this.setState({
                loaded: true,
                currentQuestion: this.test.questions[this.currentQuestionIndex],
            }); 
        }
        catch(err) {

            this.msgAlert(
                {heading: 'Error', message: err.message, variant: 'danger'});
        }
    };


    checkAnswerButtonClickHandler = () => {
        let message = 'You answered correctly';
        let variant = 'success';
        let index = 0;

        if (this.answersToTheQuestion === null) {
            this.msgAlert(
                {
                    heading: `${this.state.currentQuestion.text}`,
                    message: `Please select an answer`,
                    variant: 'info'
                }  
            );

            return;
        }

        // The question was answered.
        this.questionsAnswered += 1;

        // Check for choices that are not empty and any that have been
        // answered incorrectly. Any single incorrect answer fails
        // the repsonse.
        let incorrectAnswer;

        for (let choice of this.state.currentQuestion.choices) {
            if (choice.text !== '') {
                if (choice.isAnswer !== this.answersToTheQuestion[index]) {
                    message = 'You answered incorrectly';
                    variant = 'danger';
                    incorrectAnswer = true;
                    break;
                }
            }

            index += 1;
        };

        // At this point the question was answered correctly.
        if (!incorrectAnswer) this.questionsAnsweredCorrectly += 1;

        this.msgAlert(
            {
                heading: `${this.state.currentQuestion.text}`,
                message: `${message}`,
                variant: `${variant}`
            }  
        );    
  
        this.currentQuestionIndex += 1;

        if (this.currentQuestionIndex === this.numberOfQuestions) {
            this.msgAlert(
                {
                    heading: `${this.test.name} is complete`,
                    message: `You have scored ${this.questionsAnsweredCorrectly} out of ${this.numberOfQuestions}`,
                    variant: `${variant}`
                }  
            );               
        }

        this.setState({
            questionsAnswered: this.questionsAnswered,
            questionsAnsweredCorrectly: this.questionsAnsweredCorrectly 
        });

        if (this.currentQuestionIndex < this.numberOfQuestions ) {
            this.setState({
                checkAnswerButtonDisabled: true,
                nextQuestionButtonDisabled: false
            });
        } 
        else if (this.currentQuestionIndex === this.numberOfQuestions) {
            this.setState({
                checkAnswerButtonDisabled: true,
                nextQuestionButtonDisabled: true
            });
        }
    };


    nextQuestionButtonClickHandler = () => {
        const question = this.test.questions[this.currentQuestionIndex];

        this.setState({ 
            checkAnswerButtonDisabled: false,
            nextQuestionButtonDisabled: true,
            currentQuestion: question
        });
    };


    answerChangedCallback = answers => {
        this.answersToTheQuestion = answers;
    };


    // A React.js lifecyle method that is invoked whenever state changes and
    // renders the component.
    //
    render() {
        return (
            <Fragment>
                { this.state.loaded &&
                  <div>
                    <h2>{this.test.name}</h2>
                    <span>
                        {`${this.questionsAnsweredCorrectly}/${this.questionsAnswered}`}
                    </span>
                    <Question question={ this.state.currentQuestion.text }
                              questionType={ this.state.currentQuestion.type }
                              answerChangedCallback={ answers => this.answerChangedCallback(answers) }
                              choices={ this.state.currentQuestion.choices }
                    />
                    <Button disabled={this.state.checkAnswerButtonDisabled} 
                            onClick={() => this.checkAnswerButtonClickHandler()} >
                        Check Answer
                    </Button>
                    <Button disabled={this.state.nextQuestionButtonDisabled} 
                            onClick={() => this.nextQuestionButtonClickHandler()}>
                        Next Question
                    </Button>
                  </div>
                }
            </Fragment>
        );
    };
}


export default withRouter(TakeTestView);