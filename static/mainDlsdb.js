
$(document).ready(function(){
  function getTemp(){
    $.ajax({
      url: 'https://dans-la-salle-de-bains.eu-gb.mybluemix.net/api/temperature',
      dataType: 'json',
      type:'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
      },
      success: function(data) {
        console.log(data)
      }
    })
  }

  getTemp();
});
