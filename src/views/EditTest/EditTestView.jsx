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
            selectedOption: 'selectBest',
            currentFirstChoice: '',
            currentFirstChoiceIsCorrect: '',
            currentFirstChoiceIsCorrectDisabled: true,
            currentSecondChoice: '',
            currentSecondChoiceIsCorrect: '',
            currentSecondChoiceIsCorrectDisabled: true,
            currentThirdChoice: '',
            currentThirdChoiceIsCorrect: '',
            currentThirdChoiceIsCorrectDisabled: true,
            currentFourthChoice: '',
            currentFourthChoiceIsCorrect: '',
            currentFourthChoiceIsCorrectDisabled: true,
            choiceType: 'radio',
            prevQuestionButtonDisabled:true,
            nextQuestionButtonDisabled: true,
            deleteButtonIsDisabled: false,
            user: props.user
        };

        this.test = null;
        this.currentQuestionIndex = 0;
        this.numberOfQuestions = -1; 
        this.msgAlert =  props.msgAlert;
        this.dataModel = new TestprepDataModel();
    };


    // React.js does not like nested state. So this sets the state for the
    // currently loaded question into a flattened state.
    //
    setQuestionState = currentQuestionIndex =>  {
        const choiceOneText = this.test.questions[currentQuestionIndex].choices[0].text;
        const choiceTwoText = this.test.questions[currentQuestionIndex].choices[1].text;
        const choiceThreeText = this.test.questions[currentQuestionIndex].choices[2].text;
        const choiceFourText = this.test.questions[currentQuestionIndex].choices[3].text; 
        
        let choiceType

        if (this.test.questions[currentQuestionIndex].type === 'selectBest') {
          choiceType = 'radio';    
        }
        else {
            choiceType = 'checkbox';
        }

        this.setState({
            testName: this.test.name,
            testDescription: this.test.description,
            currentQuestion: this.test.questions[currentQuestionIndex].text,
            currentFirstChoice: this.test.questions[currentQuestionIndex].choices[0].text,
            currentSecondChoice: this.test.questions[currentQuestionIndex].choices[1].text,
            currentThirdChoice: this.test.questions[currentQuestionIndex].choices[2].text,
            currentFourthChoice: this.test.questions[currentQuestionIndex].choices[3].text,
            currentFirstChoiceIsCorrect: this.test.questions[currentQuestionIndex].choices[0].isAnswer,
            currentSecondChoiceIsCorrect: this.test.questions[currentQuestionIndex].choices[1].isAnswer,
            currentThirdChoiceIsCorrect: this.test.questions[currentQuestionIndex].choices[2].isAnswer,
            currentFourthChoiceIsCorrect: this.test.questions[currentQuestionIndex].choices[3].isAnswer,
            currentFirstChoiceIsCorrectDisabled: choiceOneText === '' ? true : false,
            currentSecondChoiceIsCorrectDisabled: choiceTwoText === '' ? true : false,
            currentThirdChoiceIsCorrectDisabled: choiceThreeText === '' ? true : false,
            currentFourthChoiceIsCorrectDisabled: choiceFourText === '' ? true : false,               
            selectedOption: this.test.questions[currentQuestionIndex].type,
            deleteButtonIsDisabled: (this.test.questions.length === 1) ? true : false,
            choiceType: choiceType
        });
    };

   
    // A React.js lifecycle method that is invoked immediately after a
    // component is mounted (inserted into the DOM). 
    //
    async componentDidMount() {
        try {
            const { match } = this.props;
            const testId = match.params.id;

            let response;

            if (testId === 'new') {
                response = {
                    "name": "",
                    "description": "",
                    "questions": [
                        {
                            "text": "",
                            "type": "selectBest",
                            "choices": [
                                {
                                    "text": "",
                                    "isAnswer": false
                                },
                                {
                                    "text": "",
                                    "isAnswer": false
                                },
                                                    {
                                    "text": "",
                                    "isAnswer": false
                                },
                                {
                                    "text": "",
                                    "isAnswer": false
                                }
                            ]
                        }
                    ]
                }
            }
            else {
                response = await this.dataModel
                                     .getATest(this.state.user.token, testId);
                response = response.data.test;                     
            }

            this.test = response;
            this.numberOfQuestions = this.test.questions.length;
            this.setQuestionState(0);
            
            this.enableDisableNavigationButtons();
        }
        catch(err) {
            this.msgAlert(
                {heading: 'Error', message: err.message, variant: 'danger'});
        }
    };


    // Handles the input field that has the name of the test when the user
    // edits the test name.
    //
    onTestNameChanged = event => {
        this.setState({ testName: event.target.value });
    };


    onTestDescriptionChanged = event => {
        this.setState({ testDescription: event.target.value });
    }


    onCurrentQuestionChanged = event => {
        this.setState({ currentQuestion: event.target.value });
    }


    validateTheTest = () => {
        if (this.state.testName === '' ||
            this.state.testDescription === '' ||
            this.state.currentQuestion === '' ||
            this.state.currentFirstChoice === '' ||
            this.state.currentSecondChoice === '' ||
            this.state.currentThirdChoice === '' ||
            this.state.currentFourthChoice === '') {
                 return false;
        }

        // Did the user select at least one choice as the correct choice?
        // Both question types require at least one correct answer.
        if (this.state.currentFirstChoiceIsCorrect === false &&
            this.state.currentSecondChoiceIsCorrect === false &&
            this.state.currentThirdChoiceIsCorrect === false &&
            this.state.currentFourthChoiceIsCorrect === false) {
                return false;
        }
        
        return true;
    };


    onSubmitHandler = async event => {
        event.preventDefault();

        if (!this.validateTheTest()) {

            this.msgAlert({
                heading: 'Save a Test',
                message: 'Your save was unsuccessful. All fields are required',
                variant: 'danger'
            });
            
            return;
        }

        this.saveTheCurrentQuestionState();

        const dataModel = new TestprepDataModel();

        try {
            if (this.test._id) {
                await dataModel.patchATest(this.state.user, this.test);  
                
                this.msgAlert({
                    heading: 'Save a Test',
                    message: 'Your save was successful',
                    variant: 'success'
                });
            }
            else {
                // This is the first time a test is being persisted, so we
                // must use a POST route.
                let response = await dataModel.createATest(this.test,
                    this.state.user);
                    
                this.test = response.data.test;

                this.msgAlert({
                    heading: 'Save a Test',
                    message: 'Your save was successful',
                    variant: 'success'
                });
            }
        }
        catch(err) {
            this.msgAlert({
                heading: 'Save a Test',
                message: 'Your save failed',
                variant: 'danger'
            });
        }
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
        let isDisabled = false;

        if (event.target.value === '') {
            isDisabled = true;
        }

        this.setState({
          currentFirstChoice: event.target.value,
          currentFirstChoiceIsCorrectDisabled: isDisabled
        });
    };


    onCurrentSecondChoiceChanged = event => {
        let isDisabled = false;

        if (event.target.value === '') {
            isDisabled = true;
        }

        this.setState({
          currentSecondChoice: event.target.value,
          currentSecondChoiceIsCorrectDisabled: isDisabled
        });
    };


    onCurrentThirdChoiceChanged = event => {
        let isDisabled = false;

        if (event.target.value === '') {
            isDisabled = true;
        }

        this.setState({
          currentThirdChoice: event.target.value,
          currentThirdChoiceIsCorrectDisabled: isDisabled
        });
    };


    onCurrentFourthChoiceChanged = event => {
        let isDisabled = false;

        if (event.target.value === '') {
            isDisabled = true;
        }

        this.setState({
            currentFourthChoice: event.target.value,
            currentFourthChoiceIsCorrectDisabled: isDisabled
        });
    };


    // This takes the flattened state for the current test question and
    // persists it back to the test object.
    // 
    saveTheCurrentQuestionState = () => {
        this.test.name = this.state.testName;
        this.test.description = this.state.testDescription;
        this.test.questions[this.currentQuestionIndex].text = this.state.currentQuestion;
        this.test.questions[this.currentQuestionIndex].type = this.state.selectedOption
        this.test.questions[this.currentQuestionIndex].choices[0].text = this.state.currentFirstChoice;
        this.test.questions[this.currentQuestionIndex].choices[0].isAnswer = this.state.currentFirstChoiceIsCorrect;
        this.test.questions[this.currentQuestionIndex].choices[1].text = this.state.currentSecondChoice;
        this.test.questions[this.currentQuestionIndex].choices[1].isAnswer = this.state.currentSecondChoiceIsCorrect;
        this.test.questions[this.currentQuestionIndex].choices[2].text = this.state.currentThirdChoice;
        this.test.questions[this.currentQuestionIndex].choices[2].isAnswer = this.state.currentThirdChoiceIsCorrect;
        this.test.questions[this.currentQuestionIndex].choices[3].text = this.state.currentFourthChoice;
        this.test.questions[this.currentQuestionIndex].choices[3].isAnswer = this.state.currentFourthChoiceIsCorrect;                        
    }



    enableDisableNavigationButtons = () => {
        let prevButtonDisabled = false;
        let nextButtonDisabled = false;

        if (this.currentQuestionIndex === 0) prevButtonDisabled = true;
        if (this.currentQuestionIndex === this.numberOfQuestions - 1) 
            nextButtonDisabled = true;
        if (this.numberOfQuestions === 1) {
            prevButtonDisabled = true;
            nextButtonDisabled = true;             
        } 

        this.setState({
            prevQuestionButtonDisabled: prevButtonDisabled,
            nextQuestionButtonDisabled: nextButtonDisabled             
        });
    };


    onNavButtonClickedHandler = event => {

        // We need to save the state of our current question back to the
        // test object from our flattened state before loading the
        // next question.
        this.saveTheCurrentQuestionState();

        const buttonClickedValue = event.target.value;

        if (buttonClickedValue === '<<') this.currentQuestionIndex -= 1;
        else this.currentQuestionIndex += 1;

        this.enableDisableNavigationButtons();
        
        // Load the next question into state and it will update the UI.
        this.setQuestionState(this.currentQuestionIndex);
    };
 

    addDeleteButtonClickHandler = event => {
        const action = event.target.value;

        if (action === 'add') {
            const question = {
                choices: [
                    {isAnswer: false, text: ''},
                    {isAnswer: false, text: ''},
                    {isAnswer: false, text: ''},
                    {isAnswer: false, text: ''},                                                            
                ],
                text: '',
                type: 'selectBest'
            };

            this.test.questions.push(question);
            this.numberOfQuestions += 1;

            // if (this.numberOfQuestions === 1) 
            //     this.setState({ deleteButtonIsDisabled: true });
            // else this.setState({ deleteButtonIsDisabled: false });

            // Add the new question to the end of the array of questions.
            this.currentQuestionIndex = this.test.questions.length - 1;
            this.setQuestionState(this.test.questions.length - 1);
        }
        else {
            // TODO: Do something better when we only have one question left.
            if (this.numberOfQuestions === 1) {
                this.setState( { deleteButtonIsDisabled: true } );
                return;
            }

            this.test.questions.splice(this.currentQuestionIndex, 1);

            if (this.currentQuestionIndex > 0) {
                this.currentQuestionIndex = this.currentQuestionIndex - 1;
            }

            this.numberOfQuestions = this.test.questions.length;

            const disable = (this.numberOfQuestions === 1) ? true : false

            this.setState( { 
                deleteButtonIsDisabled: disable
            });

            this.setQuestionState(this.currentQuestionIndex);
        }

        this.enableDisableNavigationButtons();
    };    


    choiceChangedHandler = event => {
        const checkId = parseInt(event.target.id.slice(0, 1));

        if (this.state.choiceType === 'radio') {
            switch(checkId) {
                case 1:
                    this.setState({ currentFirstChoiceIsCorrect: true });
                    break; 
                case 2:
                    this.setState({ currentSecondChoiceIsCorrect: true });
                    break;         
                case 3:
                    this.setState({ currentThirdChoiceIsCorrect: true });
                    break;       
                case 4:
                    this.setState({ currentFourthChoiceIsCorrect: true });
                    break;  
                default:
                    break;                                        
            }
        }
        else {
            switch(checkId) {
                case 1:
                    this.setState((state) => ({
                        currentFirstChoiceIsCorrect: !state.currentFirstChoiceIsCorrect
                      }));
                    break; 
                case 2:
                    this.setState((state) => ({
                        currentSecondChoiceIsCorrect: !state.currentSecondChoiceIsCorrect
                      }));
                    break;         
                case 3:
                    this.setState((state) => ({
                        currentThirdChoiceIsCorrect: !state.currentThirdChoiceIsCorrect
                      }));
                    break;       
                case 4:
                    this.setState((state) => ({
                        currentFourthChoiceIsCorrect: !state.currentFourthChoiceIsCorrect
                      }));
                    break;  
                default:
                    break;                                        
            }
        }
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
                        <Button disabled={ this.state.prevQuestionButtonDisabled }
                                onClick={event => this.onNavButtonClickedHandler(event)}
                                variant="primary" value='<<' type="button">
                            &lt;&lt;
                        </Button>
                        <Button disabled={ this.state.nextQuestionButtonDisabled }
                                onClick={event => this.onNavButtonClickedHandler(event)}
                                variant="primary" value='>>' type="button">
                            &gt;&gt;
                        </Button>
                        <Button variant="primary" type="button"
                                value='add'
                                onClick={ event => this.addDeleteButtonClickHandler(event) }>
                            Add Question;
                        </Button> 
                        <Button variant="primary" type="button"
                                value='delete'
                                disabled={ this.state.deleteButtonIsDisabled }
                                onClick={ event => this.addDeleteButtonClickHandler(event) }>                        
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
                                    checked={this.state.selectedOption === 'selectBest'}
                                    label="select best answer" />
                        <Form.Check id='select-all' inline type="radio"
                                    value='selectAllThatApply'
                                    onChange={event => this.handleOptionChange(event)}
                                    name="questionType"
                                    checked={this.state.selectedOption === 'selectAllThatApply'}
                                    label="select all that apply" >
                        </Form.Check>
                    </Form.Group>                    
                    <Form.Label>Choices</Form.Label>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Control type="text" placeholder="first choice"
                                      className='w-50'
                                      value={this.state.currentFirstChoice}
                                      onChange={event => this.onCurrentFirstChoiceChanged(event) } />
                        <Form.Check id='1-isCorrect' inline type={this.state.choiceType}
                                    value={this.state.currentFirstChoiceIsCorrect}
                                    onChange={event => this.choiceChangedHandler(event)}
                                    checked={this.state.currentFirstChoiceIsCorrect}
                                    disabled={ this.state.currentFirstChoiceIsCorrectDisabled }
                                    name='choice' label='Is Correct?' />
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Control type="text" placeholder="second choice"
                                      className='w-50'
                                      value={this.state.currentSecondChoice}
                                      onChange={event => this.onCurrentSecondChoiceChanged(event) }  />
                        <Form.Check id='2-isCorrect' inline type={this.state.choiceType}
                                    value={this.state.currentSecondChoiceIsCorrect}
                                    onChange={event => this.choiceChangedHandler(event)}
                                    checked={this.state.currentSecondChoiceIsCorrect}
                                    disabled={ this.state.currentSecondChoiceIsCorrectDisabled }
                                    name='choice' label='Is Correct?' />              
                    </Form.Group> 
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Control type="text" placeholder="third choice"
                                      className='w-50'
                                      value={this.state.currentThirdChoice}
                                      onChange={event => this.onCurrentThirdChoiceChanged(event) }  />
                        <Form.Check id='3-isCorrect' inline type={this.state.choiceType}
                                    value={this.state.currentThirdChoiceIsCorrect}
                                    onChange={event => this.choiceChangedHandler(event)}
                                    checked={this.state.currentThirdChoiceIsCorrect}
                                    disabled={ this.state.currentThirdChoiceIsCorrectDisabled }
                                    name='choice' label='Is Correct?' />                                        
                    </Form.Group>      
                    <Form.Group controlId="formBasicCheckbox" className='w-75'>
                        <Form.Control type="text" placeholder="fourth choice"
                                      value={this.state.currentFourthChoice}
                                      onChange={event => this.onCurrentFourthChoiceChanged(event) }  />
                        <Form.Check id='4-isCorrect' inline type={this.state.choiceType}
                                    value={this.state.currentFourthChoiceIsCorrect}
                                    onChange={event => this.choiceChangedHandler(event)}
                                    checked={this.state.currentFourthChoiceIsCorrect}
                                    disabled={ this.state.currentFourthChoiceIsCorrectDisabled }
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