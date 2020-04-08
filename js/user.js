$(document).ready(function () {



    var id = location.search.split('&')[0].substring(1,location.search.length);
    var token = location.search.split('&')[1];

    var myData = {
        MurdochUserNumber: id,
        Token: token
    }
    //Check if link is valid
    DoPost("server/userContent.php",myData,(response)=>{

        console.log(response)
    

    },
    (data, status, error)=>
    {
        alert("An error occurred")
    } 
    )


 
})
