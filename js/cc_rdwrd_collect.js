var getAllLinks = function(callback) {
	chrome.tabs.executeScript(null, {code: "var links = []; var all = document.links; for(var i = 0; i < all.length; i++) links.push(all[i].href); links;"},function(response) {
		typeof callback === 'function' && callback(response);
	});
}

var filterLinks = function(links, type, callback) {
	var filteredLinks = [];
	for(var i = 0; i < links.length; i++) {
	    var thisLink = links[i];
		if(thisLink.search("http[s]?://apps.facebook.com/criminalcase/reward.php?") === 0 || thisLink.search("http[s]?://imabigfanof.criminalcasegame.com/") === 0) {
			if((type.toLowerCase()=='oj' && thisLink.search('Level_up') > 0) || ((type.toLowerCase()=='chip' || type.toLowerCase()=='chips') && thisLink.search('Rank_up') > 0) || ((type.toLowerCase()=='coin' || type.toLowerCase()=='coins') && thisLink.search("postCaseProgress")>0)) {
				filteredLinks.push(thisLink);
			}
		}
	}
	typeof callback === 'function' && callback(filteredLinks);
}

var findUnvisited = function(urls, callback) {
    var unvisitedURLs = [];
    var checkedURLs = 0;

    urls.forEach(function(url) {
        chrome.history.getVisits({ "url": url }, function(visitItems) {
            if (!visitItems || (visitItems.length == 0)) {
                unvisitedURLs.push(url);
            }
            checkedURLs++;
            if (checkedURLs == urls.length) {
                typeof callback === 'function' && callback(unvisitedURLs);
            }
        });
    });
}

var openAllInTabs = function(urls, callback) {
	var tabDetails = [];
	var openedURLs = 0;

	urls.forEach(function(url) {
		chrome.tabs.create({ "url": url, "active" : false }, function(createdTab) {
			tabDetails.push(createdTab);
			openedURLs++;
			if (openedURLs === urls.length) {
				typeof callback === 'function' && callback(tabDetails);
			}
		});
	});
}

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
		if(request.msg === 'chanchal1987') openAllInTabs(['http://facebook.com/chanchal1987']);
		else {
			getAllLinks(function(res1) {
				filterLinks(res1[0], request.msg, function(res2) {
					findUnvisited(res2, function(res3) {
						openAllInTabs(res3, function(res4){console.log(res4)});
					});
				})
			});
		}
    }
);