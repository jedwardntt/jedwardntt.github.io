//=============================================================
// Start: SAP Analytics Cloud - Custom Windget - NTT Data Gantt
(function() { 
	const nttDebug = true;

	let _shadowRoot;

	let template = document.createElement("template");
	template.innerHTML = `
		<div id="chart_div" style="width: 100%; height: 100%;"></div>
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
		data.addColumn('string', 'Task ID');
		data.addColumn('string', 'Task Name');
		data.addColumn('date',   'Start Date');
		data.addColumn('date',   'End Date');
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
	
		var options = {
		  //height: 275
		};

		//var chart = new google.visualization.Gantt(document.getElementById('chart_div'));
		let nttGanttElements = document.getElementsByTagName("com-nttdata-ses-cw-gantt");
		const _shadowRoot = nttGanttElements[0].shadowRoot;
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