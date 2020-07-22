import React from "react";
import * as d3 from "d3";
import "./Cartesian.css";

export class Cartesian extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			slide: 0,
			focus: []
		};
	}

	render() {
		return (
			<React.Fragment>
				<div
					style={{
						display: "flex",
						flexDirection: "row"
					}}
				>
					<div id="cartesian"/>
					<div>
						<div>
							<button
								disabled={this.state.slide === 0}
								onClick={() => this.setState({
									slide: this.state.slide - 1
								})}
							>
								prev slide
							</button>
							<button
								disabled={this.state.slide === 4}
								onClick={() => this.setState({
									slide: this.state.slide + 1
								})}
							>
								next slide
							</button>
						</div>
						{
							(this.state.slide === 0 ? (
								<React.Fragment>
									<p>
										Javascript has become one of the most popular languages in web development. It has transitioned from pure front end scripting to the full stack.
									</p>
									<p>
										Web developers now use Javascript to create dynamic web pages and deploy web servers. Many Javascript frameworks and libraries surfaced to meet the great demands.
									</p>
									<p>
										It would be interesting to assess the performance of each library, however assessment criteria may be subjective. We can however conduct a survey and gather opinions from users.
									</p>
									<p>
										The dataset used is downloaded from StateOfJs, conducted a survey every year from 2016 on various Javascript frameworks and libraries. Survey takers would respond to each framework:
									</p>
									<ul>
										<li>
											would use
										</li>
										<li>
											would not use
										</li>
										<li>
											interested
										</li>
										<li>
											not interested
										</li>
										<li>
											never heard
										</li>
									</ul>
									<p>
										This would give us great insight on the performance of each Javascript framework.
									</p>
									<hr/>
									<ul>
										<li>
											Follow the path of each Javascript framework as indicated by the arrows.
										</li>
										<li>
											Hover over black data points for yearly survey results.
										</li>
										<li>
											Hover over the legend at the bottom of the chart to inspect each category.
										</li>
									</ul>
								</React.Fragment>
							) : undefined)
						}
						{
							(this.state.slide === 1 ? (
								<React.Fragment>
									<p>
										The top right side of the chart shows the most popular Javascript frameworks. They all have a large user base and receive positive feedback.
									</p>
									<p>
										In fact ReactJS, ExpressJS and Jest tech stack is one of the most popular Full Stack bundle of choice.
									</p>
								</React.Fragment>
							) : undefined)
						}
						{
							(this.state.slide === 2 ? (
								<React.Fragment>
									<p>
										The top left side of the chart shows AngularJS developed by Google. It is an interesting outlier since it has a large user base but receives poor critics. People are still using it despite its poor performance.
									</p>
									<p>
										AngularJS started off as a potential complete solution to front end. Without competitors, it receives good feedback with an increasing user base.
									</p>
									<p>
										However, AngularJS started introducing huge upgrades, including code breaking changes from Angular to Angular2. This induces trust issues with programmers.
									</p>
									<p>
										With new uprising competitors such as ReactJS and VueJS, AngularJS is slowly in decline.
									</p>
									<p>
										The considerable size of its user base can be explained by the presence of older websites that were built with AngularJS. Programmers are still required to maintain them. it would take some time for these websites to migrate to newer technologies.
									</p>
								</React.Fragment>
							) : undefined)
						}
						{
							(this.state.slide === 3 ? (
								<React.Fragment>
									<p>
										MeteorJS used to hype the community by introducing an all-in-one Full Stack framework on its own.
									</p>
									<p>
										This proved to be too aggressive, as it slowly evolves into a black box. MeteorJS is difficult to customize and maintain.
									</p>
									<p>
										MeteorJS is slowly in decline.
									</p>
								</React.Fragment>
							) : undefined)
						}
						{
							(this.state.slide === 4 ? (
								<React.Fragment>
									<p>
										VueJS and NextJS are also frameworks with great potential. Both are rising in user base and feedback.
									</p>
									<p>
										The two are currently dominated heavily by ReactJS and ExpressJS, however they are undergoing rapid development and the responses are positive.
									</p>
								</React.Fragment>
							) : undefined)
						}
					</div>
				</div>
				<div id="legend-cartesian"/>
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
		this.repaintChart();
		this.repaintLegend();
	}

	repaintChart() {
		document.getElementById("cartesian").innerHTML = "";

		const width = this.props["width"];
		const height = this.props["height"];
		const dataset = this.props["dataset"];

		const canvas = d3.select("#cartesian").append("svg");
		canvas.attr("width", width);
		canvas.attr("height", height);

		const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

		const xScale = d3.scaleLinear().domain([-0.12, 1.12]).range([0, width]);
		const yScale = d3.scaleLinear().domain([1.12, -0.12]).range([0, height]);

		canvas.append("g").attr("class", "axis").attr("transform", "translate(" + 0 + "," + (height / 2) + ")").call(d3.axisBottom(xScale));
		canvas.append("g").attr("class", "axis").attr("transform", "translate(" + (width / 2) + "," + 0 + ")").call(d3.axisLeft(yScale));

		canvas.append("text").attr("transform", "translate(" + 72 + "," + (height / 2 - 2) + ")").style("text-anchor", "middle").text("Negative Feedback");
		canvas.append("text").attr("transform", "translate(" + (width - 72) + "," + (height / 2 - 2) + ")").style("text-anchor", "middle").text("Positive Feedback");
		canvas.append("text").attr("transform", "translate(" + (width / 2 + 16) + "," + 12 + ")").text("Popular");
		canvas.append("text").attr("transform", "translate(" + (width / 2 + 16) + "," + (height - 12) + ")").text("Unpopular");

		const opinion = (tally) => (tally["would_use"] + tally["interested"]) / (tally["would_not_use"] + tally["would_use"] + tally["not_interested"] + tally["interested"]);
		const popularity = (tally) => (tally["would_not_use"] + tally["would_use"]) / (tally["never_heard"] + tally["interested"] + tally["not_interested"] + tally["would_not_use"] + tally["would_use"]);

		const pointData = (dataset) => (framework) => {
			let points = [];
			[
				"tally2016",
				"tally2017",
				"tally2018",
				"tally2019"
			].forEach((tally) => {
				if (dataset[framework][tally]["would_use"] !== 0) {
					points = [
						...points,
						{
							tally,
							opinion: opinion(dataset[framework][tally]),
							popularity: popularity(dataset[framework][tally])
						}
					];
				}
			});
			return points;
		};

		canvas.append("svg:defs").append("svg:marker")
			.attr("id", "triangle")
			.attr("refX", 6)
			.attr("refY", 6)
			.attr("markerWidth", 72)
			.attr("markerHeight", 72)
			.attr("markerUnits", "userSpaceOnUse")
			.attr("orient", "auto")
			.append("path")
			.attr("d", "M 0 0 12 6 0 12 3 6")
			.style("fill", "black");

		Object.keys(dataset).forEach((framework) => {
			const plotData = pointData(dataset)(framework);

			const color = {
				"react": "#F88DAD",
				"vuejs": "#F88DAD",
				"angular": "#F88DAD",
				"express": "#1D2F6F",
				"meteor": "#1D2F6F",
				"nextjs": "#1D2F6F",
				"jest": "#FAC748",
				"mocha": "#FAC748",
				"jasmine": "#FAC748"
			};

			const opacity = (framework) => {
				if (this.state.focus.length === 0 || this.state.focus.includes(framework)) {
					return 1;
				}
				return 0.08;
			};

			const path = canvas.append("g").append("path");
			const line = d3.line().curve(d3.curveCardinal);
			line.x(data => xScale(data.opinion));
			line.y(data => yScale(data.popularity));
			path.datum(plotData).attr("stroke", color[framework] ? color[framework] : "black").attr("stroke-width", 4.8).attr("fill", "none").attr("d", line);
			path.attr("marker-end", "url(#triangle)");
			path.style("opacity", opacity(framework));

			const offsetX = 12;
			const offsetY = -20;
			const text = canvas.append("g").append("text");
			text.attr("transform", "translate(" + (xScale(plotData[plotData.length - 1].opinion) + offsetX) + "," + (yScale(plotData[plotData.length - 1].popularity) + offsetY) + ")");
			text.style("opacity", opacity(framework));
			text.text(framework);

			const circle = canvas.append("g").selectAll("circle").data(plotData).enter().append("circle");
			circle.attr("cx", data => xScale(data.opinion));
			circle.attr("cy", data => yScale(data.popularity));
			circle.attr("r", () => 4);
			circle.style("opacity", (d) => {
				if (d.tally === "tally2019") {
					return 0;
				}
				return opacity(framework);
			});
			circle.on("mouseover", (data) => {
				tooltip.transition().duration(200).style("opacity", 0.9);
				tooltip.html(framework + " " + data.tally.substring(5) + " </br>popularity: " + Math.floor(data.popularity * 100) + "%</br>opinion: " + Math.floor(data.opinion * 100) + "%").style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 24) + "px");
			});
			circle.on("mouseout", () => {
				tooltip.transition().duration(800).style("opacity", 0);
			});
		});

		const annotate = (cx, cy, r) => {
			const annotationCircle = canvas.append("g").append("circle");
			annotationCircle.attr("cx", cx);
			annotationCircle.attr("cy", cy);
			annotationCircle.attr("r", r);
			annotationCircle.attr("stroke", "blue");
			annotationCircle.attr("fill", "none");
		};

		if (this.state.slide === 1) {
			annotate(980, 248, 100);
		}

		if (this.state.slide === 2) {
			annotate(440, 320, 100)
		}

		if (this.state.slide === 3) {
			annotate(440, 640, 100)
		}

		if (this.state.slide === 4) {
			annotate(860, 480, 100)
		}
	}

	repaintLegend() {
		document.getElementById("legend-cartesian").innerHTML = "";

		const width = this.props["width"];
		const height = this.props["height"] / 4;

		const canvas = d3.select("#legend-cartesian").append("svg");
		canvas.attr("width", width);
		canvas.attr("height", height);

		const keys = {
			Frontend: "#F88DAD",
			Backend: "#1D2F6F",
			Testing: "#FAC748"
		};

		const circle = canvas.selectAll("legend").data(Object.keys(keys)).enter().append("circle");
		circle.attr("cx", (d, i) => 20 + i * 256);
		circle.attr("cy", 20);
		circle.attr("r", 12);
		circle.style("fill", (d) => keys[d]);
		circle.on("mouseover", (d) => {
			const category = {
				Frontend: [
					"react",
					"vuejs",
					"angular"
				],
				Backend: [
					"express",
					"meteor",
					"nextjs"
				],
				Testing: [
					"jest",
					"mocha",
					"jasmine"
				]
			};
			this.setState({
				focus: category[d]
			}, () => {
				this.repaintChart();
			});
		});

		const label = canvas.selectAll("legend").data(Object.keys(keys)).enter().append("text");
		label.attr("x", (d, i) => 48 + i * 256);
		label.attr("y", 20);
		label.text((d) => d);
		label.attr("text-anchor", "left");
		label.style("alignment-baseline", "middle");
	}

}
