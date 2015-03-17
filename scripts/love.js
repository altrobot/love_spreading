// global variable
var messages;
var max_num_messages = 0;
var max_num_images = 0;
var msg_idx = 0;
var img_idx = 0;
var img_list = [
    '../images/bg001.jpg',
    '../images/bg002.jpg',
    '../images/bg003.jpg'
];

// history page 
var hist_idx = 0;

$(document).on("pageinit", "#main_page", function ()
{
    $.get('../messages/love1.csv', function (data) {
        messages = data.split("\n");
        // max number of messages
        max_num_messages = messages.length;
        // show the firt message
        $('#message').html(messages[msg_idx]);
    });

    preload(img_list);
});

// load background images
function preload(arrayOfImages)
{
    var images = [];
    for (i = 0, length = arrayOfImages.length; i < length; ++i) {
        images[i] = new Image();
        images[i].src = arrayOfImages[i];
    }
    max_num_images = arrayOfImages.length;

    //    $('.ui-page').css('background-image', 'url(' + arrayOfImages[2] + ')');
}

// history page
$(document).on("pageinit", "#history_page", function () {

//    var hist= JSON.parse(localStorage.getItem("history"));
    var hist = localStorage["history"];
    var hist_data = {};
    if (hist == undefined || hist == '') {
        alert("localstorage is empty");
    }
    else {
//        hist_idx = hist_data.id + 1;
        //        alert("hist_idx: " + hist_idx);
        hist_data = JSON.parse(hist);

        var out="", n;
        for (n in hist_data) {
            out += '<li><a href=" #"><h3>' + hist_data[n].target + '</h3><p>' + hist_data[n].msg + '</p><p class="ui-li-aside"><strong>' + hist_data[n].date + '</strong></p><span class="ui-li-count">' + hist_data[n].pulse
         + '</span></a><a href="#" id="hist_item' + hist_idx++ + '"data-icon="delete">Delete</a></li>';
            // write the list content    
            $('#hist_list').append(out);
            if ($("#hist_list").hasClass('ui-listview')) {
                $("#hist_list").listview("refresh");
            } else {
                $("#hist_list").trigger('create');
            }
        }
    }
    

    // send button handler
    // @todo if the history page is not initialized, the send button does nothing!
    $('#send').click(function (event) {
        // add a list to history page
        // @todo need to keep the history. save the list and read the list when the page is initialized
        /*
         <li><a href=" #"><h3>사랑이</h3><p>기억하세요. 당신은 사랑입니다.</p><p class="ui-li-aside"><strong>2015년 3월 10일</strong></p><span class="ui-li-count">159</span></a><a href="#" data-icon="delete"></a></li>
        */
        event.preventDefault();

        var output = "";
        var _target = "사랑이"
        var _msg = "기억하세요, 당신은 사랑입니다.";
        var today = new Date();
        var _date= today.getFullYear() + '년 ' + (today.getMonth() + 1) + '월 ' +
                         today.getDate() + '일';
        var _pulse = 150;

        id = new Date().getTime();

        // save the content to json file
        var data = {
            id: hist_idx,
            target: _target,
            msg: _msg,
            date: _date,
            pulse: _pulse
        };

        alert("hist_idx, data" + hist_idx + ". " + data);

        hist_data[hist_idx] = data;


        // save the
        localStorage.setItem("history", JSON.stringify(hist_data));

        output += '<li><a href=" #"><h3>' + _target + '</h3><p>' + _msg + '</p><p class="ui-li-aside"><strong>' + _date + '</strong></p><span class="ui-li-count">' + _pulse
               + '</span></a><a href="#" id="hist_item' + hist_idx + '"data-icon="delete">Delete</a></li>'; 
        // write the list content    
        $('#hist_list').append(output);
        if ($("#hist_list").hasClass('ui-listview')) {
            $("#hist_list").listview("refresh");
        } else {
            $("#hist_list").trigger('create');
        }  

        hist_idx++;
    });

    $('#hist_list').on("click", "li", function () {
       // alert("text: " + $(this).text());
        //        var listitem = $(this).parent("li");
        var listitem = $(this);
        alert("item: " + listitem);
        confirmAndDelete(listitem);
    });


    function confirmAndDelete(listitem, transition) {
        // Highlight the list item that will be removed
        listitem.addClass("ui-btn-down-d");
        // Inject topic in confirmation popup after removing any previous injected topics
//        $("#confirm .topic").remove();
//        listitem.find(".topic").clone().insertAfter("#question");
        // Show the confirmation popup
        $("#confirm").popup("open");
        // Proceed when the user confirms
        $("#confirm #yes").on("click", function () {
            // Remove with a transition
            if (transition) {
                listitem
                // Remove the highlight
                .removeClass("ui-btn-down-d")
                // Add the class for the transition direction
                .addClass(transition)
                // When the transition is done...
                .on("webkitTransitionEnd transitionend otransitionend", function () {
                    // ...the list item will be removed
                    listitem.remove();
                    // ...the list will be refreshed and the temporary class for border styling removed
                    $("#hist_list").listview("refresh").find(".ui-li.border").removeClass("border");
                })
                // During the transition the previous list item should get bottom border
                .prev("li.ui-li").addClass("border");
            }
            // If it's not a touch device or the CSS transition isn't supported just remove the list item and refresh the list
            else {
                listitem.remove();
                $("#hist_list").listview("refresh");
            }
        });
        // Remove active state and unbind when the cancel button is clicked
        $("#confirm #cancel").on("click", function () {
            listitem.removeClass("ui-btn-down-d");
            $("#confirm #yes").off();
        });
    }
});

