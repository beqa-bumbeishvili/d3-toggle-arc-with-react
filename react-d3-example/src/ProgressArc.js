import React, { Component } from 'react';
import * as d3 from "d3";
class ProgressArc extends Component {
  displayName: 'ProgressArc';

  propTypes: {
    id: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number,
    backgroundColor: PropTypes.string,
    foregroundColor: PropTypes.string,
    percentComplete: PropTypes.number,
    duration: PropTypes.number
  }

  componentDidMount() {
    this.drawArc();
  }

  componentDidUpdate() {
    this.redrawArc();
  }

  drawArc() {
    const svg = this.setContext();
    this.setBackground(svg);
    this.setForeground(svg);
    this.updatePercent(svg);
  }

  redrawArc() {
    const svg = d3.select(`#${this.props.id}`);
    svg.remove();
    this.drawArc();
  }

  setContext() {
    const { height, width, id } = this.props;
    return d3.select(this.refs.arc).append('svg')
      .attr('height', height)
      .attr('width', width)
      .attr('id', id)
      .append('g')
      .attr('transform', `translate(${height / 2}, ${width / 2})`);
  }

  setBackground(svg) {
    return svg.append('path')
      .datum({ endAngle: this.tau })
      .style('fill', this.props.backgroundColor)
      .attr('d', this.arc());
  }

  setForeground(svg) {
    return svg.append('path')
      .datum({ endAngle: 0 }) // <- (instead of tau * our percentage)
      .style('fill', this.props.foregroundColor)
      .attr('d', this.arc());
  }

  updatePercent(svg) {
    return this.setForeground(svg).transition()
      .duration(this.props.duration)
      .call(this.arcTween, this.tau * this.props.percentComplete, this.arc());
  }

  arcTween(transition, newAngle, arc) {
    transition.attrTween('d', (d) => {
      const interpolate = d3.interpolate(d.endAngle, newAngle);
      const newArc = d;
      return (t) => {
        newArc.endAngle = interpolate(t);
        return arc(newArc);
      };
    });
  }

  tau = Math.PI * 2;

  arc() {
    return d3.arc()
      .innerRadius(this.props.innerRadius)
      .outerRadius(this.props.outerRadius)
      .startAngle(0)
  }

  render() {
    return (
      <div ref="arc"></div>
    )
  }
}
export default ProgressArc;