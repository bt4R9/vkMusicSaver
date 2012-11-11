/*
* VK Music Saver [1.2]
*/

var vkm = {
	init: function() {
		this.hash = location.href;
		this.addEvents();
	},
	addEvents: function() {
		setInterval(function() {
			vkm.detector();
		}, 300);
	},
	getBar: function() {
		var bar = document.createElement('div');
		bar.innerHTML = '<div class="vkm-progress"></div>'
		bar.className = 'vkm-progressBar';
		return bar;
	},
	getInfo: function() {
		var info = document.createElement('div');
		info.className = 'vkm-info';
		return info;
	},
	getDL: function() {
		var dl = document.createElement('div');
		dl.className = 'vkm-download';
		return dl;
	},
	getCheckBox: function() {
		var checkbox = document.createElement('checkbox');
		checkbox.setAttribute('class', 'vkm-checkbox checkbox fl_l');
		checkbox.innerHTML = '<div></div>';
		checkbox.setAttribute('onClick', 'checkbox(this); var e = arguments[0]; e.stopPropagation();');
		return checkbox;
	},
	getBtn:	function(label, css) {
		var btn = document.createElement('div');
		btn.className = 'button_blue fl_r vkm-btn';
		btn.innerHTML = '<button>' + label + '</button>';
		if(css != undefined) btn.style.cssText = css;
		return btn;
	},
	getBtns: function() {
		var args = [].slice.call(arguments[0]);
		var pool = {};
		
		for(var i = 0, len = args.length; i < len; i++) {
			pool[args[i][0]] = (function(id, label, css) {
				var btn = document.createElement('div');
				btn.className = 'button_blue fl_r vkm-btn';
				btn.setAttribute('id', id);
				btn.innerHTML = '<button>' + label + '</button>';
				if(css != undefined) btn.style.cssText = css;
				return btn;
			})(args[i][0], args[i][1], args[i][2]);
		}
		
		return pool;
	},
	detector: function() {
		// popUp window
		if (document.getElementById('pad_wrap')){
			this.render('popup', 'pad_wrap');
		}
		// default profiles 3 songs
		if (document.getElementById('profile_audios')){
			this.render('profile', 'profile_audios');
		}
		// user wall
		if (document.getElementById('profile_wall')){
			this.render('wall', 'profile_wall');
		}
		// search audio
		if (document.getElementById('search_content') && document.getElementsByClassName('audio_results').length > 0) {
			this.render('search', 'search_content');
		}
		// audio page
		if (document.getElementById('audios_list')) {
			this.render('audio', 'audios_list');
		}
		// feed
		if (document.getElementById('feed_wall')) {
			this.render('feed', 'feed_wall');
		}
		// choose audio dialog
		if (document.getElementById('choose_audio_rows')) {
			this.render('choseaudio', 'choose_audio_rows');
		}
	},
	render: function(type, container) {
		var songsPre = document.getElementById(container).getElementsByTagName('input');
		var songs = [];
		
		for(var i = 0; i < songsPre.length; i++) {
			if(/^audio_info/.test(songsPre[i].getAttribute('id'))
				&& (songsPre[i].getAttribute('data-status') != 'vkm-processing'
				&& songsPre[i].getAttribute('data-status') != 'vkm-processed')
			) {
				songsPre[i].setAttribute('data-status', 'vkm-processing');
				songs.push(songsPre[i]);
			}
		}
		
		for(var i = 0; i < songs.length; i++) {
			var song = songs[i];

			var songContainer;
			var progressBar = vkm.getBar();
			var songLink = song.value.split(',')[0];

			//Insert Bar and correct styles
			switch(type) {
				case 'profile':
					songContainer = song.parentNode.parentNode.parentNode.parentNode.parentNode;
					progressBar.style.width = '179px';
					songContainer.insertBefore(progressBar, songContainer.getElementsByClassName('player')[0]);
					songContainer.getElementsByClassName('player')[0].style.marginTop = '2px';
					break;

				case 'wall':
				case 'feed':
					songContainer = song.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
					progressBar.style.width = '98%';
					songContainer.getElementsByClassName('area')[0].insertBefore(progressBar, songContainer.getElementsByClassName('player')[0]);
					songContainer.getElementsByClassName('player')[0].style.marginTop = '2px';
					break;
				
				case 'search':
					songContainer = song.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
					progressBar.style.width = '424px';
					songContainer.getElementsByClassName('area')[0].insertBefore(progressBar, songContainer.getElementsByClassName('player')[0]);
					songContainer.getElementsByClassName('player')[0].style.marginTop = '2px';
					var checkbox = vkm.getCheckBox();
					checkbox.style.cssText = 'margin-top: 7px';
					songContainer.getElementsByClassName('info')[0].insertBefore(checkbox, songContainer.getElementsByClassName('title_wrap')[0]);
					break;
				
				case 'audio':
					progressBar.style.width = '407px';
					songContainer = song.parentNode.parentNode.parentNode;
					songContainer.appendChild(progressBar);
					var checkbox = vkm.getCheckBox();
					checkbox.style.cssText = 'margin-top: 10px';
					songContainer.getElementsByClassName('info')[0].insertBefore(checkbox, songContainer.getElementsByClassName('title_wrap')[0]);
					break;
					
				case 'popup':
					progressBar.style.width = '470px';
					songContainer = song.parentNode.parentNode.parentNode;
					songContainer.appendChild(progressBar);
					var checkbox = vkm.getCheckBox();
					checkbox.style.cssText = 'margin-top: 10px';
					songContainer.getElementsByClassName('info')[0].insertBefore(checkbox, songContainer.getElementsByClassName('title_wrap')[0]);	
					break;
				case 'choseaudio':
					progressBar.style.width = '405px';
					songContainer = song.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
					songContainer.getElementsByClassName('player')[0].style.marginTop = '2px';
					songContainer.getElementsByClassName('area')[0].insertBefore(progressBar, songContainer.getElementsByClassName('player')[0]);
					break;
			};
			
			var songGroup	= songContainer.getElementsByClassName('title_wrap')[0].getElementsByTagName('a')[0].innerText;
			var songName	= songContainer.getElementsByClassName('title')[0].innerText;

			var songDLName = songGroup + ' - ' + songName;

			var songDuration = songContainer.getElementsByClassName('duration')[0].innerText;
			songDuration = parseInt(songDuration.split(':')[0]) * 60 + parseInt(songDuration.split(':')[1]);
			
			var params = {
				song:			song,
				duration:		songDuration,
				songContainer:	songContainer,
				songLink:		songLink,
				songDLName:		songDLName,
				progressBar:	progressBar,
				type:			type,
			};
			
			//multi download [AUTO MODE] *without checkboxes
			switch(type) {
				case 'feed':
				case 'wall':
					//Save button only if 2 or more songs in container
					var songsCount = params.songContainer.parentNode.getElementsByClassName('audio').length;
					if(params.songContainer.parentNode.getElementsByClassName('vkm-saveAll').length == 0 && songsCount > 1) {
						var saveAll = vkm.getBtn('Скачать все', 'margin-bottom: 10px');
						saveAll.className += ' vkm-saveAll';
						params.songContainer.parentNode.appendChild(saveAll);
						
						(function(locType, handler) {
							handler.addEventListener('click', function(e) {
								e.stopPropagation();
								vkm.multiDownloadAuto(this.parentNode, locType, false, function(params) {
									for(var i = 0; i < params.songs.length; i++) {
										params.songs[i].progressBar.style.display = 'none';
										params.songs[i].progressBar.getElementsByClassName('vkm-progress')[0].className = 'vkm-progress';
									}
								});
							});
						}(type, saveAll));
						
					}
					break;
					
			}
			
			//manual multi download
			switch(type) {
				case 'audio':
				case 'search':
				case 'popup':
					if(!document.getElementById('vkm-cp')) {
						var cp = document.createElement('div');
						cp.setAttribute('id', 'vkm-cp');
						
						if(type == 'audio' || type == 'search') {
							var cpBTN = vkm.getBtns([
								['checkAll', 'Выделить все'],
								['cancelAll', 'Отменить все'],
								['saveAll', 'Скачать выделенные']
							]);
						} else if(type == 'popup') {
							var cpBTN = vkm.getBtns([
								['saveAll', 'Скачать'],
								['cancelAll', 'Отменить'],
								['checkAll', 'Выделить']
							]);
						}
						
						for(var k in cpBTN) {
							if(cpBTN.hasOwnProperty(k)) {
								cp.appendChild(cpBTN[k]);
							}
						}
						
						var clear = document.createElement('div');
						clear.style.cssText = 'clear: both';
						cp.appendChild(clear);
						
						var container = null;
						if(type == 'audio') {
							container = document.getElementById('album_filters');
						} else if(type == 'search') {
							container = document.getElementById('search_filters');
						} else if(type == 'popup') {
							container = document.getElementById('pad_footer');
						}
						
						
						container.appendChild(cp);
						
						cpBTN.checkAll.addEventListener('click', function(e) {
							if(type == 'audio') {
								var checkboxes = document.getElementById('audios_list').getElementsByClassName('vkm-checkbox');
							} else if(type == 'search') {
								var checkboxes = document.getElementById('results').getElementsByClassName('vkm-checkbox');
							} else if(type == 'popup') {
								var checkboxes = document.getElementById('pad_playlist').getElementsByClassName('vkm-checkbox');
							}
							for(var i = 0, len = checkboxes.length; i < len; i++) {
								checkboxes[i].className = 'vkm-checkbox checkbox fl_l on';
							}
						});
						
						cpBTN.cancelAll.addEventListener('click', function(e) {
							if(type == 'audio') {
								var checkboxes = document.getElementById('audios_list').getElementsByClassName('vkm-checkbox');
							} else if(type == 'search') {
								var checkboxes = document.getElementById('results').getElementsByClassName('vkm-checkbox');
							} else if(type == 'popup') {
								var checkboxes = document.getElementById('pad_playlist').getElementsByClassName('vkm-checkbox');
							}
							for(var i = 0, len = checkboxes.length; i < len; i++) {
								checkboxes[i].className = 'vkm-checkbox checkbox fl_l';
							}
						});
						
						cpBTN.saveAll.addEventListener('click', function(e) {
							var container = null;
							if(type == 'audio') {
								container = document.getElementById('audios_list');
							} else if(type == 'search') {
								container = document.getElementById('results');
							} else if(type == 'popup') {
								container = document.getElementById('pad_playlist');
							}
							vkm.multiDownloadAuto(container, type, true, function(params) {
								for(var i = 0; i < params.songs.length; i++) {
									params.songs[i].progressBar.style.display = 'none';
									params.songs[i].progressBar.getElementsByClassName('vkm-progress')[0].className = 'vkm-progress';
									params.songs[i].song.parentNode.parentNode.getElementsByClassName('vkm-checkbox')[0].className = 'vkm-checkbox checkbox fl_l';
								}
							});
						});
					}
					break;
			}
			
			this.getSongInfo(params, function(params) {
				//error - change status
				if(!params.status) {
					params.song.setAttribute('data-status', 'vkm-processing-error');
					params.songContainer.style.border = '1px solid red';
					return;
				}
				
				//song is processed
				params.song.setAttribute('data-status', 'vkm-processed');
				
				var songSizeMB	=	( parseInt(params.size) / 1048576 ).toFixed(2);
				var songKbps	=	Math.round( ( parseInt(params.size) / params.duration * 8 / 1000) / 16) * 16;
				
				var info = vkm.getInfo();
				info.innerText = songSizeMB + ' MB | ' + songKbps + 'kbps';

				var dl = vkm.getDL();
				dl.className = 'audio_edit_wrap fl_r vkm-download';
				dl.setAttribute('onmouseover', "showTooltip(this, {text: 'Скачать: " + params.songDLName + "', black: 1 });");
				dl.setAttribute('onclick', 'var e = arguments[0]; e.stopPropagation();');
				
				//additional styles for various page types
				switch(type) {
					case 'audio':
						info.innerText += ' | ';
						info.style.cssText = 'position: absolute; top: 10px; left: 290px';
						dl.style.cssText = 'margin-top: 10px';
						params.songContainer.appendChild(info);
						params.songContainer.getElementsByClassName('actions')[0].appendChild(dl);
						break;
						
					case 'profile':
						info.style.cssText = 'text-align: left; margin-left: 7px';
						dl.style.cssText = 'position: absolute; top: 8px; left: 167px';
						params.songContainer.appendChild(dl);
						params.songContainer.insertBefore(info, params.progressBar);
						break;
						
					case 'wall':
					case 'feed':
						dl.style.cssText = 'position: absolute; right: 10px; top: 8px';
						params.songContainer.appendChild(dl);
						info.innerText += ' | ';
						info.style.cssText = 'position: absolute; left: -132px; top: 8px';
						params.songContainer.getElementsByClassName('actions')[0].appendChild(info);
						break;
				
					case 'popup':
						info.innerText += ' | ';
						info.style.cssText = 'position: absolute; top: 10px; right: 36px';
						dl.style.cssText = 'position: absolute; top: 11px; right: 35px';
						params.songContainer.appendChild(info);
						params.songContainer.getElementsByClassName('actions')[0].appendChild(dl);
						break;
						
					case 'search':
						dl.style.cssText = 'position: absolute; right: 30px; top: 8px';
						params.songContainer.appendChild(dl);
						info.innerText += ' | ';
						info.style.cssText = 'position: absolute; right: 32px; top: 6px';
						params.songContainer.getElementsByClassName('info')[0].insertBefore(info, params.songContainer.getElementsByClassName('duration')[0]);
						break;
					case 'choseaudio':
						dl.style.cssText = 'position: absolute; right: 10px; top: 8px';
						params.songContainer.getElementsByClassName('actions')[0].appendChild(dl);
						info.innerText += ' | ';
						info.style.cssText = 'position: absolute; left: -132px; top: 8px';
						params.songContainer.getElementsByClassName('actions')[0].appendChild(info);
						break;
				}
				
				//download event
				dl.addEventListener('click', function(e) {
					e.stopPropagation();
				
					if(params.song.getAttribute('data-xhrstatus') == 'downloading')
						return;
							
					params.song.setAttribute('data-xhrstatus', 'downloading');
					vkm.downloadSong(params, function(params) {
						params.song.setAttribute('data-xhrstatus', 'downloaded');
						params.progressBar.style.display = 'none';
					});
				});
				
			});
		}
		
	},
	multiDownloadAuto: function(container, type, manual, callback) {
		var songsPre = container.getElementsByTagName('input');

		var download = {
			count: 0,
			completed: 0,
			songs: []
		};
			
		for(var i = 0; i < songsPre.length; i++) {
			//with checkboxes
			if(manual) {
				if(songsPre[i].parentNode.parentNode.getElementsByClassName('vkm-checkbox')[0].className.indexOf('on') < 0) {
					continue;
				}
			}
			if(songsPre[i].getAttribute('data-status') == 'vkm-processed' && songsPre[i].getAttribute('data-xhrstatus') != 'downloading') {
				download.count++;
				
				var songGroup	= songsPre[i].parentNode.parentNode.getElementsByClassName('title_wrap')[0].getElementsByTagName('a')[0].innerText;
				var songName	= songsPre[i].parentNode.parentNode.getElementsByClassName('title')[0].innerText;
				var songDLName = songGroup + ' - ' + songName;
				
				var songLink = songsPre[i].value.split(',')[0];
				var progressBar = null;
				
				switch(type) {
					case 'feed':
					case 'wall':
					case 'search':
						progressBar = songsPre[i].parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('vkm-progressBar')[0];
						break;
					case 'audio':
					case 'popup':
						progressBar = songsPre[i].parentNode.parentNode.parentNode.getElementsByClassName('vkm-progressBar')[0];
						break;
				}
				
				var params = {
					song:			songsPre[i],
					songLink:		songLink,
					songDLName:		songDLName,
					progressBar:	progressBar
				};
				
				download.songs.push(function(params) {
					return params;
				}(params));
			}
		};

		for(var i = 0; i < download.songs.length; i++) {
			download.songs[i].song.setAttribute('data-xhrstatus', 'downloading');
			vkm.downloadSong(download.songs[i], function(params) {
				params.song.setAttribute('data-xhrstatus', 'downloaded');
				params.progressBar.getElementsByClassName('vkm-progress')[0].className += ' vkm-progress-completed';
				download.completed++;
				if(download.count == download.completed) {
					callback({
						container:	container,
						type:		type,
						songs:		download.songs
					});
				}
			});
		}

	},
	getSongInfo: function(params, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('HEAD', params.songLink, true);	
		xhr.onload = function(e) {
			if(this.status == 200) {
				params.status = 1;
				params.size = this.getResponseHeader('Content-Length');
				callback(params);
			}
		};
		xhr.onerror = function() {
			params.status = 0;
			callback(params);
		};
		xhr.send();
	},
	downloadSong: function(params, callback) {
		params.progressBar.style.display = 'block';
		var xhr = new XMLHttpRequest();
		xhr.responseType = 'arraybuffer';
		xhr.open('GET', params.songLink, true);
		xhr.onload = function(e){
			if(this.status == 200){
				BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;
				var bb = new BlobBuilder();
				bb.append(this.response);
				var blob = bb.getBlob('audio/mpeg');
				saveAs(blob, params.songDLName + '.mp3');
				params.status = 1;
				callback(params);
			} else {
				params.status = 0;
				callback(params);
			}
		};
		xhr.onerror = function() {
			params.status = 0;
			callback(params);
		};
		xhr.onprogress = function(pe) {
			if(pe.lengthComputable) {
				var max		= pe.total;
				var current	= pe.loaded;
						
				params.progressBar.setAttribute('data-totalSize', max);
				params.progressBar.setAttribute('data-loadedSize', current);
				
				var percent	= parseInt(current / max * 100);

				params.progressBar.getElementsByClassName('vkm-progress')[0].style.width = percent + '%';
			}
		};
		xhr.send();
	}
};

vkm.init();