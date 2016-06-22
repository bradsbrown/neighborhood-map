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
  long: "",
  shorturl: "",
  description: ""
}, {
  name: "Dell Diamond",
  foursquare_id: "4b155039f964a52026b023e3",
  rating: "",
  lat: "",
  long: "",
  shorturl: "",
  description: ""
}, {
  name: "HEB",
  foursquare_id: "4ae62210f964a520f4a421e3",
  rating: "",
  lat: "",
  long: "",
  shorturl: "",
  description: ""
}, {
  name: "Forest Creek Golf Club",
  foursquare_id: "4be5a1abcf200f474f75133c",
  rating: "",
  lat: "",
  long: "",
  shorturl: "",
  description: ""
}, {
  name: "Torchy's Tacos",
  foursquare_id: "518d264f498e1fbf0b642c75",
  rating: "",
  lat: "",
  long: "",
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

// initialLocations.forEach(function(locItem) {
//   var index = findWithAttr(initialLocations, "name", locItem.name)
//   console.log("index = " + index)
//   // define query url for location
//   var search_url = "https://api.foursquare.com/v2/venues/";
//   var auth_keys = "/?&client_id=LMZLEPB1CQGFTBSXMERFV4IFDNNZABUOWABWHGYU2L3NRIYQ&client_secret=UQLPF3LMC0K0GF2X4J30DKTTZ4LE04ESQXHE4RJCQGDMQ12H&v=";
//   var query_url = search_url + locItem.foursquare_id + auth_keys + today;
//
//   // pull 4sq data and insert into an observableArray
//   // TODO - GET THIS WORKING
//   function load_4sq(locItem) {
//     $.ajax({
//       url: query_url,
//       dataType: 'json',
//     })
//     .success(function(json) {
//       // TODO - remove these console.log statements when testing complete
//       console.log(json.response.venue);
//       data = json.response.venue;
//       initialLocations[index].rating = data.rating;
//       initialLocations[index].lat = data.location.lat;
//       initialLocations[index].long = data.location.long;
//       initialLocations[index].shorturl = data.shortUrl;
//       console.log(initialLocations[index].rating);
//     })
//     .fail(function( xhr, status, errorThrown ) {
//       alert( "Sorry, there was a problem!" );
//       console.log( "Error: " + errorThrown );
//       console.log( "Status: " + status );
//       console.dir( xhr );
//     })};
//   load_4sq(locItem);
// });

var Location = function(data) {
  var self = this;
  var vm = this;

  // define data as KO observables
  this.name = ko.observable(data.name);
  this.foursquare_id = ko.observable(data.foursquare_id);
  this.rating = ko.observable(data.rating);
  this.lat = ko.observable(data.lat);
  this.long = ko.observable(data.long);
  this.shorturl = ko.observable(data.shorturl)
  this.description = ko.observable(data.description)
  this.formattedName = ko.computed(function() {
    return self.name() + " - " + self.rating()
  })

  // define query url for location
  var search_url = "https://api.foursquare.com/v2/venues/";
  var auth_keys = "/?&client_id=LMZLEPB1CQGFTBSXMERFV4IFDNNZABUOWABWHGYU2L3NRIYQ&client_secret=UQLPF3LMC0K0GF2X4J30DKTTZ4LE04ESQXHE4RJCQGDMQ12H&v=";
  var query_url = search_url + self.foursquare_id() + auth_keys + today;

  // pull 4sq data and insert into an observableArray
  // TODO - GET THIS WORKING
  function load_4sq() {
    $.ajax({
      url: query_url,
      dataType: 'json',
    })
    .success(function(json) {
      // TODO - remove these console.log statements when testing complete
      console.log(json.response.venue);
      data = json.response.venue;
      self.rating(data.rating);
      self.lat(data.location.lat);
      self.long(data.location.long);
      self.shorturl(data.shortUrl);
      self.description(data.description);
      console.log(data.rating);
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

  this.loc_list = ko.observableArray([]);

  function updateCurrent() {this.currentLoc = ko.observable(this.loc_list()[0])}

  var initsProcessed = 0

  initialLocations.forEach(function(locItem) {
    self.loc_list.push(new Location(locItem));
    initsProcessed++;
    if (initsProcessed === initialLocations.length) {
      updateCurrent();
    };
  });

  this.currentLoc = ko.observable(this.loc_list()[0]);

  this.changeLoc = function(clickedLoc) {
    self.currentLoc(clickedLoc);
  };
};

ko.applyBindings(ViewModel);
