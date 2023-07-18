//=============================================================
// Start: SAP Analytics Cloud - Custom Windget - NTT Data Gantt
(function() { 
	const nttDebug = true;

	let _shadowRoot;

	let template = document.createElement("template");
	template.innerHTML = `
		<div id="chart_div" style="width: 100%; height: 100%; overflow: auto;"></div>
	`;
	
	// Se crea una función genérica para cargar bibliotecas JavaScript necesarias para el widget
	function loadScript(url,shadowRoot, callbackFunction) {
		const script = document.createElement('script');
		script.type  = 'text/javascript';
		script.src  = url;
		script.addEventListener("load", callbackFunction);
		script.nonce = document.getElementsByTagName("script")[0].nonce; // Importante para que no de error de: Content-Security-Policy
		if(nttDebug==1)console.log("=======> Debug NTT - Nonce value: "+document.getElementsByTagName("script")[0].nonce);
		shadowRoot.appendChild(script);
	};

	// Fundción necesaria para el gantt
	function daysToMilliseconds(days) {
		return days * 24 * 60 * 60 * 1000;
	}
	
	// Inicializar y dibujar el gantt
	function drawChart() {
	
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Task ID'); 		  data.addColumn('string', 'Task Name');	data.addColumn('string', 'Resource');
		data.addColumn('date',   'Start Date');		  data.addColumn('date',   'End Date');		data.addColumn('number', 'Duration');
		data.addColumn('number', 'Percent Complete'); data.addColumn('string', 'Dependencies');

		data.addRows([
		  ['1_Preparacion', 'I. Preparación del proyecto', null, new Date(2023, 9, 1), new Date(2023, 9, 6) , null,  100,  null], 
		  ['1.1_Alcance', 'Validación alcance y equipos', 'Preparación', new Date(2023, 9, 1), null, daysToMilliseconds(0.5), 25,  '1_Preparacion'],///'1_Preparacion'
		  ['1.2_Planificacion', 'Validación planificación proyecto', 'Preparación', null, new Date(2023, 9, 3), daysToMilliseconds(1), 25,  '1_Preparacion'],///'1_Preparacion'
		  ['1.3_Accesos', 'Accesos y permisos a sistemas', 'Preparación', null,           new Date(2023, 9, 4), daysToMilliseconds(1), 20,  '1_Preparacion'],///'1_Preparacion'
		  ['1.4_Kickoff', 'Reunión de lanzamiento - kickoff', 'Preparación', null,        new Date(2023, 9, 5), daysToMilliseconds(1), 0,   '1_Preparacion'],///'1_Preparacion'
		  ['1.5_Prep_Entornos', 'Preparación de entornos', 'Preparación', null,           new Date(2023, 9, 6), daysToMilliseconds(1), 100, '1_Preparacion'],///'1_Preparacion'

		  ['2_Analisis', 'II. Análisis y Diseño', null, 							new Date(2023, 9, 7), new Date(2023, 9, 10),  null,  100,  '1_Preparacion'],
		  ['2.1_Origenes', 'Análisis sistemas origen', 'Analisis',					new Date(2023, 9, 7), new Date(2023, 9, 8),   null,  100,  '2_Analisis'],//'2_Analisis'
		  ['2.2_AF', 'Anáisis y Diseño Funcional', 'Analisis',						new Date(2023, 9, 8), new Date(2023, 9, 9),   null,  100,  '2_Analisis'],//'2_Analisis'
		  ['2.3_DT', 'Diseño Técnico', 'Analisis', 									new Date(2023, 9, 9), new Date(2023, 9, 10),  null,  100,  '2_Analisis'],//'2_Analisis'
		  ['2.4_AprobacionDFDT', 'Aprobación diseño funcional y técnico', 'Analisis', new Date(2023, 9, 9), new Date(2023, 9, 10), null, 100,  '2_Analisis'],//'2_Analisis'

		  ['3_Implantacion', 'III. Implantación', 									null, new Date(2023, 9, 11), new Date(2023, 9, 15), null,  100,  '2_Analisis'],
		  ['3.1_Content', 'Activación del Content', 'Implantacion', 				new Date(2023, 9, 11), new Date(2023, 9, 12), null,  100,  '3_Implantacion'],
		  ['3.2_FuentesDatos', 'Fuentes de datos', 'Implantacion', 					new Date(2023, 9, 12), new Date(2023, 9, 13), null,  100,  '3_Implantacion'],
		  ['3.3_DatosMaestros', 'Datos Maestros', 'Implantacion', 					new Date(2023, 9, 13), new Date(2023, 9, 14), null,  100,  '3_Implantacion'],
		  ['3.4_DTransaccionales', 'Datos Transaccioanles', 'Implantacion', 		new Date(2023, 9, 14), new Date(2023, 9, 15), null,  100,  '3_Implantacion'],
		  ['3.5_Repositorios', 'Repositorios', 'Implantacion', 						new Date(2023, 9, 14), new Date(2023, 9, 15), null,  100,  '3_Implantacion'],
		  ['3.6_Autorizaciones', 'Autorizaciones', 'Implantacion', 					new Date(2023, 9, 14), new Date(2023, 9, 15), null,  100,  '3_Implantacion'],
		  ['3.7_Cadenas', 'Cadenas de procesos', 'Implantacion', 					new Date(2023, 9, 14), new Date(2023, 9, 15), null,  100,  '3_Implantacion'],
		  ['3.8_Reporting', 'Reporting', 'Implantacion', 							new Date(2023, 9, 14), new Date(2023, 9, 15), null,  100,  '3_Implantacion'],
		  	['3.8.1_InformesES', 'Informes E/S', 'Implantacion', 					new Date(2023, 9, 14), new Date(2023, 9, 15), null,  100,  '3_Implantacion'],
			['3.8.2_Formulas', 'Lógicas sencillas/Fórmulas', 'Implantacion', 		new Date(2023, 9, 14), new Date(2023, 9, 15), null,  100,  '3_Implantacion'],
			['3.8.3_BADIs', 'Lógicas complejas (BADIs) - Programación API', 'Implantacion', new Date(2023, 9, 15), new Date(2023, 9, 15), null,  100,  '3_Implantacion'],

		  ['4_Pruebas', 'IV. Plan de Pruebas', 										null, new Date(2023, 9, 16), new Date(2023, 9, 20), null,  100,  '3_Implantacion'],
		  ['4.1_Unitarias', 'Pruebas Unitarias y paso a Integración', 'Pruebas', 	new Date(2023, 9, 16), new Date(2023, 9, 17), null,  100,  '4_Pruebas'],
		  ['4.2_Formacion', 'Formación', 'Pruebas', 								new Date(2023, 9, 18), new Date(2023, 9, 19), null,  100,  '4_Pruebas'],
		  ['4.3_Integracion', 'Pruebas  Integradas en Integración', 'Pruebas', 		new Date(2023, 9, 19), new Date(2023, 9, 20), null,  100,  '4_Pruebas'],
		  ['4.4_Adaptaciones', 'Adaptaciones', 'Pruebas', 							new Date(2023, 9, 19), new Date(2023, 9, 20), null,  100,  '4_Pruebas'],
		  ['4.5_Aceptacion', 'Pruebas de Aceptación', 'Pruebas', 					new Date(2023, 9, 19), new Date(2023, 9, 20), null,  100,  '4_Pruebas'],

		  ['5_Arranque', 'V. Arranque y Soporte', 									null, new Date(2023, 9, 21), new Date(2023, 9, 25), null,  100,  '4_Pruebas'],
		  ['5.1_Despliegue', 'Despliegue a producción', 'Arranque', 				new Date(2023, 9, 21), new Date(2023, 9, 22), null,  100,  '5_Arranque'],
		  ['5.2_Soporte', 'Soporte', 'Arranque', 									new Date(2023, 9, 22), new Date(2023, 9, 23), null,  100,  '5_Arranque'],
		  ['5.3_Cierre', 'Cierre de proyecto', 'Arranque',							new Date(2023, 9, 23), new Date(2023, 9, 25), null,  100,  '5_Arranque'],
		]);
	
		var options = {
		  gantt: {
			trackHeight: 17,
			barHeight:   17,
			labelStyle: {
				fontSize: 10
			  },
		  }
		};

		//var chart = new google.visualization.Gantt(document.getElementById('chart_div'));
		let nttGanttElements  = document.getElementsByTagName("com-nttdata-ses-cw-gantt");
		const _shadowRoot     = nttGanttElements[0].shadowRoot;
		const chartDivElement = _shadowRoot.getElementById("chart_div");
		var chart = new google.visualization.Gantt(chartDivElement); 
	
		chart.draw(data, options);
	}

	class Gantt extends HTMLElement {
		constructor() {
			if(nttDebug==1)console.log("=======> Debug NTT - Constructor");
			super(); 
			let _shadowRoot = this.attachShadow({mode: "open"});
			_shadowRoot.appendChild(template.content.cloneNode(true));

			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});
			this._props = {};

			//=============================================================
			if(nttDebug==1)console.log("=======> Debug NTT - Google Chart - Start chart render");
			// Cargar la biblioteca JavaScript de Google Chart
			loadScript("https://www.gstatic.com/charts/loader.js",_shadowRoot,function(){
				if(nttDebug==1)console.log("=======> Debug NTT - Google Chart - JavaScript library loaded");
				// Cargar el paquete de gráficos de gantt
				google.charts.load('current', {'packages':['gantt']});
				// Invocar a la función drawChart
				google.charts.setOnLoadCallback(drawChart);	


			});

		}

		onCustomWidgetBeforeUpdate(changedProperties) {
			if(nttDebug==1)console.log("=======> Debug NTT - onCustomWidgetBeforeUpdate");
			
			this._props = { ...this._props, ...changedProperties };
		}

		onCustomWidgetAfterUpdate(changedProperties) {
			if(nttDebug==1)console.log("=======> Debug NTT - onCustomWidgetAfterUpdate");
			
			if ("color" in changedProperties) {
				this.style["background-color"] = changedProperties["color"];
			}
			if ("opacity" in changedProperties) {
				this.style["opacity"] = changedProperties["opacity"];
			}

			if ("width" in changedProperties) {
				//this.style["opacity"] = changedProperties["opacity"];
				if(nttDebug==1)console.log("=======> Debug NTT - Cmabio en ancho de 'Custome widget': "+changedProperties["width"]);
			}
			if ("height" in changedProperties) {
				//this.style["opacity"] = changedProperties["opacity"];
				if(nttDebug==1)console.log("=======> Debug NTT - Cmabio en alto de 'Custome widget': "+changedProperties["height"]);
			}
		}
	}

	customElements.define("com-nttdata-ses-cw-gantt", Gantt);
		
})();