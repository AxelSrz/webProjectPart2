function searchByCategory(){
  var categoriesQuery = Array.from(new Set($('#categoryFilter').val().toLowerCase().split(',')));
  $('#questionsTable').empty();
  var selectedCategories = categories.filter(function(element){
    return categoriesQuery.indexOf(element.categoryName) >= 0;
  });

  questions.filter(
    el => selectedCategories.filter(
      sc => sc.questionId == el.questionId
    ).length
  ).forEach(function(question, index){
    var selectedAnswers = answers.filter(el => el.questionId == question.questionId);
    var questionCategories = categories.filter(el => el.questionId == question.questionId);
    var correctAnswer = selectedAnswers.filter(el => el.seqNo == question.correctAnswer)[0];
    var listOfAnswers = '';
    selectedAnswers.forEach(function(answer, index){
      listOfAnswers += '<li><a href="#">'+answer.answer+'</a></li>';
    });
    var listOfCategories = '';
    questionCategories.forEach(function(category, index){
      listOfCategories += '<li><a href="#">'+category.categoryName+'</a></li>';
    });
    $('#questionsTable')
    .append('<tr><td>'+question.question+'</td><td>'+correctAnswer.answer+'</td>'+
            '<td><div class="btn-group">'+
            '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
              'See all answers <span class="caret"></span>'+
            '</button>'+
            '<ul class="dropdown-menu">'+
              listOfAnswers+
            '</ul>'+
            '</div></td>'+
            '<td><div class="btn-group">'+
            '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
              'See all categories <span class="caret"></span>'+
            '</button>'+
            '<ul class="dropdown-menu">'+
              listOfCategories+
            '</ul>'+
            '</div></td>'
            );
  });
}
