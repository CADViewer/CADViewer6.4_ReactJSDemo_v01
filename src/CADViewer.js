import React, { Component }  from 'react';
//import {findDOMNode } from 'react-dom';
//import logo from './logo.svg';
//import { render } from '@testing-library/react';
//import  ResizeObserver from 'rc-resize-observer';
// import { View } from 'react-native';
//import 'jquery-ui';
import jQuery from "jquery";

import './CADViewer_component.css';

//import * as cadviewer from "./cadviewer/app/cv/cv-pro/cadviewer_base_pro_6_4_06.js";
import * as cadviewer from "./cadviewer/app/cv/cv-pro/cadviewer_react.min.js";



// In the component that visualizes CADViewer, we need CADViewer style sheet, bootstrap, bootstrap-multiselect and jquery.qtip
import './cadviewer/app/css/cvjs_6.1.0.css';
import './cadviewer/app/css/bootstrap.min.css';
import './cadviewer/app/css/bootstrap-multiselect.css';
import './cadviewer/app/css/jquery.qtip.min.css';


var roomLayer1; 

var  selected_handles = [];
var  handle_selector = false;
var  current_selected_handle = "";


// we have to export the CADViewer methods in which we are getting information return from CADViewer 
export function cvjs_OnLoadEnd(){
	// generic callback method, called when the drawing is loaded
	// here you fill in your stuff, call DB, set up arrays, etc..
	// this method MUST be retained as a dummy method! - if not implemeted -

	cadviewer.cvjs_resetZoomPan("floorPlan");

	var user_name = "Bob Smith";
	var user_id = "user_1";

	// set a value for redlines
	cadviewer.cvjs_setCurrentStickyNoteValues_NameUserId(user_name, user_id );
	cadviewer.cvjs_setCurrentRedlineValues_NameUserid(user_name, user_id);
	// cadviewer.cvjs_dragBackgroundToFront_SVG("floorPlan");					
	//cvjs_initZeroWidthHandling("floorPlan", 1.0);			

	roomLayer1 = cadviewer.cvjs_clearLayer(roomLayer1);
	
	cadviewer.cvjs_LayerOff("EC1 Space Names");
	cadviewer.cvjs_LayerOff("EC1 Space Status Descs");
	cadviewer.cvjs_LayerOff("EC1 Space Project");
	cadviewer.cvjs_LayerOff("EC1 Space Function Descs");
	cadviewer.cvjs_LayerOff("EC1 Space Type Descs");
	cadviewer.cvjs_LayerOff("EC1 Tenant Names");
	cadviewer.cvjs_LayerOff("EC1 UDA Design Capacity");
	cadviewer.cvjs_LayerOff("EC1 UDA Is Secured");

}

export function cvjs_OnLoadEndRedlines(){
	// generic callback method, called when the redline is loaded
	// here you fill in your stuff, hide specific users and lock specific users
	// this method MUST be retained as a dummy method! - if not implemeted -

	// I am hiding users added to the hide user list
	cadviewer.cvjs_hideAllRedlines_HiddenUsersList();

	// I am freezing users added to the lock user list
	cadviewer.cvjs_lockAllRedlines_LockedUsersList();
}

