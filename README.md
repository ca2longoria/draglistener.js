draglistener.js
===============

**For this reason, I am:**
<br>There are other simple javascript drag utilities out there, but this is one I wrote myself.
<br>Unique traits are as follows...
* dragData object passed to drag (mousedown->drag(mousemove)->mouseup), containing full history of present drag event
* can provide drag data for multiple elements, as supplied by the relatedNodes parameter
* provides time (milliseconds, epoch) data per mousemove event

**Summary:**
<br>Element.prototype.addDragListener = function(key,mousedown,drag,mouseup,relatedNodes,params)

**Issues:**
<br>\* This lacks sufficient commenting.  Will work on that, as well as a few other things.
<br>\* This is an experiment in jQuery, so may jump between jQuery methodology and classical javascript programming without real reason.  Will consolidate this to a more proper jQuery header, eventually.
