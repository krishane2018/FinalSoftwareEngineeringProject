import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

const React = require('react'); // <1>
import Question from './Question'
import Button from "@material-ui/core/Button";
const client = require('./client'); // <3>


export default class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {formValues: {}}
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        const {questions} = this.props

        if (prevProps.questions.length !== questions.length) {
            let formValues = {}
            for (let question of questions) {
                formValues[question.id] = ""
            }
            this.setState({formValues})
        }

    }

    handleInputChange = (e) => {
        const {name, value} = e.target;
        const {formValues} = this.state
        this.setState({formValues: {...formValues, [name]: value}});
    };

    handleSliderChange = (id) => (value) => {
        const {formValues} = this.state
        this.setState({formValues: {...formValues, [id]: value.text}});
    };
  handleSubmit = (event) => {
    const { formValues } = this.state
    event.preventDefault();
    console.log(formValues);
    client({method: 'POST', path: '/submission', entity: Object.values(formValues),
      headers: {'Content-Type': 'application/json'}}).done(response => {
        console.log("finished")
        window.location.assign("http://localhost:8080/thanks");
        });
  };

    render() {

    const {formValues} = this.state

    const questionsArr = this.props?.questions ?? []
    const questions = questionsArr.map(question => {
      let onChange = question.type === "NUMBER_RANGE" ? this.handleSliderChange(question.id) : this.handleInputChange
          return(<Question key={question.id} type={"NUMBER_RANGE"} answer={formValues[question.id]}
                    handleInputChange={onChange}{...question}/>)
      }
    );
    const handleSubmit = (event) => {
                event.preventDefault();
                console.log(formValues);
              };
    return (
      <form onSubmit={handleSubmit}>
        <Grid container alignItems="center" justify="center" direction="column">
        {questions}
        </Grid>
        <Grid container justify="center">
        <Button variant="contained" color="primary" type="submit">
        Submit
        </Button>
        </Grid>
      </form>
    )
  }
}