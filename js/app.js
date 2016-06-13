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
  this.name = ko.observable(data.name);
  this.foursquare_id = ko.observable(data.foursquare_id);

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

  var search_url = "https://api.foursquare.com/v2/venues/";
  var auth_keys = "/?&client_id=LMZLEPB1CQGFTBSXMERFV4IFDNNZABUOWABWHGYU2L3NRIYQ&client_secret=UQLPF3LMC0K0GF2X4J30DKTTZ4LE04ESQXHE4RJCQGDMQ12H&v=";
  var query_url = search_url + this.foursquare_id() + auth_keys + today;


  // Results is initialized as a getJSON request,
  // the result of which is put into a function that takes the JSON data as an argument
  // then you set the ko variables to the data.whatever_you_need
  var results = $.getJSON(query_url, function(data){
    //set data to the venue (allows you to remove v_data)
    data = data.response.venue;
    this.phone = ko.observable(data.formattedPhone);
    this.address = ko.observable(data.location.address);
    this.lat = ko.observable(data.location.lat);
    this.long = ko.observable(data.location.long);
    this.description = ko.observable(data.description);
    this.rating = ko.observable(data.rating);
    console.log(data);
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

ko.applyBindings(new ViewModel());
