/**
 * Created by sonia.brahmi on 15-05-26.
 */

var STICKIES = (function() {
   var initStickies = function initStickies(){
		   $('<div />',{
			   text: '+',
			   'class': 'add-sticky',
			   click: function () {
				   createSticky();
				   //it’s important to call createSticky
				   // from inside a function, and not have the click
				   // handler call directly to createSticky;
				   // this is because createSticky can take a single
				   // parameter, and we don’t want that to be the event
				   // object).
			   }
		   }).prependTo(document.body);

		   initStickies = null;//insures that this function is only
		   // run once. Don’t want the API user to add multiple
		   // “add note” buttons to page.
	   },
	   openStickies = function openStickies(){
		   //if initStickies has not been set to null yet, run the function.
		   initStickies && initStickies();

		   for(var i = 0; i < localStorage.length; i++){
			   createSticky(
				   // converting from a string back into an object.
				   JSON.parse(
					   //get item value
					   localStorage.getItem(localStorage.key(i))
				   )
			   );
		   }
	   },
	   createSticky = function createSticky(data){
           // if we are not passing in any data
           // (i.e., we’re creating a brand new note),
           // we’ll create the default note object.
		   data = data || {
			   id: +new Date(),
			   top: '40px',
			   left: '40px',
			   text: 'Note Here'
		   }

		   return $('<div />',
			   {
				   'class' : 'sticky',
				   'id' : data.id

			   })
               //why prepend here?
			   .prepend(
				   $('<div />',
					   {
					   'class' : 'sticky-header'
					   }
				   )
				   .append(
				   $(
					   '<span />',
					   {
						   'class' : 'status-sticky',
						   click : saveSticky // click handler saveSticky.
					   }
				   ))
				   .append(
				   $(
					   '<span />',
						{
						   'class': 'close-sticky',
						   text : 'trash',
						   click : function () {
							   deleteSticky($(this).parents('.sticky').attr('id'));
                               //we pass the method the note id.
						   }
					   }
				   ))
			   )
			   .append($('<div />', {
                   html : data.text,
                   contentEditable : true,
                   'class' : 'sticky-content',
                   keypress : markUnsaved
               }))
               .draggable({
                   handle: 'div.sticky-header',
                   stack: '.sticky',
                   start: markUnsaved,
                   stop: saveSticky
               })
               .css({
                   position : 'absolute',
                   'top' : data.top,
                   'left' : data.left
               })
               .focusout(saveSticky)
               .appendTo(document.body);
	   },
	   deleteSticky = function(id){
           localStorage.removeItem('sticky-' + id);
           $('#' + id).fadeOut(200, function () { $(this).remove() });
       },
	   saveSticky = function(){
           var that = $(this),
               sticky = (that.hasClass('sticky-status') ||
                   that.hasClass('sticky-content')) ?
                   that.parents('div.sticky'): that,
               // if it does not have either of those classes,
               // then it’s div.sticky itself, so we’ll just use that.
               obj = {
                   id : sticky.attr('id'),
                   top : sticky.css('top'),
                   left : sticky.css('left'),
                   text : sticky.children('.sticky-content').html()
                   //we’re using html() instead of text() because we
                   // want to keep the line breaks.
               }
           localStorage.setItem('sticky-' + obj.id, JSON.stringify(obj));
           // localStorage only stores strings, we use JSON.stringify()
           // to convert the object to a string.
           sticky.find('.sticky-status').text('saved');
       },
	   markUnsaved = function(){
           var that = $(this),
               sticky = that.hasClass('sticky-content') ?
                   that.parents('div.sticky') :
                   that;
           sticky.find('.sticky-status').text('unsaved');
       }; // 4 functions/closures.

	return{
		open : openStickies,
		init : initStickies
	};
}());//self-invoking function


