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
    var selectElement = '';
    if (question.selected) {
      selectElement += '<td><input type="button" id="buttonQuestion'+question.questionId+'" class="btn btn-default disabled" value="Added" /></td>';
    } else {
      selectElement += '<td><input type="button" id="buttonQuestion'+question.questionId+'" class="btn btn-success" value="Add to quiz" onClick="addQuestionToForm('+question.questionId+')" /></td>'
    }
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
            '</div></td>'+
            selectElement);
  });
}

function addQuestionToForm(qId){
  var questionToAdd = questions.filter(el => el.questionId == qId)[0];
  questionToAdd.selected = true;
  $('#buttonQuestion'+qId).removeClass('btn-success');
  $('#buttonQuestion'+qId).addClass('btn-default disabled');
  $('#buttonQuestion'+qId).attr('value', 'Added');

  $('<div>'+
    '<label>Question '+($('#questionsContainer label').length+1)+':</label> &nbsp;&nbsp;'+
    '<text>'+questionToAdd.question+'</text>'+
    '&nbsp;&nbsp; <button type="button" onClick="swapUp('+$('#questionsContainer label').length+')" class="btn btn-default btn-sm" style="padding-top: 0px; padding-bottom: 0px; padding-left: 5px; padding-right: 5px;" >'+
    '<span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span>'+
    '</button>'+
    '<button type="button" onClick="swapDown('+$('#questionsContainer label').length+')" class="btn btn-default btn-sm" style="padding-top: 0px; padding-bottom: 0px; padding-left: 5px; padding-right: 5px;" >'+
    '<span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>'+
    '</button>'+
    '<input type="hidden" name="quizQuestions['+$('#questionsContainer label').length+']" value="'+qId+'" />')
    .appendTo('#questionsContainer');
}

function removeQuestionForm() {
  if($('#questionsContainer').children().length > 0){
    var qId = $('#questionsContainer').children().last().children().last().val();
    $('#questionsContainer').children().last().remove()
    questions.filter(el => el.questionId == qId)[0].selected = false;
    $('#buttonQuestion'+qId).removeClass('btn-default disabled');
    $('#buttonQuestion'+qId).addClass('btn-success');
    $('#buttonQuestion'+qId).attr('value', 'Add to quiz');
  }
}

function swapUp(currentIndex) {
  if(currentIndex > 0){
      var actual = $('#questionsContainer').children(':nth-of-type('+(currentIndex+1)+')').children('text').text();
      var previous = $('#questionsContainer').children(':nth-of-type('+(currentIndex)+')').children('text').text();
      $('#questionsContainer').children(':nth-of-type('+(currentIndex+1)+')').children('text').text(previous);
      $('#questionsContainer').children(':nth-of-type('+(currentIndex)+')').children('text').text(actual);
      var actualValue = $('#questionsContainer').children(':nth-of-type('+(currentIndex+1)+')').children().last().val();
      var previousValue = $('#questionsContainer').children(':nth-of-type('+(currentIndex)+')').children().last().val();
      $('#questionsContainer').children(':nth-of-type('+(currentIndex+1)+')').children().last().val(previousValue);
      $('#questionsContainer').children(':nth-of-type('+(currentIndex)+')').children().last().val(actualValue);
  }
}

function swapDown(currentIndex) {
  if(currentIndex+1 < $('#questionsContainer').children().length){
    var actual = $('#questionsContainer').children(':nth-of-type('+(currentIndex+1)+')').children('text').text();
    var next = $('#questionsContainer').children(':nth-of-type('+(currentIndex+2)+')').children('text').text();
    $('#questionsContainer').children(':nth-of-type('+(currentIndex+1)+')').children('text').text(next);
    $('#questionsContainer').children(':nth-of-type('+(currentIndex+2)+')').children('text').text(actual);
    var actualValue = $('#questionsContainer').children(':nth-of-type('+(currentIndex+1)+')').children().last().val();
    var nextValue = $('#questionsContainer').children(':nth-of-type('+(currentIndex+2)+')').children().last().val();
    $('#questionsContainer').children(':nth-of-type('+(currentIndex+1)+')').children().last().val(nextValue);
    $('#questionsContainer').children(':nth-of-type('+(currentIndex+2)+')').children().last().val(actualValue);
  }
}

function validateQuizForm() {
  if($('#questionsContainer').children().length == 0){
    $('#addQuestionError').css("display", "block");
    return false
  }
}

function cancelAdd(){

  window.location.href = '/';
}
