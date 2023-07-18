//=================================================================================
// IMPORTRAR LA BIBLIOTECA GOOGLE CHART JS

// Se obtiene el "Shadow" del elemento: com-nttdata-ses-cw-gantt
let nttGanttElements = document.getElementsByTagName("com-nttdata-ses-cw-gantt");
const nttGanttShadow = nttGanttElements[0].shadowRoot;
nttGanttShadow;
nttGanttShadow.querySelector("#chart_div");

// Se crea una función genérica para cargar bibliotecas JavaScript necesarias para el widget
function loadScript(url) {
    const script = document.createElement('script');
    script.type  = 'text/javascript';
    script.src  = url;
    script.nonce = document.getElementsByTagName("script")[0].nonce; // Importante para que no de error de: Content-Security-Policy
    nttGanttShadow.appendChild(script);
};

loadScript("https://www.gstatic.com/charts/loader.js");

// Se crea al elemento: script JS de Google Chart
/*
let googleChartJSLibraryElement   = document.createElement("script");
googleChartJSLibraryElement.type  = "text/javascript";
googleChartJSLibraryElement.src   = "https://www.gstatic.com/charts/loader.js";
googleChartJSLibraryElement.nonce = document.getElementsByTagName("script")[0].nonce; // Importante para que no de error de: Content-Security-Policy
googleChartJSLibraryElement;
googleChartJSLibraryElement.nonce;
*/

// Se crea al elemento meta de: Content-Security-Policy
/*
let googleChartCSPMeta = document.createElement("meta");
googleChartCSPMeta.httpEquiv = "Content-Security-Policy" ;
googleChartCSPMeta.content   = "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.gstatic.com https://sapui5.hana.ondemand.com https://sapui5.cn1.platform.sapcloud.cn https://internal.orca-cdn-canary.c.eu-de-1.cloud.sap https://*.sapanalytics.cloud https://assets.sapanalyticscloud.cn https://orcadevproxy.sap.corp:* https://askmode.orcatools.only.sap https://js.arcgis.com https://js.arcgisonline.cn ;" ;
let headerElement = document.getElementsByTagName("head")[0];
headerElement.appendChild(googleChartCSPMeta);
headerElement;
*/

// Se añade el "script" de Google Chart al Custome Widget "com-nttdata-ses-cw-gantt"
nttGanttShadow.appendChild(googleChartJSLibraryElement);

//=================================================================================
// AÑADIR EL GANTT AL CUSTOM WIDGET DE SAC

function daysToMilliseconds(days) {
    return days * 24 * 60 * 60 * 1000;
}

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
      height: 275
    };

    //var chart = new google.visualization.Gantt(document.getElementById('chart_div'));
    let nttGanttElements = document.getElementsByTagName("com-nttdata-ses-cw-gantt");
    const nttGanttShadow = nttGanttElements[0].shadowRoot;
    var chart = new google.visualization.Gantt(nttGanttShadow.querySelector("#chart_div"));

    chart.draw(data, options);
}

google.charts.load('current', {'packages':['gantt']});
google.charts.setOnLoadCallback(drawChart);

// ==============================================================================================
/*
// Original SAC HTML source code:
<!--meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-eval' https://sapui5.hana.ondemand.com https://sapui5.cn1.platform.sapcloud.cn https://internal.orca-cdn-canary.c.eu-de-1.cloud.sap https://*.sapanalytics.cloud https://assets.sapanalyticscloud.cn https://orcadevproxy.sap.corp:* https://askmode.orcatools.only.sap https://js.arcgis.com https://js.arcgisonline.cn blob: 'nonce-8IBTHwOdqNKAWeKl7plt8g==';"-->


// SAC Error:
[Report Only] Refused to load the script 'https://www.gstatic.com/charts/loader.js' because it violates the following Content Security Policy directive: "script-src 'self' 'unsafe-eval' https://sapui5.hana.ondemand.com https://sapui5.cn1.platform.sapcloud.cn https://internal.orca-cdn-canary.c.eu-de-1.cloud.sap https://*.sapanalytics.cloud https://assets.sapanalyticscloud.cn https://orcadevproxy.sap.corp:* https://askmode.orcatools.only.sap https://js.arcgis.com https://js.arcgisonline.cn blob: 'nonce-3c4f2e96-813a-4122-95f0-90a068eb012c'". Note that 'script-src-elem' was not explicitly set, so 'script-src' is used as a fallback.


// Original string
<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *"></meta>

// Corrected string
<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *;**script-src 'self' http://onlineerp.solution.quebec 'unsafe-inline' 'unsafe-eval';** "></meta>

// Full permision: 
// blob: data: gap: 
<meta http-equiv="Content-Security-Policy" content="default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;"></meta>
*/

nttGanttElement.innerHTML = "XXX";

let ganttDiv = document.createElement("div");
ganttDiv.id = "gantt-div";

nttGanttElement.appendChild(ganttDiv);

//let chartDivElement = document.getElementById("chart_div");

//<com-nttdata-ses-cw-gantt class="sapCustomWidgetWebComponent" style="background-color: red; opacity: 1;"></com-nttdata-ses-cw-gantt>

// ===================================================================

const shadow = this.attachShadow({ mode: "open" });

// open means that you can access the shadow DOM using JavaScript written in the main page context, for example using the Element.shadowRoot property:
const myShadowDom = myCustomElem.shadowRoot;

// attach the created elements to the shadow DOM
shadow.appendChild(style);
shadow.appendChild(wrapper);





