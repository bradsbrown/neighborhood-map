var initialLocations = [{
  name: "The Salt Lick",
  foursquare_id: "4a0c4c4af964a5201a751fe3"
}, {
  name: "Dell Diamond",
  foursquare_id: "4b155039f964a52026b023e3"
}, {
  name: "HEB",
  foursquare_id: "4ae62210f964a520f4a421e3"
}, {
  name: "Forest Creek Golf Club",
  foursquare_id: "4be5a1abcf200f474f75133c"
}, {
  name: "Torchy's Tacos",
  foursquare_id: "518d264f498e1fbf0b642c75"
}];

var Location = function(data) {
  var self = this;

  // define hard-coded data as KO observables
  this.name = ko.observable(data.name);
  this.foursquare_id = ko.observable(data.foursquare_id);

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

  // define query url for location
  var search_url = "https://api.foursquare.com/v2/venues/";
  var auth_keys = "/?&client_id=LMZLEPB1CQGFTBSXMERFV4IFDNNZABUOWABWHGYU2L3NRIYQ&client_secret=UQLPF3LMC0K0GF2X4J30DKTTZ4LE04ESQXHE4RJCQGDMQ12H&v=";
  var query_url = search_url + this.foursquare_id() + auth_keys + today;

  // pull 4sq data and insert into an observableArray
  // TODO - GET THIS WORKING
  this.results = ko.observableArray()
  $.ajax({
    url: query_url,
    dataType: 'json',
  })
  .done(console.log("Retrieval complete"))
  .success(function(json) {
    // TODO - remove these console.log statements when testing complete
    console.log(json.response.venue)
    self.results().push(json.response.venue)
    console.log(self.results()[0].rating)
  })
  .fail(function( xhr, status, errorThrown ) {
    alert( "Sorry, there was a problem!" );
    console.log( "Error: " + errorThrown );
    console.log( "Status: " + status );
    console.dir( xhr );
  });
};

var ViewModel = function() {
  var self = this;

  this.loc_list = ko.observableArray([]);

  initialLocations.forEach(function(locItem) {
    self.loc_list.push(new Location(locItem));
  });

  this.currentLoc = ko.observable(this.loc_list()[0]);

  this.changeLoc = function(clickedLoc) {
    self.currentLoc(clickedLoc);
  };
};

ko.applyBindings(ViewModel);
