var http = require('http');

var cheerio = require('cheerio');

var finish = require("finish");

var fs = require("fs");
/*
 * GET home page.
 */
exports.index = function (req, response) {

    var username = req.params.username;

    var today = new Date();
    var directory = 'cache';
    var filename = username + '_' + today.getFullYear() + today.getMonth() + today.getDate();

    var total = 0;
    var rated = 0;
    var counter = 0;
    var distribution = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var ratings = [];
    var nickname = '';
    var wished = 0;
    var watched = 0;
    var watching = 0;
    var held = 0;
    var trashed = 0;
    var avatar = '';

    var watched_subjects = [];

    function loadPage(page_number, callback) {

        var options = {
            host: 'bgm.tv',
            path: '/anime/list/' + username + '/collect?orderby=rate&page=' + page_number
        };

        http.get(options,function (res) {

            var output = '';
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                output += chunk;
            });

            res.on('end', function () {

                var $ = cheerio.load(output);
                var rx = /\(.*\/(.*)\)/g;

                var pages = 0;
                var items = $('#browserItemList>li');
                nickname = $('h1').text().replace('看过的动画', '').trim();
                avatar = $('.avatarSize75').attr('style').replace("background-image:url('", "").replace("')", "").replace("/m/", "/l/");

                var collection = $('.navSubTabs a');

                console.log(collection.length, 'collection.length');

                for (var i = 0; i < collection.length; i++) {
                    if ($(collection[i]).text().search('想看')>=0) {
                        wished = parseInt($(collection[i]).text().replace('       ', '').split(' ')[1].replace('(', '').replace(')', ''));
                    }
                    else if ($(collection[i]).text().search('看过')>=0) {
                        watched = parseInt($(collection[i]).text().replace('       ', '').split(' ')[1].replace('(', '').replace(')', ''));
                        if (watched) {
                            pages = Math.ceil(watched / 24);
                        }
                    }
                    else if ($(collection[i]).text().search('再看')>=0) {
                        watching = parseInt($(collection[i]).text().replace('       ', '').split(' ')[1].replace('(', '').replace(')', ''));

                    }
                    else if ($(collection[i]).text().search('搁置')>=0) {
                        held = parseInt($(collection[i]).text().replace('       ', '').split(' ')[1].replace('(', '').replace(')', ''));

                    }
                    else if ($(collection[i]).text().search('抛弃')>=0) {
                        trashed = parseInt($(collection[i]).text().replace('       ', '').split(' ')[1].replace('(', '').replace(')', ''));
                    }
                }
                for (var i = 0; i < items.length; i++) {
                    var class_info = $(items[i]).find('.starsinfo').attr('class');
                    var subject_name = $(items[i]).find('h3>a').text().trim();
                    var alt_name = $(items[i]).find('h3>.grey').text().trim();
                    var rate = class_info ? parseInt(class_info.split(' ')[0].split('sstars')[1]) : NaN;
                    watched_subjects.push({name: subject_name, alt_name: alt_name, rate: rate});

                    if (!isNaN(rate)) {
                        ratings.push(rate);
                        distribution[rate - 1]++;
                        total += rate;
                        rated++;
                    }
                    counter++;
                }
                callback(null, pages);
            });
        }).on('error', function (e) {

                callback(e);
            });

    }

    fs.readFile(directory + '/' + filename + '.json', 'utf8', function (err, data) {
        if (err) {
            loadPage(1, function (err, pages) {
                console.log(pages,' pages!!!!!');
                finish.ordered(function (async) {
                     for (var p = 2; p < pages + 1; p++) {
                    //for (var p = 2; p < 3; p++) {
                        async(function (done) {
                            loadPage(p, done);
                        })
                    }
                }, function (err, results) {
                    ratings.sort();
                    var average = total / rated;
                    var json_result = {username: username, nickname: nickname, avatar: avatar, wished: wished, held: held,
                        watching: watching, trashed: trashed, watched: counter, rated: rated, average: (average).toFixed(4),
                        median: calculate_median(ratings), deviation: calculate_std(ratings, average), distribution: distribution};
                    json_result.watched_subjects = watched_subjects;
                    fs.writeFile(directory + '/' + filename + '.json', JSON.stringify(json_result), function (err) {
                        return console.log(err);
                    });
                    response.json(json_result)
                })
            })
        }
        else {
            response.json(JSON.parse(data));
        }
    });
};


function calculate_std(array, mean) {
    var total = 0;
    for (var i = 0; i < array.length; i++) {
        total += Math.pow(array[i] - mean, 2);
    }
    return (Math.sqrt(total / array.length)).toFixed(4);
}

function calculate_median(array) {
    if (array.length % 2) {
        return array[parseInt(array.length / 2)];
    }
    else {
        return (array[array.length / 2 - 1] + array[array.length / 2] ) / 2;
    }
}