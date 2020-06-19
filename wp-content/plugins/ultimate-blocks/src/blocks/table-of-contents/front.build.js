"use strict";

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;

    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);

    return null;
  };
}

function ub_hashHeaderScroll() {
  if (window.location.hash) {
    var targetHeading = document.getElementById(window.location.hash.slice(1));
    var probableHeaders;

    try {
      probableHeaders = document.elementsFromPoint(window.innerWidth / 2, 0);
    } catch (e) {
      probableHeaders = document.msElementsFromPoint(window.innerWidth / 2, 0);
    }

    var stickyHeaders = Array.prototype.slice.call(probableHeaders).filter(function (e) {
      return ["fixed", "sticky"].includes(window.getComputedStyle(e).position);
    });
    var stickyHeaderHeights = stickyHeaders.map(function (h) {
      return h.offsetHeight;
    });
    var deficit = targetHeading.getBoundingClientRect().y || targetHeading.getBoundingClientRect().top;
    window.scrollBy(0, deficit - (stickyHeaders.length ? Math.max.apply(Math, stickyHeaderHeights) : 0));
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var instances = [];

  if (document.getElementById("ub_table-of-contents-toggle-link")) {
    instances.push(document.getElementById("ub_table-of-contents-toggle-link"));
  } else {
    instances = Array.prototype.slice.call(document.getElementsByClassName("ub_table-of-contents-toggle-link"));
  }

  instances.forEach(function (instance) {
    var tocHeight;
    var block = instance.closest(".ub_table-of-contents");
    var tocContainer = block.querySelector(".ub_table-of-contents-container");
    var containerStyle = tocContainer.style;
    var tocMain = tocContainer.parentNode;
    var mainStyle = tocMain.style;
    var showButton = block.getAttribute("data-showtext") || "show";
    var hideButton = block.getAttribute("data-hidetext") || "hide";
    var initialHide = tocContainer.classList.contains("ub-hide") || containerStyle.height === "0px" || getComputedStyle(tocContainer).display === "none";

    if (initialHide) {
      tocContainer.classList.remove("ub-hide");
      containerStyle.display = "";
      containerStyle.height = "";
      tocMain.classList.remove("ub_table-of-contents-collapsed");
    }

    if (initialHide) {
      tocContainer.classList.add("ub-hide");
      tocMain.classList.add("ub_table-of-contents-collapsed");
    }

    tocContainer.removeAttribute("style");
    instance.addEventListener("click", function (event) {
      event.preventDefault();
      var curWidth = tocMain.offsetWidth;

      if (tocMain.classList.contains("ub_table-of-contents-collapsed")) {
        //begin showing
        tocContainer.classList.remove("ub-hide");

        if (tocHeight !== getComputedStyle(tocContainer).height) {
          tocHeight = getComputedStyle(tocContainer).height;
        }

        tocContainer.classList.add("ub-hiding");
        mainStyle.width = "".concat(curWidth, "px");
        setTimeout(function () {
          tocMain.classList.remove("ub_table-of-contents-collapsed");
          containerStyle.height = tocHeight;
          containerStyle.width = "100%";
          tocContainer.classList.remove("ub-hiding");
          mainStyle.width = "100%";
        }, 50);
      } else {
        //begin hiding
        mainStyle.width = "".concat(tocMain.offsetWidth, "px");
        containerStyle.width = "".concat(tocContainer.offsetWidth, "px");
        containerStyle.height = "".concat(tocContainer.offsetHeight, "px");
        setTimeout(function () {
          mainStyle.minWidth = "fit-content";
          mainStyle.width = "0px";
          tocContainer.classList.add("ub-hiding");
          containerStyle.height = "0";
          containerStyle.width = "0";
        }, 50);
      }

      instance.innerHTML = tocContainer.classList.contains("ub-hiding") ? hideButton : showButton;
    });
    tocContainer.addEventListener("transitionend", function () {
      if (tocContainer.offsetHeight === 0) {
        //hiding is done
        tocContainer.classList.remove("ub-hiding");
        tocContainer.classList.add("ub-hide");

        if (containerStyle.display === "block") {
          containerStyle.display = "";
        }

        tocMain.classList.add("ub_table-of-contents-collapsed");
        mainStyle.minWidth = "";
      }

      containerStyle.width = "";
      containerStyle.height = "";
      mainStyle.width = "";
    });
  });

  if (window.location.hash) {
    setTimeout(function (_) {
      return ub_hashHeaderScroll();
    }, 50);
  }
});
window.onhashchange = ub_hashHeaderScroll;
Array.prototype.slice.call(document.querySelectorAll(".ub_table-of-contents-container li > a")).forEach(function (link) {
  link.addEventListener("click", function (e) {
    var hashlessLink = link.href.replace(link.hash, "");
    var targetPageNumber = /[?&]page=\d+/g.exec(hashlessLink);
    var currentPageNumber = /[?&]page=\d+/g.exec(window.location.search);

    if (window.location.href.includes(hashlessLink) && (currentPageNumber === null || targetPageNumber && currentPageNumber[0] === targetPageNumber[0])) {
      e.preventDefault();
      history.pushState(null, "", link.hash);
      ub_hashHeaderScroll();
    }
  });
});