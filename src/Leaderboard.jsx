import React from "react";
import { Pie } from "./Pie";

export class Leaderboard extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const width = this.props["width"];
		const height = this.props["height"];
		const dataset = this.props["dataset"]

		return (
			<React.Fragment>
				<Pie width={width} height={height} framework="react" dataset={dataset["react"]?.["tally2019"]}/>
				<Pie width={width} height={height} framework="express" dataset={dataset["express"]?.["tally2019"]}/>
				<Pie width={width} height={height} framework="jest" dataset={dataset["jest"]?.["tally2019"]}/>
			</React.Fragment>
		);
	}

}
