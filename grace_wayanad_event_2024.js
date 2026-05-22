/**** Jal-অভিকর্ষ : GRACE — Wayanad Landslide Edition ***********************
 *
 * Question being explored:
 * Did GRACE / GRACE-FO record an anomalous regional water load around the
 * 30-July-2024 Mundakkai–Chooralmala landslide in Wayanad, Kerala?
 *
 ***************************************************************************/

// =====================================================================
// 0.  DATASET — Updated to show only the last 5 years of data (2021-2026)
// =====================================================================
var grace = ee.ImageCollection('NASA/GRACE/MASS_GRIDS_V04/MASCON_CRI')
              .filter(ee.Filter.date('2021-01-01', '2026-06-01')) // Last 5 Years
              .select('lwe_thickness');   // equivalent water thickness, cm

// Your India assets
var district = ee.FeatureCollection('projects/ee-project-tapas/assets/IndiaDistrict');
var state    = ee.FeatureCollection('projects/ee-project-tapas/assets/IndiaState2');

// NEW: Your explicit visualization parameters locked to a 5 to 15 range
var myVisParams = {
  min: 5, 
  max: 15, 
  palette: ['001137', '01abab', 'e7eb05', '620500']
};

// =====================================================================
// 1.  THE EVENT — Mundakkai / Chooralmala headscarp, 30 Jul 2024
// =====================================================================
var slidePoint = ee.Geometry.Point([76.2327, 11.7818]);

// Sample a ~150 km radius region (resolvable GRACE footprint scale)
var footprint = slidePoint.buffer(150000);

// =====================================================================
// 2.  MAP VISUALIZATION
// =====================================================================
var map = ui.Map();
map.setOptions('HYBRID');
map.centerObject(footprint, 6);   

var outlines = district.style({color: 'white', fillColor: '00000000', width: 1});
map.addLayer(outlines, {}, 'District outlines');

// GRACE footprint + the slide marker
map.addLayer(
  ee.FeatureCollection([ee.Feature(footprint)]).style({color: 'red', fillColor: '00000000', width: 1}),
  {}, 'GRACE footprint (~150 km)');
map.addLayer(
  ee.FeatureCollection([ee.Feature(slidePoint)]).style({color: 'yellow', pointSize: 9, pointShape: 'triangle'}),
  {}, 'Landslide 30-Jul-2024');

// --- Specific July 2024 Anomaly Layer ---
var july2024 = grace.filter(ee.Filter.date('2024-07-01', '2024-08-01'))
                    .mean()
                    .resample('bilinear')
                    .clip(footprint);
map.addLayer(july2024, myVisParams, 'TWSa July 2024 (cm)', true);

// --- Historical Average July Layer (Recent 5 years average baseline) ---
var avgJuly = grace.filter(ee.Filter.calendarRange(7, 7, 'month'))
                   .mean()
                   .resample('bilinear')
                   .clip(footprint);
map.addLayer(avgJuly, myVisParams, 'Historical Average July Baseline (Recent)', false);

// --- ADDED: Standalone Comparative Layer for July 2023 ---
var july2023 = grace.filter(ee.Filter.date('2023-07-01', '2023-08-01'))
                    .mean()
                    .resample('bilinear')
                    .clip(footprint);
map.addLayer(july2023, myVisParams, 'TWSa July 2023 (cm)', false);

// --- ADDED: Standalone Comparative Layer for July 2022 ---
var july2022 = grace.filter(ee.Filter.date('2022-07-01', '2022-08-01'))
                    .mean()
                    .resample('bilinear')
                    .clip(footprint);
map.addLayer(july2022, myVisParams, 'TWSa July 2022 (cm)', false);


// =====================================================================
// 3.  SIDE PANEL + TIME SERIES
// =====================================================================
var panel = ui.Panel({style: {width: '42%', padding: '8px'}});
ui.root.clear();
ui.root.add(ui.SplitPanel({firstPanel: panel, secondPanel: map,
  orientation: 'horizontal', wipe: false}));

panel.add(ui.Label('Jal-অভিকর্ষ — Wayanad GRACE check',
  {fontSize: '22px', fontFamily: 'serif', color: 'bb0000', padding: '4px 2px'}));
panel.add(ui.Label('Regional Total Water Storage anomaly around the '
  + '30 July 2024 Mundakkai–Chooralmala landslide.',
  {fontSize: '14px', fontFamily: 'serif', padding: '0 2px 6px'}));

