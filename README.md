draglistener.js
===============

**For this reason, I am:**
<br>There are other simple javascript drag utilities out there, but this is one I wrote myself.
<br>Unique traits are as follows...
* full history of **drag data** for multiple elements per drag/mousemove event (elements as supplied by the relatedNodes parameter)
* full history of **time data** per drag/mousemove event (milliseconds, epoch)

**Summary:**
<br>Element.prototype.addDragListener = function(key,mousedown,drag,mouseup,relatedNodes,params)
<br>Element.prototype.removeDragListener = function(key)

**Issues:**
<br>\* This lacks sufficient commenting.  Will work on that, as well as a few other things.
<br>\* This is an experiment in jQuery, so may jump between jQuery methodology and classical javascript programming without real reason.  Will consolidate this to a more proper jQuery header, eventually.
<br>\* Need to add examples to this README.
