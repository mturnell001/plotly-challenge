//builds base-line page
function initVisit() {
    d3.json('samples.json').then(function (data) {
    console.log(data);

    //build the ID dropdown
    const idDropDown = d3.select('body').select('#selDataset');
    data.names.forEach( (idNum, i) => {
        idDropDown.append('option')
            .attr('value', `${i}`)
            .text(`${idNum}`)
    });

    //draw barChart for patient 0
    barChart(0, data);

    //draw bubbleChart for patient 0
    bubbleChart(0, data);

    //update demographics for patient 0
    demographics(0, data);

})};

//updates the barChart
function barChart(idIndex, data){
    const trace = [{x: data.samples[idIndex]
                    .sample_values
                    .slice(0,10).reverse(),

                    y: data.samples[idIndex]
                    .otu_ids
                    .slice(0,10)
                    .map(item => 'OTU ' + item.toString())
                    .reverse(),

                    type: 'bar',
                    orientation: 'h',

                    hovertext: data.samples[idIndex]
                    .otu_labels
                    .slice(0,10)
                    .reverse()
                    .map(item => otuLabelHandler(item))}];
    console.log(trace);
    Plotly.newPlot('bar', trace);
};

//updates the bubbleChart
function bubbleChart(idIndex, data){
    const trace = [{x: data.samples[idIndex]
                    .otu_ids,
                    y: data.samples[idIndex]
                    .sample_values,
                    marker: {
                        color: data.samples[idIndex]
                        .otu_ids,
                        size: data.samples[idIndex]
                        .sample_values},
                    mode:'markers',
                    hovertext: data.samples[idIndex]
                    .otu_labels
                    .map(item => otuLabelHandler(item))}];
    
    Plotly.newPlot('bubble', trace);
};

//updates the demographics
function demographics(idIndex, data){
    d3.select('#sample-metadata').append('ul').attr('id', 'demo-list');
    const div = d3.select('#demo-list');
    //if theres already info here, clear it
    if (!div.empty()){
        div.html('')
    };
    //pull the metadata for the correct id
    console.log(Object.entries(data.metadata[idIndex]));
    Object.entries(data.metadata[idIndex])
        .forEach(item => {
            div.append('li')
                .text(`${item[0]}: ${item[1]}`);
        });
}

//collects the idIndex when the dropdown is updated
//and updates the page
function dropDownUpdate(){
    const idIndex = d3
            .select('body')
            .select('#selDataset')
            .property('value');
    
    d3.json('samples.json').then(data => {
        barChart(idIndex,data);
        bubbleChart(idIndex,data);
        demographics(idIndex, data);
    });
};

//returns Family and Genus for a given otu label
function otuLabelHandler(label){
    return label.split(';').slice(-2).join();
};

initVisit();