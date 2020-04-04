// Generic function

var address = "http://localhost/ict302-server/"
//var address = "https://unreckoned-worry.000webhostapp.com/"

function DoGet(to, data, onSuccess)
{
  $.ajax({
      url: address + to,
      type: "GET",
      timeout: 5000,
      data: data,
      success: function(response) { onSuccess(response) },
      error: function(x, t, m) {


          alert("An error occurred. Please try again later")
         /* if(t==="timeout") {
              alert("got timeout");
          } else {
              alert(t);
          }*/
      }
  })    
}

function DoPost(to, dataIn, onSuccess, onError)
{
  $.ajax({
      url: address + to,
      type: "POST",
      timeout: 15000,
      ContentType: 'application/json',
      data: dataIn,
      success: function(response) { onSuccess(response) },
      error: function(x, t, m) {

          onError(x)
         // alert("An error occurred. Please try again later")
         /* if(t==="timeout") {
              alert("got timeout");
          } else {
              alert(t);
          }*/
      }
  })    
}
