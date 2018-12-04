
$(document).ready(function(){
  // test();
  getListData();
  getLastData();
  setInterval(function(){
    getListData();
    getLastData();
  },5000)
});
// function getLastData(){
//   $.get( "https://dans-la-salle-de-bains.eu-gb.mybluemix.net/api/value/last", function(data) {
//       return data
//     })
// }

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
// function test(){
//   data = [{temperature:"29"},{temperature:"35"},{temperature:"35"},{temperature:""},{temperature:"0"},{temperature:"0"},{temperature:"35"},{temperature:"35"}]
//   var i = 0;
//   var svgns = "http://www.w3.org/2000/svg"
//   var container = document.querySelector('.graphique > svg > g');
//   data.forEach(function(data){
//     let circle = document.createElementNS(svgns,'circle');
//     circle.setAttribute("r",5);
//     circle.setAttribute("cx",i);
//     circle.setAttribute("cy",80-data.temperature)
//     circle.setAttribute('style', 'color:black');
//     container.appendChild(circle);
//     console.log(circle);
//     i=i+5;
//   })
// }
function listData(data){
  var i = 0;
  var values = data.values;
  var svgns = "http://www.w3.org/2000/svg"
  var container = document.querySelector('.graphique > svg > g');
  values.forEach(function(value){
    let circle = document.createElementNS(svgns,'circle');
    circle.setAttribute("r",5);
    circle.setAttribute("cx",i);
    circle.setAttribute("cy",84-value.temperature)
    circle.classList.add('circle');
    container.appendChild(circle);
    console.log(circle);
    i=i+25;
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
  //let divCurrentDate = document.querySelector('div.time-value');
  //var d = new Date(Date.parse(data.timestamp));
  //divCurrentDate.innerHTML = 'le : ' + d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() + ' à ' + d.getHours() + ':' + d.getMinutes();

}
