
$(document).ready(function(){
  getListData();
  getLastData();
});
// function getLastData(){
//   $.get( "https://dans-la-salle-de-bains.eu-gb.mybluemix.net/api/value/last", function(data) {
//       return data
//     })
// }

function getListData(){
  $.ajax({
    url: 'https://dans-la-salle-de-bains.eu-gb.mybluemix.net/api/value/list',
    //url: 'https://dans-la-salle-de-bains.eu-gb.mybluemix.net/api/temperature',
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
    //url: 'https://dans-la-salle-de-bains.eu-gb.mybluemix.net/api/temperature',
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
  let divGraphiquePoint = document.querySelector('div#graphiquePoint');
  //$.each(data.element,function(e){
    //console.log(e);
  //})
}
//recupère et stocke dans div dernière données
function lastData(data){
  let tempValue = document.querySelector('div.temp-value');
  let dewValue = document.querySelector('div.dew-value');
  let humValue = document.querySelector('div.hum-value');
  tempValue.innerHTML = data.temperature;
  dewValue.innerHTML = date.dew;
  humValue.innerHTML = data.humidity;



  //let divCurrentDate = document.querySelector('div.time-value');
  //var d = new Date(Date.parse(data.timestamp));
  //divCurrentDate.innerHTML = 'le : ' + d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() + ' à ' + d.getHours() + ':' + d.getMinutes();

}