// Callback Method on Creation and Delete 
export function cvjs_graphicalObjectOnChange(type, graphicalObject, spaceID){
	var myobject;
	// do something with the graphics object created! 
//	window.alert("CALLBACK: cvjs_graphicalObjectOnChange: "+type+" "+graphicalObject+" "+spaceID+" indexSpace: "+graphicalObject.toLowerCase().indexOf("space"));
	console.log("CALLBACK: cvjs_graphicalObjectOnChange: "+type+" "+graphicalObject+" "+spaceID+" indexSpace: "+graphicalObject.toLowerCase().indexOf("space"));

	if (type == 'Create' && graphicalObject.toLowerCase().indexOf("space")>-1 && graphicalObject.toLowerCase().indexOf("circle")==-1){
			
		/**
		 * Return a JSON structure of all content of a given ID: <br>
		* 	var jsonStructure =  	{	"path":   path, <br>
		*								"tags": tags, <br>
		*								"node": node, <br>
		*								"outerhtml": outerHTML, <br>
		*								"occupancy": occupancy, <br>
		*								"name": name, <br>
		*								"type": type, <br>
		*								"id": id, <br>
		*								"defaultcolor": defaultcolor, <br>
		*								"layer": layer, <br>
		*								"group": group, <br>
		*								"linked": linked, <br>
		*								"attributes": attributes, <br>
		*								"attributeStatus": attributeStatus, <br>
		*								"displaySpaceObjects": displaySpaceObjects, <br>
		*								"translate_x": translate_x, <br>
		*								"translate_y": translate_y, <br>
		*								"scale_x": scale_x ,<br>
		*								"scale_y": scale_y ,<br>
		*								"rotate": rotate, <br>
		*								"transform": transform} <br>
		* @param {string} spaceID - Id of the Space Object to return
		* @return {Object} jsonSpaceObject - Object with the entire space objects content
		*/

		myobject = cadviewer.cvjs_returnSpaceObjectID(spaceID);
		// I can save this object into my database, and then use command 
		// cvjs_setSpaceObjectDirect(jsonSpaceObject) 
		// when I am recreating the content of the drawing at load
		// for the fun of it, display the SVG geometry of the space:			
		console.log("This is the SVG: "+myobject.outerhtml)
	}


	if (type == 'Delete' && graphicalObject.toLowerCase().indexOf("space")>-1 ){
		// remove this entry from my DB

		window.alert("We have deleted: "+spaceID)
	}


	if (type == 'Move' && graphicalObject.toLowerCase().indexOf("space")>-1 ){
		// remove this entry from my DB

		console.log("This object has been moved: "+spaceID)		
		myobject = cadviewer.cvjs_returnSpaceObjectID(spaceID);

	}

}


export function cvjs_saveStickyNotesRedlinesUser(){

// there are two modes, user handling of redlines
// alternatively use the build in redline file manager

cadviewer.cvjs_openRedlineSaveModal("floorPlan");

// custom method startMethodRed to set the name and location of redline to save
// see implementation below
//startMethodRed();
// API call to save stickynotes and redlines
//cvjs_saveStickyNotesRedlines("floorPlan");
}


// This method is linked to the load redline icon in the imagemap
export function cvjs_loadStickyNotesRedlinesUser(){


cadviewer.cvjs_openRedlineLoadModal("floorPlan");

// first the drawing needs to be cleared of stickynotes and redlines
//cvjs_deleteAllStickyNotes();
//cvjs_deleteAllRedlines();

// custom method startMethodRed to set the name and location of redline to load
// see implementation below
// startMethodRed();

// API call to load stickynotes and redlines
//cvjs_loadStickyNotesRedlines("floorPlan");
}

// Here we are writing a basic function that will be used in the PopUpMenu
// this is template on all the good stuff users can add
export function my_own_clickmenu1(){
var id = cadviewer.cvjs_idObjectClicked();
//		var node = cvjs_NodeObjectClicked();
window.alert("Custom menu item 1: Here developers can implement their own methods, the look and feel of the menu is controlled in the settings.  Clicked object ID is: "+id);
}

// Here we are writing a basic function that will be used in the PopUpMenu
// this is template on all the good stuff users can add
export function my_own_clickmenu2(){
var id = cadviewer.cvjs_idObjectClicked();
//var node = cvjs_NodeObjectClicked();

window.alert("Custom menu item 2: Here developers can implement their own methods, the look and feel of the menu is controlled in the settings. Clicked object ID is: "+id);
//window.alert("Custom menu item 2: Clicked object Node is: "+node);
}

export function cvjs_popupTitleClick(roomid){
	window.alert("we have clicked "+roomid);	
}
   

// HANDLING OF MOUSE OPERATION


// ENABLE ALL API EVENT HANDLES FOR AUTOCAD Handles
export function cvjs_mousedown(id, handle, entity){

}

