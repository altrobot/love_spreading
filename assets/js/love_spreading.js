
// global variable
var messages='';
var max_num_messages = 0;
var msg_idx = 0;
var img_idx = 0;
var img_list = [
    'assets/img/bg_001.jpg',
    'assets/img/bg_002.jpg',
    'assets/img/bg_003.jpg',
    'assets/img/bg_004.jpg',
    'assets/img/bg_005.jpg'
];
var hist_idx = 0;
// javascript data
var hist_data = {};
var max_num_images = 0;

var screenshot = new Image();

/******** main page ***********************/
// @todo mobileinit is not working? why?
$(document).on("pageinit", "#main_page", function () {

    // load background images
    preload(img_list);
    // read messages asynchronosouly if the messages are empty
    if (max_num_messages == 0) {
        readMessages();
    }
    $('#message_box').html(messages[msg_idx]);

    // swiping options
    var swipeOptions =
    {
        triggerOnTouchEnd: true,
        swipeStatus: swipeStatus,
        allowPageScroll: "none",
        threshold: 100
    };

    // horizontal prev button
    $('#prev_msg').on("click", function (event) {
        // hooking the original event handler
        event.preventDefault();
        // decrease the message index
        msg_idx--;
        // sanity check
        if (msg_idx < 0) {
            msg_idx = 0;
        }
        // show the previous message
        $('#message_box').html(messages[msg_idx]);   
    });
    // horizontal next button
    $('#next_msg').on("click", function (event) {
        // hooking the original event handler
        event.preventDefault();
        // increase the message index
        msg_idx++;
        // sanity check
        if (msg_idx >= max_num_messages) {
            msg_idx = max_num_messages - 1;
        }
        // show the next messsage
        $('#message_box').html(messages[msg_idx]);
    });
    // vertical prev button
    $('#prev_bg').on("click", function (event) {
        // hooking the original event handler
        event.preventDefault();
        // decrease the message index
        img_idx--;
        // sanity check
        if (img_idx < 0) {
            img_idx = 0;
        }
        // show the previous image
        $('#main_page').css('background-image', 'url(' + img_list[img_idx] + ')');
    });
    // vertical next button
    $('#next_bg').on("click", function (event) {
        // hooking the original event handler
        event.preventDefault();
        // increase the message index
        img_idx++;
        // sanity check
        if (img_idx >= max_num_images) {
            img_idx = max_num_images - 1;
        }
        // show the previous image
        $('#main_page').css('background-image', 'url(' + img_list[img_idx] + ')');
    });

    // screen swipe options
    var swipeOptions =
    {
        triggerOnTouchEnd: true,
        swipeStatus: swipeStatus,
        allowPageScroll: "none",
        threshold: 100
    };
    var screen = $("#main_page")
    screen.swipe(swipeOptions);

    // send button handler
    $('#kakao-link-btn').on('click', function (event) {
        // override the default handler
        event.preventDefault();

        Kakao.init("d9b6ff0b565f058048aa0b2bb68a5293");


        var output = "";
        var _receiver= "Love Spreading"
        var _msg = messages[msg_idx];
        var today = new Date();
        var _date = today.getFullYear() + '년 ' + (today.getMonth() + 1) + '월 ' +
                         today.getDate() + '일';
        // save the history record to json file
         var record = {
            id: hist_idx,
            receiver: _receiver,
            msg: _msg,
            date: _date,
        };
        hist_data[hist_idx] = record;
        // save the record in the localStorage
        localStorage.setItem("history_love_spreading", JSON.stringify(hist_data));
        // write the record to the history list    
        output += '<li id="hist_idx' + hist_idx + '"><a href=" #"><h3>' + _receiver + '</h3><p>' + _msg + '</p><p class="ui-li-aside"><strong>' + _date + '</strong></p></a><a href="#" class="delete" data-icon="delete">Delete</a></li>';
        $('#hist_list').append(output);
        $("#hist_list").listview().listview("refresh");

        // detach all events and re-attach the click handler
        $('.delete').off("click", onDeleteClicked);
        $('.delete').on("click", onDeleteClicked);

        // not used but left for reference
        // $('[data-icon="delete"]').trigger("updatelayout");

        // update the history index
        hist_idx++;

        shareViaKakao();

/*
        // @test screenshot
        html2canvas(document.body).then(function (canvas) {
            screenshot.src = canvas.toDataURL("image/png");
            window.open(screenshot.src);
        });
*/
    });  
});


