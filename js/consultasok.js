var _clave = "";
var _params = "";
var _url = "";

//para que no tarde el click
window.addEventListener('load', function() {
	new FastClick(document.body);
}, false);

function actualizar(){
	//alert("JJJJJJJJ");	

	$.mobile.changePage( "#page-loading", { transition: "slideup", changeHash: true });

	cargar_posibles_servicios();
	cargar_practicos_turnos();		
	cargar_servicios_sin_practico();
	cargar_servicios_activos();		
		
	$.mobile.changePage( "#page-principal", { transition: "slideup", changeHash: true });
	};

$("#actualizar").addClass("ddddddddddddddd");

function ws_leer_url(){
	var url =acceso_ws_get_url();
	alert("leido " + url);
	$("#url_ws").val(url);
};

function ws_validar_clave(){
	var url  = $("#url_ws").val();
	acceso_ws_set_url(url);
	
	alert(url + " - Guardado!.");
	$.mobile.changePage( "#page-principal", { transition: "slideup", changeHash: true });
};


function ajax_cargar(url, params, nombre, id_tabla ){
	var ajax = $.ajax({
	url: url,
	data: params, 
	type: 'POST',
	contentType: "application/json; charset=utf-8",
	async: false,
	dataType: 'json',
	beforeSend: function () {
		$("#estado").html("Actualizando "+ nombre +" ...");
	}
    });
    ajax.done(function (response) {
		//alert("DONEEEEE");
		//alert(response);		
		var resultado_json = $.parseJSON(response.d);
		//codigo | descripcion | resultado
		//alert("codigo: " + resultado_json.codigo);
		//alert("descripcion: " + resultado_json.descripcion);
		//alert("resultado: " + resultado_json.resultado);
		
		if(resultado_json.codigo !=100){//100 es ok
			alert("webService error cod: " + resultado_json.codigo);
			alert("webService error desc: " + resultado_json.descripcion);
			alert("res: " + resultado_json);
			for(var d in resultado_json){
				alert(d);
				alert(resultado_json[d]);
			}
		}else{
			//alert(resultado_json);
			//alert("fin ok--------------------------------");
			//onDone(resultado_json.resultado, id_tabla);
			/////////////////////////////////////////////////////////////////
			//limpio la tabla 
			$("#" + id_tabla + " tbody").empty();
			//$("#tbodyid").empty();


			var columnas = [];					
			/*trago las columnas del th para saber el orden en el que se tienen que cargar los datos*/
			$("#"+id_tabla + " thead th").each(function( index ) {
			  //alert( index + ": " + $(this).text() );
			  columnas.push($(this).text());
			});
			//alert(columnas.join("-"));
			var data = resultado_json.resultado;
			for (var i = 0; i < data.length; i++) {
				var rowData = data[i];
				//alert("rowData: " + rowData);
				var row = $("<tr/>")
				$("#"+id_tabla).append(row); 
				
				for(var j in columnas){
					if(rowData[columnas[j]]!=null)
						row.append($("<td>" + rowData[columnas[j]] + "</td>"));
					else
						row.append($("<td>" + rowData + "</td>"));
				}				
			}
			//alert("TERMINADO " + nombre);
			
			////////////////////////////////////////////////////////////////
			$("#estado").html(nombre + " OK");
		}
				
		
    });
    ajax.fail(function (xhr, status) {
		$("#estado").html( nombre + " ERROR");
        alert("fail-" + status);
    });
    ajax.always(function () {
		//alert("allways");
		//$("#estado").html("OKOKOK");
    });	
};


function cargar_posibles_servicios(){
	var url = _url + WS_POSIBLES_SERVICIOS;		
	//alert("ajax antes");	
	ajax_cargar(url, _params, "Posibles servicios", "tabla-posibles-servicios");
	//alert("ajax despues ");	
};

function cargar_servicios_activos(){
	var url = _url + WS_SERVICIOSACTIVOS;
	ajax_cargar(url, _params, "Servicios activos", "tabla-servicios-activos");
}

function cargar_practicos_turnos(){	
	//alert("cargar_practicos_turnos");	
	var url = _url + WS_PRACTICOS;
	//alert("ajax antes");
	ajax_cargar(url, _params, "practicos Turnos", "tabla-practicos-turnos");


};

function cargar_servicios_sin_practico(){
	var url = _url + WS_SERVICIOSSINPRACTICO;
	//alert("ajax antes Servicios sin practico");
	ajax_cargar(url, _params, "Servicios sin practico", "tabla-servicios-sin-practico");
	//alert("ajax despues Servicios sin practico");	
};

$(document).ready(function(){
	alert("ready-indexok.js");
	_clave = acceso_ws_get_clave();
	_params = "{acceso: '"+_clave+"'}";
	_url = acceso_ws_get_url();
	actualizar();
	
});
