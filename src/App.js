import React from "react";
import "./App.css";

import { Cartesian } from "./Cartesian";
import { Leaderboard } from "./Leaderboard";

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
			dataset: {},
			page: "Trend"
		};
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.switchPage = this.switchPage.bind(this);
	}

	render() {
		return (
			<React.Fragment>
				<div
					style={{
						margin: 24
					}}
				>
					<h2>
						Trend of Javascript Web Development Frameworks and Libraries
					</h2>
					<p>
						<button onClick={this.switchPage("Trend")}>
							Trend
						</button>
						<button onClick={this.switchPage("Leaderboard")}>
							Leaderboard
						</button>
					</p>
					{
						(Object.keys(this.state.dataset).length === 0 ? (
							<p>
								Loading dataset...
							</p>
						) : undefined)
					}
					{
						(this.state.page === "Trend" ?
							<Cartesian width={1200} height={800} dataset={this.state.dataset}/> : undefined)
					}
					{
						(this.state.page === "Leaderboard" ? <Leaderboard width={1200} height={360} dataset={this.state.dataset}/> : undefined)
					}
				</div>
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
		const dataset2016 = fetchData("state_of_js_2016_normalized_responses_anon.json");
		const dataset2017 = fetchData("state_of_js_2017_normalized_responses_anon.json");
		const dataset2018 = fetchData("state_of_js_2018_normalized_responses_anon.json");
		const dataset2019 = fetchData("state_of_js_2019_normalized_responses_anon.json");
		const promises = [
			dataset2016,
			dataset2017,
			dataset2018,
			dataset2019
		];
		Promise.all(promises).then(() => {
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
				"express",
				"meteor",
				"nextjs",
				"jest",
				"mocha",
				"jasmine"
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

	switchPage(page) {
		return () => {
			this.setState({
				page: page
			}, () => {
				this.forceUpdate();
			});
		};
	}

}

export default App;
