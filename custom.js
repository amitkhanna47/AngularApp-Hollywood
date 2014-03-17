$(function(){
	$('.animatedBack').addClass('hid');
});

var popups = {
	starsPopup:{id:'starsPopup',url:'popups/stars.html',sync:'true'}		
	}

function showPopup(pop2){

try{
	window[pop2].show();		
}
catch(e){
	function popup(options){		
		function setPop(options){
			var me = this;
			this.create = function(){
				var a = $('<div class=lefthide id='+ options.id +' />').appendTo('#popup');
				$.get(options.url, function(data) {
    			// Get the $compile service from the app's injector
    			var injector = angular.element( document.querySelector( '#entApp' ) ).injector();    
    			var $compile = injector.get('$compile');

    			// Compile the HTML into a linking function...
    			var linkFn = $compile(data);
    			// ...and link it to the scope we're interested in.
    			// Here we'll use the $rootScope.
    			var $rootScope = injector.get('$rootScope');
    			var elem = linkFn($rootScope);
    			a.append(elem);
			
				$('.popup-content', a).append('<a class="closeMe glyphicon glyphicon-remove"></a> <div class="popup-back"></div>');
				me.show();
				$('.closeMe', a).click(function(){														
					$('#'+ options.id).css({left:'-100%'});
					$('.popup-back',a).css({left:'100%'});			
				});					

    // Now that the content has been compiled, linked,
    // and added to the DOM, we must trigger a digest cycle
    // on the scope we used in order to update bindings.
    $rootScope.$digest();

  }, 'html');
																	
			}				
			this.show = function(){				
					$('#'+ options.id).css({left:'0'});					
					$('.popup-back').css('left',0);	
				if($('#'+ options.id).length > 0){
				}						
			}		
			this.create();					
		}
		window[options.id] = new setPop(options);							
	}
	
	for(p in popups){ if(p == pop2) popup(popups[p]);}	
}
	

}

