// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // get the metadata field
    let metaData = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const result = metaData.filter((data) => {
      return data.id == sample;
    })

    // Use d3 to select the panel with id of `#sample-metadata`
    sampleMetaData = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sampleMetaData.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    let entryArr = [];
    for(entry in result[0]) {
      entryArr.push(entry);
    }

    let keysCount = Object.keys(result[0]).length;
    for(let i = 0; i < keysCount; i++) {
      let newItem = sampleMetaData.append("li");
      newItem.html(`${entryArr[i].toUpperCase()} : ${result[0][entryArr[i]]}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    let samplesData = data.samples;

    // Filter the samples for the object with the desired sample number
    const filtered = samplesData.filter((data)=> {
      return data.id == sample;
    })

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filtered[0].otu_ids;
    let otu_labels = filtered[0].otu_labels;
    let sample_values = filtered[0].sample_values;

    // Build a Bubble Chart
    let trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values
      }
    };

    let bubbleData = [trace1];

    let layout = {
      title: {
        text: "Bacteria Cultures Per Sample"
      },
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"},
      showlegend: false,
      height: 600,
      width: 1300
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let stringifiedOtuIds = otu_ids.map((id) => {
      return `OTU ${id}`;
    })

    // Build a Bar Chart
    // Extract first 10 values and then reverse array to print values in descending order
    let top10Samples = sample_values.slice(0,10).reverse();
    let top10StringifiedIds = stringifiedOtuIds.slice(0,10).reverse();

    let trace2 = {
      x: top10Samples,
      y: top10StringifiedIds,
      type: "bar",
      orientation: "h"
    };

    let barData = [trace2];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Number of Bacteria"}
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropDown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    let keysCount = Object.keys(names).length;
    for(let i = 0; i < keysCount; i++) {
      let newItem = dropDown.append("option");
      newItem.html(`${names[i]}`);
      newItem.attr("value", `${names[i]}`);
    }

    // Get the first sample from the list
    let firstSample = dropDown.select(":first-child");
    let firstSampleVal = firstSample._groups["0"][0].value;

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSampleVal);
    buildCharts(firstSampleVal);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  let dropDown = d3.select("#selDataset");
  dropDown.on("change", buildMetadata(dropDown.node().value), buildCharts(dropDown.node().value));
}

// Initialize the dashboard
init();


