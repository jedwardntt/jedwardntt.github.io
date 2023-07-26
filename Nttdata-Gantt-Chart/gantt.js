//=============================================================
// Start: SAP Analytics Cloud - Custom Windget - NTT Data Gantt

const nttDebug = true;

// Global variable for the Html Element Gantt (for development propose)
var _htmlElementGantt;

(function() { 
	
	let _shadowRoot;

	let template = document.createElement("template");
	template.innerHTML = `<div id="project_title" style="font-size: 16px; line-height: 19px; color: rgb(88, 89, 91); fill: rgb(88, 89, 91); font-family: "72-Web";">Project title</div>`;
	template.innerHTML += `<div id="chart_div" style="width: 100%; height: 100%; overflow: auto;"></div>`;
	
	// Project stages based on:
	// https://www.cloud4c.com/sap/blogs/7-key-stages-your-sap-implementation-journey

	
	// Inicializar y dibujar el gantt
	function drawChart(htmlElementGantt) {
	
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Task ID'); 		  data.addColumn('string', 'Task Name');	data.addColumn('string', 'Resource');
		data.addColumn('date',   'Start Date');		  data.addColumn('date',   'End Date');		data.addColumn('number', 'Duration');
		data.addColumn('number', 'Percent Complete'); data.addColumn('string', 'Dependencies');

		data.addRows([
		  ['1_Preparation', 'I. Preparación del proyecto', null, 					new Date("2023-07-22"), null, daysToMilliseconds(1),  100,  null], 
		  /*
		  ['1.1_Alcance', 'Validación alcance y equipos', 'Preparación', 				  new Date(2023, 9, 1), null, daysToMilliseconds(0.5), 25,  '1_Preparacion'],///'1_Preparacion'
		  ['1.2_Planificacion', 'Validación planificación proyecto', 'Preparación', null, new Date(2023, 9, 3), daysToMilliseconds(1), 25,  '1_Preparation'],///'1_Preparacion'
		  ['1.3_Accesos', 'Accesos y permisos a sistemas', 'Preparación', null,           new Date(2023, 9, 4), daysToMilliseconds(1), 20,  '1_Preparation'],///'1_Preparacion'
		  ['1.4_Kickoff', 'Reunión de lanzamiento - kickoff', 'Preparación', null,        new Date(2023, 9, 5), daysToMilliseconds(1), 0,   '1_Preparation'],///'1_Preparacion'
		  ['1.5_Prep_Entornos', 'Preparación de entornos', 'Preparación', null,           new Date(2023, 9, 6), daysToMilliseconds(1), 100, '1_Preparation'],///'1_Preparacion'
		  */
		  ['2_Analysis', 'II. Análisis y Diseño', null, 							null, null,  daysToMilliseconds(1),  100,  '1_Preparation'],
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
			}
		  },
		  backgroundColor:  {
			'fill': 'white',
			'opacity': 0
		 },
		  width: '100%',
		  height: '100%'
		};

		// var chart = new google.visualization.Gantt(document.getElementById('chart_div'));
		// let nttGanttElements  = document.getElementsByTagName("com-nttdata-ses-cw-gantt");
		// const chartDivElement = nttGanttElements[0].shadowRoot.getElementById("chart_div");
		// var   chart			  = new google.visualization.Gantt(chartDivElement); 

		const chartDivElement = htmlElementGantt.shadowRoot.getElementById("chart_div");
		var   chart			  = new google.visualization.Gantt(chartDivElement); 
		chart.draw(data, options);

		//=============================================================
		// Save the google gant chart to Gantt class' attribute:
		htmlElementGantt.chart = chart;
		//if(nttDebug==1)console.log("=======> Debug NTT - Gantt constructor - chart content:");
		//if(nttDebug==1)console.log(htmlElementGantt.chart);

		htmlElementGantt.data = data;
		//if(nttDebug==1)console.log("=======> Debug NTT - Gantt constructor - data content:");
		//if(nttDebug==1)console.log(htmlElementGantt.data);

		htmlElementGantt.options = options;
		//if(nttDebug==1)console.log("=======> Debug NTT - Gantt constructor - options content:");
		//if(nttDebug==1)console.log(htmlElementGantt.options);

		if(nttDebug==1)console.log("=======> Debug NTT - Google Chart - End grantt draw 1");

		//=============================================================
		// taskProperty values: 'Start Date', 'End Date', 'Duration', 'Percent Complete', 'Dependencies'
		data.updateTask = function (taskId, taskProperty, newValue){ 
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
			var columnIndexes = [null,'Task Name','Resource', 'Start Date', 'End Date', 'Duration', 'Percent Complete', 'Dependencies'];
			var propertyIndex = columnIndexes.indexOf(taskProperty);
			if( taskRow != null && propertyIndex > 0 ){
				console.log("taskRow: "+taskRow.toString()+" | propertyIndex: "+propertyIndex.toString());
				if( propertyIndex==5 && newValue != null ){ //  propertyIndex==4 means 'Duration' in days
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

		if(nttDebug==1)console.log("=======> Debug NTT - Google Chart - End grantt draw 2");
	}

	// ===================== Auxiliar functions =================================
	
	// Generic function to load JavaScript libraries into the custom widget
	function loadScript(url,shadowRoot, callbackFunction) {
		const script = document.createElement('script');
		script.type  = 'text/javascript';
		script.src  = url;
		script.addEventListener("load", callbackFunction);
		script.nonce = document.getElementsByTagName("script")[0].nonce; // Importante para que no de error de: Content-Security-Policy
		//if(nttDebug==1)console.log("=======> Debug NTT - Nonce value: "+document.getElementsByTagName("script")[0].nonce);
		shadowRoot.appendChild(script);
	}

		// Function to convert days into milliseconds, to be used in the Google Gantt Chart
	function daysToMilliseconds(days) {
		return days * 24 * 60 * 60 * 1000;
	}
	
	// Main class for the Gantt chart custom widget
	class Gantt extends HTMLElement {

		constructor() {
			//if(nttDebug==1)console.log("=======> Debug NTT - Constructor");
			super(); 
			let _shadowRoot = this.attachShadow({mode: "open"});
			_shadowRoot.appendChild(template.content.cloneNode(true));
			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});
			this._props = {};

			//=============================================================
			   _htmlElementGantt = this; // save this class as a global var to debug and development propose
			var htmlElementGantt = this; // create this temporary var to pass to drawChart() function as parameter
			// Load JavaScript Google Chart library
			if(nttDebug==1)console.log("=======> Debug NTT - Google Chart - Start load library");
			loadScript("https://www.gstatic.com/charts/loader.js",_shadowRoot,function(){
				// Cargar el paquete de gráficos de gantt
				google.charts.load('current', {'packages':['gantt']});
				// --> to check in the future the gantt translation -> google.charts.load('current', {'packages':['corechart'], 'language': 'ja'});
				// Call to drawChart function 
				if(nttDebug==1)console.log("=======> Debug NTT - Google Chart - Start grantt draw");
				google.charts.setOnLoadCallback(function(){
					drawChart(htmlElementGantt);
				});
			});
		}

		onCustomWidgetBeforeUpdate(changedProperties) {
			if(nttDebug==1)console.log("=======> Debug NTT - onCustomWidgetBeforeUpdate");
			this._props = { ...this._props, ...changedProperties };
		}

		onCustomWidgetAfterUpdate(changedProperties) {
			if(nttDebug==1)console.log("=======> Debug NTT - onCustomWidgetAfterUpdate");
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
				if(nttDebug==1)console.log("=======> Debug NTT - Cambio en ancho de 'Custome widget': "+changedProperties["width"]);
			}
			if ("height" in changedProperties) {
				//this.style["opacity"] = changedProperties["opacity"];
				if(nttDebug==1)console.log("=======> Debug NTT - Cambio en alto de 'Custome widget': "+changedProperties["height"]);
			}
		}

		setStartDate(startDate){ // Date formar: yyyymmdd
			//if(nttDebug==1)console.log("=======> Debug NTT - setStartDate(startDate) - Input date: "+startDate);
			this.startDate = startDate.toString().substr(0,4)+"-"+startDate.toString().substr(4,2)+"-"+startDate.toString().substr(6,2);
			//if(nttDebug==1)console.log("=======> Debug NTT - setStartDate(startDate) - Final date: "+this.startDate);
			this.data.updateTask('1_Preparation', 'Start Date', new Date(this.startDate));
			this.refresh();
		}

		setTaskProperty(taskId, propertyName, newValue){
			if(nttDebug==1)console.log("=======> Debug NTT - setTaskProperty(taskId,propertyName,newValue) - taskId: "+taskId+" / propertyName: "+propertyName+" / newValue: "+newValue);
			this.data.updateTask(taskId, propertyName, newValue);
			this.refresh();
		}
		// _htmlElementGantt.setTaskProperty('1_Preparation','Duration',3);

		getTaskProperty(taskId){
			if(nttDebug==1)console.log("=======> Debug NTT - setStartDate(startDate) - Input date: "+startDate);
			var convertedDate = startDate.toString().substr(0,4)+"-"+startDate.toString().substr(4,2)+"-"+startDate.toString().substr(6,2);
			if(nttDebug==1)console.log("=======> Debug NTT - setStartDate(startDate) - Converted date: "+convertedDate);
			this.startDate = convertedDate;
			if(nttDebug==1)console.log("=======> Debug NTT - setStartDate(startDate) - Final date: "+this.startDate);
		}		

		// Update the gantt's user interface to show recent changes
		refresh() {
			if(nttDebug==1)console.log("=======> Debug NTT - refresh()");
			this.chart.draw(this.data, this.options);
		}

		reset() {
			if(nttDebug==1)console.log("=======> Debug NTT - clearChart");
			/*
			var data = new google.visualization.DataTable();
			data.addColumn('string', 'Task ID'); 		  data.addColumn('string', 'Task Name');	data.addColumn('string', 'Resource');
			data.addColumn('date',   'Start Date');		  data.addColumn('date',   'End Date');		data.addColumn('number', 'Duration');
			data.addColumn('number', 'Percent Complete'); data.addColumn('string', 'Dependencies');
			//this.chart.removeRow(0);
			
			//google.charts.setOnLoadCallback(drawChart);
			if(nttDebug==1)console.log("=======> Debug NTT - clearChart -- v1"); 
			*/
		}
		
	}

	customElements.define("com-nttdata-ses-cw-gantt", Gantt);
		
})();