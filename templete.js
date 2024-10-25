// Step 1: Set dimensions and margins
const margin = {top: 20, right: 30, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Step 2: Create the SVG canvas
const svg = d3.select("#scatterplot")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Step 3: Read the data
d3.csv("iris.csv").then(function(data) {

  // Step 4: Convert string data to numerical values
  data.forEach(function(d) {
    d.PetalLengthCm = +d.PetalLengthCm;
    d.PetalWidthCm = +d.PetalWidthCm;
  });

  // Step 5: Define scales for the axes
  const x = d3.scaleLinear()
    .domain([d3.min(data, d => d.PetalLengthCm) - 0.5, d3.max(data, d => d.PetalLengthCm) + 0.5])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([d3.min(data, d => d.PetalWidthCm) - 0.5, d3.max(data, d => d.PetalWidthCm) + 0.5])
    .range([height, 0]);

  // Step 6: Define color scale
  const color = d3.scaleOrdinal()
    .domain(["Iris-setosa", "Iris-versicolor", "Iris-virginica"])
    .range(["#FF6347", "#4682B4", "#32CD32"]);

  // Step 7: Add the circles to the plot
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.PetalLengthCm))
    .attr("cy", d => y(d.PetalWidthCm))
    .attr("r", 5)
    .style("fill", d => color(d.Species))
    .style("opacity", 0.7);

  // Step 8: Add the X Axis
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Step 9: Add the Y Axis
  svg.append("g")
    .call(d3.axisLeft(y));

  // Step 10: Add X-axis label
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width / 2 + 30)
    .attr("y", height + 40)
    .text("Petal Length (cm)");

  // Step 11: Add Y-axis label
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", -height / 2)
    .attr("y", -40)
    .attr("transform", "rotate(-90)")
    .text("Petal Width (cm)");

  // Step 12: Create a legend
  const legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(0,${i * 20})`);

  // Step 13: Add colored circles to the legend
  legend.append("circle")
    .attr("cx", width - 10)
    .attr("cy", 10)
    .attr("r", 5)
    .style("fill", color);

  // Step 14: Add legend text
  legend.append("text")
    .attr("x", width - 20)
    .attr("y", 15)
    .style("text-anchor", "end")
    .text(d => d);

});
