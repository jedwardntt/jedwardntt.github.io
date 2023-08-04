//////// ONINITIALIZATION
//console.log("=======> Debug NTT - onInitialization - Start");
		
var projects = PlanningModel_Estimator.getMembers(DimProy,{limit: 1000}); 

Dropdown_Proyectos.addItem("--","-- Seleccionar proyecto --");
Dropdown_Proyectos.setSelectedKey("--");

for (var i=0;i<projects.length;i++) {
	// Accede a las propiedades del objeto
	//Dropdown_EntrPPal.addItem(ObjetosPpal[i].properties.Entorno );
	/*
	console.log("=======> Debug NTT - onInitialization - Iteración"+i.toString());
	console.log(proyectos[i].id);
	console.log(proyectos[i].description);
	console.log(proyectos[i].properties);
	console.log(proyectos[i].properties.Manager);
	*/
	Dropdown_Proyectos.addItem(projects[i].id, "(Id: "+projects[i].id+") "+projects[i].description);
}
//Text_ListBox_Proyecto.setStyle()
 
//Gantt_1.collapsePhase("");

/*
console.log("=======> Debug NTT - onInitialization - Application.getUserInfo();");
console.log(Application.getUserInfo());
console.log("=======> Debug NTT - onInitialization - Application.getInfo();");
console.log(Application.getInfo());
*/

//console.log("=======> Debug NTT - onInitialization - End");

var proyectoP1 = PlanningModel_Estimator.getMember("Proyecto","P1"); // PlanningModelMember
console.log("Proyecto P1 - ID");
console.log(proyectoP1.id);
console.log("Proyecto P1 - Members");

//.DiferenciaMeses();






//////// BOTON SELECICONAR PROYECTO
console.log("=======================================================================");

var selectedProject = this.getSelectedKey();
console.log("=======> Debug NTT - Dropdown_Proyectos - getSelectedKey: "+selectedProject);

Project = PlanningModel_Estimator.getMember(DimProy,selectedProject);
Gantt_1.setProjectName(Project.description);

var fechaInicio   = Project.properties["FechaInicio"]; 
var validaEquipo  = Project.properties["ValidaEquipo"];
var validaPlani   = Project.properties["ValidaPlani"];
var acesoPermisos = Project.properties["AccesoPermisos"];
var kickoff       = Project.properties["Kickoff"];
var prepEntornos  = Project.properties["PrepEntornos"];

var UAT        = Project.properties["UAT"]; 
var Despliegue = Project.properties["Despliegue"]; 
var Soporte    = Project.properties["Soporte"]; 

console.log("=======> Debug NTT - Dropdown_Proyectos - Fecha inicio: "+fechaInicio);

console.log("=======> Debug NTT - Dropdown_Proyectos - UAT: "+UAT);
console.log("=======> Debug NTT - Dropdown_Proyectos - Despliegue: "+Despliegue);
console.log("=======> Debug NTT - Dropdown_Proyectos - Soporte: "+Soporte);
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