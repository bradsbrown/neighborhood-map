## neighborhood-map
A knockout-backed map of locations around my area.

# Setup
Setting up and running this application is a simple matter:
1. Download/clone the repo into a directory on your hard drive
1. Open the `index.html` file in your browser.

# Customization
If you'd like to edit this map for your own area, all you need to do is:
1. Edit the `initialLocations` object in `js/app.js` to fill your own location names and Foursquare IDs.
2. You should also edit the latitude and longitude of the map center in `initMap` function defined in `index.html`, and possibly the zoom, to accommodate your area.

# Development Goals
Next steps to include as this project develops are:
* Ability to fill other popular locations in the map area from 4sq API.
* Yelp API integration
* Ability to auto-repopulate the map with points for any given map area.
* Ability for user to mark "favorite" spots in their list.
