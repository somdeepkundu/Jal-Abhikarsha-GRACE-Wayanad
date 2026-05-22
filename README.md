# Jal-অভিকর্ষ: Gravimetric Dynamics & Regional Water Storage

This repository contains Google Earth Engine (GEE) JavaScript applications developed to monitor regional Total Water Storage anomalies (TWSa) using NASA GRACE and GRACE-FO satellite gravimetry data. 

Currently, the framework is applied to analyze the antecedent moisture conditions and localized gravimetric footprint surrounding the Mundakkai and Chooralmala landslides in Wayanad, Kerala (July 30, 2024).

## Scripts Included
1. `grace_historical_2002_2017.js`: Extracts district-level liquid water equivalent (LWE) thickness trends across India using the NASA/GRACE/MASS_GRIDS_V04/LAND (GFZ) dataset.
2. `grace_wayanad_event_2024.js`: A specialized application utilizing the MASCON_CRI dataset with a 150 km radial spatial reducer to isolate the pre- and post-landslide TWS anomaly.

## Usage
These scripts are designed to be run in the [Google Earth Engine Code Editor](https://code.earthengine.google.com/). You must have an active GEE account to execute the code and access the assets.

*Note: The India state and district boundary shapefiles referenced in the code (`projects/ee-project-tapas/assets/...`) are private assets. Users will need to substitute their own region of interest (ROI) geometries to replicate the exact mapping visualizations.*

## Authors
* Somdeep Kundu 
* Arunima Chakraborty 
*(RuDRA Lab, Centre for Technology Alternatives for Rural Areas, IIT Bombay)*
