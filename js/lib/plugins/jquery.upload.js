
(function($) {
	/*
	 * mynaviUpload
	 *
	 * Copyright (c) 2017 iseyoshitaka at teamLab
	 *
	 * Description:
	 * �t�@�C���񓯊��A�b�v���[�_�[
	 *
	 */
	$.mynaviUpload = function(options) {
	
		var params = $.extend({}, $.mynaviUpload.defaults, options);

		var init = function(files) {

			var uploadUrl = params.uploadUrl;
			var contentType = params.contentType;
			var maxFileSize = params.maxFileSize;
			var successCallback = params.successCallback;
			var errorsCallback = params.errorsCallback;
			
			// �摜URL����t�@�C�����A�b�v���[�h
			this.imageUrlUpload = function(imagePath, imageId) {
				// �摜�����[�h
				var img = $('<img>');
				img
					.load(function() {
						var o_width = img[0].width;
						var o_height = img[0].height;
						
						// canvas�ɏ����o��
						var canvas = document.createElement('canvas');
						canvas.width  = o_width;
						canvas.height = o_height;
						var ctx = canvas.getContext('2d');
						ctx.drawImage(img[0], 0, 0);
						var base64 = canvas.toDataURL(contentType);
						
						// Base64����o�C�i���֕ϊ�
						var bin = atob(base64.replace(/^.*,/, ''));
						
						// �o�C�i������Blob �֕ϊ�
						var buffer = new Uint8Array(bin.length);
						for (var i = 0; i < bin.length; i++) {
						  buffer[i] = bin.charCodeAt(i);
						}
						var blob = new Blob([buffer.buffer], {type: contentType});
						blob.name = imagePath.substring(imagePath.lastIndexOf('/')+1).replace(/(.*)\.(.*)\?(.*)$/, '$1.$2');
						blob.imageId = imageId;
						var files = [blob];
						var obj = {files : files};
						
						// �t�@�C��API�ɑΉ����Ă���ꍇ�́A�摜�`�F�b�N�ƃT�C�Y�`�F�b�N���N���C�A���g���ł��s���B
						if (window.File && window.FileReader && window.FileList && window.Blob){
							for(var i=0,len=files.length; i<len; i++){
								var file = files[i];
								var errors = [];
								
								// �摜�t�@�C���`�F�b�N
								if( !file.type.match("image.*") ){
									errors.push('�摜�t�@�C�����s���ł��B');
								}
								// �t�@�C���T�C�Y�`�F�b�N
								if( maxFileSize && maxFileSize <= file.size ){
									errors.push('�摜�t�@�C���̃t�@�C���T�C�Y���ő�l('+ maxFileSize +'�o�C�g)�𒴂��Ă��܂��B');
								}

								if (0 < errors.length) {
									if (errorsCallback) {
										errorsCallback(errors);
									}

									return false;
								}
							}
						}
						
						fileUpload(obj);
					});
				img.attr('src', imagePath);
			};
			
			// �t�@�C���̃A�b�v���[�h
			var fileUpload = this.fileUpload = function (obj) {

				// 60�b�ȓ��Ƀ��X�|���X���Ȃ��ꍇ�́A�^�C���A�E�g���b�Z�[�W��\������B
				var timer = setTimeout( function() {
					var errors = [];
					errors.push('�^�C���A�E�g���������܂����B');

					if (errorsCallback) {
						errorsCallback(errors);
					}

					return false;
				}, 60000);
				
				var def = $.Deferred();
				var promise = def;

				// �t�@�C�����^�X�N���쐬
				$.each(obj.files, function(i, file){
					 
					promise = promise.pipe(function(response){
						 
						var newPromise = $.Deferred();
		
						var formData = new FormData();
						formData.enctype = 'multipart/form-data';
						formData.append('uploadImageFile', file, file.name);
						formData.append('uploadImageId', file.imageId);
						$.ajax({
							url: uploadUrl,
							type: 'POST',
							dataType: 'json',
							data: formData,
							cache: false,
							contentType: false,
							processData: false,
							success: function(res) {
								
								clearInterval(timer);
								
								if (successCallback) {
									successCallback(res);
								}

							},
							error: function(xhr, textStatus, errorThrown) {
								var res = {};
								try {
									res = $.parseJSON(xhr.responseText);
								} catch (e) {}
								alert(res.errorMessage);
							},
							complete: function() {
								newPromise.resolve();
							}
						});
						return newPromise;
					});
				});
				def.resolve();
			};
			
		};

		return new init();
	}
	
	$.mynaviUpload.defaults = {
		uploadUrl: '/client/album/list/imageUpload/',
		contentType : 'image/jpeg',
		maxFileSize : null,
		successCallback : null,
		errorsCallback : null
	}

})(jQuery);
