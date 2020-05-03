d3.select(".project-name").text("D3 BARCHART")
d3.select("#title").text("PIB de Estados Unidos")

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
.then(response => response.json())
.then( response => {
  
  const dataSet = response.data;
  let padding = 40;  
  const width = 850, height = 400 + padding, widthBar = width / dataSet.length;
  const widthSpace = width - padding ;
  const heightSpace = height - padding;

  let tooltip = d3.select('.bar-chart')
              .append('div')
              .attr('class', 'tooltip')
              .attr('id', 'tooltip')
              .style('opacity', '0')
            
  tooltip.append('h3')
  
  tooltip.append('p').attr("class", "money")

  const svg = d3.select(".bar-chart")
              .append("svg")
              .attr("width", width)
              .attr("height", height)

  let format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataSet, d => d[1])])
            .range([heightSpace, 0])

  const yAxis = d3.axisLeft(yScale);

  const dates = dataSet.map( x => new Date(x[0]))

  let xMax = d3.max(dates);

  xMax.setMonth(xMax.getMonth() + 6);

  const xScale = d3.scaleTime()
            .domain([d3.min(dates), xMax])
            .range([0, widthSpace]);

  const xAxis = d3.axisBottom().scale(xScale);

  const g = d3.select('svg')
            .append('g')
            .attr('transform', `translate(${padding}, ${10})`)
            
  const textY = svg.append('text')
            .attr('x', -width/4)
            .attr('y', 70)
            .attr('transform', 'rotate(-90)')
            .attr("opacity","0.6")
            .text('Producto Interno Bruto');

            g.append('g').call(yAxis)
            .attr('id', 'y-axis')
            g.append('g').call(xAxis)
            .attr("transform", `translate(0,${heightSpace})`)
            .attr('id', 'x-axis');

            svg.select('g')
            .selectAll("rect")
            .data(dataSet)
            .enter()
            .append("rect")
            .attr('class', 'bar')
            .attr('data-date', (d, i) => d[0])
            .attr('data-gdp', (d, i) => d[1])
            .attr('x', (d, i) => xScale( new Date(d[0])))
            .attr('y', d =>  yScale(d[1])- padding)
            .attr('width', widthBar)
            .attr('height', d => height - yScale(d[1]) -padding )
            .attr("transform", `translate(0,40)`)
            .on('mouseover', (d, i) =>{

            fecha = new Date(d[0])
            
            d3.select('h3')
                .text(`${fecha.getFullYear()} ${convertMonth(fecha.getMonth())}`)

            d3.select('.money')
                .text(`${format.format(d[1])} Billion`)

            tooltip
              .style('opacity', '0.8')
              .style('margin-left', `${xScale( new Date(d[0]))+85}px`)
              .style('margin-top', `${300}px`)
              .attr('data-date', d[0]);

            })
            .on("mouseout",
            d => { 
              tooltip.style('opacity', '0');
            });

})


function convertMonth(month){
    if(month <= 3){
      return 'Q1'
    }
    if(month >= 4 && month <= 6){
      return 'Q2'
    }
    if(month >= 7 && month <= 9){
      return 'Q3'
    }
    if(month >= 10 && month <= 12){
      return 'Q4'
    } 
    return undefined
}
