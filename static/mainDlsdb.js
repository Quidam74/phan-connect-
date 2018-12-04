$(document).ready(function(){
  // test();
  getListData();
  getLastData();
  setInterval(function(){
    getListData();
    getLastData();
  },5000)
});

function getListData(){
  $.ajax({
    url: 'https://dans-la-salle-de-bains.eu-gb.mybluemix.net/api/value/list',
    dataType: 'json',
    type:'GET',
    headers: {
      'accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
    },
    success: function(data) {
      listData(data);
    }
  })
}
function getLastData(){
  $.ajax({
    url: 'https://dans-la-salle-de-bains.eu-gb.mybluemix.net/api/value/last',
    dataType: 'json',
    type:'GET',
    headers: {
      'accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
    },
    success: function(data) {
      lastData(data);
    }
  })
}

function listData(data){
  var svgns = "http://www.w3.org/2000/svg"
  var container = document.querySelector('.graphique > svg > g');
  container.innerHTML = ''
  const values = data.values.slice(0, 40)
  var x = 10;

  values.reverse().map(value => {
    const circle = document.createElementNS(svgns,'circle');
    circle.setAttribute("r", 5);
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", (100*3.8 - value.temperature * 8))
    circle.classList.add('circle');
    container.prepend(circle);
    x += 25;
  })
}
//recupère et stocke dans div dernière données
function lastData(data){
  let tempValue = document.querySelector('span.temp-value');
  let dewValue = document.querySelector('span.dew-value');
  let humValue = document.querySelector('span.hum-value');

  tempValue.innerHTML = Math.floor(data.temperature*10)/10+"°C";
  dewValue.innerHTML = Math.floor(data.dew_point*10)/10+"°C";
  humValue.innerHTML = Math.floor(data.humidity*10)/10+"%";

    if (eval(data.temperature) >= 30) {
        tempValue.classList.add("rouge");
    } else if (eval(data.temperature) <= 15){
        tempValue.classList.add("bleu");
    } else {
    tempValue.classList.remove("bleu");
    tempValue.classList.remove("rouge");
    }
}