// settings pape initialize
$(document).on("pageinit", "#settings_page", function () {
    // history delete event handling
    $('#delete_history').on("click", function (event) {
        $('#confirm2').popup();
        $("#confirm2").popup("open");
        // Proceed when the user confirms
        $("#confirm2 #yes").on("click", function () {
            // clear localstorage
            alert("deleting all history");
            window.localStorage.clear();
        });
    });
});

// settings page
$(document).ready(function () {


    // handling music on/off slide event
    $('[data-role="flipswitch"]').on("change", function () {
        var val = $(this).val();
        if (val == 'Off') {
            $('body > audio').trigger('pause');
        }
        else if (val == 'On') {
            $('body > audio').trigger('play');
        }
    });
});



// JQuery를 사용하면 제일 먼저 콜백 함수 실행
$(document).ready(function () {

 

    /*    var IMG_WIDTH = 500; */
    var IMG_HEIGHT = 500;
    var currentImg = 0;
    var maxImages = 3;
    var speed = 500;

    var imgs;

    var swipeOptions =
    {
        triggerOnTouchEnd: true,
        swipeStatus: swipeStatus,
        allowPageScroll: "none",
        threshold: 100
    };

    imgs = $("#background_img")


    imgs.swipe(swipeOptions);
});

$(document).ready(function ()
{
    // horizontal prev button
    $('.hcontrol .prev').click(function (event)
    {
        // decrease the message index
        msg_idx--;
        // sanity check
        if (msg_idx < 0)
        {
            msg_idx = 0;
            // disable the button
//            $(this).addClass('ui-disabled');
        }
        // show the previous message
        $('#message').html(messages[msg_idx]);

        // hooking the original event handler
        return false;
    });

    // horizontal next button
    $('.hcontrol .next').click(function (event)
    {
        // increase the message index
        msg_idx++;
        // sanity check
        if (msg_idx >= max_num_messages)
        {
            msg_idx = max_num_messages - 1;
            // disable the button
//            $(this).addClass('ui-disabled');
        }
        // show the next messsage
        $('#message').html(messages[msg_idx]);
        // hooking the original event handler
        return false;
    });

    // vertical prev button
    $('.vcontrol .prev').click(function (event)
    {
        // decrease the message index
        img_idx--;
        // sanity check
        if (img_idx < 0)
        {
            img_idx = 0;
            // disable the button
            // $(this).addClass('ui-disabled');
        }
        // show the previous image
        $('.ui-page').css('background-image', 'url(' + img_list[img_idx] + ')');
        // hooking the original event handler
        return false;
    });

    // vertical next button
    $('.vcontrol .next').click(function (event)
    {
        // increase the message index
        img_idx++;
        // sanity check
        if (img_idx >= max_num_images)
        {
            img_idx = max_num_images - 1;
            // disable the button
            // $(this).addClass('ui-disabled');
        }
        // show the next messsage
        $('.ui-page').css('background-image', 'url(' + img_list[img_idx] + ')');
        // hooking the original event handler
        return false;
    });

});

