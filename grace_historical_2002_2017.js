// =========================================================================
// 1. Map & Layout Initialization
// =========================================================================

// Side Panel
var side_panel = ui.Panel({
  style: {
    width:    '40%', 
    minWidth: '30%', 
    maxWidth: '80%', 
  }
});

// Map Widget 
var map = ui.Map();  
var Silver = [
  { "elementType": "geometry", "stylers": [ { "color": "#f5f5f5" } ] },
  { "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] },
  { "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] },
  { "elementType": "labels.text.stroke", "stylers": [ { "color": "#f5f5f5" } ] },
  { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [ { "color": "#bdbdbd" } ] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#eeeeee" } ] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#e5e5e5" } ] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] },
  { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#ffffff" } ] },
  { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#dadada" } ] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] },
  { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] },
  { "featureType": "transit.line", "elementType": "geometry", "stylers": [ { "color": "#e5e5e5" } ] },
  { "featureType": "transit.station", "elementType": "geometry", "stylers": [ { "color": "#eeeeee" } ] },
  { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#c9c9c9" } ] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] }
];

// Split Panel
var split_panel = ui.SplitPanel({
  firstPanel: side_panel, 
  secondPanel: map,
  orientation: "horizontal",
  wipe: false 
});

// Initialize Layout
ui.root.clear();
ui.root.add(split_panel);

// =========================================================================
// 2. Datasets & Core Variables
// =========================================================================

// MASCON dataset to extend timeframe past 2017 up to present data
// Change your current dataset filter line to this:
var dataset = ee.ImageCollection('NASA/GRACE/MASS_GRIDS_V04/MASCON')
                  .filter(ee.Filter.date('2002-04-01', ee.Date(Date.now())));

// Selected the correct Mascon band name 'lwe_thickness'
var gfz = dataset.select('lwe_thickness');

// Using SOI boundaries
var state = ee.FeatureCollection("projects/ee-project-tapas/assets/IndiaState2");
var district = ee.FeatureCollection("projects/ee-project-tapas/assets/IndiaDistrict");

// Created a standard styled vector layer for district outlines
var districtLayer = district.style({
  color: 'black',
  fillColor: 'ffffff1A', // White color with 10% opacity
  width: 1
});

// =========================================================================
// 3. UI Elements (Side Panel)
// =========================================================================

var title = ui.Label('Jal-অভিকর্ষ : The GRACE Product');
title.style().set({
  fontSize: '24px',
  fontFamily: 'serif', 
  padding: '10px 5px',
  color: 'bb0000',
});
side_panel.add(title);

var subtitle = ui.Label("India's district level change in 'Gravity Equivalent Water Thickness' (2002 - Present)");
subtitle.style().set({
  position:  'top-center',
  fontSize: '16px',
  fontFamily: 'serif', 
  padding: '0px 5px',
});
side_panel.add(subtitle);

var dropdownPanel = ui.Panel();
var resultPanel = ui.Panel();

var stateSelect = ui.Select({
  placeholder: 'please wait...',
  style: {fontFamily: 'serif', margin: '2px auto', width: '90%'}
}).setDisabled(true);

var districtSelect = ui.Select({
  placeholder: 'select a state first',
  style: {fontFamily: 'serif', margin: '2px auto', width: '90%'}
}).setDisabled(true);

dropdownPanel.add(stateSelect);
dropdownPanel.add(districtSelect);

side_panel.add(dropdownPanel);
side_panel.add(resultPanel);

// =========================================================================
// 4. Callback Functions & Interactivity
// =========================================================================

var stateSelected = function(stateName, callback) {
  resultPanel.clear();
  
  districtSelect.items().reset();
  districtSelect.setPlaceholder('please wait.. ⏳');

  var districtNames = district
    .filter(ee.Filter.eq('State', stateName))
    .aggregate_array('District')
    .sort();

  districtNames.evaluate(function(items){
    districtSelect.setPlaceholder('Select a District');
    districtSelect.items().reset(items);
    districtSelect.setDisabled(false);
    
    // Execute a callback once list is ready (crucial for automated startup trigger)
    if (callback) callback();
  });
};

var districtSelected = function(districtName) {
  resultPanel.clear();
  map.clear();
  map.setOptions('Silver', {Silver: Silver});
  map.addLayer(districtLayer, {}, 'Districts Outline'); 

  var filteredDistrict = district.filter(ee.Filter.eq('District', districtName));
  var dist = filteredDistrict.geometry();

  resultPanel.add(ui.Label('Selected District: ' + districtName ));
  map.centerObject(filteredDistrict);

  // Style and add the selected district to the map
  var styledLayer = filteredDistrict.draw({color: '#FF6347', strokeWidth: 2});
  map.addLayer(styledLayer, {}, districtName);
  
  // Graph Generation
  var chart = ui.Chart.image.series({
    imageCollection: gfz.select(['lwe_thickness'], ['Equivalent Water Thickness']),
    region: dist,
    reducer: ee.Reducer.mean()
  })
  .setOptions({
    title: 'Change in Total Water Storage anomalies (TWSa) from GRACE for ' + districtName +' District',
    hAxis: {
      format: 'yyyy',
      title: 'Date', 
      titleTextStyle: {italic: false, bold: true}
    },
    vAxis: {
      title: 'TWSa (cm)',
      titleTextStyle: {italic: false, bold: true},
    },
    lineWidth: 1,
    trendlines: {
      0: {
        type: 'linear', 
        color: 'red', 
        lineWidth: 1,
        pointSize: 0,
        visibleInLegend: true,
        labelInLegend: 'Trendline',
      }
    },
  });
  resultPanel.add(chart);
};

// =========================================================================
// 5. Explanatory Text & Footer
// =========================================================================

var fullStatement = ui.Label(
  "Perhaps the single most thought-provoking satellite and dataset available. " +
  "There are four fundamental forces in nature, Gravitational Force, Electromagnetic Force, Nuclear Strong Force & Weak Force, "+
  "and here we are utilizing electromagnetic waves to communicate with the satellite couple that detect gravitational shifts. " +
  "This fascinating approach helps us understand both above and underground (aquifer) water level changes. " +
  "As the ancient Egyptian proverb says, 'even time is afraid of the Pyramids.' " +
  "Their massive, high-volume and high-density entities curve space-time curvature, making time flow slower around them. " +
  "Similarly, large volumes of water, whether above or below ground, can have profound effects, and the absence of it separates our satellite couple mates. " +
  "In regions with minimal land slope as per the above graphs, adopting robust water conservation practices is crucial to ensure the well-being of future generations. " +
  "[As far as my studies are concerned]"
);

fullStatement.style().set({
  fontSize: '13px',
  fontFamily: 'serif',
  padding: '5px 5px',
});
side_panel.add(fullStatement);

var credit = ui.Label("Developed by Somdeep Kundu & Arunima Chakraborty, Updated 2026");
credit.style().set({
  fontSize: '13px',
  fontFamily: 'serif', 
  padding: '5px 5px',
  color: 'bb0000'
});
side_panel.add(credit);

// =========================================================================
// 6. Map Setup, Listeners, & Startup Initialization
// =========================================================================

map.setOptions('Silver', {Silver: Silver});
map.addLayer(districtLayer, {}, 'India Districts Baseline');
map.setCenter(78.9, 23.77, 4);   

// Attach dynamic change triggers
stateSelect.onChange(stateSelected);
districtSelect.onChange(districtSelected);

// Populate Initial State Options and trigger default choice
var stateNames = state.aggregate_array('State').sort().distinct();

stateNames.evaluate(function(items) {
  stateSelect.items().reset(items);
  stateSelect.setDisabled(false);
  stateSelect.setPlaceholder('Select a State');
  
  // FIXED: Automates selecting Kerala and then Wayanad right on load
  stateSelect.setValue('Kerala', false); // setting true can duplicate triggers
  stateSelected('Kerala', function() {
    districtSelect.setValue('Wayanad');
  });
});

