//============================================================================================

var container =  _htmlElementGantt.shadowRoot.getElementById("chart_div");

var tasks = container.getElementsByTagName("text");

function setCssTaskAttribute(taskName, attribute, value){
	for(var i=0; i<tasks.length; i++){
		var task = tasks[i];
		var iTaskName = task.innerHTML;
		if(iTaskName == taskName){
			$(task).attr(attribute, value);
			console.log("taskName cambio atributo: "+iTaskName);
		}
		console.log("taskName: "+iTaskName);
	}
}

setCssTaskAttribute("I. Preparación del proyecto", "font-weight", "bold");
setCssTaskAttribute("II. Análisis y Diseño", "font-weight", "bold");
setCssTaskAttribute("III. Implantación", "font-weight", "bold");
setCssTaskAttribute("IV. Plan de Pruebas", "font-weight", "bold");
setCssTaskAttribute("V. Arranque y Soporte", "font-weight", "bold");

//============================================================================================

var observer = new MutationObserver(function () {
	console.log("++++ ");
    $.each($('text'), function (index, label) {
		console.log(">> "+index+" / "+label);
      var rowIndex = data.getFilteredRows([{
        column: 1,
        value: $(label).text()
      }]);
      if (rowIndex.length > 0) {
        $(label).attr('background-color', 'red')
      }
    });
});

observer.observe(container, {
    childList: true,
    subtree: true
  })
  
_htmlElementGantt.refresh();

//============================================================================================

'1_Preparation'
'1.3_Accesos'

_htmlElementGantt.getTaskProperty("1.3_Accesos","Duration");

_htmlElementGantt.getTaskProperty("1.3_Accesos","Dependencies");
_htmlElementGantt.getTaskProperty('1.2_Planificacion',"Dependencies");
_htmlElementGantt.getTaskProperty('1.1_Alcance',"Dependencies");
_htmlElementGantt.getTaskProperty('1_Preparation',"Dependencies"); -> null


_htmlElementGantt.refreshDuration = function (dependencies){
			const dependenciesArray = dependencies.split(",", 3);
			dependenciesArray.forEach(element => {
				console.log("element: "+element);
			});
		}

_htmlElementGantt.refreshDuration("1.2_Planificacion")


//============================================================================================

_htmlElementGantt.safeAddTaskToDataClone('1_Preparation');
CollapsedStages -> array con las etapas contraidas
CheckboxGroup_OcultarTarea_Gantt.setSelectedKeys(["ocultar"]);

_htmlElementGantt.expandAllStages();

if(nttDebug==1)console.log("NTT Data CW Gantt: expandStage(stageId): "+stageId+" ===============");


if(NttDebug===true){console.log("======= PopupEditTask - Inicio");}


_htmlElementGantt.expandStage=function(stageId){
			//console.log(">>>>>>>>>>>> expandStage(stageId)");
			//console.log(this.nttDebug);
			if(this.nttDebug===true)console.log(this.nttDebugPrefix+"expandStage(stageId): \""+stageId+"\"");
			//var stageSubTasks = [];
			var taskRow = null;
			for (var rowIndex = 0; rowIndex < this.data.getNumberOfRows(); rowIndex++) {// Run over the original "data" Data table
				var iDependencies = this.data.getValue(rowIndex, 7); // Dependencies
				var subTaskId     = this.data.getValue(rowIndex, 0); // 0 means TaskId
				if(this.nttDebug===true)console.log(this.nttDebugPrefix+"rowIndex: "+rowIndex+" || "+this.data.getValue(rowIndex, 0)+" - "+this.data.getValue(rowIndex, 1)); // 1 means task name
				if(this.nttDebug===true)console.log(this.nttDebugPrefix+"subTaskId: "+subTaskId);
				if(this.nttDebug===true)console.log(this.nttDebugPrefix+"subTaskId.includes(\".\"): "+subTaskId.includes("."));
				if(iDependencies != null && iDependencies.includes(stageId) && subTaskId.includes(".")){ // If the selected subtask is part of the "stageId" and the subtask is not a stage (e.g. '1_Preparation', '2_Analysis', '3_Implementation', '4_Testing', '5_Close')
					if(this.nttDebug===true)console.log(this.nttDebugPrefix+"¡¡¡SUBTASK IDENTIFIED TO BE ADDED!!! - subTaskId: "+subTaskId);
					var newTask = [];
					for( var columnIndex=0; columnIndex<8; columnIndex++ ){ // The Gantt data table has 8 columns (task properties)
						var value = this.data.getValue(rowIndex, columnIndex);
						if(this.nttDebug===true)console.log(this.nttDebugPrefix+"Task property "+columnIndex+": "+value);
						newTask.push(value);						
					}
					//if(this.nttDebug===true)console.log(this.nttDebugPrefix+"safeAddTaskToDataClone('"+newTask+"')");
					this.safeAddTaskToDataClone(newTask, stageId);
					this.expandStage(subTaskId);
					//rowIndex--; // Go back because one element was removed
				}
			}
			this.chart.draw(this.dataClone, this.options);
		}
			
		
_htmlElementGantt.expandStage('1_Preparation')


_htmlElementGantt.refresh()


_htmlElementGantt.safeAddTaskToDataClone = function (newTask, stageId){ // newTask: Array with a DataTable row // stageId: newTask's parent taskId
			if(this.nttDebug===true)console.log(this.nttDebugPrefix+"safeAddTaskToDataClone(newTask) newTask[0]: "+newTask[0]);
			// Check if the newTask is already in "dataClone" (check by TaskId)
			for (var rowIndex = 0; rowIndex < this.dataClone.getNumberOfRows(); rowIndex++) {
				var value = this.dataClone.getValue(rowIndex, 0); // 0 means TaskId
				if( value == newTask[0]){ // 0 means TaskId
					if(this.nttDebug===true)console.log(this.nttDebugPrefix+"safeAddTaskToDataClone(newTask) - Task '"+newTask[0]+"' is already in dataClone");
					return; // The newTask is already in the dataClone
				}
			}
			if(this.nttDebug===true)console.log(this.nttDebugPrefix+"safeAddTaskToDataClone(newTask) - Task added");
			var rowIndex = this.getTaskRowAtDataClone(stageId);
			this.dataClone.insertRows(rowIndex, [newTask]);
		}



_htmlElementGantt.nttDebugPrefix = "NTT Data CW-Gantt> "
_htmlElementGantt.nttDebug
_htmlElementGantt.nttDebugPrefix

_htmlElementGantt.dataClone