var tsChart = ui.Chart.image.series({
    imageCollection: grace.select(['lwe_thickness'], ['TWS anomaly']),
    region: footprint,
    reducer: ee.Reducer.mean(),
    scale: 25000
  })
  .setOptions({
    title: 'Recent 5-Year GRACE/GRACE-FO TWSa, ~150 km around Wayanad (cm)',
    hAxis: {format: 'yyyy', title: 'Date',
            titleTextStyle: {italic: false, bold: true}},
    vAxis: {title: 'TWSa (cm equivalent water thickness)',
            titleTextStyle: {italic: false, bold: true}},
    lineWidth: 1.5, pointSize: 2, colors: ['#1565c0'],
    trendlines: {0: {type: 'linear', color: 'red', lineWidth: 1,
                     visibleInLegend: true, labelInLegend: 'Recent 5-Yr Trend'}}
  });
panel.add(tsChart);

// --- MAKE THE CHART CLICKABLE (Uses your custom range) ---
tsChart.onClick(function(xValue, yValue) {
  if (xValue === null) return;
  
  var clickDate = ee.Date(xValue);
  var nextMonth = clickDate.advance(1, 'month');
  
  var monthlyTWSa = grace
    .filterDate(clickDate, nextMonth)
    .mean()
    .resample('bilinear')
    .clip(footprint);
  
  var dateStr = new Date(xValue).toISOString().slice(0, 7);
  
  print('Clicked: ' + dateStr);
  print('Monthly TWSa ≈ ' + yValue.toFixed(2) + ' cm');
  
  map.addLayer(monthlyTWSa, myVisParams, 'TWSa @ ' + dateStr, true);
});

// =====================================================================
// 4.  "WAS THE REGION ANOMALOUSLY WET?"
// =====================================================================
var preEvent = grace.filter(ee.Filter.date('2024-06-01', '2024-08-01')).mean();
var climatology = grace.filter(ee.Filter.calendarRange(6, 7, 'month')).mean();

var sample = function(img) {
  return img.reduceRegion({reducer: ee.Reducer.mean(),
    geometry: footprint, scale: 25000}).values().get(0);
};

ee.Dictionary({
  jj2024:  sample(preEvent),
  clim:    sample(climatology),
  excess:  sample(preEvent.subtract(climatology)),
  july24:  sample(july2024),
  julyAvg: sample(avgJuly)
}).evaluate(function(d) {
  var box = ui.Panel({style: {margin: '8px 2px', padding: '6px', border: '1px solid #bbb'}});
  box.add(ui.Label('How water-loaded was the region pre-slide?', {fontWeight: 'bold', fontFamily: 'serif'}));
  
  box.add(ui.Label('Jun–Jul 2024 TWSa:        ' + d.jj2024.toFixed(2) + ' cm'));
  box.add(ui.Label('Typical Recent Jun–Jul:   ' + d.clim.toFixed(2) + ' cm'));
  box.add(ui.Label('Excess vs normal monsoon: ' + d.excess.toFixed(2) + ' cm', {color: '#d32f2f'}));
  
  box.add(ui.Label('-----------------------------------------', {color: '#bbb'}));
  
  box.add(ui.Label('Specific July 2024 TWSa:   ' + d.july24.toFixed(2) + ' cm'));
  box.add(ui.Label('Recent July Average:       ' + d.julyAvg.toFixed(2) + ' cm'));
  var julExcess = d.july24 - d.julyAvg;
  box.add(ui.Label('July Specific Excess:      ' + julExcess.toFixed(2) + ' cm', {fontWeight: 'bold', color: '#1976d2'}));
  
  box.add(ui.Label(
    'Positive excess = the region carried more water than your recent baseline. '
    + 'The map layers for 2022, 2023, and 2024 are available in the upper right layer manager to visually track annual structural variances.',
    {fontSize: '12px', color: '#555', padding: '4px 0 0'}));
  panel.add(box);
});

// =====================================================================
// 5.  CREDIT
// =====================================================================
panel.add(ui.Label('Original app: Somdeep Kundu & Arunima Chakraborty (2024). '
  + 'Wayanad extension added 2026.',
  {fontSize: '12px', fontFamily: 'serif', color: 'bb0000', padding: '6px 2px'}));
