var imageManipulation = require('./image-manipulation/image-manipulation.io');
var uiimage = require("ui/image");
var imageSource = require('image-source');
var http = require('http');
var observableModule = require('data/observable');
var meme = new observableModule.Observable();

exports.loaded = function(args) {
	var page = args.object;
	page.bindingContext = meme;
};

exports.navigatedTo = function(args) {
	var page = args.object;
	var context = page.navigationContext;
	
	// Send Request to get a image
	http.getImage(context.url).then(function(res) {
		meme.set('rawImage', res);
		meme.set('image', res);
		meme.set('topText', '');
		meme.set('bottomText', '');
		meme.set('fontSize', 40);
		meme.set('isBlackText', false);
	}, function() {
		alert('Loading the image failed.');
	});
};

exports.unloaded = function() {
	meme.set('image', null);
};

exports.apply = function() {
	console.log(meme.get('rawImage'));

	var imageFromSource = new uiimage.Image();
	// imageFromSource.src = meme.get('rawImage');

	var image = imageManipulation.addText(
		imageFromSource,
		meme.get('topText'),
		meme.get('bottomText'),
		meme.get('fontSize'),
		meme.get('isBlackText')
	);

	meme.set('image', image);
};