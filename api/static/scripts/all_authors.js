// Handler of Page Turning
// Source: https://blog.csdn.net/a_hui_tai_lang/article/details/84137847
function page_ctrl(data_obj) {
    var obj_box = (data_obj.obj_box !== undefined) ? data_obj.obj_box : function () { return; }; //Page Dom Object
    var total_item = (data_obj.total_item !== undefined) ? parseInt(data_obj.total_item) : 0; //Total num of authors
    var per_num = (data_obj.per_num !== undefined) ? parseInt(data_obj.per_num) : 5; //Default num of authors per page
    var current_page = (data_obj.current_page !== undefined) ? parseInt(data_obj.current_page) : 1; //Current page
    var total_page = Math.ceil(total_item / per_num); //Compute the num of pages

    // Adding the content
    $(obj_box).append('<hr><div class="page_content text-center"></div><hr style="margin-bottom: 25px;">');
    // Adding the page manage
    $(obj_box).append('<div class="page_ctrl text-center"></div>');

    function page_even() {
        // Loding the data
        function change_content() {
            $.ajax({
                csrfmiddlewaretoken: '{{ csrf_token }}',
                url: "api/authors/",
                type: "GET",
                data: {"page": current_page},
                success: function(data) {
                    var count = 0;
                    var html = '';

                    for (var author of data.items) {
                        count += 1;
                        html += '<hr><a href="../profile/' + author['authorID'] + '" ';
                        html += 'style="text-decoration: none; font-size: 14pt;">' + author["displayName"] + '</a>';
                    }

                    if (count == 0) {
                        html = "<br><h4>Server has no Authors, T.T</h4><br>";
                    }
                    else {
                        html = html.substring(html.indexOf("<hr>") + 4);
                    }

                    $(obj_box).children('.page_content').html(html);
                }
            })
        }

        change_content();

        var append_html = '<button class="prev_page btn btn-primary" style="width: 100px; margin: 0 5px;">Previous</button>';

        for (var i = 0; i < total_page - 1; i++) {
            var end_lefts = 3;
            if (current_page > total_page - 5) {
                end_lefts = 7 - total_page + current_page;
            }

            if (total_page > 8 && current_page > 5 && i < current_page - end_lefts) {
                if (i < 1) {
                    append_html += '<button class="page_num btn btn-outline-primary">' + (i + 1) + '</button>';
                }
                else if (i == 1) {
                    append_html += '<span class="page_dot">•••</span>';
                }
            }
            else if (total_page > 8 && current_page < total_page - 4 && i > current_page + 1) {
                if (current_page > 5 && i == current_page + 3) {
                    append_html += '<span class="page_dot">•••</span>';
                } 
                else if (current_page < 6) {
                    if (i < 7) {
                        append_html += '<button class="page_num btn btn-outline-primary">' + (i + 1) + '</button>';
                    } 
                    else if (i == 7) {
                        append_html += '<span class="page_dot">•••</span>';
                    }
                }
            }
            else {
                if (i == current_page - 1) {
                    append_html += '<button class="page_num btn btn-outline-primary current_page">' + (i + 1) + '</button>';
                }
                else {
                    append_html += '<button class="page_num btn btn-outline-primary">' + (i + 1) + '</button>';
                }
            }
        }

        if (current_page == total_page) {
            append_html += '<button class="page_num btn btn-outline-primary current_page">' + (i + 1) + '</button>';
        } 
        else {
            append_html += '<button class="page_num btn btn-outline-primary">' + (i + 1) + '</button>';
        }

        append_html += '<button class="next_page btn btn-primary" style="width: 100px; margin: 0 5px;">Next</button><span class="page_total">';
        $(obj_box).children('.page_ctrl').append(append_html);

        if (current_page == 1) {
            $(obj_box + ' .page_ctrl .prev_page').attr('disabled', 'disabled').addClass('btn_dis');
        } 
        else {
            $(obj_box + ' .page_ctrl .prev_page').removeAttr('disabled').removeClass('btn_dis');
        }

        if (current_page == total_page) {
            $(obj_box + ' .page_ctrl .next_page').attr('disabled', 'disabled').addClass('btn_dis');
        } 
        else {
            $(obj_box + ' .page_ctrl .next_page').removeAttr('disabled').removeClass('btn_dis');
        }
    }

    page_even();

    $(obj_box + ' .page_ctrl').on('click', 'button', function () {
        var that = $(this);
        if (that.hasClass('prev_page')) {
            if (current_page != 1) {
                current_page--;
                that.parent('.page_ctrl').html('');
                page_even();
            }
        }
        else if (that.hasClass('next_page')) {
            if (current_page != total_page) {
                current_page++;
                that.parent('.page_ctrl').html('');
                page_even();
            }
        }
        else if (that.hasClass('page_num') && !that.hasClass('current_page')) {
            current_page = parseInt(that.html());
            that.parent('.page_ctrl').html('');
            page_even();
        }
        else if (that.hasClass('to_page_num')) {
            current_page = parseInt(that.siblings('.input_page_num').val());
            that.parent('.page_ctrl').html('');
            page_even();
        }
    });
}