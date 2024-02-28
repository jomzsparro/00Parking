$("#update_user").submit(function(event){
  event.preventDefault();

  var unindexed_array = $(this).serializeArray();
  var data = {}

  $.map(unindexed_array, function(n, i){
      data[n['name']] = n['value']
  })


  var request = {
      "url" : `http://localhost:8080/vehicle/api/vehicleInfoPut/${data.id}`,
      "method" : "PUT",
      "data" : data
  }

  $.ajax(request).done(function(response){
      alert("Data Updated Successfully!");
  })

})