/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');

var conversion = {"가평": "Gapyeong",
									"흥천": "Heungcheon",
									"경안천": "Gyeongancheon",
									"구리": "Guri",
									"여주": "Yeoju",
									"원주": "Wonju",
									"평창강": "Pyeongchanggang",
									"한탄강": "Hantan-gang",
									"서상": "Seosang",
									"강천": "Gangcheon",
									"의암호": "Uiamho",
									"신천": "Shincheon",
									"충주": "Chungju",
									"성서": "Seongseo",
									"고령": "Goryeong",
									"왜관": "Waegwan",
									"강창": "Gangchang",
									"적포": "Jeokpo",
									"청암": "Cheong-am",
									"칠서": "Chilseo",
									"창암": "Chang-am",
									"다산": "Dasan",
									"남천": "Namcheon",
									"안동": "Andong",
									"해평": "Haepyeong",
									"진주": "Jinju",
									"능서": "Neungseo",
									"갑천": "Gabcheon",
									"대청호": "Daecheongho",
									"공주": "Gongju",
									"부여": "Buyeo",
									"미호천": "Mihocheon",
									"장계": "Janggye",
									"용담호": "Yongdamho",
									"현도": "Hyeondo",
									"옥천천": "Okcheoncheon",
									"이원": "Iwon",
									"봉황천": "Bonghwangcheon",
									"주암호": "Juamho",
									"나주": "Naju",
									"서창교": "Seochanggyo",
									"옥정호": "Okjeongho",
									"용봉": "Yongbong",
									"구례": "Gurye",
									"탐진호": "Tamjinho",
									"인제": "Inje",
									"미산": "Misan",
									"포천": "Pocheon",
									"풍양": "Pung-yang",
									"칠곡": "Chilgok",
									"상동": "Sangsong",
									"신암": "Sinam",
									"도개": "Dogae",
									"회상": "Hoesang",
									"남면": "Nammyeon",
									"우치": "Uchi",
									"단양": "Danyang",
									"화천": "Hwacheon",
									"봉화": "Bonghwa",
									"동복호": "Dongbokho",
									"구미": "Gumi",
									"달천": "Dalcheon",
									"청미천": "Cheongmicheon",
									"복하천": "Bokhacheon",
									"안동댐하류": "Andongdaemharyu",
									"남강": "Namgang"};

var width = 144;
var watchinfo;
if(Pebble.getActiveWatchInfo) {
	watchinfo = Pebble.getActiveWatchInfo();
	if (watchinfo.platform == 'chalk') width = 180;
} else {
	width = 144;
} 

var textTitle = new UI.Text({
	position: new Vector2(0, 0),
	size: new Vector2(width, 35),
	text : 'HangangSwim',  
	font: 'Gothic 28 Bold',
	color: 'Black',
	textAlign: 'center',
	backgroundColor: 'White'
});

var textTime = new UI.Text({
	position: new Vector2(0, 35),
	size: new Vector2(width, 20),
	text : '',  
	font: 'Gothic 14',
	color: 'Dark Candy Apple Red',
	textAlign: 'center',
	backgroundColor: 'White'
});

var textLabel1 = new UI.Text({
	position: new Vector2(0, 55),
	size: new Vector2(width, 20),
	text : 'Closest point',  
	font: 'Gothic 14 Bold',
	color: 'White',
	textAlign: 'center',
	backgroundColor: 'Electric Ultramarine'
});

var textLocation = new UI.Text({
	position: new Vector2(0, 75),
	size: new Vector2(width, 19),
	text : 'Fetching data',  
	font: 'Gothic 14 Bold',
	color: 'Cobalt Blue',
	textAlign: 'center',
	backgroundColor: 'White'
});

var textLabel2 = new UI.Text({
	position: new Vector2(0, 94),
	size: new Vector2(width, 20),
	text : 'Water temperature',  
	font: 'Gothic 14 Bold',
	color: 'White',
	textAlign: 'center',
	backgroundColor: 'Electric Ultramarine'
});

var textTemp = new UI.Text({
	position: new Vector2(0, 114),
	size: new Vector2(width, 70),
	text : 'Fetching data',  
	font: 'Gothic 24 Bold',
	color: 'Cobalt Blue',
	textAlign: 'center',
	backgroundColor: 'White'
});

var window = new UI.Window({
	fullscreen: false
});

window.add(textTitle);
window.add(textLabel1);
window.add(textLocation);
window.add(textLabel2);
window.add(textTemp);
window.add(textTime);
window.show();

var tmpMode = 0;
var tmp = 0;

var refresh = function() {
	switch (tmpMode) {
		case 0:
			textTemp.text((0|tmp*100)/100 + '°C');
			break;
		case 1:
			textTemp.text((0|(tmp + 273.15)*100)/100 + 'K');
			break;
		case 2:
			textTemp.text((0|(tmp * 1.8 + 32)*100)/100 + '°F');
			break;
	}
};

function locationSuccess(pos) {
	var Lat = pos.coords.latitude, Long = pos.coords.longitude;
	var request = new XMLHttpRequest();
	request.onload = function() {
		try {
			var json = JSON.parse(this.responseText);
			textLocation.text(conversion[json.name]);
			tmp = json.temp;
			refresh();
			var dateRef = new Date(json.time);
			var minute = dateRef.getMinutes();
			if (minute < 10) minute = '0' + minute;
			textTime.text('Updated: ' + dateRef.getFullYear() + '-' + (dateRef.getMonth()+1) + '-' + dateRef.getDate() + ' ' + dateRef.getHours() + ':' + minute);
		} catch (e) {
			textLocation.text('Error fetching data');
		}
	};
	request.open('GET', 'https://0101010101.com/api/temperature/?lat=' + Lat + '&lng=' + Long, true);
	request.send();
}   
function locationError(err) {
	textLocation.text('Error getting location');
}

var locationOptions = {
	enableHighAccuracy: true, 
	maximumAge: 10000, 
	timeout: 10000
};

navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);

window.on('click', 'up', function() {
	tmpMode = (tmpMode + 2) % 3;
	refresh();
});

window.on('click', 'down', function() {
	tmpMode = (tmpMode + 1) % 3;
	refresh();
});

window.on('click', 'select', function() {
	navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
});