export function cvjs_click(id, handle, entity){


  console.log("mysql click "+id+"  "+handle);
  // if we click on an object, then we add to the handle list
  if (handle_selector){
      selected_handles.push({id,handle});
      current_selected_handle = handle;
  }

// tell to update the Scroll bar 
//vqUpdateScrollbar(id, handle);
// window.alert("We have clicked an entity: "+entity.substring(4)+"\r\nThe AutoCAD Handle id: "+handle+"\r\nThe svg id is: "+id+"\r\nHighlight SQL pane entry");
}

export function cvjs_dblclick(id, handle, entity){

console.log("mysql dblclick "+id+"  "+handle);
window.alert("We have double clicked entity with AutoCAD Handle: "+handle+"\r\nThe svg id is: "+id);
}

export function cvjs_mouseout(id, handle, entity){

  console.log("mysql mouseout "+id+"  "+handle);
  
  if (current_selected_handle == handle){
      // do nothing
  }
  else{
      cadviewer.cvjs_mouseout_handleObjectStyles(id, handle);
  }
}

export function cvjs_mouseover(id, handle, entity){

console.log("mysql mouseover "+id+"  "+handle+"  "+jQuery("#"+id).css("color"))
//cvjs_mouseover_handleObjectPopUp(id, handle);	
}

export function cvjs_mouseleave(id, handle, entity){

console.log("mysql mouseleave "+id+"  "+handle+"  "+jQuery("#"+id).css("color"));
}


export function cvjs_mouseenter(id, handle, entity){
//	cvjs_mouseenter_handleObjectStyles("#a0a000", 4.0, 1.0, id, handle);
//	cvjs_mouseenter_handleObjectStyles("#ffcccb", 5.0, 0.7, true, id, handle);


cadviewer.cvjs_mouseenter_handleObjectStyles("#F00", 2.0, 1.0, true, id, handle);

}

// END OF MOUSE OPERATION



// generic callback method, tells which FM object has been clicked
export function cvjs_change_space(){
}

export function cvjs_graphicalObjectCreated(graphicalObject){
// do something with the graphics object created!
//		window.alert(graphicalObject);

}

export function cvjs_ObjectSelected(rmid){
	// placeholder for method in tms_cadviewerjs_modal_1_0_14.js   - must be removed when in creation mode and using creation modal
}



export function cvjs_measurementCallback(){
}
export function cvjs_CalibrateMeasurementCallback(){
}
export function cvjs_Url_callback(){
}
export function cvjs_loadSpaceImage_UserConfiguration(){
}
export function cvjs_NoObjectSelected(){
}
export function cvjs_SVGfileObjectClicked(){
}
export function cvjs_SVGfileObjectMouseEnter(){
}
export function cvjs_SVGfileObjectMouseLeave(){
}
export function cvjs_SVGfileObjectMouseMove(){
};
export function cvjs_ParseDisplayDataMaps(){
};
export function cvjs_QuickCountCallback(){
};
export function cvjs_OnHyperlinkClick(){
};
export function cvjs_setUpStickyNotesRedlines(){
};
export function custom_host_parser_PopUpMenu(){
};
export function cvjs_customHostParser(){
}
export function drawPathsGeneric(){
};
export function cvjs_callbackForModalDisplay(){
};
export function cvjs_populateMyCustomPopUpBody(){
};
export function cvjs_customModalPopUpBody(){
};
export function cvjs_NoObjectSelectedStickyNotes(){
};
export function cvjs_NoObjectSelectedHyperlinks(){
};
export function cvjs_ObjectSelectedHyperlink(){
};
export function cvjs_ObjectSelectedStickyNotes(){
};





class CADViewer extends Component {

