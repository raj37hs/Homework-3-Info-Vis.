//for the most part I followed along with class code, but there were a few spots where I got confused. I used stackoverflow, copilot,
//, and TAs as resources to help me with areas I was confused with. 

// Scatterplot Code
(function() {
  const margin = { top: 30, right: 30, bottom: 50, left: 50 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  d3.csv("iris.csv").then(function(data) {
    data.forEach(function(d) {
      d.PetalLengthCm = +d.PetalLengthCm;
      d.PetalWidthCm = +d.PetalWidthCm;
    });

    const x = d3.scaleLinear()
      .domain([d3.min(data, d => d.PetalLengthCm) - 0.5, d3.max(data, d => d.PetalLengthCm) + 0.5])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([d3.min(data, d => d.PetalWidthCm) - 0.5, d3.max(data, d => d.PetalWidthCm) + 0.5])
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .domain(["Iris-setosa", "Iris-versicolor", "Iris-virginica"])
      .range(["#FF6347", "#4682B4", "#32CD32"]);

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.PetalLengthCm))
      .attr("cy", d => y(d.PetalWidthCm))
      .attr("r", 5)
      .style("fill", d => color(d.Species))
      .style("opacity", 0.7);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width / 2 + 30)
      .attr("y", height + 40)
      .text("Petal Length (cm)");

    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", -height / 2)
      .attr("y", -40)
      .attr("transform", "rotate(-90)")
      .text("Petal Width (cm)");

    const legend = svg.selectAll(".legend")
      .data(color.domain())
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("circle")
      .attr("cx", width - 10)
      .attr("cy", 10)
      .attr("r", 5)
      .style("fill", color);

    legend.append("text")
      .attr("x", width - 20)
      .attr("y", 15)
      .style("text-anchor", "end")
      .text(d => d);
  });
})();

// Side-by-Side Boxplot Code
(function() {
  const margin = { top: 30, right: 30, bottom: 50, left: 50 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#boxplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  d3.csv("iris.csv").then(function(data) {
    data.forEach(function(d) {
      d.PetalLengthCm = +d.PetalLengthCm;
    });

    const xScale = d3.scaleBand()
      .domain(["Iris-setosa", "Iris-versicolor", "Iris-virginica"])
      .range([0, width])
      .paddingInner(1)
      .paddingOuter(0.5);

    const yScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.PetalLengthCm) - 1, d3.max(data, d => d.PetalLengthCm) + 1])
      .range([height, 0]);

    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .call(d3.axisLeft(yScale));

    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .text("Species");

    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", -height / 2)
      .attr("y", -40)
      .attr("transform", "rotate(-90)")
      .text("Petal Length (cm)");

    function rollupFunction(v) {
      const sorted = v.map(d => d.PetalLengthCm).sort(d3.ascending);
      const q1 = d3.quantile(sorted, 0.25);
      const median = d3.quantile(sorted, 0.5);
      const q3 = d3.quantile(sorted, 0.75);
      const iqr = q3 - q1;
      const min = Math.max(d3.min(sorted), q1 - 1.5 * iqr);
      const max = Math.min(d3.max(sorted), q3 + 1.5 * iqr);
      return { q1, median, q3, iqr, min, max };
    }

    const quartilesBySpecies = d3.rollup(data, rollupFunction, d => d.Species);

    quartilesBySpecies.forEach((quartiles, species) => {
      const x = xScale(species);
      const boxWidth = xScale.bandwidth() / 2;

      svg.append("line")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", yScale(quartiles.min))
        .attr("y2", yScale(quartiles.max))
        .attr("stroke", "black");

      svg.append("rect")
        .attr("x", x - boxWidth / 2)
        .attr("y", yScale(quartiles.q3))
        .attr("height", yScale(quartiles.q1) - yScale(quartiles.q3))
        .attr("width", boxWidth)
        .attr("stroke", "black")
        .attr("fill", "#69b3a2");

      svg.append("line")
        .attr("x1", x - boxWidth / 2)
        .attr("x2", x + boxWidth / 2)
        .attr("y1", yScale(quartiles.median))
        .attr("y2", yScale(quartiles.median))
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    });
  });
})();
