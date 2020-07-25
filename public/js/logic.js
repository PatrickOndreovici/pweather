
$(document).ready(function() {
    var engine;
    fetch("/cities")
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        engine = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            sorter:function(a, b) { 
                if (a.searches_cnt > b.searches_cnt){
                    return -1;
                }else if (a.searches_cnt < b.searches_cnt){
                    return 1;
                }else{
                    return 0;
                }
            },
            local: data
         });
         engine.initialize();
        $("#multiple-datasets .typeahead").typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            limit: 6,
            name: 'nba-teams',
            display: 'name',
            source: engine
         });
    })
    .catch(function(err){
        console.error(err);
    });
    const apiKey = "10b179455d283bed7aab50907b5e31e3";
    function GetHour(data){
        var res = "";
        for (var i = 11; i <= 15; ++i){
            res += data[i];
        }
        return res;
    }
    function GetWeather(url1, url2){
        fetch(url1)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                if (data.cod != "404"){
                    $("#location").html(data.name + ", " + data.sys.country);
                    $("#temperature").html(Math.floor(data.main.temp) + " <span>&#8451;</span>");
                    var iconUrl = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
                    $("#icon").attr("src", iconUrl);
                    $("#description").html(data.weather[0].description);
                    $("#weather").css("display", "inline-block");
                    const data2 = new URLSearchParams();
                    data2.append("cityName", data.name + ", " + data.sys.country);
                    fetch("/city", {
                        method: 'post',
                        body: data2
                    })
                    .then(function(response){
                        return response.json();
                    })
                    .then(function(data){
                        if (data.name != "null"){
                            engine.add(data);
                        }
                    });
                }

            })
            .catch(function(err){
                console.error(err);
            });
        fetch(url2)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                if (data.cod != "404"){
                    $("#hour1").html(GetHour(data.list[0].dt_txt));
                    $("#hour2").html(GetHour(data.list[1].dt_txt));
                    $("#hour3").html(GetHour(data.list[2].dt_txt));
                    $("#temp1").html(Math.floor(data.list[0].main.temp) + " <span>&#8451;</span>");
                    $("#temp2").html(Math.floor(data.list[1].main.temp) + " <span>&#8451;</span>");
                    $("#temp3").html(Math.floor(data.list[2].main.temp) + " <span>&#8451;</span>");
                    iconUrl = "http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png";
                    $("#icon1").attr("src", iconUrl);
                    iconUrl = "http://openweathermap.org/img/wn/" + data.list[1].weather[0].icon + "@2x.png";
                    $("#icon2").attr("src", iconUrl);
                    iconUrl = "http://openweathermap.org/img/wn/" + data.list[2].weather[0].icon + "@2x.png";
                    $("#icon3").attr("src", iconUrl);
                }
            })
            .catch(function(err){
                console.error(err);
            });
    }
    function GetWeatherByCity(city){
        var url1 = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric" + "&appid=" + apiKey;
        var url2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric" + "&appid=" + apiKey;
        GetWeather(url1, url2);
    }
    function GetCurrentCityWeather(){
        function success(position) {
            const latitude  = position.coords.latitude;
            const longitude = position.coords.longitude;
            var url1 = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=metric" + "&appid=" + apiKey;
            var url2 = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=metric" + "&appid=" + apiKey;
            GetWeather(url1, url2);
          }

          function error() {
    
          }
        
          if(!navigator.geolocation) {
    
          } else {
    
            navigator.geolocation.getCurrentPosition(success, error);
          }
    }

    GetCurrentCityWeather();
    $("#search").submit(function(){
        var city = $(this).serializeArray()[0].value;
        GetWeatherByCity(city);
        return false;
    });
});
