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
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import TestprepDataModel from './../../api/data-model';




// This component is the take test view for the test prep application.
//
class EditTestView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            testName: '',
            testDescription: '',
            currentQuestion: '',
            selectedOption: '',
            currentFirstChoice: '',
            currentFirstChoiceIsCorrect: '',
            currentSecondChoice: '',
            currentSecondChoiceIsCorrect: '',
            currentThirdChoice: '',
            currentThirdChoiceIsCorrect: '',
            currentFourthChoice: '',
            currentFourthChoiceIsCorrect: '',
            choiceType: 'radio',
            user: props.user
        };

        this.test = null;
        this.currentQuestionIndex = 0;
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
            this.numberOfQuestions = this.test.questions.length;

            this.setState({
                 testName: this.test.name,
                 testDescription: this.test.description,
                 currentQuestion: this.test.questions[0].text,
                 currentFirstChoice: this.test.questions[0].choices[0].text,
                 currentSecondChoice: this.test.questions[0].choices[1].text,
                //  currentThirdChoice: this.test.questions[0].choices[2].text,
                //  currentFourthChoice: this.test.questions[0].choices[3].text,
                 currentFirstChoiceIsCorrect: this.test.questions[0].choices[0].isAnswer,
                 currentSecondChoiceIsCorrect: this.test.questions[0].choices[1].isAnswer,
                //  currentThirdChoiceIsCorrect: this.test.questions[0].choices[2].isAnswer,
                //  currentFourthChoiceIsCorrect: this.test.questions[0].choices[3].isAnswer,
                 selectedOption: this.test.questions[0].type,
                 choiceType: 'radio'
            });
        }
        catch(err) {
            this.msgAlert(
                {heading: 'Error', message: err.message, variant: 'danger'});
        }
    };


    onTestNameChanged = event => {
        this.setState({ testName: event.target.value });
    };


    onTestDescriptionChanged = event => {
        this.setState({ testDescription: event.target.value });
    }


    onCurrentQuestionChanged = event => {
        this.setState({ currentQuestion: event.target.value });
    }


    onSubmitHandler = event => {
        event.preventDefault();
    };


    handleOptionChange = event => {
        let choiceType

        if (event.target.value === 'selectBest') {
          choiceType = 'radio';    
        }
        else {
            choiceType = 'checkbox';
        }

        this.setState({
          selectedOption: event.target.value,
          choiceType: choiceType
        });
    };


    onCurrentFirstChoiceChanged = event => {

        this.setState({
          currentFirstChoice: event.target.value,
        });
    };


    onCurrentSecondChoiceChanged = event => {
        this.setState({
          currentSecondChoice: event.target.value
        });
    };


    onCurrentThirdChoiceChanged = event => {
        this.setState({
          currentThirdChoice: event.target.value
        });
    };


    onCurrentFourthChoiceChanged = event => {
        this.setState({
            currentFourthChoice: event.target.value,
        });
    };
 


    // A React.js lifecyle method that is invoked whenever state changes and
    // renders the component.
    //
    render() {
        return (
            <Fragment>
                <h3>Edit A Test</h3>
                <Form onSubmit={event => this.onSubmitHandler(event)}>
                    <Form.Group controlId="formTestName">
                        <Form.Label>Test Name</Form.Label>
                        <Form.Control type="text" placeholder="test name" 
                                      value={ this.state.testName }
                                      onChange={event => this.onTestNameChanged(event) } />
                    </Form.Group>
                    <Form.Group controlId="formCurrentQuestion">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" placeholder="description"
                                      value={this.state.testDescription}
                                      onChange={event => this.onTestDescriptionChanged(event) }  />
                    </Form.Group>
                    <Form.Group controlId="formCurrentQuestion">
                        <Button variant="primary" type="button">
                            &lt;&lt;
                        </Button>
                        <Button variant="primary" type="button">
                            &gt;&gt;
                        </Button>
                        <Button variant="primary" type="button">
                            Add Question;
                        </Button> 
                        <Button variant="primary" type="button">
                            Delete Question;
                        </Button>                                                                           
                    </Form.Group>                         
                    <Form.Group controlId="formCurrentQuestion">
                        <Form.Label>Current Question</Form.Label>
                        <Form.Control type="text" placeholder="current question"
                                      value={this.state.currentQuestion}
                                      onChange={event => this.onCurrentQuestionChanged(event) }  />
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check id='select-best' inline type="radio" 
                                    value='selectBest' 
                                    onChange={event => this.handleOptionChange(event)}
                                    name='questionType'
                                    label="select best answer" />
                        <Form.Check id='select-all' inline type="radio"
                                    value='selectAllThatApply'
                                    onChange={event => this.handleOptionChange(event)}
                                    name="questionType"
                                    label="select all that apply" >
                        </Form.Check>
                    </Form.Group>                    
                    <Form.Label>Choices</Form.Label>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Control type="text" placeholder="first choice"
                                      className='w-50'
                                      value={this.state.currentFirstChoice}
                                      onChange={event => this.onCurrentFirstChoiceChanged(event) } />
                        <Form.Check id='isCorrect-1' inline type={this.state.choiceType}
                                    value=''
                                    name='choice' label='Is Correct?' />
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Control type="text" placeholder="second choice"
                                      className='w-50'
                                      value={this.state.currentSecondChoice}
                                      onChange={event => this.onCurrentSecondChoiceChanged(event) }  />
                        <Form.Check id='isCorrect-2' inline type={this.state.choiceType}
                                    value=''
                                    name='choice' label='Is Correct?' />              
                    </Form.Group> 
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Control type="text" placeholder="third choice"
                                      className='w-50'
                                      value={this.state.currentThirdChoice}
                                      onChange={event => this.onCurrentThirdChoiceChanged(event) }  />
                        <Form.Check id='isCorrect-3' inline type={this.state.choiceType}
                                    value=''
                                    name='choice' label='Is Correct?' />                                        
                    </Form.Group>      
                    <Form.Group controlId="formBasicCheckbox" className='w-75'>
                        <Form.Control type="text" placeholder="fourth choice"
                                      value={this.state.currentFourthChoice}
                                      onChange={event => this.onCurrentFourthChoiceChanged(event) }  />
                        <Form.Check id='isCorrect-4' inline type={this.state.choiceType}
                                    value=''
                                    name='choice' label='Is Correct?' />                                        
                    </Form.Group>                          

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Fragment>
        );
    };
}


export default withRouter(EditTestView);