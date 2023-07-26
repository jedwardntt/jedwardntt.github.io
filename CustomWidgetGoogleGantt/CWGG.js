let rootGlobal = null;

(function() { 
	let template = document.createElement("template");
	
	template.innerHTML = `
		<style>
		:host {
			border-width: 1px;
			border-color: silver;
			border-style: solid;
			display: block;
		} 
		</style>
		<div id="chart_div" ></div>
	`;

    function daysToMilliseconds(days) {
		return days * 24 * 60 * 60 * 1000;
	}
  
	function drawChart() {
		var data = new google.visualization.DataTable();
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
  
		var options = {
		  height: 275
		};

		let nttGanttElements = document.getElementsByTagName("com-nttdata-ses-cwgg");
		const nttGanttShadow = nttGanttElements[0].shadowRoot;
		var chart = new google.visualization.Gantt(nttGanttShadow.querySelector("#chart_div"));
		chart.draw(data, options);
	}	

	class CWGG extends HTMLElement {
		constructor() {
			super(); 
			let shadowRoot = this.attachShadow({mode: "open"});
			rootGlobal = shadowRoot;
			shadowRoot.appendChild(template.content.cloneNode(true));
			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});			
			this._props = {};

			const script = document.createElement('script');
			script.type  = 'text/javascript';
			script.src   = "https://www.gstatic.com/charts/loader.js";
			script.addEventListener("load", function(){
				google.charts.load('current', {'packages':['gantt']});
				google.charts.setOnLoadCallback(drawChart);
			});
			shadowRoot.appendChild(script);

			const script2 = document.createElement('script');
			script2.type  = 'text/javascript';
			script2.src   = "https://momentjs.com/downloads/moment.js";
			shadowRoot.appendChild(script2);
		}

		onCustomWidgetBeforeUpdate(changedProperties) {
			this._props = { ...this._props, ...changedProperties };
		}

		onCustomWidgetAfterUpdate(changedProperties) {
		}
	}

	customElements.define("com-nttdata-ses-cwgg", CWGG);
})();