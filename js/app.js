function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
}

var initialLocations = [{
  name: "The Salt Lick",
  foursquare_id: "4a0c4c4af964a5201a751fe3",
  rating: "",
  lat: "",
  lng: "",
  shorturl: "",
  description: ""
}, {
  name: "Dell Diamond",
  foursquare_id: "4b155039f964a52026b023e3",
  rating: "",
  lat: "",
  lng: "",
  shorturl: "",
  description: ""
}, {
  name: "HEB",
  foursquare_id: "4ae62210f964a520f4a421e3",
  rating: "",
  lat: "",
  lng: "",
  shorturl: "",
  description: ""
}, {
  name: "Forest Creek Golf Club",
  foursquare_id: "4be5a1abcf200f474f75133c",
  rating: "",
  lat: "",
  lng: "",
  shorturl: "",
  description: ""
}, {
  name: "Torchy's Tacos",
  foursquare_id: "518d264f498e1fbf0b642c75",
  rating: "",
  lat: "",
  lng: "",
  shorturl: "",
  description: ""
}];


// function to create formatted date for unique 4sq identifier
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();
if (dd < 10) {
  dd = '0' + dd;
}
if (mm < 10) {
  mm = '0' + mm;
}
today = yyyy + mm + dd;


var Location = function(data) {
  var locself = this;

  // define data as KO observables
  this.name = ko.observable(data.name);
  this.foursquare_id = ko.observable(data.foursquare_id);
  this.rating = ko.observable(data.rating);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
  this.shorturl = ko.observable(data.shorturl);
  this.desc = ko.observable(data.description);
  this.description = ko.computed(function() {
    if (locself.desc() === undefined) {
      return "No description provided."
    } else {
      return locself.desc()
    }
  });
  this.formattedName = ko.computed(function() {
    return (loc_list.indexOf(locself) + 1) + " - " + locself.name() + " - " + locself.rating()
  });
  this.latLng = ko.computed(function() {
    return "{ lat: " + locself.lat() + ", lng: " + locself.lng() +" }"
  })

  // define query url for location
  var search_url = "https://api.foursquare.com/v2/venues/";
  var auth_keys = "/?&client_id=LMZLEPB1CQGFTBSXMERFV4IFDNNZABUOWABWHGYU2L3NRIYQ&client_secret=UQLPF3LMC0K0GF2X4J30DKTTZ4LE04ESQXHE4RJCQGDMQ12H&v=";
  var query_url = search_url + locself.foursquare_id() + auth_keys + today;

  // pull 4sq data and inserts desired data as Location properties
  function load_4sq() {
    $.ajax({
      url: query_url,
      dataType: 'json',
    })
    .success(function(json) {
      data = json.response.venue;
      locself.rating(data.rating);
      locself.lat(data.location.lat);
      locself.lng(data.location.lng);
      locself.shorturl(data.shortUrl);
      locself.desc(data.description);
    })
    .fail(function( xhr, status, errorThrown ) {
      alert( "Sorry, there was a problem!" );
      console.log( "Error: " + errorThrown );
      console.log( "Status: " + status );
      console.dir( xhr );
    })};
  load_4sq();
};

var ViewModel = function() {
  var self = this;

  // list array to hold all info for locations
  this.loc_list = ko.observableArray([]);

  // upon loc_list insertion, called to set currentLoc to first item
  function updateCurrent() {this.currentLoc = ko.observable(this.loc_list()[0])}

  // pulls hard-coded data from initialLocations, drops into loc_list
  var initsProcessed = 0
  initialLocations.forEach(function(locItem) {
    self.loc_list.push(new Location(locItem));
    initsProcessed++;
    if (initsProcessed === initialLocations.length) {
      updateCurrent();
    };
  });

  //holds state for currently selected loc
  this.currentLoc = ko.observable(this.loc_list()[0]);

  // on click on sidebar element, changes currentLoc and bounces map pin
  this.changeLoc = function(clickedLoc) {
      self.currentLoc(clickedLoc);
      makeBounce(filterIndex(clickedLoc.name()));
  };

  this.markerChangeLoc = function(index) {
    loc = filterLocs()[index];
    self.changeLoc(loc);
  }

  function filterIndex(name) {
    for (i = 0; i < filterLocs().length; i++ ) {
      if (filterLocs()[i].name() === name) {
        return i
      }
    }
  }

  // holds data from search input field
  this.query = ko.observable('');

  // filters loc_list by query, returns items that match
  this.filterLocs = ko.computed(function () {
    var search = self.query().toLowerCase();
    return ko.utils.arrayFilter(self.loc_list(), function (loc) {
        return loc.name().toLowerCase().indexOf(search) >= 0;
    });
  });

  // clears and re-drops the map pins every time filterLocs changes
  this.filterLocs.subscribe(function() {
    deleteMarkers();
    updateLocs();
  });
};
