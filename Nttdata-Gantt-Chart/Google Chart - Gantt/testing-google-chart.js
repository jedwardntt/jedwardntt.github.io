data.addRows([
    ['Nuevo', 'Tarea nueva',
    null, new Date(2015, 0, 6), daysToMilliseconds(1), 100,  'Outline']
]);

chart.draw(data, options);

/*
data.addRows([
    ['Nuevo', 'Tarea nueva (duplicada)',
    null, new Date(2015, 0, 6), daysToMilliseconds(2), 100,  'Research']
]);
data.getNumberOfRows();
*/

data.removeRow(3); // Inicialmente es: 'Complete', 'Hand in paper' (nadie depende de él)

data.toJSON();

data.removeRow(2); // Es: 'Cite', 'Create bibliography' (nadie depende de él)

data.removeRow(0); // Es: 'Research', 'Find sources' (varios dependen de él)

data.addRows([
    ['Nuevo2', 'Tarea nueva2',
    null, new Date(2015, 0, 6), daysToMilliseconds(1), 100,  'Research']
]);


data.deleteTaskByID = function (taskID){
    var taskIDRowIndex = null;
    for (var i = 0; i < this.getNumberOfRows(); i++) {
        var iTaskID = this.getValue(i, 0); // column 0 means taskID
        if( iTaskID === taskID ){
            taskIDRowIndex = i; 
        }
        var dependencies = this.getValue(i, 6); // column 6 means dependencies
        if( dependencies != null ){ 
            if(dependencies.includes(taskID)){
                return false; // detele can't be performed by dependencies to taskID task
            }
        }
    }
    // If the script continues executing until this line, there is no dependencies to taskID, so we can remove the taskID
    
    if( taskIDRowIndex != null ){
        this.removeRow(taskIDRowIndex);
        return true; // delete success
    }else{
        return false; // taskId not found
    }
}

function millisecondsToDays(milliseconds) {
    return milliseconds / 1000 / 60 / 60 / 24;
}
data.printTasks = function (){
    console.log("\tTask ID\t|\tTask name\t|\tStart\t|\tEnd\t|\tDuration\t|\tDependencies");
    for (var i = 0; i < this.getNumberOfRows(); i++) {
        var s = this.getValue(i, 2); // Start
        var ss = null
        if(s != null){
            ss = s.getFullYear()+"-"+s.getMonth()+"-"+s.getDate();
        }else{ ss = "null" }
        var e = this.getValue(i, 3); // End
        var es = null
        if(e != null){
            es = e.getFullYear()+"-"+e.getMonth()+"-"+e.getDate();
        }else{ es = "null" }
        console.log(i+".\t"+
            this.getValue(i, 0)+"\t|\t"+                     // taskID
            this.getValue(i, 1)+"\t|\t"+                     // Task name
            ss+"\t|\t"+                                      // Start string
            es+"\t|\t"+                                      // End string
            ( (this.getValue(i, 4) == null)? "null" : millisecondsToDays(this.getValue(i, 4)) )+"\t|\t"+ // Duration
            this.getValue(i, 6)                             // Dependencies
        );
    }
}

data.printTasks();

function daysToMilliseconds(days) {
    return days * 24 * 60 * 60 * 1000;
}
data.updateTask = function (taskId, taskProperty, newValue){ // taskProperty values: 'Start Date', 'End Date', 'Duration', 'Percent Complete', 'Dependencies'
    var taskRow = null;
    for (var i = 0; i < this.getNumberOfRows(); i++) {
        var iTaskId = this.getValue(i, 0); // Task ID
        //console.log("i: "+i.toString+" | "+iTaskID);
        console.log(iTaskId +" // "+ taskId);
        if(iTaskId === taskId){
            //console.log("i de salida del for: "+i.toString());
            taskRow = i;
            break;
        }
    }
    var columnIndexes = [null,null,'Start Date', 'End Date', 'Duration', 'Percent Complete', 'Dependencies'];
    var propertyIndex = columnIndexes.indexOf(taskProperty);
    if( taskRow != null && propertyIndex > 0 ){
        console.log("taskRow: "+taskRow.toString()+" | propertyIndex: "+propertyIndex.toString());
        if( propertyIndex==4 && newValue != null ){ //  propertyIndex==4 means 'Duration' in days
            this.setValue(taskRow, propertyIndex, daysToMilliseconds(newValue)); 
        }else{
            this.setValue(taskRow, propertyIndex, newValue); 
        }
        return true;  // Success update
    }else{
        return false; // Update error 
    }
}

data.updateTask("Write","Duration",1);
data.printTasks();
chart.draw(data, options);

// Conversion from integer date to JavaCript Date
function integerDateToJSDate(dateInIntegerFormat){ // dateInIntegerFormat could be something like: 202301 (january 1, 2023) os 20230722 (july 22, 2023)
    var inputLegth = dateInIntegerFormat.toString().length
    console.log("inputLegth: "+inputLegth.toString());
    if( inputLegth == 6 ){
        dateInIntegerFormat = (dateInIntegerFormat*100)+1;
    }
    console.log("dateInIntegerFormat: "+dateInIntegerFormat,toString());
    if( dateInIntegerFormat.toString().length == 8 ){
        dateInIntegerFormat = (dateInIntegerFormat*100)+1;
    }
    console.log("dateInIntegerFormat: "+dateInIntegerFormat,toString());
}

integerDateToJSDate(202301);
integerDateToJSDate(20230722);


0 data.addColumn('string', 'Task ID');
1 data.addColumn('string', 'Task Name');
2 data.addColumn('date', 'Start Date');
3 data.addColumn('date', 'End Date');
4 data.addColumn('number', 'Duration');
5 data.addColumn('number', 'Percent Complete');
6 data.addColumn('string', 'Dependencies');




data.deleteTaskByID('Complete');
chart.draw(data, options);
data.deleteTaskByID('Research');
chart.draw(data, options);


data.setCell(rowIndex, columnIndex [, value [, formattedValue [, properties]]])


data.getRowProperties(0);
getFilteredRows(filters)


//============================================================
        data = new google.visualization.DataTable();

        data.addColumn('string', 'Task ID');
        data.addColumn('string', 'Task Name');
        data.addColumn('date', 'Start Date');
        data.addColumn('date', 'End Date');
        data.addColumn('number', 'Duration');
        data.addColumn('number', 'Percent Complete');
        data.addColumn('string', 'Dependencies');

        data.addRows([
            ['Research', 'Find sources',
            new Date(2015, 0, 1), new Date(2015, 0, 5), null,  100,  null],
            ['Write', 'Write paper',
            null, new Date(2015, 0, 9), daysToMilliseconds(3), 25, 'Research,Outline'],
            ['Cite', 'Create bibliography',
            null, new Date(2015, 0, 7), daysToMilliseconds(1), 20, 'Research'],
            ['Complete', 'Hand in paper',
            null, new Date(2015, 0, 10), daysToMilliseconds(1), 0, 'Cite,Write'],
            ['Outline', 'Outline paper',
            null, new Date(2015, 0, 6), daysToMilliseconds(1), 100, 'Research']
          ]);

        data.addRows([
            ['Write', 'Write paper',
            null, new Date(2015, 0, 9), daysToMilliseconds(3), 25, null]
          ]);