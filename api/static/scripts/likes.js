// Handler of Like Post SHOW button click event
$(".myCustom_like_post_show").click(function () {
    var clockedButtonInformation = $(this).attr("data-bs-target");
    var postID_index = clockedButtonInformation.indexOf("post_");
    var poster_index = clockedButtonInformation.indexOf("_author_");
    var postID = clockedButtonInformation.substring(postID_index + 5, poster_index);
    var poster = clockedButtonInformation.substring(poster_index + 8);

    var authorID = $(this).attr("var");

    $.ajax({
        csrfmiddlewaretoken: '{{ csrf_token }}',
        url: "api/author/" + poster + "/posts/" + postID + "/likes",
        type: "GET",

        success: function(data) {
            var count = 0;
            var html = "";
            var AmILiked = false;

            for (var like of data) {
                count += 1;
                html += "<hr>" + '<div class="">';
                html += '<a href="profile/' + like['author'] + '" ';
                html += 'style="text-decoration: none; font-size: 14pt;">';
                html += like['summary'].substring(0, like['summary'].indexOf(" Like"));
                html += "</a> Liked this Post</div>";

                if (AmILiked == false && like['author'].match(authorID)) {
                    $("#like_post_content_" + postID).html("You Liked This Post");
                    $("#button_like_post_" + postID + "_author_" + authorID).remove();
                    AmILiked = true;
                }
            }

            if (count == 0) {
                html = "<hr><h5>No one Like this post so far, T^T</h5>";
            }

            $("#like_post_" + postID).html(html);
        }
    })
        
});

// Handler of Like Post SEND button click event
$(".myCustom_button_like_post_send").click(function () {
    var clockedButtonInformation = $(this).attr("id");
    var postID_index = clockedButtonInformation.indexOf("post_");
    var authorID_index = clockedButtonInformation.indexOf("_author_");
    var postID = clockedButtonInformation.substring(postID_index + 5, authorID_index);
    var authorID = clockedButtonInformation.substring(authorID_index + 8);

    var HOSTNAME = $("#like_post_hostname_" + postID).attr("value");
    var poster = $("#like_post_hostname_" + postID).attr("var");

    $.ajax({
        csrfmiddlewaretoken: '{{ csrf_token }}',
        url: "api/author/" + authorID + "/inbox/",
        type: "POST",
        data: { "summary": authorID + " Likes your post", "object": HOSTNAME + '/author/' + poster + '/posts/' + postID },

        success: function(data) {
            
            $.ajax({
                csrfmiddlewaretoken: '{{ csrf_token }}',
                url: "api/author/" + poster + "/posts/" + postID + "/likes",
                type: "GET",

                success: function(data) {
                    var html = "";
                    var AmILiked = false;

                    for (var like of data) {
                        html += "<hr>" + '<div class="">';
                        html += '<a href="profile/' + like['author'] + '" ';
                        html += 'style="text-decoration: none; font-size: 14pt;">';
                        html += like['summary'].substring(0, like['summary'].indexOf(" Like"));
                        html += "</a> Liked this Post</div>";

                        if (AmILiked == false && like['author'].match(authorID)) {
                            $("#like_post_content_" + postID).html("You Liked This Post");
                            $("#button_like_post_" + postID + "_author_" + authorID).remove();
                            AmILiked = true;
                        }
                    }

                    $("#like_post_" + postID).html(html);
                }
            })

        }

    })
});

// Handler of Like Comment SHOW button click event
$("#myCustom_container_area").on("click", ".myCustom_like_comment_show", function () {
    var clockedButtonInformation = $(this).attr("data-bs-target");
    var postID_index = clockedButtonInformation.indexOf("post_");
    var poster_index = clockedButtonInformation.indexOf("_author_");
    var commentID_index = clockedButtonInformation.indexOf("_comment_");
    var postID = clockedButtonInformation.substring(postID_index + 5, poster_index);
    var poster = clockedButtonInformation.substring(poster_index + 8, commentID_index);
    var commentID = clockedButtonInformation.substring(commentID_index + 9);

    var authorID = $(this).attr("var");

    $.ajax({
        csrfmiddlewaretoken: '{{ csrf_token }}',
        url: "api/author/" + poster + "/posts/" + postID + "/comments/" + commentID + "/likes",
        type: "GET",

        success: function(data) {
            var count = 0;
            var html = "";
            var AmILiked = false;

            for (var like of data) {
                count += 1;
                html += "<hr>" + '<div class="">';
                html += '<a href="profile/' + like['author'] + '" ';
                html += 'style="text-decoration: none; font-size: 14pt;">';
                html += like['summary'].substring(0, like['summary'].indexOf(" Like"));
                html += "</a> Liked this Comment</div>";

                if (AmILiked == false && like['author'].match(authorID)) {
                    $("#like_comment_content_" + commentID).html("You Liked This Comment");
                    $("#button_like_post_" + postID + "_author_" + authorID + "_comment_" + commentID).remove();
                    AmILiked = true;
                }
            }

            if (count == 0) {
                html = "<hr><h5>No one Like this comment so far, T^T</h5>";
            }

            $("#like_comment_" + commentID).html(html);
        }
    })
        
});

// Handler of Like Comment SEND button click event
$("#myCustom_container_area").on("click", ".myCustom_button_like_comment_send", function () {
    var clockedButtonInformation = $(this).attr("id");
    var postID_index = clockedButtonInformation.indexOf("post_");
    var authorID_index = clockedButtonInformation.indexOf("_author_");
    var commentID_index = clockedButtonInformation.indexOf("_comment_");
    var postID = clockedButtonInformation.substring(postID_index + 5, authorID_index);
    var authorID = clockedButtonInformation.substring(authorID_index + 8, commentID_index);
    var commentID = clockedButtonInformation.substring(commentID_index + 9);

    var HOSTNAME = $("#like_comment_hostname_" + commentID).attr("value");
    var poster = $("#like_comment_hostname_" + commentID).attr("var");

    $.ajax({
        csrfmiddlewaretoken: '{{ csrf_token }}',
        url: "api/author/" + authorID + "/inbox/",
        type: "POST",
        data: { "summary": authorID + " Likes your comment", 
            "object": HOSTNAME + '/author/' + poster + '/posts/' + postID + '/comments/' + commentID },

        success: function(data) {
            
            $.ajax({
                csrfmiddlewaretoken: '{{ csrf_token }}',
                url: "api/author/" + poster + "/posts/" + postID + "/comments/" + commentID + "/likes",
                type: "GET",

                success: function(data) {
                    var html = "";
                    var AmILiked = false;

                    for (var like of data) {
                        html += "<hr>" + '<div class="">';
                        html += '<a href="profile/' + like['author'] + '" ';
                        html += 'style="text-decoration: none; font-size: 14pt;">';
                        html += like['summary'].substring(0, like['summary'].indexOf(" Like"));
                        html += "</a> Liked this Comment</div>";

                        if (AmILiked == false && like['author'].match(authorID)) {
                            $("#like_comment_content_" + commentID).html("You Liked This Comment");
                            $("#button_like_post_" + postID + "_author_" + authorID + "_comment_" + commentID).remove();
                            AmILiked = true;
                        }
                    }

                    $("#like_comment_" + commentID).html(html);
                }
            })

        }

    })
});