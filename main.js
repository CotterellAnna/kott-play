$(function(){
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://genius.p.rapidapi.com/songs/442856",
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "8c0e79bc7bmshbc2e19ccc5b7908p12ed07jsnfd3980b94391",
            "X-RapidAPI-Host": "genius.p.rapidapi.com"
        }
    };
    
    $.ajax(settings).done(function (response) {
        console.log(response);
    });
})