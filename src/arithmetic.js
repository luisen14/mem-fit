import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Container, Divider ,Form, Input, Label, Dropdown, Message, Button } from 'semantic-ui-react';

function isInt(value) {
  return !isNaN(value) && (x => (x | 0) === x)(parseFloat(value));
}

class QuizzGame extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      successCount: 0,
      failuresCount: 0,
      difficultLevel: 3
    };
    this.handleDifficultyChange = this.handleDifficultyChange.bind(this);
    this.handleSuccessChange = this.handleSuccessChange.bind(this);
    this.hanldeFailuresChange = this.hanldeFailuresChange.bind(this);
    this.handleResetCounters = this.handleResetCounters.bind(this);
    this.options = [
      {key: '2', text: 'Two digits', value: '2'},
      {key: '3', text: 'Three digits', value: '3'},
      {key: '4', text: 'Four digits', value: '4'},
      {key: '5', text: 'Five digits', value: '5'},
      {key: '6', text: 'Six digits', value: '6'},
      {key: '7', text: 'Seven digits', value: '7'},
    ]
  }

  handleResetCounters(event, data){
    this.setState({
      successCount: 0,
      failuresCount: 0,})
  }

  handleDifficultyChange(event, data){
    this.setState({difficultLevel: data.value})
  }

  handleSuccessChange(count){
    this.setState({successCount: count});
  }

  hanldeFailuresChange(count){
    this.setState({failuresCount: count});
  }

  render(){
    return (
      <div>
        <br />
        <Container textAlign='center'>
          <Message attached header='Mental Arithmetic' content='Enter the answer to quizz below and press <ENTER>' />
          <ArithmeticQuizz key={'k-'+this.state.difficultLevel}
          difficultLevel={this.state.difficultLevel}
          successCount={this.state.successCount}
          failuresCount={this.state.failuresCount}
          onSuccessChange={this.handleSuccessChange}
          onFailuresChange={this.hanldeFailuresChange} />
          <Divider />
          <Form className='attached fluid segment'>
          <Form.Field inline>
            <label>Difficulty level: </label>
            <Dropdown options={this.options} defaultValue='3' onChange={this.handleDifficultyChange} />
            <Divider />
            <Label>Successes: </Label><Label circular color='green'>{this.state.successCount}</Label> <Label>Failures: </Label><Label circular color='red'>{this.state.failuresCount}</Label>
          </Form.Field>
          <Button size='mini' onClick={this.handleResetCounters}>Reset counters</Button>
          </Form>
        </Container>
      </div>
    );
  }
}

class ArithmeticQuizz extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "",
                  val1 : 0,
                  val2 : 0,
                  answer: 0,
                  correct: -1,
                  failedQuizz: "" };

    this.power = Math.pow(10, this.props.difficultLevel);

    // This binding is necessary to make `this` work in the callback
    this.handleChange = this.handleChange.bind(this);
    this.evalAnswer = this.evalAnswer.bind(this);
  }

  componentDidMount() {
    this.setupNewQuiz();
  }

  setupNewQuiz() {
    let v1 = Math.floor((Math.random() * this.power) + 1);
    let v2 = Math.floor((Math.random() * v1) + 1);

    this.setState({
      val1: v1,
      val2: v2,
      answer: (v1 - v2),
      value: ""
    });
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  evalAnswer(e){
    e.preventDefault();
    if (e.keyCode !== 13) {
      return;
    }

    let answerInput = e.target.value;

    if (!isInt(answerInput)){
      this.setState({
        correct: 0,
        failedQuizz: 'Invalid input provided: ' + answerInput
      });

      this.setupNewQuiz();
      return;
    }

    let sanitizedInput = Number(answerInput);
    if (sanitizedInput === this.state.answer) {
      this.setState({
        correct: 1
      });
      this.props.onSuccessChange(this.props.successCount+1);
    } else {
      this.setState({
        correct: 0,
        failedQuizz: this.state.val1 + " - "  + this.state.val2 + "= " + this.state.answer + " not " + sanitizedInput
      });
      this.props.onFailuresChange(this.props.failuresCount+1);
    }

    //this.state.value = "";
    this.setupNewQuiz();
  }

  evalInputAssesment(correctValue){
    let message = null;
    let color = null;

    if (correctValue === 1) {
      message = 'Correct';
      color = 'green';
    } else if (correctValue === 0) {
      message = "Wrong: " + this.state.failedQuizz;
      color = 'red';
    }
    return message != null ? <Label basic color={color} pointing='left'>{ message }</Label> : null;
  }

  render() {
    let assesmentLabel = this.evalInputAssesment(this.state.correct);
    return (
      <Form className='attached fluid segment'>
        <Form.Field inline>
        <label>{this.state.val1} - {this.state.val2} = </label>
        <Input size='mini' value={this.state.value} onKeyUp={this.evalAnswer} onChange={this.handleChange} />
        { assesmentLabel }
        </Form.Field>
      </Form>
    );
  }
}

export default QuizzGame;
