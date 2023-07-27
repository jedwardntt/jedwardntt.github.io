//////// BOTON SELECICONAR PROYECTO

console.log("=======================================================================");

var selectedProject = this.getSelectedKey();
console.log("=======> Debug NTT - Dropdown_Proyectos - getSelectedKey: "+selectedProject);

Project = PlanningModel_Estimator.getMember(DimProy,selectedProject);
Gantt_1.setProjectName(Project.description);

var fechaInicio = Project.properties["FechaInicio"]; 
var preparacion = Project.properties["Preparacion"]; 

var validaEquipo  = Project.properties["ValidaEquipo"];
var validaPlani   = Project.properties["ValidaPlani"];
var acesoPermisos = Project.properties["AccesoPermisos"];
var kickoff       = Project.properties["Kickoff"];
var prepEntornos  = Project.properties["PrepEntornos"];

var UAT = Project.properties["UAT"]; 
var Despliegue = Project.properties["Despliegue"]; 
var Soporte = Project.properties["Soporte"]; 

console.log("=======> Debug NTT - Dropdown_Proyectos - Fecha inicio: "+fechaInicio);
console.log("=======> Debug NTT - Dropdown_Proyectos - Preparación: "+preparacion);

console.log("=======> Debug NTT - Dropdown_Proyectos - UAT: "+UAT);
console.log("=======> Debug NTT - Dropdown_Proyectos - Despliegue: "+Despliegue);
console.log("=======> Debug NTT - Dropdown_Proyectos - Soporte: "+Soporte);
// Preparación, por defecto 5 jornadas o un porcentaje del resto
// Análisis, por defecto 5 jornadas? o un porcentaje del resto

Gantt_1.setStartDate(fechaInicio);
//Application.Error("TEST ERROR");

console.log("prepDuration:");
var prepDuration = Math.max(Number.parseFloat(validaEquipo), Number.parseFloat(validaPlani));
prepDuration = Math.max(prepDuration, Number.parseFloat(acesoPermisos));
prepDuration = Math.max(prepDuration, Number.parseFloat(kickoff));
prepDuration = Math.max(prepDuration, Number.parseFloat(prepEntornos));

Gantt_1.setTaskProperty('1_Preparation','Duration',prepDuration.toString());
Gantt_1.setTaskProperty('1.1_Alcance','Duration',validaEquipo);
Gantt_1.setTaskProperty('1.2_Planificacion','Duration',validaPlani);
Gantt_1.setTaskProperty('1.3_Accesos','Duration',acesoPermisos);
Gantt_1.setTaskProperty('1.4_Kickoff','Duration',kickoff);
Gantt_1.setTaskProperty('1.5_Prep_Entornos','Duration',prepEntornos);
///////////

Text_ListBox_Proyecto.applyText("Proyecto:");
Dropdown_Proyectos.removeItem("--");

//console.log("=======> Debug NTT - Dropdown_Proyectos - Start");