	async componentDidMount () {

		// window.alert("loading 6.4.05");

		window.addEventListener('resize', this._handleWindowResize);
	
		var ServerBackEndUrl = "http://localhost:3000/";
		var ServerUrl = "http::/localhost:8000/";
		var ServerLocation = "c:/nodejs/cadviewer/";

		//var FileName = ServerBackEndUrl+ "/content/drawings/dwg/LUXR-42-01-PID-005_0-Model.pdf";
		//var FileName = ServerBackEndUrl + "/content/drawings/dwg/BRA_Alta Vila_02_CkIn_06082020.dwg";	
		//var FileName = ServerBackEndUrl+ "/content/drawings/dwg/LUXR-42-01-PID-005_0-Model.pdf";
		//var FileName = ServerBackEndUrl+ "/content/drawings/dwg/hq17_2spaces.dwg";
		var FileName = ServerBackEndUrl+ "/content/drawings/dwg/hq17_.dwg";

		cadviewer.cvjs_debugMode(true);
		cadviewer.cvjs_setServerLocationURL(ServerLocation, ServerUrl);
		cadviewer.cvjs_setServerBackEndUrl(ServerBackEndUrl);
//	    cadviewer.cvjs_setAngular(false);
		cadviewer.cvjs_setHandlerSettings('ReactJS');

		// PATH and FILE to be loaded, can be in formats DWG, DXF, DWF, SVG , JS, DGN, PCF, JPG, GIF, PNG
		  //var FileName = ServerBackEndUrl+ "/content/drawings/dwg/hq17_.dwg";		
		
	   
		  // Location of installation folders
		  // NOTE: THE LOCATION OF THE ServerLocation/ServerUrl VARIABLES ARE DEFINED IN /cadviewer/app/cv/XXXHandlerSettings.js	
		  //	var ServerLocation = 
		  //	var ServerUrl =    
		 cadviewer.cvjs_CADViewerPro(true);
		 
		 // Pass over the location of the installation, will update the internal paths
		 cadviewer.cvjs_PrintToPDFWindowRelativeSize(0.8);
		 cadviewer.cvjs_setFileModalEditMode(false);
	   		   
			// For "Merge DWG" / "Merge PDF" commands, set up the email server to send merged DWG files or merged PDF files with redlines/interactive highlight.
			// See php / xampp documentation on how to prepare your server
		cadviewer.cvjs_emailSettings_PDF_publish("From CAD Server", "my_from_address@mydomain.com", "my_cc_address@mydomain.com", "my_reply_to@mydomain.com");
		   	 
			 // CHANGE LANGUAGE - DEFAULT IS ENGLISH
	   //      cvjs_loadCADViewerLanguage("English", ServerUrl+"/assets/cadviewer/app/cv/cv-pro/language_table/cadviewerProLanguage.xml");
	   
			 // set to Angular mode
			 cadviewer.cvjs_loadCADViewerLanguage("English", "/app/cv/cv-pro/language_table/cadviewerProLanguage.xml");
	   	   
			 // Available languages:  "English" ; "French, "Korean", "Spanish", "Portuguese", "Chinese-Simplified", "Chinese-Traditional"
				 
			 // Set Icon Menu Interface controls. Users can: 
			 // 1: Disable all icon interfaces
			 //  cvjs_displayAllInterfaceControls(false, "floorPlan");  // disable all icons for user control of interface
	   
	   
			 // 2: Disable either top menu icon menus or navigation menu, or both
	   
			//cvjs_displayTopMenuIconBar(false, "floorPlan");  // disable top menu icon bar
			//cvjs_displayTopNavigationBar(false, "floorPlan");  // disable top navigation bar
	   
			 // 3: Users can change the number of top menu icon pages and the content of pages, based on a configuration file in folder /cadviewer/app/js/menu_config/    
			 cadviewer.cvjs_setTopMenuXML("floorPlan", "cadviewer_full_commands_01.xml", "/app/cv/cv-pro/menu_config/");
	   
			
			 // Initialize CADViewer  - needs the div name on the svg element on page that contains CADViewerJS and the location of the
			 // main application "app" folder. It can be either absolute or relative
		   		  
		   
			 // SETTINGS OF THE COLORS OF SPACES
			 var cvjsRoomPolygonBaseAttributes = {
					   fill: '#d8e1e3', //'#d8e1e3', // '#ffd7f4', //'#D3D3D3',   // #FFF   #ffd7f4
					   "fill-opacity": 0.04,    //"0.05",   // 0.1
					   stroke: '#CCC',  
					   'stroke-width': 0.25,
					   'stroke-linejoin': 'round',
				   };
			   
			 var cvjsRoomPolygonHighlightAttributes = {
					 fill: '#a4d7f4',
					 "fill-opacity": "0.5",
					 stroke: '#a4d7f4',
					 'stroke-width': 0.75
				   };
				   
			 var cvjsRoomPolygonSelectAttributes = {
					 fill: '#5BBEF6',
					 "fill-opacity": "0.5",
					 stroke: '#5BBEF6',
					 'stroke-width': 0.75
				   };
		   
		   /** FIXED POP-UP MODAL  **/
		   
			 // THIS IS THE DESIGN OF THE pop-up MODAL WHEN CLICKING ON SPACES
			// KEEP METHODS NAME AS IS FOR NOW...............

			 var my_cvjsPopUpBody = "<div class=\'cvjs_modal_1\' id=\'my_own_clickmenu1()\'>Custom<br>Menu 1<br><i class=\'fa fa-undo\'></i></div>";
			 my_cvjsPopUpBody += "<div class=\'cvjs_modal_1\' id=\'my_own_clickmenu2()\'>Custom<br>Menu 2<br><i class=\'fa fa-info-circle\'></i></div>";
			 my_cvjsPopUpBody += "<div class=\'cvjs_modal_1\' id=\'cvjs_zoomHere()\'>Zoom<br>Here<br><i class=\'fa fa-search-plus\'></i></div>";
			 

			 // Initialize CADViewer - needs the div name on the svg element on page that contains CADViewerJS and the location of the
			 // And we intialize with the Space Object Custom values
		   //  cvjs_InitCADViewer_highLight_popUp_app("floorPlan", ServerUrl+"app/", cvjsRoomPolygonBaseAttributes, cvjsRoomPolygonHighlightAttributes, cvjsRoomPolygonSelectAttributes, my_cvjsPopUpBody);
	   
		   //      cvjs_InitCADViewer_highLight_popUp_app("floorPlan", ServerUrl+ "/cadviewer/app/", cvjsRoomPolygonBaseAttributes, cvjsRoomPolygonHighlightAttributes, cvjsRoomPolygonSelectAttributes, my_cvjsPopUpBody );
		   cadviewer.cvjs_InitCADViewer_highLight_popUp_app("floorPlan", "/cadviewer/app/", cvjsRoomPolygonBaseAttributes, cvjsRoomPolygonHighlightAttributes, cvjsRoomPolygonSelectAttributes, my_cvjsPopUpBody );
		
			 	   
			 // set the location to license key, typically the js folder in main app application folder ../app/cv/
			 //cadviewer.cvjs_setLicenseKeyPath("/cadviewer/app/cv/");
			 // alternatively, set the key directly, by pasting in the cvKey portion of the cvlicense.js file, note the JSON \" around all entities 	 
			 cadviewer.cvjs_setLicenseKeyDirect('{ \"cvKey\": \"00110010 00110010 00110000 00110001 00110010 00110000 00110100 00110001 00110100 00111000 00110001 00110100 00110101 00110001 00110101 00110111 00110001 00110101 00111001 00110001 00110100 00111000 00110001 00110101 00110010 00110001 00110100 00110101 00110001 00110100 00110001 00110001 00110100 00110000 00110001 00111001 00111000 00110010 00110000 00110110 00110010 00110000 00111000 00110010 00110000 00110110 00110010 00110000 00110111 00110010 00110001 00110001 00110010 00110000 00111000 00110010 00110000 00110101 00110010 00110001 00110001 00110010 00110000 00110101 00110010 00110000 00110111 \" }');		 
			  	 
			 // Sets the icon interface for viewing, layerhanding, measurement, etc. only
			 //cvjs_setIconInterfaceControls_ViewingOnly();
		   
			 // disable canvas interface.  For developers building their own interface
			 // cvjs_setIconInterfaceControls_DisableIcons(true);
		   
		   
			 cadviewer.cvjs_allowFileLoadToServer(true);
		   
		   //		cvjs_setUrl_singleDoubleClick(1);
		   //		cvjs_encapsulateUrl_callback(true);
			
			 // NOTE BELOW: THESE SETTINGS ARE FOR SERVER CONTROLS FOR UPLOAD OF REDLINES
			 


			// NOTE BELOW: THESE SETTINGS ARE FOR SERVER CONTROLS FOR UPLOAD OF REDLINES, FILES, SPACE OBJECTS
			cadviewer.cvjs_setServerFileLocation_AbsolutePaths(ServerLocation+'/content/drawings/dwg/', ServerUrl+'content/drawings/dwg/',"","");
			cadviewer.cvjs_setRedlinesAbsolutePath(ServerBackEndUrl+'/content/redlines/fileloader_610/', ServerLocation+'/content/redlines/fileloader_610/');
			cadviewer.cvjs_setSpaceObjectsAbsolutePath(ServerBackEndUrl+'/content/spaceObjects/', ServerLocation+'/content/spaceObjects/');
			cadviewer.cvjs_setInsertImageObjectsAbsolutePath(ServerBackEndUrl+'/content/inserted_image_objects/', ServerLocation+'/content/inserted_image_objects/')

			 
			 cadviewer.cvjs_conversion_clearAXconversionParameters();
//			 cadviewer.cvjs_conversion_addAXconversionParameter("lw", "0.3");		 
//			 cadviewer.cvjs_conversion_addAXconversionParameter("lwmin", "0.3");		 

			// process layers for spaces  RL/TL
			 cadviewer.cvjs_conversion_addAXconversionParameter("RL", "RM_");		 
	         cadviewer.cvjs_conversion_addAXconversionParameter("TL", "RM_TXT");		 
			 // calculate areas of spaces
	         cadviewer.cvjs_conversion_addAXconversionParameter("LA", "");		 

			 //      cvjs_conversion_addAXconversionParameter("RL", "EC1 Space Polygons");		 
	   //      cvjs_conversion_addAXconversionParameter("TL", "EC1 Space Numbers");		 
	   
	   
			cadviewer.cvjs_conversion_addAXconversionParameter("last", "");		 
			cadviewer.cvjs_conversion_addAXconversionParameter("fpath", ServerLocation + "/converters/ax2020/windows/fonts/");		 
		   					 
			 // NOTE ABOVE: THESE SETTINGS ARE FOR SERVER CONTROLS FOR CONVERTING DWG, DXF, DWF files
		   
			 // Load file - needs the svg div name and name and path of file to load
			 cadviewer.cvjs_LoadDrawing("floorPlan", FileName );
			
			 // set maximum CADViewer canvas side
			 cadviewer.cvjs_resizeWindow_position("floorPlan" );
	   
			 // alternatively set a fixed CADViewer canvas size
			 //	cvjs_resizeWindow_fixedSize(600, 400, "floorPlan");			   
	}

	componentWillUnmount () {
		window.removeEventListener('resize', this._handleWindowResize);
	}


	_handleWindowResize () {

        console.log("_handleResize")
            // we put the resize in a try-catch in case the init_CADViewer() has not initialized yet, and values are zero
        try{    
            cadviewer.cvjs_resizeWindow_position("floorPlan" );
         //	window.vjs_resizeWindow_fixedSize(600, 400, "floorPlan");		

        } 
        catch(err) {console.log(err);}
    }

    render(){
        return (    
              <div className="CADViewer"> 
					{/*This is the CADViewer floorplan div declaration*/}
					<div id="floorPlan" >
					</div>
					{/*End of CADViewer declaration*/}.
			  </div>
        );
    }
}

export default CADViewer;




