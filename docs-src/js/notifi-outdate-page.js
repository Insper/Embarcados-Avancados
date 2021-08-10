{
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/lastModified#notes
    var
    nCurrentId = 0;
    nRemoteId = 0;

    function getlastmod(url, cb) {
        var req = new XMLHttpRequest();
        // by-pass cache
        req.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime());
        req.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
        req.send(null);
        req.addEventListener("load", function() {
            cb(req.getResponseHeader("Last-Modified"));
        }, false);
    }

    function checkChange() {
        getlastmod(window.location.href, function(v) {
            nRemoteId = Date.parse(v);
        });

        if (nCurrentId == 0){
            nCurrentId = nRemoteId;
        }

        if (isNaN(nRemoteId) || nRemoteId > nCurrentId) {
            const text = window.ihandout_config["notifi-outdate-page"]["text"];
            notification.toast(text, {bgColor: "warning",
                                      href: window.location.href });
            nCurrentId = nRemoteId;

            window.setTimeout(checkChange, 1000);
        }
      }

    window.setInterval(checkChange, 1000);

  }
