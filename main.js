$(function(){
    let current_track = document.createElement('audio')
    current_track.preload = "metadata"
    let track_index = 0;
    let isPlaying = false;
    let isRandom = false;
    let prevTrackIndex 
    let nextTrackIndex
    let updateTimer;
    let isMuted = false
    let repeat = false
    const music_list = [
        {
            title:"In The Light",
            artist: "Johnny Drille ft Ayra Starr",
            cover: "./img/cover.jpg",
            audioFile: "./music/In_the_light.mp3"
        },
        {
            title:"Odo",
            artist: "Johnny Drille ft Styl-Plus",
            cover: "./img/cover.jpg",
            audioFile: "./music/odo.mp3"
        },
        {
            title:"Driving In The Rain",
            artist: "Johnny Drille",
            cover: "./img/cover.jpg",
            audioFile: "./music/driving_in_the_rain.mp3"
        },
        {
            title:"Ova",
            artist: "Johnny Drille ft Don Jazzy",
            cover: "./img/cover.jpg",
            audioFile: "./music/ova.mp3"
        },
        {
            title:"My Kind of Brown",
            artist: "Johnny Drille",
            cover: "./img/cover.jpg",
            audioFile: "./music/my_kind_of_brown.mp3"
        },
        {
            title:"I Found a Love That Never Dies",
            artist: "Johnny Drille",
            cover: "./img/cover.jpg",
            audioFile: "./music/i_found_a_love_that_never_dies.mp3"
        },
        {
            title:"Ludo",
            artist: "Johnny Drille",
            cover: "./img/cover.jpg",
            audioFile: "./music/ludo.mp3"
        },
        {
            title:"Lost In The Rhythm",
            artist: "Johnny Drille",
            cover: "./img/cover.jpg",
            audioFile: "./music/lost_in_the_rhythm.mp3"
        },
        {
            title:"Sell My Soul",
            artist: "Johnny Drille",
            cover: "./img/cover.jpg",
            audioFile: "./music/sell_my_soul.mp3"
        }
    ]
    let audio = document.createElement('audio')
    $.each(music_list, function(i,v){
        audio.preload = "metadata"
        audio.src = v.audioFile
        audio.load()
        $("#songs-el").append(`
                <tr class="track">
                    <td class="song-title col-6">${v.title}</td>
                    <td class="artist col-6">${v.artist}</td>
                </tr>
        `)
        
    })
    // play selected track
    $(".track").click(function(){
        getTrack($(this).index())
        playTrack()
    })
    // convert duration to minutes and seconds
    function convDuration(seconds){
        let minutes = Math.floor(seconds/60)
        let extra_seconds = Math.floor(seconds % 60)
        minutes = minutes < 10 ? "0" + minutes : minutes
        extra_seconds = extra_seconds < 10 ? "0" + extra_seconds : extra_seconds
        duration = `${minutes}:${extra_seconds}`
        return duration
    }
    // get track and dislay data on now playing bar
    function getTrack(track_index){
        clearInterval(updateTimer)
        reset()
        current_track.volume = $("#volume").val() / 100
        current_track.src = music_list[track_index].audioFile
        current_track.load()
        $("#track-img").attr("src", music_list[track_index].cover)
        $(".track-name").html(music_list[track_index].title)
        $("#track-artist").html(music_list[track_index].artist)
        current_track.onloadedmetadata = function() {
            $("#total-duration").html(convDuration(current_track.duration))
        }
        updateTimer = setInterval(setUpdate, current_track.duration)
        current_track.addEventListener('ended', nextTrack)
    }
    getTrack(track_index)
    // reset now playing bar
    function reset(){
        $("#current-time").html("00:00")
        $("#total-duration").html("00:00")
        $("#seek-slider").val(0)
    }
    reset()
    // change current time of the track
    $("#seek-slider").on("input", function(){
        clearInterval(updateTimer)
        updateTimer = setInterval(setUpdate, current_track.duration)
        current_track.currentTime = current_track.duration * ($("#seek-slider").val() / 100)
    })
    // toggle shuffle
    $("#shuffle-btn").click(function(){
        if(isRandom === false){
            isRandom = true
            $("#shuffle-btn").attr("src", "./img/shuffle-fill.svg")
        }else{
            isRandom = false
            $("#shuffle-btn").attr("src", "./img/shuffle-icon.svg")
        }
    })
    // play previous track
    function prevTrack(){
        if(track_index > 0 && isRandom == false ){
            track_index --
        }else if( track_index > 0 && isRandom == true){
            track_index = prevTrackIndex
        }else{
            track_index = 0
        }
        getTrack(track_index)
        playTrack()
    }
    $("#prev-btn").click(function(){
        prevTrack()
    })
    //pause and play track
    function playPauseTrack(){
        if(isPlaying){
            pauseTrack()
        }else{
           playTrack()
        }
    }
    function playTrack(){
        current_track.play()
        isPlaying = true
        $("#play-btn").attr("src", "./img/pause-circle-line.svg")
    }
    function pauseTrack(){
        current_track.pause()
        isPlaying = false
        $("#play-btn").attr("src", "./img/play-icon.svg")
    }
    $("#play-btn").click(function(){
        playPauseTrack()
    })
    $(document).keypress(function(e){
        if(e.which == 32){
            playPauseTrack()
        }
    })
    
    //play next track
    function nextTrack(){
        if(repeat == false || repeat == true){
            if(track_index < music_list.length - 1 && isRandom == false){
                track_index ++
                nextTrackIndex = track_index
            }else if( track_index <= music_list.length -1 && isRandom == true){
                prevTrackIndex = track_index
                track_index = Math.floor((Math.random() * (music_list.length-1))+1)
                if(track_index == prevTrackIndex){
                    track_index = Math.floor((Math.random() * (music_list.length-1))+1)
                }
                console.log(track_index)
                nextTrackIndex = track_index
            }
            else{
                nextTrackIndex = 0
            }
        }else if(repeat == "once"){
            nextTrackIndex = track_index
        }else{
            nextTrackIndex = 0
        }
        
        getTrack(nextTrackIndex)
        playTrack()
    }
    $("#next-btn").click(function(){
        nextTrack()
    })
    // repeat
    $("#repeat-btn").click(function(){
        if(repeat == false){
            repeat = true
            $("#repeat-btn").attr("src", "./img/repeat-fill.png")
        }else if ( repeat == true){
            repeat = "once"
            $("#repeat-btn").attr("src", "./img/repeat-once-fill.png")
        }else if(repeat == "once"){
            repeat = false
            $("#repeat-btn").attr("src", "./img/repeat-icon.svg")
        }
    })
    // change the current
    function setUpdate(){
        let seekPosition = 0;
        if(!isNaN(current_track.duration)){
            seekPosition = current_track.currentTime * (100 / current_track.duration);
            convDuration(current_track.currentTime)
            $("#current-time").html(convDuration(current_track.currentTime))
            $("#seek-slider").val(seekPosition)
        }
    }
    // mute song
    function mute(){
        $("#volume-icon").attr("src", "./img/volume-mute-fill.svg")
        current_track.volume = 0
        isMuted = true
    }
    // unmute song
    function unmute(){
        $("#volume-icon").attr("src", "./img/volume-icon.svg")
        current_track.volume = $("#volume").val() / 100
        isMuted = false
    }
    // toggle mute
    $("#volume-icon").click(function(){
        if( isMuted == false){
            mute()
        }else{
            unmute()
        }
    })
    // set volume
    $("#volume").change(function(){
        current_track.volume = $("#volume").val() / 100
    })

    let isOnline = navigator.onLine
    let myTimeout
    navigator.connection.onchange = () => {
        isOnline = navigator.onLine
        checkInternet()
    }

    // check internet connectivity
    function checkInternet(){
        if (isOnline == false){
            $("#icon").html(`<i class="ri-wifi-off-fill" style = "color: red"></i>`)
            $("#message").html(`Connection lost`)
            pauseTrack()
            $.blockUI({message: $("#message-container")})
        }else{
            $("#icon").html(`<i class="ri-wifi-fill" style = "color: green;"></i>`)
            $("#message").html(`Connection Restored`)
            $.blockUI({message: $("#message-container")})
            clearTimeout(myTimeout)
            myTimeout = setTimeout(function(){
                $.unblockUI()
            }, 3000)
        }
    }

    navigator.getBattery()
        .then((battery) => {
            let batteryLevel = battery.level * 100
            battery.addEventListener('levelchange', function(){
                if( batteryLevel <= 20){
                    $("#icon").html(`<i class="ri-battery-low-fill" style = "color:green;"></i>`)   
                    $("#message").html(`Battery low`) 
                    $.blockUI({message: $("#message-container")})
                }
            })
            battery.addEventListener('chargingchange', function(){
                console.log(battery.charging)
                if(battery.charging == true){
                    $.unblockUI()
                }
            })
        }
    )
})