$(document).on("pageinit", "#search_page", function ()
{
    alert('num: ' + messages.length);

    var output= '';
    $.each( messages, function( index, value )
    {
        output += '<li><a href="#">' + value + '</a></li>';
        max_num_messages++;
    });
    $('#msg_list').html(output);
    $('#msg_list').listview("refresh");
    $('#msg_list').trigger("updatelayout");

    // message list click event
    $('#msg_list > li').click(function (event)
    {
        var idx= $(this).index();
//        var idx= 
        // send the msg to the main window
        $('#message').html(messages[idx]);
        // udpate the message index
        msg_idx = idx;
        // @todo need to transit to the main page?
        $(location).attr('href', "#main_page");
        return false;
    });
});


/**
 * Catch each phase of the swipe.
 * move : we drag the div
 * cancel : we animate back to where we were
 * end : we animate to the next image
 */
function swipeStatus(event, phase, direction, distance)
{
    //If we are moving before swipe, and we are going L or R in X mode, or U or D in Y mode then drag.
    if (phase == "move" && (direction == "up" || direction == "down"))
    {
        var duration = 0;

        if (direction == "up")
        {
            // chagne background image
            //            $('#background_img').css('background-image', 'url(../images/bg2.jpg)');
         //   $('.ui-page').css('background-image', 'url(../images/bg2.jpg)');
            $('.ui-page').css('background-image', 'url(' + img_list[img_idx] + ')');


//            scrollVertical((IMG_HEIGHT * currentImg) - distance, duration);
        }
        else if (direction == "down")
        {
            // chagne background image
//            $('#background_img').css('background-image', 'url(../images/bg1.png)');
//            $('.ui-page').css('background-image', 'url(../images/bg1.png)');
            $('.ui-page').css('background-image', 'url(' + img_list[img_idx] + ')');

//            scrollVertical((IMG_HEIGHT * currentImg) + distance, duration);
        }
    }
    else if (phase == "cancel")
    {
//        scrollVertical(IMG_HEIGHT * currentImg, speed);
    }
    else if (phase == "end")
    {
        
        if (direction == "up")
        {
            // decrease the message index
            img_idx--;
            // sanity check
            if (img_idx < 0)
            {
                img_idx = 0;
                // disable the button
                // $(this).addClass('ui-disabled');
            }
        }
        else if (direction == "down")
        {
            // increase the message index
            img_idx++;
            // sanity check
            if (img_idx >= max_num_images)
            {
                img_idx = max_num_images - 1;
                // disable the button
                // $(this).addClass('ui-disabled');
            }
        }
    }
 
    
    if (phase == "move" && (direction == "left" || direction == "right"))
    {
        var duration = 0;

        if (direction == "left")
        {
            // chagne background image
            $('#message').html(messages[msg_idx]);
        }
        else if (direction == "right")
        {
            // chagne background image
            $('#message').html(messages[msg_idx]);
        }

    }
    else if (phase == "end")
    {
        if (direction == "left")
        {
            // increase the message index
            msg_idx++;
            // sanity check
            if (msg_idx >= max_num_messages)
            {
                msg_idx = max_num_messages - 1;
            }

        }
        else if (direction == "right")
        {
            // decrease the message index
            msg_idx--;
            // sanity check
            if (msg_idx < 0)
            {
                msg_idx = 0;
            }
        }
    }
    else if (phase == "cancel")
    {
    }

}

function previousImage() {
    currentImg = Math.max(currentImg - 1, 0);
    scrollImages(IMG_WIDTH * currentImg, speed);
}

function nextImage() {
    currentImg = Math.min(currentImg + 1, maxImages - 1);
    scrollImages(IMG_WIDTH * currentImg, speed);
}

function previousImageV()
{
    currentImg = Math.max(currentImg - 1, 0);
    scrollVertical(IMG_HEIGHT * currentImg, speed);
}

function nextImageV()
{
    currentImg = Math.min(currentImg + 1, maxImages - 1);
    scrollVertical(IMG_HEIGHT * currentImg, speed);
}

/**
 * Manually update the position of the imgs on drag
 */
function scrollImages(distance, duration)
{
    imgs.css("transition-duration", (duration / 1000).toFixed(1) + "s");

    //inverse the number we set in the css
    var value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
    imgs.css("transform", "translate(" + value + "px,0)");
}

function scrollVertical(distance, duration)
{
    imgs.css("transition-duration", (duration / 1000).toFixed(1) + "s");

    //inverse the number we set in the css
    var value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
    imgs.css("transform", "translate(0," + value + "px)");
}
