/*let vid = document.getElementById("vidPlayer");
let xmlhttp = new XMLHttpRequest();
let url = "/gettimestamp/<%= vid %>";
function gettime(){
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let timestamp = JSON.parse(this.responseText).timestamp;
        vid.currentTime = parseFloat(timestamp,10);
        settime();
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();
}

function settime(){ 
    let vid = document.getElementById("vidPlayer");
    let xmlhttp = new XMLHttpRequest();
    let url = "/settimestamp/<%= vid %>?time=" + vid.currentTime;

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

vid.oncanplay = gettime();
vid.onseeked = settime();
setInterval(settime, 15000);*/

function getAPI(getString ,callback){ 
    let xmlhttp = new XMLHttpRequest();
    let url = "/api?" + getString;
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.responseText));
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function postAPI(getString ,callback){ 
    let xmlhttp = new XMLHttpRequest();
    let url = "/api";
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.responseText));
        }
    };
    xmlhttp.open("post", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(getString);
}

//decodeURI(str)


var getprams = {};
var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    getprams[key] = decodeURI(value);
});


getAPI("get=mediaMeta&title=" + getprams["title"],function(get){
    if(get.res.type == "audio"){
        document.getElementById("audioPlayer").style = "display:block;";
        document.getElementById("media").style.height = "25%";
        document.getElementById("videoPlayer").style = "display:none;";
        document.getElementById("PDFViewer").style = "display:none;";
        document.getElementById("audioPlayer-audio").src = "/media?title=" + get.res.title + "&part=" + ((getprams["part"] != undefined) ? getprams["part"] : "0");
    } else if(get.res.type == "PDF"){
        document.getElementById("audioPlayer").style = "display:none;";
        document.getElementById("videoPlayer").style = "display:none;";
        document.getElementById("PDFViewer").style = "display:block;";
    } else if(get.res.type == "video"){
        document.getElementById("audioPlayer").style = "display:none;";
        document.getElementById("videoPlayer").style = "display:block;";
        document.getElementById("PDFViewer").style = "display:none;";
        document.getElementById("videoPlayer-video").src = "/media?title=" + get.res.title + "&part=" + ((getprams["part"] != undefined) ? getprams["part"] : "0");
        document.getElementById("videoPlayer-video").oncanplay = getAPI("get=getTimeStamp&title=" + get.res.title + "&part=" + ((getprams["part"] != undefined) ? getprams["part"] : "0"),function(getTime){
            document.getElementById("videoPlayer-video").currentTime = parseFloat(getTime.res,10);
        });
        setInterval(function(){
            postAPI("update=setTimeStamp&title=" + getprams["title"] + "&part=" + ((getprams["part"] != undefined) ? getprams["part"] : "0") + "&time=" + document.getElementById("videoPlayer-video").currentTime,function(ok){
                console.log(ok);
            });
        }, 15000);
    }

    document.getElementById("title").innerHTML = "<h3>" + get.res.title + "&nbsp&nbsp<span id='rating'>" + get.res.rating +"</span></h3>";
    document.getElementById("description").innerHTML = get.res.description;
    document.getElementById("poster-img").src = "/poster?title=" + get.res.title;
    if(get.res.parts.length > 1){
        let partsList = "";
        for(let part=0; part<get.res.parts.length; part++){
            partsList += "<li id='parts-list-part' onclick='window.location =\"/watch?title=" + get.res.title + "&part=" + part + "\"'><span id='parts-list-part-id'>" + part + "</span><span id='parts-list-part-name'>" + get.res.parts[part].replace(/\.[^/.]+$/, "") + "</span></li>";
        }
        document.getElementById("parts-list").innerHTML = partsList;
    }
    
});