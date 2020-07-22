import React from "react";
import * as d3 from "d3";
import "./Pie.css";

export class Pie extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const framework = this.props["framework"];
		return (
			<React.Fragment>
				<h2>
					{framework}
				</h2>
				<div id={"pie-" + framework}/>
			</React.Fragment>
		);
	}

	componentDidMount() {
		this.repaint();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.repaint();
	}

	repaint() {
		const width = this.props["width"];
		const height = this.props["height"];
		const framework = this.props["framework"];
		const dataset = this.props["dataset"];
		document.getElementById("pie-" + framework).innerHTML = "";

		const canvas = d3.select("#pie-" + framework).append("svg");
		canvas.attr("width", width);
		canvas.attr("height", height);

		const chart = canvas.append("g");
		chart.attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

		canvas.append("g").classed("labels", true);
		canvas.append("g").classed("lines", true);

		const radius = Math.min(width, height) / 6;
		const pie = d3.pie().value((d) => d.value).sort(null);;
		const readyData = pie(d3.entries(dataset));
		const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
		const color = {
			would_use: "DarkGreen",
			interested: "DarkOliveGreen",
			not_interested: "Brown",
			would_not_use: "Crimson",
			never_heard: "DimGrey"
		};

		const slice = chart.selectAll("slice").data(readyData).enter().append("path");
		slice.attr("d", arcGenerator);
		slice.attr("fill", (d) => color[d.data.key]);
		slice.attr("stroke", "black");
		slice.style("stroke-width", "2px");
		slice.style("opacity", 0.7);

		const annotation = chart.selectAll("slice").data(readyData).enter().append("text");
		annotation.text((d) => {
			if (d.endAngle - d.startAngle > 0.2) {
				return d.data.key;
			}
			return "";
		});
		annotation.attr("transform", (d) => {
			const centroid = arcGenerator.centroid(d);
			return "translate(" + centroid[0] * 3.2 + "," + centroid[1] * 3.2 + ")";
		});
		annotation.style("text-anchor", "middle");
		annotation.style("font-size", 16);
	}

}
