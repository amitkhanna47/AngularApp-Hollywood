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
				a.load(options.url, function(data){
						
					var injector = $('[ng-app]').injector();
    var $compile = injector.get('$compile');

    // Compile the HTML into a linking function...
    var linkFn = $compile(data);
    // ...and link it to the scope we're interested in.
    // Here we'll use the $rootScope.
    var $rootScope = injector.get('$rootScope');
    var elem = linkFn($rootScope);						
											
					
																	
						$('.popup-content', this).append('<a class="closeMe glyphicon glyphicon-remove"></a>');						
						me.show();
						$('.closeMe', this).click(function(){														
							$('#'+ options.id).css({left:'-100%'});			
						});					
					});													
			}				
			this.show = function(){
				if($('#'+ options.id).length > 0){
					$('#'+ options.id).css({left:'0'});	
				}						
			}		
			this.create();					
		}
		window[options.id] = new setPop(options);							
	}
	
	for(p in popups){ if(p == pop2) popup(popups[p]);}	
}
	

}

