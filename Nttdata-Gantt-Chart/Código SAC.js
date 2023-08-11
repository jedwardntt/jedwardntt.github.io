//////////////////////////////////////////////////////// INITIALIZATION

// Obtener el listado de proyectos para poblar el selector (Dropdown_Proyectos)
Gantt.setVisible(false);
Gantt.setProjectName("");
var projects = PlanningModel_Estimator.getMembers(DimProy,{limit: 1000}); 
DropdownProyectosGantt.addItem("--","-- Seleccione un proyecto --");
DropdownProyectosGantt.setSelectedKey("--");
for (i=0;i<projects.length;i++) {
	DropdownProyectosGantt.addItem(projects[i].id, "(Id: "+projects[i].id+") "+projects[i].description);
}
TableGantt.setVisible(false);
InputField_Gantt_Duracion.setEditable(false);
Button_Gantt_Edit_Locked.setVisible(true);
Button_Gantt_Edit_Unloked.setVisible(false);
CheckboxGroup_OcultarTarea_Gantt.setVisible(false);





//////////////////////////////////////////////////////// function getMesureDimensionValue(mesureDimensionName: string) : string
var selectedProject = DropdownProyectosGantt.getSelectedKey();
var varDataCell = TableGantt.getDataSource().getData({"@MeasureDimension":mesureDimensionName,"Proyecto":selectedProject});

var varDataCellValue = "";
if(varDataCell !== undefined){
	varDataCellValue = varDataCell.rawValue;
}
return varDataCellValue;




//////////////////////////////////////////////////////// BOTON SELECICONAR PROYECTO
console.log("=======================================================================");
//console.log("=======================================================================");
//Application.showBusyIndicator("Actualizando el Gantt...");

var selectedProject = this.getSelectedKey();
//console.log("=======> Debug NTT - Dropdown_Proyectos - getSelectedKey: "+selectedProject);

var Project     = PlanningModel_Estimator.getMember(DimProy,selectedProject);
var fechaInicio = Project.properties["FechaInicio"]; 

// Fase de: Análisis
var validaEquipo  = Project.properties["ValidaEquipo"];
var validaPlani   = Project.properties["ValidaPlani"];
var acesoPermisos = Project.properties["AccesoPermisos"];
var kickoff       = Project.properties["Kickoff"];
var prepEntornos  = Project.properties["PrepEntornos"];

/*
var UAT           = Project.properties["UAT"]; 
var Despliegue    = Project.properties["Despliegue"]; 
var Soporte       = Project.properties["Soporte"]; 
*

/*
if( fechaInicio === "" ){
	fechaInicio = "20230101";
	console.log("Conversión de fecha inicio");
}{
	console.log("Sin conversión de fecha inicio");
}
*/
/*
console.log("=======> Debug NTT - Dropdown_Proyectos - Fecha inicio: "+fechaInicio);
console.log("=======> Debug NTT - Dropdown_Proyectos - UAT: "+UAT);
console.log("=======> Debug NTT - Dropdown_Proyectos - Despliegue: "+Despliegue);
console.log("=======> Debug NTT - Dropdown_Proyectos - Soporte: "+Soporte);
*/
// Análisis, por defecto 5 jornadas? o un porcentaje del resto

Gantt.setStartDate(fechaInicio);
//Application.Error("TEST ERROR");

var tiempoPreparacionTotalDias = ScriptObject_Funciones.getMesureDimensionValue("TiempoPreparacionTotalDias");

Gantt.setTaskProperty('1_Preparation','Duration',tiempoPreparacionTotalDias);
Gantt.setTaskProperty('1.1_Alcance','Duration',validaEquipo);
Gantt.setTaskProperty('1.2_Planificacion','Duration',validaPlani);
Gantt.setTaskProperty('1.3_Accesos','Duration',acesoPermisos);
Gantt.setTaskProperty('1.4_Kickoff','Duration',kickoff);
Gantt.setVisible(true);
Gantt.setTaskProperty('1.5_Prep_Entornos','Duration',prepEntornos);

var tiempoAnalisisTotalDiasValue  = ScriptObject_Funciones.getMesureDimensionValue("TiempoAnalisisTotalDias");
var tiempoDocumentaTotalDiasValue = ScriptObject_Funciones.getMesureDimensionValue("TiempoDocumentaTotalDias");

//console.log(Number.parseFloat(tiempoAnalisisTotalDiasValue)+Number.parseFloat(tiempoDocumentaTotalDiasValue));
Gantt.setTaskProperty('2_Analysis','Duration',ConvertUtils.numberToString(Number.parseFloat(tiempoAnalisisTotalDiasValue)+Number.parseFloat(tiempoDocumentaTotalDiasValue)));

