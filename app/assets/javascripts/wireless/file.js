var File = {
	read: function(files){
		if(files.length <= 0) return undefined;

		var file = files[0];

		var reader = new FileReader();

		reader.onload = function(){
			var lines = event.target.result.split('\n');

			for(var i = 0; i < lines.length; i++){
				var line = lines[i];
				File.parse(line);
			}
		}
		reader.readAsText(file);
	},	

	parse: function(line){
		console.log(line);
		eval(line);
	},

	write: function(text){
		window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
		window.requestFileSystem(TEMPORARY, 1024*1024, function(fileSystem){

    	fileSystem.root.getFile('log.txt', {create: true, exclusive: false}, function(fileEntry){
  
    	fileEntry.createWriter(function(fileWriter){
    		console.log(text);
    		var blob = new Blob([ text ], { "type" : "text/plain" });
    		fileWriter.write(blob);
    	
   			fileWriter.onwriteend = function(e){
    			console.log("ファイル書き込み成功");
    		};
   		
    		fileWriter.onerror = function(e){
    			console.log("ファイル書き込み失敗");
    		};
  		});
                
    	$("#download").attr("href", fileEntry.toURL());
    	}, function(error){
    		console.log("error.code=" + error.code);
    	});
  	});
	},

	clean: function(){
		window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
		window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs){
  		fs.root.getFile('log.txt', {create: true}, function(fileEntry) {
    		fileEntry.remove(function() {
      		console.log('File removed.');
      		File.write('A');
    		}, function(error){
    			console.log('Not file removed.');
    		});
  		});
		});
	},
}