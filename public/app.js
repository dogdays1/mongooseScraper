// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
   // for (var i = 0; i < data.length; i++) {   too many!!! limit to 20
   for (var i = 0; i < 20; i++) {
     $("#articles").append("<p data-id='" + data[i]._id + "'><strong>" + data[i].title + "</strong><br /><i>" + data[i].summary + "</i><br /><small>" + data[i].link + "</small></p>");

    }
  });
  
  
  // Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    console.log("p hit")
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    //create notes field
      .then(function(data) {
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' class='savenote'>Save Note</button>");
        $(".existingNotes").empty()
  
        // If there's a note(s) already in the article
        if (data.note) {
          console.log(data.note)
          console.log(data.note[0].title)
          //put this code in a for loop data.note.length
          for (var i=0; i<data.note.length; i++){
          var newDiv = $("<div>")
          var newH3 =$("<h3>")
          var newP =$("<p>")
          newH3.text(data.note[i].title)
          newP.text(data.note[i].body)
         newDiv.append(newH3).append(newP).append("<button data-id='" + data._id + "' class='deletenote'>Delete Note</button>")
          console.log(newDiv)
          $(".existingNotes").append(newDiv)
         // $("#notes").append(newH3)
          //$("#notes").append(newP)

         }
          // Place the title of the note in the title input
         // $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
         // $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  $(document).on("click", ".savenote", function() {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
        console.log(data);
        $("#notes").empty();
      });
  
    // empty the note entry fields
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  $(document).on("click", ".deletenote", function() {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "DELETE",
      url: "/articles/" + thisId,
    })
      .then(function() {
        console.log("deleted")
         $("#notes").empty();
      });
  
    // empty the note entry fields
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });