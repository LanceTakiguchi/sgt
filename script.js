/**
 * Define all global variables here
 */
/**
 * current_student_index - a global index number that tells what the index of the last student was
 * Starts at negative 1 as when a student is added, it will always increment, putting the first student as index 0
 * @type {number}
 */
var current_student_index = -1;
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [];
/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds = [];
/**
 * ajax_data - Used to hold the results from the server call
 * @type {null} - Will be an object with and array with an object
 */
var ajax_data = null;
/**
 * addClicked - Event Handler when user clicks the add button
 */
function addClicked(){
    $("#addButton").click(function(){
        addStudent(); // ** Add student
        deleteClicked(); // ** Add delete functionality
    });
}
/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked(){
    $("#cancelButton").click(function(){
        $("#studentName").val("");
        $("#course").val("");
        $("#studentGrade").val("");
    });
}
/**
 * Grab server data on click
 */
function serverClicked(){
    $("#serverButton").click(obtainServerData);
}
/**
 * The functionality of the "Get Server Data" button. Waits for results from the AJAX call and then adds the students to the array and table
 */
function obtainServerData(){
    Call_LearningFuze();
    /**
     * Used to wait for the ajax data to be saved in the global ajax_data
     */
    function wait(){
        if (ajax_data == null){
            setTimeout(wait, 10); // ** Note: I feel like a recursion genius XD
        }else {
            // ** The data was saved. Now use the data.
            for (var student_index in ajax_data.data) {
                var name = ajax_data.data[student_index].name;
                var course = ajax_data.data[student_index].course;
                var grade = ajax_data.data[student_index].grade;
                var student = {student: name, course: course, grade: grade};
                student_array.push(student);
                current_student_index++;
                addStudentToDom(student);
                displayAverage();
                deleteClicked();
            }
        }
    }
    wait(); // ** Recursive call to check again for the ajax data.
}
/**
 * deleteClicked - Event Handler when user clicks the cancel button, should remove from student array and delete the student's DOM row
 */
function deleteClicked(){
    $(".student-list .btn.btn-danger:last").click(function(){ // ** If not last, it will give every existing delete button a new click handler.
        var delete_index = $(this).parent().parent().index();
        student_array.splice(delete_index, 1);
        $(this).parent().parent().remove(); // ** Deletes the row it's in
    });
}
/**
 * Removes the student object from student_array
 * @param {number} index The index which holds the student whose existence is no longer tolerable.
 */
function removeStudent(index){
    student_array.slice(index, 1);;
}
/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent(){
    var name = $("#studentName").val();
    var course = $("#course").val();
    var grade = $("#studentGrade").val();
    var new_id = 0;
    if(inputIds.length === 0){
        inputIds.splice(0, 0, new_id);
    }else{
        for(var id_index in inputIds){
            if(new_id == inputIds[id_index]){
                new_id++;
            }else{
                inputIds.splice(id_index, 0, new_id);
                break;
            }
        }
    }
    var student = {student: name, course: course, grade: grade, id: new_id};
    student_array.push(student);
    current_student_index++;
    addStudentToDom(student);
    displayAverage();
    return undefined; // ** Why?
}
/**
 * Function to display the calculated average onto the DOM
 */
function displayAverage(){
    var average = calculateAverage(); // ** TODO: reallocate this action to another part of the code
    $("div div small span").html(average);
}
/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */

/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage(){
    var sum = 0; // ** Holds the total of all the grades added together
    for(var index in student_array){
        sum += Number(student_array[index].grade);
    }
    return Math.round(sum / student_array.length);
}
/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData(){
    calculateAverage();
    updateStudentList();
}
/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList(){
    //**TODO updateStudentList
}
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom(studentObj){
    var student_column = "<td>" + studentObj.student + "</td>";
    var course_column = "<td>" + studentObj.course + "</td>";
    var grade_column = "<td>" + studentObj.grade + "</td>";
    var delete_column = "<td><button type='button' class='btn btn-danger' onclick=''>Delete</button></td>";
    var row = "<tr>" + student_column + course_column + grade_column + delete_column + "</tr>";
    $(".student-list tbody").append(row);
}
/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset(){
    student_array = [];
    inputIds = [];
    //TODO: reset inputs
    //TODO: reset dom
}
function Call_LearningFuze(){ // ** TODO Grab the response (Might need API key)
    //console.log('Calling LearningFuze');
    var ajax_return = null; // Will hold the AJAX return
    $.ajax({
        url: 'http://s-apis.learningfuze.com/sgt/get',
        dataType: 'json',
        method: 'post',
        cache: false,
        data: {api_key: "Yd2V1lB6e5"},
        success: function(response){
            // console.log('Data retrieval successfully');
            ajax_data = response;
        },
        error: function(response){
            console.log('ajax error!')
        }
    });  //end of the ajax call
}
/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function () {
    addClicked();
    cancelClicked();
    serverClicked();
    obtainServerData();
});