function shareViaKakao() {
    Kakao.Link.createTalkLinkButton({
        container: '#kakao-link-btn',
        label: '[' + document.getElementsByTagName("TITLE")[0].text + ']\n' + messages[msg_idx],
        /*
        image: {
            src: screenshot.src,
            width: '300',
            height: '300'
        },*/ 
        webButton: {
            text: '모바일 웹앱방문',
            url: "http://altrobot.github.io/love_spreading"
        }
    })
}


$(document).ready(function(){

});


// load background images
function preload(arrayOfImages) {
    var images = [];
    for (i = 0, length = arrayOfImages.length; i < length; ++i) {
        images[i] = new Image();
        images[i].src = arrayOfImages[i];
    }
    max_num_images = arrayOfImages.length;
}

/* read message files asynchronosouly */
function readMessages() {
    // wait until it gets the messages
    $.ajax({
        async: false,
        type: 'GET',
        url: 'assets/data/messages_01.csv',
        success: function (data) {
            // split the data in rows
            messages = data.split("\n");
            // max number of messages
            max_num_messages = messages.length;
            // draw a random index
            // msg_idx = Math.floor(Math.random() * (max_num_messages - 1));
            // shuffle all messages
            messages = shuffle(messages);
            // reset the message index
            msg_idx = 0;
        }
    });
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/******** search page ***********************/
$(document).on("pageinit", "#search_page", function ()
{
    // read messages asynchronosouly if the messages are empty
    if (max_num_messages == 0) {
        readMessages();
    }
    // messages to write to HTML
    var output = '';

    // loop over messages
    $.each( messages, function( index, value )
    {
        output += '<li><a href="#">' + value + '</a></li>';
    });
    // write the messages
    $('#msg_list').html(output);
    // refresh the list
    $('#msg_list').listview("refresh");

    // message list click event
    $('#msg_list > li').on('click', function (event)
    {
        // get the message index
        var idx = $(this).index();
        // send the msg to the main window
        $('#message_box').html(messages[idx]);
        // udpate the message index
        msg_idx = idx;
        // transit to the main page
        $(location).attr('href', "#main_page");
    });
});

/* history page */
$(document).on("pageinit", "#history_page", function () {
    // read history from localStorage
    var hist_storage = localStorage["history_love_spreading"];
    // @todo what if the localStorage is empty?
    if (hist_storage == undefined || hist_storage == '') {
        return;
    }
    else {
        // parse the storage data
        hist_data = JSON.parse(hist_storage);
        var output = "", n;
        for (n in hist_data) {
            output = '<li id="hist_idx' + hist_idx +'"><a href=" #"><h3>' + hist_data[n].receiver + '</h3><p>' + hist_data[n].msg + '</p><p class="ui-li-aside"><strong>' + hist_data[n].date + '</strong></p></a><a href="#" class="delete" data-icon="delete">Delete</a></li>';
            // update the history recondr index
            hist_idx++;
            // write the list content    
            $('#hist_list').append(output);
            // set event handler for dynamically generated items 
            $("#hist_list").listview().listview("refresh");
        }
    }

    // delete an item (when the page is refreshed)
    $('.delete').on("click", function () {
        // get the list item (it is the parent of .delete class)
        var listitem = $(this).parent("li");
        // pop-up dialog to confirm
        confirmAndDelete(listitem);
    });

});

/*
 * user function to handle click event for .delete class
 * this function is called when the user clicks the "send" button to dynamicall add event handler
 */
function onDeleteClicked( event, ui ) {
    var listitem = $(this).parent("li");
    confirmAndDelete(listitem);
}


// delete an item
function confirmAndDelete(listitem, transition) {
    // Highlight the list item that will be removed
    listitem.addClass("ui-btn-down-d");
    // Inject topic in confirmation popup after removing any previous injected topics
    //        $("#confirm .topic").remove();
    //        listitem.find(".topic").clone().insertAfter("#question");
    // Show the confirmation popup
    $("#confirm_delete_item").popup("open");
    // Proceed when the user confirms
    $("#confirm_delete_item #yes").on("click", function () {
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
        //// Updating local storage
        // get the item id with the prefix="hist_idx"
        var css_id = listitem.attr("id");
        // remove the prefix to get the record id
        id = css_id.replace("hist_idx", ""),
        delete hist_data[id];
        localStorage.setItem("history_love_spreading", JSON.stringify(hist_data));
    });
    // Remove active state and unbind when the cancel button is clicked
    $("#confirm_delete_item #cancel").on("click", function () {
        listitem.removeClass("ui-btn-down-d");
        $("#confirm_delete_item #yes").off();
    });
}


/* settings pape */
$(document).on("pageinit", "#settings_page", function () {
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

    // history delete event handling
    $('#delete_history').on("click", function (event) {
        $('#confirm_delete_all').popup();
        $("#confirm_delete_all").popup("open");
        // Proceed when the user confirms
        $("#confirm_delete_all #yes").on("click", function () {
            // clear localstorage
            localStorage.clear();
            // remove all history list
            $("#hist_list").empty();
        });
    });
    
    // more-less event
    $('.more-less-text').on("click", function () {
        if ($(this).html() == "More...") {
            // get the list > div
            $(this).parent().children(':first-child').addClass("more");
            $(this).parent().children(':first-child').removeClass("less");
            $(this).html("Less...");
        }
        else {
            $(this).parent().children(':first-child').addClass("less");
            $(this).parent().children(':first-child').removeClass("more");
            $(this).html("More...");
        }
    });
});

/**
 * Catch each phase of the swipe.
 * move : we drag the div
 * cancel : we animate back to where we were
 * end : we animate to the next image
 */
function swipeStatus(event, phase, direction, distance) {
    //If we are moving before swipe, and we are going L or R in X mode, or U or D in Y mode then drag.
    if (phase == "move" && (direction == "up" || direction == "down")) {
        var duration = 0;

        if (direction == "up") {
            // chagne background image
            $('#main_page').css('background-image', 'url(' + img_list[img_idx] + ')');
        }
        else if (direction == "down") {
            // chagne background image
            $('#main_page').css('background-image', 'url(' + img_list[img_idx] + ')');
        }
    }
    else if (phase == "cancel") {
    }
    else if (phase == "end") {

        if (direction == "up") {
            // decrease the message index
            img_idx--;
            // sanity check
            if (img_idx < 0) {
                img_idx = 0;
                // disable the button
                // $(this).addClass('ui-disabled');
            }
        }
        else if (direction == "down") {
            // increase the message index
            img_idx++;
            // sanity check
            if (img_idx >= max_num_images) {
                img_idx = max_num_images - 1;
                // disable the button
                // $(this).addClass('ui-disabled');
            }
        }
    }


    if (phase == "move" && (direction == "left" || direction == "right")) {
        var duration = 0;

        if (direction == "left") {
            // chagne background image
            $('#message_box').html(messages[msg_idx]);
        }
        else if (direction == "right") {
            // chagne background image
            $('#message_box').html(messages[msg_idx]);
        }

    }
    else if (phase == "end") {
        if (direction == "left") {
            // increase the message index
            msg_idx++;
            // sanity check
            if (msg_idx >= max_num_messages) {
                msg_idx = max_num_messages - 1;
            }

        }
        else if (direction == "right") {
            // decrease the message index
            msg_idx--;
            // sanity check
            if (msg_idx < 0) {
                msg_idx = 0;
            }
        }
    }
    else if (phase == "cancel") {
    }
}