import React from "react";
import "./App.css";

import { Cartesian } from "./Cartesian";

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			screen: {
				width: 0,
				height: 0
			},
			"state_of_js_2016_normalized_responses_anon.json": [],
			"state_of_js_2017_normalized_responses_anon.json": [],
			"state_of_js_2018_normalized_responses_anon.json": [],
			"state_of_js_2019_normalized_responses_anon.json": [],
			dataset: {}
		};
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	render() {
		return (
			<React.Fragment>
				<h2>
					Popularity of Front End Frameworks
				</h2>
				<Cartesian width={1000} height={600} dataset={this.state.dataset}/>
			</React.Fragment>
		);
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener("resize", this.updateWindowDimensions);
		const getDataUrl = (dataset) => "https://raw.githubusercontent.com/pkcwong/cs498-narrative-visualization/master/data/" + dataset;
		const fetchData = (dataset) => fetch(getDataUrl(dataset)).then(response => response.json()).then((json) => {
			this.setState({
				[dataset]: json
			});
		}).catch((err) => {
			console.error(err);
		});
		Promise.all([
			fetchData("state_of_js_2016_normalized_responses_anon.json"),
			fetchData("state_of_js_2017_normalized_responses_anon.json"),
			fetchData("state_of_js_2018_normalized_responses_anon.json"),
			fetchData("state_of_js_2019_normalized_responses_anon.json")
		]).then(() => {
			const mapper2016 = {
				"would_use": 2,
				"interested": 1,
				"never_heard": 0,
				"not_interested": -1,
				"would_not_use": -2
			};

			const tally = (dataset, mapper) => (framework) => dataset.map(record => record.tools?.[framework]?.experience).reduce((accumulator, current) => (current ? ({
				...accumulator,
				[current]: accumulator[current] + 1
			}) : accumulator), Object.keys(mapper).reduce((accumulator, current) => ({
				...accumulator,
				[current]: 0
			}), {}));

			const tally2016 = tally(this.state["state_of_js_2016_normalized_responses_anon.json"], mapper2016);
			const tally2017 = tally(this.state["state_of_js_2017_normalized_responses_anon.json"], mapper2016);
			const tally2018 = tally(this.state["state_of_js_2018_normalized_responses_anon.json"], mapper2016);
			const tally2019 = tally(this.state["state_of_js_2019_normalized_responses_anon.json"], mapper2016);

			const statistics = ({
				tally2016,
				tally2017,
				tally2018,
				tally2019
			});

			const dataset = [
				"react",
				"vuejs",
				"angular",
				"ember"
			].reduce((accumulator, framework) => ({
				...accumulator,
				[framework]: Object.keys(statistics).reduce((accumulator, current) => ({
					...accumulator,
					[current]: statistics[current](framework)
				}), {})
			}), {});

			this.setState({
				dataset: dataset
			});
		}).catch((err) => {
			console.error(err);
		});
	}

	updateWindowDimensions() {
		this.setState({
			screen: {
				width: window.innerWidth,
				height: window.innerHeight
			}
		});
	}

}

export default App;
