var httpModule = require('http');
var frameModule = require('ui/frame');
var observableModule = require('data/observable');
var observableArrayModule = require('data/observable-array');

var model = new observableModule.Observable();
model.reddit = new observableArrayModule.ObservableArray([]);

var url = "http://www.reddit.com/r/aww.json?after=";
var after;

// var vmModule = require("./main-view-model");
exports.loaded = function(args) {
    var page = args.object;
    // page.bindingContext = vmModule.mainViewModel;
    page.bindingContext = model;

    if (page.ios) {
		// Tell the frame module that the navigation bar should always display
		frameModule.topmost().ios.navBarVisibility = "always";

		// Change the UIViewController's title property
		page.ios.title = "My Awesome App";

		// Get access to the native iOS UINavigationController
		var controller = frameModule.topmost().ios.controller;

		// Call the UINavigationController's setNavigationBarHidden method
		controller.navigationBarHidden = false;

		// Change color background color of navigation bar.
		controller.navigationBar.barTintColor = UIColor.colorWithRedGreenBlueAlpha(0.81, 0.89, 0.97, 1);
	}
    
    loadItems();
};

function loadItems() {
	httpModule.getJSON(url + after).then(function(response) {
		after = response.data.after;
		response.data.children.forEach(function(item) {
			if (item.data.url.match(/.jpg/)) {
				model.reddit.push({
					'title': item.data.title,
					'url': item.data.url
				});
			}
		});
	});
};

exports.loadMoreItems = function() {
	loadItems();
};

exports.itemTap = function(args) {
	var item = model.reddit.getItem(args.index);
	frameModule.topmost().navigate({
		// Reference to file meme.(js, xml and css)
		moduleName: "meme",
		context: item
	});
};
