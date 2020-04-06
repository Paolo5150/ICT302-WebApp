// Generic function

var address = "http://localhost/ict302-webapp/"
//var address = "https://unreckoned-worry.000webhostapp.com/"

/**
 * 
 * @param {*} to        The target script (eg. server/login.php)
 * @param {*} dataIn    The data to be passed
 * @param {*} onSuccess Callback for successfull request (one argument for the response)
 * @param {*} onError Callback for successfull request (3 arguments: data, textStatus, error). "data.status" will give error code, "error" will give error description
 */
function DoGet(to, data, onSuccess, onError)
{
  $.ajax({
      url: address + to,
      type: "GET",
      timeout: 5000,
      data: data,
      success: function(response) { onSuccess(response) },
      error: function(data, textStatus, errorMessage) {
        onError(data, textStatus, errorMessage) 
      }
  })    
}
/**
 * 
 * @param {*} to        The target script (eg. server/login.php)
 * @param {*} data    The data to be passed
 * @param {*} onSuccess Callback for successfull request (one argument for the response)
 * @param {*} onError Callback for successfull request (3 arguments: data, textStatus, error). "data.status" will give error code, "error" will give error description
 */
function DoPost(to, data, onSuccess, onError)
{
  $.ajax({
      url: address + to,
      type: "POST",
      timeout: 5000,
      ContentType: 'application/json',
      data: dataIn,
      success: function(response) { onSuccess(response) },
      error: function(data, textStatus, error) {     

          onError(data, textStatus, error)
      }
  })    
}
