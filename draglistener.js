
// author: Cesar A. Longoria II
// copyright (under MIT?): 2014-2015

/**
	key: stores these in a table, so a key makes later removal convenient.
	
	mousedown: event on mouse down.
	
	drag: function(e,dragData)
		- e: mousemove event
		- dragData
			  . [key1,key2,...]: arrays of all offsets between element and document.
			  . timing: array of times mousemove was called, in epoch millis.
			  . length: function returning current length of offset data arrays.
			  . diff: function(a,b,index) returning subtraction of offset array data
			      at index between nodes stored under dragData as keys a and b.
			  . first: function(a,b) performing diff with index = 0.
			  . last: function(a,b) performing diff with index = dragData.length-1.
	
	mouseup: event on mouse up.
	
	relatedNodes: nodes whichs' offsets from document to track and store under
	  their given key names in the dragData object passed to the drag function.
	
	params: eh... extraneous options and parameters...
		- selection: setting params.selection to true will allow the default
		    mousedown behavior.  Otherwise, the actual mousedown listener will
		    always end with { e.preventDefault(); return true; }.
*/

Element.prototype.addDragListener =
	function(key,mousedown,drag,mouseup,relatedNodes,params)
{
	if (!this._dragEvents)
		this._dragEvents = {};
	
	var startFunc;
	var dragFunc;
	var endFunc;
	
	var offsetArrays = {};
	var timingArray = [];
	
	for (var i in relatedNodes)
		offsetArrays[i] = [];
	
	var dragging = false;
	
	var self = this;
	
	var trueOffset = function(node)
	{
		var n = node;
		var off = {x:0,y:0};
		while (n.offsetParent)
		{
			off.x += parseFloat(n.offsetLeft);
			off.y += parseFloat(n.offsetTop);
			n = n.offsetParent;
		}
		return off;
	};
	
	this.dragging = function(){return dragging};
	
	this.addEventListener('mousedown',startFunc=function(e)
	{
		dragging = true;
		
		offsetArrays = {mouse:[]};
		timingArray = [];
		
		// NOTE: Can't seem to decide which key variable name to use...
		for (var k in relatedNodes)
			offsetArrays[k] = [];
		
		var pushCurrent = function(e)
		{
			for (var p in relatedNodes)
				offsetArrays[p].push(trueOffset(relatedNodes[p]));
			
			offsetArrays.mouse.push({
				x:parseFloat(e.pageX) + parseFloat(document.body.scrollLeft),
				y:parseFloat(e.pageY) + parseFloat(document.body.scrollTop)
			});
			
			timingArray.push(new Date().getTime());
		};
		
		document.addEventListener('mousemove',dragFunc=function(e)
		{
			pushCurrent(e);
			
			var dragData = {
				length:function(){return offsetArrays.mouse.length},
				diff:function(a,b,index)
				{
					return {
						x:this[a][index].x-this[b][index].x,
						y:this[a][index].y-this[b][index].y
					};
				},
				first:function(a,b){return this.diff(a,b,0)},
				last:function(a,b){return this.diff(a,b,this.length()-1)}
			};
			
			// NOTE: Oh boy.  Full copy of all arrays *every mousemove*.  This needs
			//   to be made into a read-only Array accessor of sorts.  I'll leave it
			//   at this, for now, though.
			for (var p in offsetArrays)
				dragData[p] = offsetArrays[p].slice(0);
			dragData.timing = timingArray.slice(0);
			
			// Call with Element as 'this' in function.
			self._drag = drag;
			self._drag(e,dragData);
			delete self._drag;
		});
		
		document.addEventListener('mouseup',endFunc=function endFunc(e)
		{
			self._mouseup = mouseup;
			self._mouseup(e);
			delete self._mouseup;
			
			dragging = false;
			document.removeEventListener('mousemove',dragFunc);
			document.removeEventListener('mouseup',endFunc);
		});
		
		self._dragEvents[key].dragFunc = dragFunc;
		self._dragEvents[key].endFunc = endFunc;
		
		// Run the mousedown function.
		pushCurrent(e);
		this._mousedown = mousedown;
		this._mousedown(e);
		delete this._mousedown;
		
		// Prevent highlight selection, by default.
		if (!params || !params.selection)
		{
			e.preventDefault();
			return false;
		}
	});
	
	this._dragEvents[key] = {startFunc:startFunc};
};

Element.prototype.removeDragListener = function(key)
{
	var a = this._dragEvents[key];
	this.removeEventListener('mousedown',a.startFunc);
	document.removeEventListener('mousemove',a.dragFunc);
	document.removeEventListener('mouseup',a.endFunc);
}

