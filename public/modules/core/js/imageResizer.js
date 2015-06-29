function ImageResizer(maxWidth, maxHeight) {
	this.maxWidth = maxWidth || 555;
	this.maxHeight = maxHeight || 555;

	this.createImage = function (url, callback) {
		var image = new Image();
		image.onload = function () {
			callback(image);
		};
		image.src = url;
	};

	this.changeImage = function (origImage, callback) {
		resizeArea = document.createElement('canvas');
		resizeArea.style.visibility = 'hidden';

		var ctx = resizeArea.getContext("2d");

		var maxWidth = this.maxWidth;
		var maxHeight = this.maxHeight;

		this.createImage(origImage.url, function (image) {
			var height = image.height;
			var width = image.width;

			// calculate the width and height, constraining the proportions
			if (width > height) {
				if (width > maxWidth) {
					height = Math.round(height * maxWidth / width);
					width = maxWidth;
				}
			} else {
				if (height > maxHeight) {
					width = Math.round(width * maxHeight / height);
					height = maxHeight;
				}
			}

			resizeArea.width = width;
			resizeArea.height = height;

			ctx.drawImage(image, 0, 0, width, height);
			callback(resizeArea.toDataURL('image/png', 0.7));
		});
	};

	this.resize = function (file, callback) {
		var fileReader = new FileReader();

		var imageResult = {
			file: file,
			url: URL.createObjectURL(file)
		};

		var resizer = this;

		fileReader.onload = function (fileLoadedEvent) {
			var deferred = new $.Deferred();
			deferred.resolve(fileLoadedEvent.target.result);
			deferred.promise().then(function (imgUrl) {
				imageResult.dataURL = imgUrl;
				resizer.changeImage(imageResult, callback);
			});
		};
		fileReader.readAsDataURL(file);
	};
}
