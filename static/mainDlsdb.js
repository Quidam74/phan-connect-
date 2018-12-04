
$(document).ready(function(){
  console.log(getLastData());
  getTemp();
});
function getLastData(){
  $.get( "https://dans-la-salle-de-bains.eu-gb.mybluemix.net/api/value/last", function(data) {
      return data
    })
}

function getTemp(){
  $.ajax({
    url: 'https://dans-la-salle-de-bains.eu-gb.mybluemix.net/api/temperature',
    dataType: 'json',
    type:'GET',
    headers: {
      'accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
    },
    success: function(data) {
      console.log(data)
    }
  })
}
