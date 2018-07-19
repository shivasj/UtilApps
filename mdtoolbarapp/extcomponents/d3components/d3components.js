(function(window) {
    'use strict';
    var d3components = {
        verticalBarChart:verticalBarChart
    }

    // Vertical Bar Chart
    function verticalBarChart(){
        // Variables
        var margin = { top: 15, right: 10, bottom: 25, left: 10 },
            width = 400,
            height = 400,
            responsive = false,
            bandPadding = 0.40,
            duration = 500,
            xTitle = 'X Title',
            yTitle = 'Y Title',
            sort = 'value',
            labelColumn = '',
            valueColumn = '',
            dataValue = function (d) { return +d[valueColumn]; };

        var _selection;
        // Colors
        var color = d3.scaleOrdinal(d3.schemeCategory10);
        var percentFormat = d3.format(",.1%");
        var numberFormat = d3.format(",.3n");

        // Chart creation function
        function chart(selection) {
            _selection = selection;

            // For each selection
            _selection.each(function(data) {
                // Build the visual
                buildVisual(this,data);
            });

        }
        function buildVisual(handle,data) {

            // Check if responsive
            if(responsive){
                // Get dimension from container
                console.log(_selection.node().getBoundingClientRect());
                width = parseInt(_selection.node().getBoundingClientRect().width);
                height = width*0.9;
            }

            // Ensure data is numeric
            //console.log(data);
            // Preprocess data for percentages
            var totalVal = 0;
            data.forEach(function(d) {
                totalVal += d[valueColumn];
                d.valuePer = 0.0;
            });

            // Sort data
            data = data.sort(function(a, b){return b[sort] - a[sort]});

            // Start point for x axis
            var xAxisStart = (width-margin.left-margin.right)*0.4;

            // Set the x,y ranges
            var xScale = d3.scaleLinear().range([0, xAxisStart]);
            var yScale = d3.scaleBand().range([0,height-margin.top-margin.bottom]).padding(bandPadding);
            var t = d3.transition().duration(duration).ease(d3.easeLinear);

            // Domains
            xScale.domain([0, d3.max(data, dataValue)]);
            yScale.domain(data.map(function(d) { return d[labelColumn]; }));

            // Axis
            var xAxis = d3.axisBottom(xScale);
            var yAxis = d3.axisLeft(yScale);

            // ***************************************************************
            // Chart Building Logic
            // Select the svg element, if it exists.
            var svg = d3.select(handle).selectAll("svg").data([0]);
            // Otherwise, create the skeletal chart.
            var gEnter = svg.enter().append("svg").append("g");

            // Chart components
            // Add the x Axis
            gEnter.append("g").attr("class", "axis x");
            gEnter.append("g").attr("class", "axis x title").append("text");
            // Add the y Axis
            gEnter.append("g").attr("class", "axis y");
            gEnter.append("g").attr("class", "axis y title").append("text");
            // Add the bars
            gEnter.append("g").attr("class", "bars");

            // Update the outer dimensions.
            var svg = _selection.select("svg");
            svg.attr("width", width).attr("height", height);
            // Update the inner dimensions.
            var g = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Draw X Axis
            g.select("g.axis.x")
                .attr("transform", "translate("+xAxisStart+"," + (height-margin.bottom-margin.top) + ")")
                .transition(t)
                .call(d3.axisBottom(xScale).ticks(4));
            // x Axis text format
            g.selectAll("g.axis.x text")
                .style('font-size','1em')
                .style('fill','#4d4d4d');
            // X Axis Title
            g.select("g.axis.x.title").select('text')
                .attr("transform", "translate("+(20+xAxisStart)+"," + (0) + ")")
                .style('font-size','1em')
                .style('font-weight','normal')
                .style('fill','#4d4d4d')
                .text(xTitle);

            // Draw Y Axis
            g.select("g.axis.y")
                .attr("class", "axis y")
                .attr("transform", "translate("+xAxisStart+","+(0)+")")
                .call(d3.axisLeft(yScale));
            // y Axis text format
            g.selectAll("g.axis.y text")
                .style('font-size','1.2em')
                .style('font-weight','bold')
                .style('fill','#4d4d4d');
            // Y Axis Title
            g.select("g.axis.y.title").select('text')
                .attr("transform", "translate("+(xAxisStart/2)+"," + (0) + ")")
                .style('font-size','1em')
                .style('font-weight','normal')
                .style('fill','#4d4d4d')
                .text(yTitle);

            // Bars
            var rectG = g.select("g.bars");
            var dataBars = rectG.selectAll(".data-bars").data(data);
            dataBars.exit().remove();
            dataBars.enter()
                .append("rect")
                .attr("class", "data-bars");
            var dataBarLabels = rectG.selectAll(".data-bar-labels").data(data);
            dataBarLabels.exit().remove();
            dataBarLabels.enter()
                .append("text")
                .attr("class", "data-bar-labels")
                .style('font-size','0.8em')
                .style('font-weight','normal')
                .style('fill','#4d4d4d');

            dataBars = rectG.selectAll(".data-bars");
            dataBars.attr("x", xAxisStart)
                .attr("fill", function(d) { return color(d[labelColumn]) })
                .attr("height", (yScale.bandwidth()))
                .style("opacity",0.75)
                .transition()
                .duration(duration)
                .attr("y", function(d) { return yScale(d[labelColumn]); })
                .attr("width", function(d) { return xScale(d[valueColumn]); });

            // Bar Lables
            dataBarLabels = rectG.selectAll(".data-bar-labels");
            dataBarLabels.transition()
                .duration(duration)
                .attr("x", function(d) { return xAxisStart+xScale(d[valueColumn])+3; } )
                .attr("y", function(d) { return yScale(d[labelColumn])+yScale.bandwidth()*0.75; } )
                .text(function(d) {
                    return (numberFormat(d[valueColumn])+' ('+percentFormat(d[valueColumn]/totalVal)+")");
                });;

            // Chart Building Logic
            // ***************************************************************

        }

        // Define Getters and Setters
        chart.margin = function(_) {
            if (!arguments.length) return margin;
            margin = _;
            return chart;
        };
        chart.width = function(_) {
            if (!arguments.length) return width;
            width = _;
            return chart;
        };
        chart.height = function(_) {
            if (!arguments.length) return height;
            height = _;
            return chart;
        };
        chart.dataValue = function (_) {
            if (!arguments.length) return dataValue;
            dataValue = _;
            return chart;
        };
        chart.responsive = function(_) {
            if (!arguments.length) return responsive;
            responsive = _;
            return chart;
        };
        chart.xTitle = function(_) {
            if (!arguments.length) return xTitle;
            xTitle = _;
            return chart;
        };
        chart.yTitle = function(_) {
            if (!arguments.length) return yTitle;
            yTitle = _;
            return chart;
        };
        chart.numberFormat = function(_) {
            if (!arguments.length) return numberFormat;
            numberFormat = _;
            return chart;
        };
        chart.labelColumn = function(_) {
            if (!arguments.length) return labelColumn;
            labelColumn = _;
            return chart;
        };
        chart.valueColumn = function(_) {
            if (!arguments.length) return valueColumn;
            valueColumn = _;
            return chart;
        };

        // Resize function
        chart.resize = function () {
            // For each selection
            _selection.each(function(data) {
                // Build the visual
                buildVisual(this,data);
            });
        }

        // return the chart function
        return chart;
    }
    // Vertical Bar Chart

    window.d3components =d3components;
})(window);