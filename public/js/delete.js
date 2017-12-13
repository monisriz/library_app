var modalConfirm = function(callback){

  $("#btn-confirm").on("click", function(){
    $("#delModal").modal('show');
  });

  $("#modal-btn-yes").on("click", function(){
    callback(true);
    $("#delModal").modal('hide');
  });

  $("#modal-btn-no").on("click", function(){
    callback(false);
    $("#delModal").modal('hide');
  });
};

modalConfirm(function(confirm){
  if(confirm){
    $("#result").html("Delete YES");
  }else{
    $("#result").html("DELETE NO");
  }
});
