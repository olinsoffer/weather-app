function weatherApp() {

    let STORAGE_ID = 'weather-app';
    let saveToLocalStorage = function () {
        localStorage.setItem(STORAGE_ID, JSON.stringify(posts));
    }

    let getFromLocalStorage = function () {
        return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
    }

    let posts = getFromLocalStorage();

    let source = $('#posts-template').html();
    let template = Handlebars.compile(source);

    let _kelvinToF = function (kelvin) {
        let f = 1.8 * (kelvin - 273) + 32;
        return f;
    }

    let _kelvinToC = function (kelvin) {
        let c = kelvin - 273.15;
        return c;
    }

    let $postsDiv = $('.results');

    let _renderPosts = function () {
        $postsDiv.empty();

        for (let i = 0, l = posts.length; i < l; i++) {
            newHTML = template(posts[i]);
            $postsDiv.append(newHTML);
            $('.post-comment-btn').off();
            $('.post-comment-btn').on('click', function () {
                let text = $(this).siblings('.comment-input').val();
                let index = $(this).closest('.post').index();

                var a = $(".content").index($(this).closest('.content'))
                createComment(text, index);
            });
        }
        _renderComments();
    }

    let _renderComments = function () {
        $('.post-comments').empty();

        for (let i = 0, l = posts.length; i < l; i++) {
            let post = posts[i],
                $post = $('.post').eq(i);
            for (let j = 0; j < post.comments.length; j += 1) {
                let comment = post.comments[j];
                $post.find('.post-comments').append('<p class="comment">' + comment.text +
                    '<button class="btn btn-danger btn-sm remove-comment">Remove Comment</button>' + '</p>'
                );
            }
        }

    };


    let createPost = function (data) {
        let currentDate = new Date();
        postData = {
            cityName: data.name,
            temp: {
                celsius: Math.round(_kelvinToC(data.main.temp)),
                fahrenheit: Math.round(_kelvinToF(data.main.temp))
            },
            currentDate: currentDate.getMonth() + 1 + '/' + currentDate.getDate() + '/' + currentDate.getFullYear(),
            currentTime: currentDate.getHours() + ":" + currentDate.getMinutes(),
            comments: []
        };
        posts.push(postData);
        saveToLocalStorage();
        _renderPosts();
    };

    let createComment = function (text, postIndex) {
        let comment = { text: text };
        posts[postIndex].comments.push(comment);
        saveToLocalStorage();
        _renderComments();
    };

    let key = '&APPID=6e5f87e9f48cd8d0faf5b74e75a28823';

    let fetch = function () {
        let searchInput = $('#search-input').val(),
            url;
        if (isNaN(searchInput)) {
            url = 'http://api.openweathermap.org/data/2.5/weather?q='
        }
        else {
            url = ' http://api.openweathermap.org/data/2.5/weather?zip=';
        }

        $.ajax({
            method: "GET",
            url: url + searchInput + key,
            success: function (data) {
                createPost(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    };

    _renderPosts();

    return {
        fetch: fetch,
        // createComment: createComment
        posts: posts
    }
}

var input = document.getElementById('search-input');

var autocomplete = new google.maps.places.Autocomplete(input);



let app = weatherApp();

$('#gettemp-button').on('click', app.fetch);

// $('.post-comment-btn').on('click', function () {
//     let text = $(this).siblings('.comment-input').val(),
//         index = $(this).closest('.post').index();
//     app.createComment(text, index);
// });

$('#clear-empty-btn').on('click', function () {
    localStorage.clear();
    location.reload();
})