var tiempoConstruccionTotalDiasValue = ScriptObject_Funciones.getMesureDimensionValue("TiempoConstruccionTotalDias");
Gantt.setTaskProperty('3_Implementation','Duration',tiempoConstruccionTotalDiasValue);

var tiempoUATotalDiasValue = ScriptObject_Funciones.getMesureDimensionValue("TiempoUATotalDias");
Gantt.setTaskProperty('4_Testing','Duration',tiempoUATotalDiasValue);

var tiempoDesliegueTotalDiasValue = ScriptObject_Funciones.getMesureDimensionValue("TiempoDesliegueTotalDias");
var tiempoSoporteTotalDiasValue   = ScriptObject_Funciones.getMesureDimensionValue("TiempoSoporteTotalDias");

//console.log("======= CIERRE ============");
//console.log(tiempoDesliegueTotalDiasValue);
//console.log(tiempoSoporteTotalDiasValue);

Gantt.setTaskProperty('5_Close','Duration',ConvertUtils.numberToString(Number.parseFloat(tiempoDesliegueTotalDiasValue)+Number.parseFloat(tiempoSoporteTotalDiasValue)));

DropdownProyectosGantt.removeItem("--");

//console.log("===============================   getSelections()   ========================================");
//console.log(TableGantt.getSelections());

//Application.hideBusyIndicator();

//console.log("=======> Debug NTT - Dropdown_Proyectos - Start");




//////////////////////////////////////////////////////// Gantt - onSelected (task)
console.log("======== onTaskSelected - onClick() Gantt - SAC");
SelectedTaskId = Gantt.getSelectedTaskId();
console.log("======== onTaskSelected - onClick() Gantt - SAC - SelectedTaskId: "+SelectedTaskId);
if(SelectedTaskId !== undefined){
	console.log("======== onTaskSelected - onClick() Gantt - SAC - Inicio");
	var duration = Gantt.getTaskProperty(SelectedTaskId,"Duration");
	var taskName = Gantt.getTaskProperty(SelectedTaskId,"Task Name");
	InputField_Gantt_Duracion.setValue(duration);
	Text_Gantt_Nombre_tarea.applyText(taskName);
	var taskCollapsedIndex = CollapsedStages.indexOf(SelectedTaskId); // Check is selected task is in "CollapsedStages" array
	if( taskCollapsedIndex > -1 ){ // If the stage is collapsed 
		CheckboxGroup_OcultarTarea_Gantt.setSelectedKeys(["ocultar"]); // Check the checkbox
	}else{
		CheckboxGroup_OcultarTarea_Gantt.setSelectedKeys([]);// Unckeck the checkbox
	}
	Popup_ViewEdit_TareaGantt.open();
	console.log("======== onTaskSelected - onClick() Gantt - SAC - Fin");
}





//////// Popup_ModifTareaGantt - onclick

if(NttDebug===true){console.log("======= PopupEditTask - Inicio");}
if (buttonId==="button1"){
	if(NttDebug===true){console.log("======= PopupEditTask - OnClick - Inicio");}
	Gantt.setTaskProperty(SelectedTaskId,"Duration",InputField_Gantt_Duracion.getValue());
	var selectedKeys = CheckboxGroup_OcultarTarea_Gantt.getSelectedKeys();
	if(NttDebug===true){console.log("======= PopupEditTask - OnClick - Selected task: "+SelectedTaskId);}
	if(selectedKeys.length>0){ // This selected task has been checked to be collapsed
		if(NttDebug===true){console.log("======= PopupEditTask - OnClick - Collapse task: "+SelectedTaskId);}
		Gantt.collapseStage(SelectedTaskId);
		CollapsedStages.push(SelectedTaskId);
	}else{ // This selected task has been unchecked to be elapsed
		if(NttDebug===true){console.log("======= PopupEditTask - OnClick - Elapse task: "+SelectedTaskId);}
		var stageIndex = CollapsedStages.indexOf(SelectedTaskId);
		CollapsedStages.splice(stageIndex,1); // Remove stage from collapsed-stages list
		Gantt.expandStage(SelectedTaskId);
	}
	if(NttDebug===true){
		console.log("======= PopupEditTask - OnClick - Selected stages:");
		for(var i=0;i<CollapsedStages.length;i++){
			if(NttDebug===true){console.log("- "+CollapsedStages[i]);}
		}
		console.log("======= PopupEditTask - OnClick - Fin");
	}
}
Gantt.refresh();
InputField_Gantt_Duracion.setEditable(false);
Button_Gantt_Edit_Locked.setVisible(true);
Button_Gantt_Edit_Unloked.setVisible(false);
CheckboxGroup_OcultarTarea_Gantt.setVisible(false);
Popup_ViewEdit_TareaGantt.close();
console.log("======= PopupEditTask - Fin");