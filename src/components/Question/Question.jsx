////////////////////////////////////////////////////////////////////////////////
//
// Question.jsx
//
// This component renders a single question based upon the question type.
//
////////////////////////////////////////////////////////////////////////////////


import React, { Fragment } from 'react';

import questionTypeEnum from './../../lib/questionTypeEnum';




// This component renders a single question based upon the question type.
//
class Question extends React.Component {

    constructor(props) {
        super();

        this.selectedAnswers = {};
        this.answerChangedCallback = props.answerChangedCallback;
    };


    onControlChanged = (event) => {
        // Only if we have a select best (radio buttons) we must
        // clear previous selections since there can be only one.
        if (this.props.questionType === questionTypeEnum.selectBest) {

            for (let index in this.selectedAnswers) {
                this.selectedAnswers[index] = false;
            }
        }

        this.selectedAnswers[event.target.id] = event.target.checked;

        const answers = {...this.selectedAnswers};

        this.answerChangedCallback(this.selectedAnswers);
    };

    // Contains the logic to render a question and its choices
    // based upon the question type.
    renderQuestion = () => {
        let controlType =
            this.props.questionType === questionTypeEnum.selectBest
                ? 'radio'
                : 'checkbox';

        // Clear any previously rendered selected answers.
        this.selectedAnswers = {};

        const choices = this.props.choices.map((choice, index) => {

            // When we load a new question, make sure that we set
            // all answers to false since a user must opt-in.
            this.selectedAnswers[index] = false;

            // Filter causes a bizarre exception to be thrown. So if the
            // choice does not have text, don't render it. Otherwise render it.
            if (choice.text === '') {
                return <Fragment></Fragment>
            }
            else {
                return (
                    <p key={index}>
                        <input id={index} type={controlType} name='question'
                            onChange={event => this.onControlChanged(event)} />
                        <label for={index}>{choice.text}</label>
                    </p>
                );
            }
        });

        return <div>{choices}</div>;
    };

    render() {
        return (
            <section>
                <h2>{this.props.question}</h2>
                {/* Whenever this.props.question changes, render will be invoked
                    and this.renderQuestion will also be invoked.  */}
                <div>{this.renderQuestion()}</div>
            </section>
        );
    }
}


export default Question;
