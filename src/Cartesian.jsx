import React from "react";
import * as d3 from "d3";

export class Cartesian extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<React.Fragment>
				<div id="cartesian"/>
			</React.Fragment>
		);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const width = this.props["width"];
		const height = this.props["height"];
		const dataset = this.props["dataset"];
		console.log(dataset);
		document.getElementById("cartesian").innerHTML = "";
		const canvas = d3.select("#cartesian").append("svg");
		canvas.attr("width", width);
		canvas.attr("height", height);

		const xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
		const yScale = d3.scaleLinear().domain([1, 0]).range([0, height]);

		canvas.append("g").attr("transform","translate("+ 0 + ","+ (height / 2) +")").call(d3.axisBottom(xScale));
		canvas.append("g").attr("transform","translate("+ (width / 2) + ","+ 0 +")").call(d3.axisLeft(yScale));

		const opinion = (tally) => tally["would_use"] / (tally["would_not_use"] + tally["would_use"]);
		const popularity = (tally) => (tally["would_not_use"] + tally["would_use"]) / (tally["never_heard"] + tally["interested"] + tally["not_interested"] + tally["would_not_use"] + tally["would_use"]);

		Object.keys(dataset).forEach((framework) => {
			const path = canvas.append("g").append("path");
			const lineData = [
				[
					opinion(dataset[framework]["tally2016"]),
					popularity(dataset[framework]["tally2016"])
				],
				[
					opinion(dataset[framework]["tally2017"]),
					popularity(dataset[framework]["tally2017"])
				],
				[
					opinion(dataset[framework]["tally2018"]),
					popularity(dataset[framework]["tally2018"])
				],
				[
					opinion(dataset[framework]["tally2019"]),
					popularity(dataset[framework]["tally2019"])
				]
			];
			const line = d3.line().curve(d3.curveCardinal);
			line.x(data => xScale(data[0]));
			line.y(data => yScale(data[1]));
			path.datum(lineData).attr("stroke", "blue").attr("stroke-width", 2).attr("fill", "none").attr("d", line);
		});
	}

}
