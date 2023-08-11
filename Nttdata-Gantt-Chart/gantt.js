//=============================================================
// Start: SAP Analytics Cloud - Custom Windget - NTT Data Gantt

//const nttDebug = true;

// Global variable for the Html Element Gantt (for development propose)
var _htmlElementGantt;

(function() { 
	
	let _shadowRoot;

	let template = document.createElement("template");
	template.innerHTML = `<div id="project_title" style="font-size: 16px; line-height: 19px; color: rgb( 35 , 31 , 32 ); fill: rgb( 35 , 31 , 32 ); font-family: '72-Web'; margin:6px">Project title</div>`; // rgb(88, 89, 91)
	template.innerHTML += `<div id="chart_div" style="width: 100%; "></div>`;
	// pointer-events: none; -> esto evita el tool-tip pero también quita la interacción con el gantt, como el evento del clic del ratón
	// height: 100%; overflow: auto;
	
	// Project stages based on:
	// https://www.cloud4c.com/sap/blogs/7-key-stages-your-sap-implementation-journey

	
	// Inicializar y dibujar el gantt
	function drawChart(htmlElementGantt) {
	
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Task ID'); 		  data.addColumn('string', 'Task Name');	data.addColumn('string', 'Resource');
		data.addColumn('date',   'Start Date');		  data.addColumn('date',   'End Date');		data.addColumn('number', 'Duration');
		data.addColumn('number', 'Percent Complete'); data.addColumn('string', 'Dependencies');

		data.addRows([
		  ['1_Preparation', 'I. Preparación del proyecto', null, 					new Date("2023-07-22"), null, daysToMilliseconds(5),  100,  null], 
		  ['1.1_Alcance', 'Validación alcance y equipos', 'Preparación', new Date("2023-07-22"), 			null, daysToMilliseconds(1), 100,'1_Preparation'],///'1_Preparation'
		  ['1.2_Planificacion', 'Validación planificación proyecto', 'Preparación', null, null, daysToMilliseconds(1), 100,  '1.1_Alcance'],///'1_Preparation'
		  ['1.3_Accesos', 'Accesos y permisos a sistemas', 'Preparación', null,           null, daysToMilliseconds(1), 100,  '1.2_Planificacion'],///'1_Preparation'
		  ['1.4_Kickoff', 'Reunión de lanzamiento - kickoff', 'Preparación', null,        null, daysToMilliseconds(1), 100,   '1.3_Accesos'],///'1_Preparation'
		  ['1.5_Prep_Entornos', 'Preparación de entornos', 'Preparación', null,           null, daysToMilliseconds(1), 100, '1.4_Kickoff'],///'1_Preparation'

		  ['2_Analysis', 'II. Análisis y Diseño', null, 							null, null, daysToMilliseconds(1),  100,  '1_Preparation'],
		  /*
		  ['2.1_Origenes', 'Análisis sistemas origen', 'Analisis',					new Date(2023, 9, 7), new Date(2023, 9, 8),   null,  100,  '2_Analysis'],//'2_Analisis'
		  ['2.2_AF', 'Anáisis y Diseño Funcional', 'Analisis',						new Date(2023, 9, 8), new Date(2023, 9, 9),   null,  100,  '2_Analysis'],//'2_Analisis'
		  ['2.3_DT', 'Diseño Técnico', 'Analisis', 									new Date(2023, 9, 9), new Date(2023, 9, 10),  null,  100,  '2_Analysis'],//'2_Analisis'
		  ['2.4_AprobacionDFDT', 'Aprobación diseño funcional y técnico', 'Analisis', new Date(2023, 9, 9), new Date(2023, 9, 10), null, 100,  '2_Analysis'],//'2_Analisis'
		  */
		 
		  ['3_Implementation', 'III. Implantación', null, 							null, null,  daysToMilliseconds(1),  100,  '2_Analysis'],
		  /* 
		  ['3.1_Content', 'Activación del Content', 'Implantacion', 				new Date(2023, 9, 11), new Date(2023, 9, 12), null,  100,  '3_Implementation'],
		  ['3.2_FuentesDatos', 'Fuentes de datos', 'Implantacion', 					new Date(2023, 9, 12), new Date(2023, 9, 13), null,  100,  '3_Implementation'],
		  ['3.3_DatosMaestros', 'Datos Maestros', 'Implantacion', 					new Date(2023, 9, 13), new Date(2023, 9, 14), null,  100,  '3_Implementation'],
		  ['3.4_DTransaccionales', 'Datos Transaccioanles', 'Implantacion', 		new Date(2023, 9, 14), new Date(2023, 9, 15), null,  100,  '3_Implementation'],
		  ['3.5_Repositorios', 'Repositorios', 'Implantacion', 						new Date(2023, 9, 14), new Date(2023, 9, 15), null,  100,  '3_Implementation'],
		  ['3.6_Autorizaciones', 'Autorizaciones', 'Implantacion', 					new Date(2023, 9, 14), new Date(2023, 9, 15), null,  100,  '3_Implementation'],
		  ['3.7_Cadenas', 'Cadenas de procesos', 'Implantacion', 					new Date(2023, 9, 14), new Date(2023, 9, 15), null,  100,  '3_Implementation'],
		  ['3.8_Reporting', 'Reporting', 'Implantacion', 							new Date(2023, 9, 14), new Date(2023, 9, 15), null,  100,  '3_Implementation'],
		  	['3.8.1_InformesES', 'Informes E/S', 'Implantacion', 					new Date(2023, 9, 14), new Date(2023, 9, 15), null,  100,  '3_Implementation'],
			['3.8.2_Formulas', 'Lógicas sencillas/Fórmulas', 'Implantacion', 		new Date(2023, 9, 14), new Date(2023, 9, 15), null,  100,  '3_Implementation'],
			['3.8.3_BADIs', 'Lógicas complejas (BADIs) - Programación API', 'Implantacion', new Date(2023, 9, 15), new Date(2023, 9, 15), null,  100,  '3_Implementation'],
		  */

		  ['4_Testing', 'IV. Plan de Pruebas', null, 								null, null,  daysToMilliseconds(1),  100,  '3_Implementation'],
		  /*
		  ['4.1_Unitarias', 'Pruebas Unitarias y paso a Integración', 'Pruebas', 	new Date(2023, 9, 16), new Date(2023, 9, 17), null,  100,  '4_Testing'],
		  ['4.2_Formacion', 'Formación', 'Pruebas', 								new Date(2023, 9, 18), new Date(2023, 9, 19), null,  100,  '4_Testing'],
		  ['4.3_Integracion', 'Pruebas  Integradas en Integración', 'Pruebas', 		new Date(2023, 9, 19), new Date(2023, 9, 20), null,  100,  '4_Testing'],
		  ['4.4_Adaptaciones', 'Adaptaciones', 'Pruebas', 							new Date(2023, 9, 19), new Date(2023, 9, 20), null,  100,  '4_Testing'],
		  ['4.5_Aceptacion', 'Pruebas de Aceptación', 'Pruebas', 					new Date(2023, 9, 19), new Date(2023, 9, 20), null,  100,  '4_Testing'],
		  */
		 
		  ['5_Close', 'V. Arranque y Soporte', null, 								null, null,  daysToMilliseconds(1),  100,  '4_Testing'],
		  /*
		  ['5.1_Despliegue', 'Despliegue a producción', 'Arranque', 				new Date(2023, 9, 21), new Date(2023, 9, 22), null,  100,  '5_Close'],
		  ['5.2_Soporte', 'Soporte', 'Arranque', 									new Date(2023, 9, 22), new Date(2023, 9, 23), null,  100,  '5_Close'],
		  ['5.3_Cierre', 'Cierre de proyecto', 'Arranque',							new Date(2023, 9, 23), new Date(2023, 9, 25), null,  100,  '5_Close'],
		  */
		]);
	
		var options = {
		  gantt: {
			trackHeight: 17,
			barHeight:   12,
			labelStyle: {
				fontSize: 10
			},
			arrow: {
				angle: 100,
				width: 0,
				color: 'silver',
				radius: 0
			},
			criticalPathStyle: {
				stroke: 'silver',
				strokeWidth: 0
			},
			percentEnabled: false,
			palette: [
				{
					"color": "#354a5f", // default // azul oscuro
					"dark":  "#5496cd", // over    // azul claro
					"light": "#e3e3e3"  // others  // gris claro
				},
				{
					"color": "#71706e", // default
					"dark":  "#5496cd", // over
					"light": "#e3e3e3"  // others
				}				
			  ]
		  },
		  backgroundColor:  {
			'fill': 'white',
			'opacity': 0
		 },
		  width: '100%',
		  height: 250
		};

		// var chart = new google.visualization.Gantt(document.getElementById('chart_div'));
		// let nttGanttElements  = document.getElementsByTagName("com-nttdata-ses-cw-gantt");
		// const chartDivElement = nttGanttElements[0].shadowRoot.getElementById("chart_div");
		// var   chart			  = new google.visualization.Gantt(chartDivElement); 

		const chartDivElement = htmlElementGantt.shadowRoot.getElementById("chart_div");
		var   chart			  = new google.visualization.Gantt(chartDivElement); 
		chart.draw(data, options);
		//chart.data = data;

		//=============================================================
		// Save the google gant chart to Gantt class' attribute:
		htmlElementGantt.chart = chart;
		//if(this.nttDebug===true)console.log(this.nttDebugPrefix+"Gantt constructor - chart content:");
		//if(this.nttDebug===true)console.log(htmlElementGantt.chart);

		htmlElementGantt.data = data;
		//if(this.nttDebug===true)console.log(this.nttDebugPrefix+"Gantt constructor - data content:");
		//if(this.nttDebug===true)console.log(htmlElementGantt.data);

		htmlElementGantt.options = options;
		//if(this.nttDebug===true)console.log(this.nttDebugPrefix+"Gantt constructor - options content:");
		//if(this.nttDebug===true)console.log(htmlElementGantt.options);

		//if(this.nttDebug===true)console.log(this.nttDebugPrefix+"Google Chart - End grantt draw 1");

		//=============================================================
		//google.visualization.events.addListener(chart, 'select', selectHandler);
/*
		function selectHandler(e) {
			if(this.nttDebug===true)console.log(this.nttDebugPrefix+"Select event");
			var selection = chart.getSelection();
			if(this.nttDebug===true)console.log("============ SELECTION ===============");
			if(this.nttDebug===true)console.log(selection.length);
			if( selection.length > 0 ){
				if(this.nttDebug===true)console.log(selection[0]);
				if(this.nttDebug===true)console.log(selection[0].row);
				if(this.nttDebug===true)console.log("============ DATA ===============");
				if(this.nttDebug===true)console.log(data.getValue(selection[0].row,0)); // Column 0 means TaskId
				if(this.nttDebug===true)console.log(data.getValue(selection[0].row,1)); // Column 1 means Task name
				if(this.nttDebug===true)console.log(data.getValue(selection[0].row,5)); // Column 5 means Task duration
				if(this.nttDebug===true)console.log(millisecondsToDays(data.getValue(selection[0].row,5))); // Duration in days
				//var event = new Event("onClick");
				//this.dispatchEvent(event);
			}
		}
		*/

		//=============================================================
		google.visualization.events.addListener(chart, 'select', selectHandler);
		function selectHandler(e) {
			//if(this.nttDebug===true)console.log(this.nttDebugPrefix+"Select event - onTaskSelected - gantt.js");
			var selection = chart.getSelection();
			//if(this.nttDebug===true)console.log(selection);
			var event = new Event("onTaskSelected");
			htmlElementGantt.dispatchEvent(event);
		}

		//=============================================================
		// taskProperty values: 'Start Date', 'End Date', 'Duration', 'Percent Complete', 'Dependencies'
		data.getTaskProperty = function (taskId, taskProperty){ 
			var taskRow = null;
			for (var i = 0; i < this.getNumberOfRows(); i++) {
				var iTaskId = this.getValue(i, 0); // Task ID
				//console.log("i: "+i.toString+" | "+iTaskID);
				//console.log(iTaskId +" // "+ taskId);
				if(iTaskId === taskId){
					//console.log("i de salida del for: "+i.toString());
					taskRow = i;
					break;
				}
			}
			var columnIndexes = [null,'Task Name','Resource', 'Start Date', 'End Date', 'Duration', 'Percent Complete', 'Dependencies'];
			var propertyIndex = columnIndexes.indexOf(taskProperty);
			if( taskRow != null && propertyIndex > 0 ){
				//console.log("taskRow: "+taskRow.toString()+" | propertyIndex: "+propertyIndex.toString());
				if( propertyIndex==5){ //  propertyIndex==5 means 'Duration' in days
					var value = this.getValue(taskRow, propertyIndex); 
					return millisecondsToDays(value);
				}else{
					return this.getValue(taskRow, propertyIndex); 
				}
			}else{
				return undefined; // Get dagta error 
			}
		}

		//=============================================================
		// taskProperty values: 'Start Date', 'End Date', 'Duration', 'Percent Complete', 'Dependencies'
		data.updateTask = function (taskId, taskProperty, newValue){ 
			var taskRow = null;
			for (var i = 0; i < this.getNumberOfRows(); i++) {
				var iTaskId = this.getValue(i, 0); // Task ID
				//console.log("i: "+i.toString+" | "+iTaskID);
				//console.log(iTaskId +" // "+ taskId);
				if(iTaskId === taskId){
					//console.log("i de salida del for: "+i.toString());
					taskRow = i;
					break;
				}
			}
			var columnIndexes = [null,'Task Name','Resource', 'Start Date', 'End Date', 'Duration', 'Percent Complete', 'Dependencies'];
			var propertyIndex = columnIndexes.indexOf(taskProperty);
			if( taskRow != null && propertyIndex > 0 ){
				//console.log("taskRow: "+taskRow.toString()+" | propertyIndex: "+propertyIndex.toString());
				if( propertyIndex==5 && newValue != null ){ //  propertyIndex==5 means 'Duration' in days
					this.setValue(taskRow, propertyIndex, daysToMilliseconds(newValue)); 
				}else{
					this.setValue(taskRow, propertyIndex, newValue); 
				}
				return true;  // Success update
			}else{
				return false; // Update error 
			}
		}

		//=============================================================
		data.printTasks = function (){
			console.log("\tTask ID\t|\tTask name\t|\tResource\t|\tStart\t|\tEnd\t|\tDuration\t|\tDependencies");
			for (var i = 0; i < this.getNumberOfRows(); i++) {
				var s = this.getValue(i, 3); // Start
				var ss = null
				if(s != null){
					ss = s.getFullYear()+"-"+s.getMonth()+"-"+s.getDate();
				}else{ 
					ss = "null" 
				}
				var e = this.getValue(i, 4); // End
				var es = null
				if(e != null){
					es = e.getFullYear()+"-"+e.getMonth()+"-"+e.getDate();
				}else{ 
					es = "null"
				}
				console.log(i+".\t"+
					this.getValue(i, 0)+"\t|\t"+                     // taskID
					this.getValue(i, 1)+"\t|\t"+                     // Task name
					this.getValue(i, 2)+"\t|\t"+                     // Resource
					ss+"\t|\t"+                                      // Start string
					es+"\t|\t"+                                      // End string
					( (this.getValue(i, 5) == null)? "null" : millisecondsToDays(this.getValue(i, 5)) )+"\t|\t"+ // Duration
					this.getValue(i, 6)                             // Dependencies
				);
			}
		}

		//if(this.nttDebug===true)console.log(this.nttDebugPrefix+"Google Chart - End grantt draw 2");
	}

	// ===================== Auxiliar functions =================================
	
	// Generic function to load JavaScript libraries into the custom widget
	function loadScript(url,shadowRoot, callbackFunction) {
		const script = document.createElement('script');
		script.type  = 'text/javascript';
		script.src  = url;
		script.addEventListener("load", callbackFunction);
		script.nonce = document.getElementsByTagName("script")[0].nonce; // Importante para que no de error de: Content-Security-Policy
		//if(this.nttDebug===true)console.log(this.nttDebugPrefix+"Nonce value: "+document.getElementsByTagName("script")[0].nonce);
		shadowRoot.appendChild(script);
	}

	// Function to convert days into milliseconds, to be used in the Google Gantt Chart
	function daysToMilliseconds(days) {
		return days * 24 * 60 * 60 * 1000;
	}

	// Function to convert milliseconds into days, to be used in the printTasks() method
	function millisecondsToDays(milliseconds) {
		return milliseconds / 1000 / 60 / 60 / 24;
	}

	// Main class for the Gantt chart custom widget
	class Gantt extends HTMLElement {

		constructor() {
			//if(this.nttDebug===true)console.log(this.nttDebugPrefix+"Constructor");
			super(); 
			let _shadowRoot = this.attachShadow({mode: "open"});
			_shadowRoot.appendChild(template.content.cloneNode(true));
			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});
			this.addEventListener("dblclick", event => {
				var event = new Event("onDblClick");
				this.dispatchEvent(event);
			});
			this.addEventListener("contextmenu", event => {
				var event = new Event("onContextMenu");
				this.dispatchEvent(event);
			});
			this._props = {};

			//=============================================================
			this.nttDebug       = true;
			this.nttDebugPrefix = "NTT Data CW-Gantt> ";

			   _htmlElementGantt = this; // save this class as a global var to debug and development propose
			var htmlElementGantt = this; // create this temporary var to pass to drawChart() function as parameter
			// Load JavaScript Google Chart library
			//if(this.nttDebug===true)console.log(this.nttDebugPrefix+"Google Chart - Start load library");
			loadScript("https://www.gstatic.com/charts/loader.js",_shadowRoot,function(){
				// Cargar el paquete de gráficos de gantt
				google.charts.load('current', {'packages':['gantt'], 'language': 'es'});
				// Call to drawChart function 
				//if(this.nttDebug===true)console.log(this.nttDebugPrefix+"Google Chart - Start grantt draw");
				google.charts.setOnLoadCallback(function(){
					drawChart(htmlElementGantt);
				});
			});
		}

		onCustomWidgetBeforeUpdate(changedProperties) {
			//if(this.nttDebug===true)console.log(this.nttDebugPrefix+"onCustomWidgetBeforeUpdate");
			this._props = { ...this._props, ...changedProperties };
		}

		onCustomWidgetAfterUpdate(changedProperties) {
			//if(this.nttDebug===true)console.log(this.nttDebugPrefix+"onCustomWidgetAfterUpdate");
			if ("projectName" in changedProperties) {
				this.shadowRoot.getElementById("project_title").innerHTML = changedProperties["projectName"];
			}			
			if ("color" in changedProperties) {
				this.style["background-color"] = changedProperties["color"];
			}
			if ("opacity" in changedProperties) {
				this.style["opacity"] = changedProperties["opacity"];
			}

			if ("width" in changedProperties) {
				//this.style["opacity"] = changedProperties["opacity"];
				if(this.nttDebug===true)console.log(this.nttDebugPrefix+"Cambio en ancho de 'Custome widget': "+changedProperties["width"]);
			}
			if ("height" in changedProperties) {
				//this.style["opacity"] = changedProperties["opacity"];
				if(this.nttDebug===true)console.log(this.nttDebugPrefix+"Cambio en alto de 'Custome widget': "+changedProperties["height"]);
			}
		}

		onCustomWidgetResize(width, height){
			/*
			if(this.nttDebug===true)console.log(this.nttDebugPrefix+"onCustomWidgetResize(width, height) event");
			if(this.nttDebug===true)console.log("width: "+width);
			if(this.nttDebug===true)console.log("height "+height);
			*/
			this.refresh();
        }

		setStartDate(startDate){ // Date in integer format: yyyymmdd
			//if(this.nttDebug===true)console.log(this.nttDebugPrefix+"setStartDate(startDate) - Input date: ");
			//if(this.nttDebug===true)console.log(startDate);
			if(startDate===''){ // Set 1900-01-01 as default start date 
				startDate = 19000101;
			}
			this.startDate = startDate.toString().substr(0,4)+"-"+startDate.toString().substr(4,2)+"-"+startDate.toString().substr(6,2);
			//if(this.nttDebug===true)console.log(this.nttDebugPrefix+"setStartDate(startDate) - Final date: "+this.startDate);
			var startDate = new Date(this.startDate);
			this.data.updateTask('1_Preparation', 'Start Date', startDate);
			this.data.updateTask('1.1_Alcance','Start Date',startDate);
			this.refresh();
		}

		setTaskProperty(taskId, propertyName, newValue){
			if( propertyName == "Duration" && (newValue =="" || isNaN(newValue)) ){
				newValue = 0;
			}
			//if(this.nttDebug===true)console.log(this.nttDebugPrefix+"setTaskProperty(taskId,propertyName,newValue) - taskId: "+taskId+" / propertyName: "+propertyName+" / newValue: "+newValue);
			this.data.updateTask(taskId, propertyName, newValue);
			this.refresh();
		}
		// _htmlElementGantt.setTaskProperty('1_Preparation','Duration',3);

		getTaskProperty(taskId, propertyName){
			/*if(this.nttDebug===true)console.log(this.nttDebugPrefix+"setStartDate(startDate) - Input date: "+startDate);
			var convertedDate = startDate.toString().substr(0,4)+"-"+startDate.toString().substr(4,2)+"-"+startDate.toString().substr(6,2);
			if(this.nttDebug===true)console.log(this.nttDebugPrefix+"setStartDate(startDate) - Converted date: "+convertedDate);
			this.startDate = convertedDate;
			if(this.nttDebug===true)console.log(this.nttDebugPrefix+"setStartDate(startDate) - Final date: "+this.startDate);
			*/
			return this.data.getTaskProperty(taskId, propertyName);
		}		

		//calculateNewDurationForAllStages(){
		//}
		
		getSelectedTaskId(){
			var selection = this.chart.getSelection();
			//if(this.nttDebug===true)console.log("============ SELECTION ===============");
			//if(this.nttDebug===true)console.log(selection.length);
			if( selection.length > 0 ){
				/*
				if(this.nttDebug===true)console.log(selection[0]);
				if(this.nttDebug===true)console.log(selection[0].row);
				if(this.nttDebug===true)console.log("============ DATA ===============");
				if(this.nttDebug===true)console.log(this.data.getValue(selection[0].row,0)); // Column 0 means TaskId
				if(this.nttDebug===true)console.log(this.data.getValue(selection[0].row,1)); // Column 1 means Task name
				if(this.nttDebug===true)console.log(this.data.getValue(selection[0].row,5)); // Column 5 means Task duration
				if(this.nttDebug===true)console.log(millisecondsToDays(data.getValue(selection[0].row,5))); // Duration in days
				*/
				//var event = new Event("onClick");
				//this.dispatchEvent(event);
				return this.getData().getValue(selection[0].row,0); // Column 0 means TaskId
			}else{
				return undefined;
			}
		}

		getData(){
			if(this.dataClone === undefined){
				return this.data
			}else{
				return this.dataClone;
			}			
		}

		collapseStage(stageId){
			//if(this.nttDebug===true)console.log("============ collapseStage(stageId): "+stageId+" ===============");
			if(this.dataClone === undefined){
				this.dataClone = this.data.clone();
			}
			//var stageSubTasks = [];
			var taskRow = null;
			for (var i = 0; i < this.dataClone.getNumberOfRows(); i++) {
				var iDependencies = this.dataClone.getValue(i, 7); // Dependencies
				var subTaskId     = this.dataClone.getValue(i, 0); // 0 means TaskId
				//console.log("i: "+i+" || "+this.dataClone.getValue(i, 0)+" - "+this.dataClone.getValue(i, 1)); // 1 means task name
				//console.log(iTaskId +" // "+ taskId);
				//console.log(subTaskId.includes("."));
				if(iDependencies != null && iDependencies.includes(stageId) && subTaskId.includes(".")){ // If the selected task is part of the "stageId" and the task is not a stage (e.g. '1_Preparation', '2_Analysis', '3_Implementation', '4_Testing', '5_Close')
					//console.log(">>>  Subtarea identificada y eliminada - TaskId: "+subTaskId);
					this.dataClone.removeRow(i);
					this.collapseStage(subTaskId);
					i--; // Go back because one element was removed
				}
			}
			this.chart.draw(this.dataClone, this.options);
		}

		expandStage(stageId){
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
 		
		// Add a row to the dataClone checkgin that the newTask is not in dataClone
		safeAddTaskToDataClone(newTask, stageId){ // newTask: Array with a DataTable row // stageId: newTask's parent taskId
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

		getTaskRowAtDataClone(taskId){
			if(this.nttDebug===true)console.log(this.nttDebugPrefix+"getTaskPositionOnDataClone(taskId) taskId: "+taskId);
			for (var rowIndex = 0; rowIndex < this.dataClone.getNumberOfRows(); rowIndex++) {
				var tmpTaskId = this.dataClone.getValue(rowIndex, 0); // 0 means TaskId
				if( tmpTaskId == taskId){
					if(this.nttDebug===true)console.log(this.nttDebugPrefix+"getTaskPositionOnDataClone(taskId) rowIndex: "+rowIndex);
					return rowIndex;
				}
			}
			if(this.nttDebug===true)console.log(this.nttDebugPrefix+"getTaskPositionOnDataClone(taskId) Task not found - taskId: "+taskId);
		}

		expandAllStages(){
			this.dataClone = undefined;
			this.refresh();
		}


		// Update the gantt's user interface to show recent changes
		refresh() {
			//if(this.nttDebug===true)console.log(this.nttDebugPrefix+"refresh()");
			this.chart.draw(this.getData(), this.options);
		}

		reset() { // Pending to implement
			if(this.nttDebug===true)console.log(this.nttDebugPrefix+"reset()");
			/*
			var data = new google.visualization.DataTable();
			data.addColumn('string', 'Task ID'); 		  data.addColumn('string', 'Task Name');	data.addColumn('string', 'Resource');
			data.addColumn('date',   'Start Date');		  data.addColumn('date',   'End Date');		data.addColumn('number', 'Duration');
			data.addColumn('number', 'Percent Complete'); data.addColumn('string', 'Dependencies');
			//this.chart.removeRow(0);
			
			//google.charts.setOnLoadCallback(drawChart);
			if(this.nttDebug===true)console.log(this.nttDebugPrefix+"clearChart -- v1"); 
			*/
		}
		
		setDebugEnabled(enabled){
			this.nttDebug = enabled;
		}
		
	}

	customElements.define("com-nttdata-ses-cw-gantt", Gantt);
		
})();