function click(e) {
    chrome.tabs.executeScript(null, {file: "cc_rdwrd_collect.js"});
    chrome.extension.sendRequest({ msg: e.target.className });
	console.log("Sending Message: " + e.target.className);
	window.close();
}

document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('a');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});