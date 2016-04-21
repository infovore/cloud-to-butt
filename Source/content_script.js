var willCount = 0;

function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
  textNode.nodeValue = replaceText(textNode.nodeValue);
}

function replaceText(v)
{

	if(v.match('Millennial')) {
		if((willCount % 10)== 0) {
 			v = v.replace(/\bMillennial\b/g, "Millennial - excuse me, Willellennial");
			v = v.replace(/\bMillennials\b/g, "Millennials - excuse me, Willellennials");
			willCount = willCount + 1;
		} else {
		 	v = v.replace(/\bMillennial\b/g, "Willellennial");
	  	v = v.replace(/\bMillennials\b/g, "Willellennials");
		 }
	 } 
	 v = v.replace(/\bmillennial\b/g, "willennial");
	 v = v.replace(/\bmillennials\b/g, "willennials");
	

    return v;
}

// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].nodeType === 3) {
                // Replace the text for text nodes
                handleText(mutation.addedNodes[i]);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(mutation.addedNodes[i]);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    willCount = 0;

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}
walkAndObserve(document);
