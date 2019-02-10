let vid = document.getElementById("vidPlayer");
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
setInterval(settime, 15000);