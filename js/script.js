		/*
	
		Name: SLOPEGRAPH (full interactive)
		Developer: J BAYLISS
		From/to: Apr-September 2015
		Technologies: D3, Javascript, D3, Chosen, Bootstrap
		
		*/
		
		
		// initialise global data object.
		// This is a legacy of the original bostock example and is just needed to load in the very frist instance the slopegraph object, before the content of config.json file is read in.	
		var data = {
			"data":[[], []],
			"label":[[]]
		};
				
		
		var dvc = {};	// initialise global dvc 'object'		
		d3.custom = {};	// initialise global d3.custom 'object'
		var graphic_aspect_width = 16; // initialise graphic_aspect_width
		var graphic_aspect_height = 16; // initialise graphic_aspect_width			
		var margin = { top : 5, bottom : 5, left : 5, right : 5 };	// define main margins to use in interactive; initialise all four margins
		var selectedGrpBtn;	// global variable to store the ID of the selected coloured category button 
		var selectedBtnIndex;	// global variable to store the index of the selected coloured category button found in the config.groups array		
		var graphic = $('#graphic');// global variable to #graphic DOM DIV item
		var keypoints = $('#keypoints');// global variable to #keypoints DOM DIV item
		var footer = $(".footer");// global variable to #footer DOM DIV item
		var pymChild = null;
		width = graphic.width();	// global variable to store the width of the #graphic DOM item		
		var buttons = $("#buttons");// global variable to #buttons DOM DIV item
		buttonsWidth = buttons.width();	// global variable to store the width of the #buttons DOM item
		var groupButtons = $("#groupButtons");	// global variable to #groupButtons DOM DIV item
		groupButtonsWidth = groupButtons.width();	// global variable to store the width of the #groupButtons DOM item
		dvc.showData = false;	//global dvc variable to define if user requires data bars, values to be shown	
		dvc.booleanButtons = [ false , false , false , false  , false  , false  ];// global array to initialise boolean checked/unchecked states of category buttons to 'false' (i.e. unselected);	 
		
			
		// define basic dimension for interactive graph display area
		var opts = {
			
			width: 500,
			height: 850,
			margin: { top: 120, right: 275, bottom: 25, left: 275 },
			labelLength: 75
			
		};// end var opts
		
		
		
		// window resize function
		$( window ).resize(function()
		{		
				
		
				// call function to draw scatter plot based on content and initialisation variables.								
				pymChild = new pym.Child({ renderCallback: makeChart});
				pymChild.sendHeight();	
				
				
				return;
				
			
		}); // end window.resize function
			
			
							
		/*
			NAME: 			clickPillGroups
			DESCRIPTION: 	handles user interaction with ny of the other bootstrap buttons, i.e. any category or tool button. Modifies relevant CSS
			CALLED FROM:	onClick of any button in the relevant groups
			CALLS: 			loadChartData					
 			REQUIRES: 		fid - ID of button selected by user
			RETURNS: 		n/a
		*/
		function clickPillGroups(fid){
			
			
			// determines index of selected button inside 'groups' array in config.json file			
			selectedBtnIndex = dvc.config.vars.groups.indexOf(fid);
			selectedGrpBtn = fid;
										
			
			// reset all group buttons and associated  horizontal colour div bars to become inactive */
			dvc.config.vars.groups.forEach(function(d,i)
			{		
						
				var str = (d.toString()).replace(' ', '');
					
					
				d3.select("#" + str).attr("class" , "btn btn-default selectGroup");
				d3.select("#panel" + str).style("opacity" , 0.33);
				d3.select("#" + str).style("pointer-events" , "auto" );
				
				
			})// end forEach 
			
						
			// update selected group button to active class and highlight associated colour div bar.
			d3.select("#" + fid).attr("class" , "btn btn-default selectGroup active");
			d3.select("#" + fid).style("pointer-events" , "none" );
			d3.select("#panel" + fid).style("opacity" , 1.0);
			

			// for each element in array defining which if any group/category selection button has been pressed
			dvc.booleanButtons.forEach(function(d,i){
				
				
				// if element in dvc.booleanButtons is related to the selected group/category button
				if ( i == dvc.config.vars.groups.indexOf(fid) ) {
					
					
					// if element in dvc.booleanButtons is already false, set to true
					if ( dvc.booleanButtons[i] == false ) { dvc.booleanButtons[i] = true; } 
					
					
					// or vice versa
					else { dvc.booleanButtons[i] = false; }					
	
					
				}// end if
				
								
				// if element in dvc.booleanButtons is not related to the selected group/category button
				else
				{
					
				
					// set to false
					dvc.booleanButtons[i] = false;
					
					
				}// end else
				
				
			})// end forEach 
	
	
			
			// modify CSS attribution accordingly
			// hide all slope lines, left hand dots, variable labels, data bars, rank index numbers and data value labels in display
			d3.selectAll('.slope-line').style( "stroke" , "solid" ).style( "stroke-width" , "3px" ).style( "opacity" , 0.05 );
			d3.selectAll(".dotsLeft").style( "opacity" , 0.05 );
			d3.selectAll(".dotsRight").style( "opacity" , 0.05 );
			d3.selectAll('.right_labels').style( "opacity" , 0.25 );
			d3.selectAll('.left_labels').style( "opacity" , 0.00 );
			d3.selectAll('.right_labels').style( "opacity" ,  0.00 );
			d3.selectAll('.barsLeft').style( "opacity" , 0.00 );
			d3.selectAll('.barsRight').style( "opacity" , 0.00 );
			d3.selectAll('.leftRankNumbers').style( "opacity" , 0.00 );
			d3.selectAll('.rightRankNumbers').style( "opacity" , 0.00 );
			d3.selectAll('.dataValuesL').style( "opacity" , 0.00 );
			d3.selectAll('.dataValuesR').style( "opacity" , 0.00 );
			
			
			if ( fid == "Showall" ) {
					
									
				if ( dvc.scalingType == "Ranking and Values" ) {
					
					
					d3.selectAll('.dataValuesL').style( "opacity" , 1.00 );
					d3.selectAll('.dataValuesR').style( "opacity" , 1.00 );
					d3.selectAll('.barsLeft').style( "opacity" , 0.50 );
					d3.selectAll('.barsRight').style( "opacity" , 0.50 );
					d3.selectAll('.leftRankNumbers').style( "opacity" , 1.00 );
					d3.selectAll('.rightRankNumbers').style( "opacity" , 1.00 );					
					
					
				}// end if ...
									
				else if ( dvc.scalingType == "Ranking" ) {
					
					
					d3.selectAll('.dataValuesL').style( "opacity" , 0.00 );
					d3.selectAll('.dataValuesR').style( "opacity" , 0.00 );
					d3.selectAll('.barsLeft').style( "opacity" , 0.00 );
					d3.selectAll('.barsRight').style( "opacity" , 0.00 );
					d3.selectAll('.leftRankNumbers').style( "opacity" , 1.00 );
					d3.selectAll('.rightRankNumbers').style( "opacity" , 1.00 );					
					
					
				} // end else if ...
				
									
				else if ( dvc.scalingType == "Values" ) {
					
					
					d3.selectAll('.dataValuesL').style( "opacity" , 0.00 );
					d3.selectAll('.dataValuesR').style( "opacity" , 0.00 );
					d3.selectAll('.barsLeft').style( "opacity" , 0.00 );
					d3.selectAll('.barsRight').style( "opacity" , 0.00 );
					d3.selectAll('.leftRankNumbers').style( "opacity" , 0.00 );
					d3.selectAll('.rightRankNumbers').style( "opacity" , 0.00 );					
					
					
				}// end else if ...
				
				
				d3.selectAll('.slope-line').style( "stroke" , "solid" ).style( "stroke-width" , "3px" ).style( "opacity" , 1.00 );
				d3.selectAll(".dotsLeft").style( "opacity" , 1.00 );
				d3.selectAll(".dotsRight").style( "opacity" , 1.00 );
				d3.selectAll('.left_labels').style( "opacity" , 1.00);
				d3.selectAll('.right_labels').style( "opacity" , 1.00 );
				
				
			}// end if ... 
			
			
			else {
				
				
				// modify CSS attribution accordingly of only those slope lines, left hand dots, variable labels, data bars, rank index numbers and data value labels in group/category selected by user via pressing a button				
				var selectedLines = d3.selectAll(".slope-line" + "." + fid).style("stroke-width" , "3px" ).style( "opacity" , 1.00 ).style("stroke" , dvc.config.vars.grpColorArray[selectedBtnIndex] );
				var selectedLDots = d3.selectAll(".dotsLeft" + "." + fid).style( "opacity" , 1.00 ).style("stroke" , dvc.config.vars.grpColorArray[selectedBtnIndex] ).style("fill" , dvc.config.vars.grpColorArray[selectedBtnIndex] );
				var selectedRDots = d3.selectAll(".dotsRight" + "." + fid).style( "opacity" , 1.00 ).style("stroke" , dvc.config.vars.grpColorArray[selectedBtnIndex] ).style("fill" , dvc.config.vars.grpColorArray[selectedBtnIndex] );
				var selectedLLabels = d3.selectAll(".left_labels" + "." + fid).style( "opacity" , 1.00 ).style("stroke" ,"none" ).style("fill" , "black" );
				var selectedRLabels = d3.selectAll(".right_labels" + "." + fid).style( "opacity" , 1.00 ).style("stroke" ,"none" ).style("fill" , "black" );					
				
				
				if ( dvc.scalingType == "Ranking and Values" ) {
					
				
					var selectedLBars = d3.selectAll('.barsLeft' + "." + fid).style( "opacity" , 0.50 );
					var selectedRBars = d3.selectAll('.barsRight' + "." + fid).style( "opacity" , 0.50 );
					var selectedLValues = d3.selectAll('.dataValuesL' + "." + fid).style( "opacity" , 1.00 );
					var selectedRValues = d3.selectAll('.dataValuesR' + "." + fid).style( "opacity" , 1.00 );									
				
					
				}// end if ...  
									
				
				var selectedLDotNumbers = d3.selectAll(".leftRankNumbers" + "." + fid).style( "opacity" , 1.00 );
				var selectedRDotNumbers = d3.selectAll(".rightRankNumbers" + "." + fid).style( "opacity" , 1.00 );
				
				
			}// end else ...
			
			
			return;
			
			
		}// end function clickPillGroups()
		
		
		
		
			
				
		// initisation function for onload situations
		if (Modernizr.inlinesvg )
		{
			
			
			// standard check for onload status
			$(document).ready(function()
			{
				
				
				// loading of configuration file .. 
				d3.json("./data/config.json", function(json)
				{
					
					
					dvc.config = json;
					
					
					// initialise starting and ending year to global dvc variables
					dvc.low = dvc.config.vars.startValue;
					dvc.high = dvc.config.vars.endValue;
					
					// initialise array index of starting and ending year to global dvc variables
					dvc.yearIndexlow = dvc.config.vars.dataLabels.indexOf(dvc.low.toString());
					dvc.yearIndexhigh = dvc.config.vars.dataLabels.indexOf(dvc.high.toString());
					
					
					// initialise scaling and data range display variables as global dvc. variables
					dvc.scalingType = dvc.config.vars.scalingType; 
					dvc.dataRangeType = dvc.config.vars.dataRangeType; 
		
		
					//initialise transitioning variable to false for onload sequence
					dvc.transitioning = false;
					
					
					// calculate button width for category/groups buttons, and each paired set of button
					var pillWidthPercentWidth = (100/dvc.config.vars.groups.length);					
		
		
					// select all DIV to contain all group/category buttons and define their class and IDs
					d3.select("#groupButtons").append("div").attr( "class" , "btn-group" ).attr( "id" , "simple-justified-button-groupGrps" );			
		
		
					// select new DIV to previously creatd append new div and define class and ID
					d3.select("#simple-justified-button-groupGrps").append("div").attr( "class" , "btn-group btn-group-justified" ).attr( "id" , "justifiedBtnGrp" ).attr( "role" , "group" ).attr( "aria-label" , "Justified button group" );
		
		
					// for each element of config.groups array ... 
					dvc.config.vars.groups.forEach(function(d, i) {
						
						
						// store the element value as a local variable
						var fid = d;
						var str = (d.toString()).replace(' ', '');						
						
						
						// select base DIV and append an 'a' and button , defining text and ID based on 'd, i' declaration
						d3.select("#justifiedBtnGrp").append("a").attr("href" , "#").attr("class" , "btn btn-default selectGroup").attr("id" , str).text(d).style( "text-align" , "center" ).style("border-style", "solid").style("border-width", "1px").style("border-color", "white").attr("onClick" , "clickPillGroups(this.id)");
					
										
					})	// end forEach...	
					
	
					// append new DIV to attach thin coloured bars to use for highlighted selected group/cartegory buttons
					d3.select("#groupButtonsColors").append("div").attr( "class" , "btn-group" ).attr( "id" , "simple-justified-button-groupGrpsColors" );			
		
		
					// select new DIV to previously creatd append new div and define class and ID
					d3.select("#simple-justified-button-groupGrpsColors").append("div").attr( "class" , "btn-group btn-group-justified" ).attr( "id" , "justifiedBtnGrpColors" ).attr( "role" , "group" ).attr( "aria-label" , "Justified button group" );


					// for each element of config.groups array ... 									
					dvc.config.vars.groups.forEach(function(d, i) {
						
						
						// save and deconstruct arrany element to get class name
						var str = (d.toString()).replace(' ', '');
						
						
						// append new DIV and modify CSS to colour-specific alue for Group/category button under which DIV it is situated
						d3.select("#justifiedBtnGrpColors").append("div").attr("class" , "btn-group btn-group-justified colorPanel").attr("id" , "panel" + str ).style("background-color" , dvc.config.vars.grpColorArray[i]).style( "text-align" , "center" ).style( "width" , pillWidthPercentWidth + "%" ).style( "height" , "10px" ).style("border-style", "solid").style("border-width", "1px").style("border-color", "white").style("opacity", 1.00 );
						
						
					})// end for each ...
						
	
					d3.select("#Showall").attr("class" , "btn btn-default selectGroup disabled"); 
					d3.select("#panelShowall").style("opacity" , 0.33); 					

						
					// write text labels above pairings of bootstra buttons
					d3.select("#Header").style( "text-align" , "center" ).append("label").attr("id" , "headerLabel").text("Select data" );

																							
							  
					/* Build proxy array for use in building DataGroup selection list ... */			
					var valueArray = [];
					for ( var i=0 ; i < dvc.config.vars.dataLabels.length; i++ ) { valueArray[i] = i; }
					
					
					/* construct left-hand selection list */	
					var dataGroupsArraysLeft = d3.zip( dvc.config.vars.dataLabels , valueArray );
					dvc.dataGroupsArraysLeft = dataGroupsArraysLeft.sort(function(b, a){ return d3.descending(a[0], b[0])});
					
					
					// Build option menu for data Groups
					var dataGroupsOptnsLeft = d3.select("#graphic")
						.append("select")
						.attr("id","selectDataGroupLeft")
						.attr("style","width:7%")
						.attr("class","chosen-select");


					dataGroupsOptnsLeft.selectAll("p")
						.data(dvc.dataGroupsArraysLeft)
						.enter()
						.append("option")
						.attr("value", function(d){ return d[1]}) 
						.text(function(d){ return d[0]});				
					
					
					$('#selectDataGroupLeft').chosen({width: "7%", allow_single_deselect: true, placeholder_text_single:"Select category"}).on('change',function(evt,params)
					{
	
	
						if(typeof params != 'undefined')
						{		
														  
							// update selectedIndex and name variables of newly selected option on selection list
							dvc.dataGroupIndexLeft = params.selected;
							dvc.dataGroupLeft = dvc.config.vars.dataLabels[this.options[this.selectedIndex].value];
							
							
							dvc.low = dvc.dataGroupLeft;
							dvc.transitioning = true;
							loadChartData();
							
							
						} // end if ....
						
						
						else {
						} // end else ....
						
						
					});// emd definition of select


					$('#selectDataGroupLeft').val(dvc.config.vars.dataLabels.indexOf(dvc.config.vars.startYear));	
					$('#selectDataGroupLeft').trigger("chosen:updated");					
									
					
					/* construct right-hand selection list */	
					var dataGroupsArraysRight = d3.zip( dvc.config.vars.dataLabels , valueArray );
					dvc.dataGroupsArraysRight = dataGroupsArraysRight.sort(function(b, a){ return d3.descending(a[0], b[0])});
					
					
					// Build option menu for data Groups
					var dataGroupsOptnsRight = d3.select("#graphic")
						.append("select")
						.attr("id","selectDataGroupRight")
						.attr("style","width:7%")
						.attr("class","chosen-select");				
						
					
					dataGroupsOptnsRight.selectAll("p")
						.data(dvc.dataGroupsArraysRight)
						.enter()
						.append("option")
						.attr("value", function(d){ return d[1]}) 
						.text(function(d){ return d[0]});
					
					
					$('#selectDataGroupRight').chosen({width: "7%", allow_single_deselect: true, placeholder_text_single:"Select category"}).on('change',function(evt,params)
					{
	
	
						if(typeof params != 'undefined')
						{	
						
															  
							// update selectedIndex and name variables of newly selected option on selection list
							dvc.dataGroupIndexRight = params.selected;
							dvc.dataGroupRight = dvc.config.vars.dataLabels[this.options[this.selectedIndex].value];						
							
							
							dvc.high = dvc.dataGroupRight;						
							dvc.transitioning = true;
							loadChartData();
							
													
						} // end if ....
						
						else {
						} // end else ....
						
						
					});// end definition of select
					
					
					// modify and update view based on selection
					$('#selectDataGroupRight').val(dvc.config.vars.dataLabels.indexOf(dvc.config.vars.endYear));	
					$('#selectDataGroupRight').trigger("chosen:updated");	
																									
							  
					/* Build proxy array for use in building selectionType selection list ... */			
					var valueArray = [];
					for ( var i=0 ; i < dvc.config.vars.selectionType.length; i++ ) { valueArray[i] = i; }
					
										
					/* construct final values/ranking selection list */	
					var dataGroupsSelectionType = d3.zip( dvc.config.vars.selectionType , valueArray );
					dvc.dataGroupsSelectionType = dataGroupsSelectionType.sort(function(b, a){ return d3.descending(b[0], a[0])});
					
									
					// Build option menu for data Groups
					var selectionType = d3.select("#graphic")
						.append("select")
						.attr("id","selectionType")
						.attr("style","width:7%")
						.attr("class","chosen-select");	
									
					
					selectionType.selectAll("p")
						.data(dvc.dataGroupsSelectionType)
						.enter()
						.append("option")
						.attr("value", function(d){ return d[1]}) 
						.text(function(d){ return d[0]});
						
					
					$('#selectionType').chosen({width: "20%", allow_single_deselect: true, placeholder_text_single:"Select presentation"}).on('change',function(evt,params)
					{
						
	
						if(typeof params != 'undefined')
						{		
						
														  
							// update selectedIndex and name variables of newly selected option on selection list
							dvc.selectionTypeIndex = params.selected;
							dvc.selectionType = dvc.config.vars.selectionType[this.options[this.selectedIndex].value];	
														
							
							if ( dvc.selectionType == "Values" ) {  dvc.scalingType = "Values"; }
							else if ( dvc.selectionType == "Ranking and Values" ) { dvc.scalingType = "Ranking and Values"; } 	
							else if ( dvc.selectionType == "Ranking" ) {  dvc.scalingType = "Ranking"; }
							else {}
							
							
							dvc.transitioning = true;
							loadChartData();
							
													
						} // end if ....
						
						else {
						} // end else ....
						
					});	
					
					
					// update displayed option of selection list accodingly.
					$('#selectionType').val(dvc.config.vars.selectionType.indexOf(dvc.config.vars.scalingType));	
					$('#selectionType').trigger("chosen:updated")	;
					
					

					if ( dvc.config.vars.groups.length > 1 ) {	
				
				
						/* Build y-axis selection list ... */			
						var valueArray = [];
						for ( var i=0 ; i < dvc.config.vars.groups.length; i++ ) { valueArray[i] = i; }	
			
						// build and manipulate data array s to help populate y-axis array...
						var groupArray = d3.zip( dvc.config.vars.groups , valueArray );		//	var codeoccyzip = d3.zip(dvc.allOcc, dvc.allCode);						
						dvc.groupArray = groupArray.sort(function(b, a){ return d3.ascending(a[10], b[1])});	// dvc.codeoccyzip = codeoccyzip.sort(function(b, a){ return d3.descending(a[0], b[0])});										
					
						// Build option menu for x-Axis
						var groupOptns = d3.select("#menu")
							.append("select")
							.attr("id","selectGroup")
							.attr("style","width:100%")
							.attr("class","chosen-select");
							
						// populate variable selection list.
						groupOptns.selectAll("p")
							.data(dvc.groupArray)
							.enter()
							.append("option")
							.attr("value", function(d){ return d[1]}) 
							.text(function(d){ return d[0]});
									
														
						// define dimensions and functionality associated with selection list ... 
						$('#selectGroup').chosen({width: "100%", allow_single_deselect: true, placeholder_text_single:"Select group to highlight"}).on('change',function(evt,params)
						{
			
							// if selection list variable is valid selection ...
							if(typeof params != 'undefined')
							{		
															
								// update selectedIndex and name variables of newly selected option on selection list
								dvc.selectedGroupIndex = params.selected;
								dvc.selectedGroup = dvc.config.vars.groups[dvc.selectedGroupIndex];	
								
								
								var str = (dvc.selectedGroup.toString()).replace(' ', '');	
								clickPillGroups(str);
								
									
							} // end if ....
							
							
							
							else {
							} // end else ....
									
											
						});	// end definition of selection list
				
				
						//	update displayed selection and position of selection group
						document.getElementById("selectGroup").selectedIndex = dvc.selectedGroupIndex;
						document.getElementById("selectGroup_chosen").selectedIndex = dvc.selectedGroupIndex;
						$('#selectGroup').val(dvc.selectedGroupIndex);	
						$('#selectGroup').trigger("chosen:updated");				
						d3.select("#selectGroup").style( "left" , "0px" );
						d3.select("#selectGroup_chosen").style( "left" , "0px" );	
						$('#selectGroup').val(dvc.selectedGroupIndex);	
						$('#selectGroup').trigger("chosen:updated");	
						
					
					}// end if ... 		
						
			  
				}); // end config file loading
				
				
				//call function to load data
				loadChartData();
				
				
				// append new SVG DIV to HTML DOM base				
				d3.select("#graphic")
					.append("svg")			
					.attr("class", "chart-root")
					.attr("id", "chartRoot")
					.append('g')
					.attr('class', 'chart-group')
					.attr("viewBox","0 0 300 250")
					.attr("preserveAspectRatio","xMidYMid");
						
						
				// initialise and call Pym to resize view ... 
				pymChild = new pym.Child(); 
				pymChild.sendHeight();				
		
				
			}) // end $(document).ready(function() ...)
			
			
		} // end Modernizr.inlinesvg
		
		
		else{
				
				
				// update graph sizing accordingly to resizing
				pymChild = new pym.Child();
				if (pymChild) { pymChild.sendHeight(); }			
				
				
		} // end else ... 
		
		
							
		
		
		/*
			NAME: 			loadChartData
			DESCRIPTION: 	called to read in data
			CALLED FROM:	$(document).ready
			CALLS: 								
			REQUIRES: 		n/a
			RETURNS: 		n/a
		*/
		function loadChartData()
		{
			
										
			
			// read in data
			d3.csv("./data/data.csv", function(error, data) {
				
				
				// store content of data.csvas global dvc variable.
				dvc.data = data;
				
			
				// call function to draw scatter plot based on content and initialisation variables.								
				pymChild = new pym.Child({ renderCallback: makeChart});
				
				
			}); // end reading data.csv
			
			
			return;
			
		
		}// end function loadChartData
		
		
							
		
		
		/*
			NAME: 			makeChart
			DESCRIPTION: 	called to read in data
			CALLED FROM:	loadChartData
							window.resize
			CALLS: 			d3.custom.slopegraph()					
			REQUIRES: 		n/a
			RETURNS: 		n/a
		*/
		function makeChart() {
		
		
			dvc.slopeGraph = d3.custom.slopegraph();	
			dvc.slopeGraph.width(width);
			d3.select('body').call(dvc.slopeGraph);				
			
			
			return;		
			
			
		}// end function makeChart
		
		
		
		
		// declaration of slopegraph building function.
		d3.custom.slopegraph = function()
		{
			
			
			// errrrr .......
			function exports(selection)
			{
			
			
				// for each line in data.csv
				selection.each(function (dataset)
				{
						
					
					// remove relevant DOM elements	ready for rebuilding slopegraph based on different parameters
					d3.selectAll(".axisgraphGridLines").remove();
					d3.selectAll(".axisGraphGridLabels").remove();
					d3.selectAll(".axisLines").remove();
					d3.selectAll(".yAxisUnitLabels").remove();
					d3.selectAll(".yAxisRankLabels").remove();
					d3.selectAll(".yAxisCategoryLabels").remove();
					d3.select("#xAxisRight").remove();
					d3.select("#xAxisLeft").remove();
					d3.select("#xAxisLeftFalse").remove();
					d3.selectAll(".leftGroups").remove();
					d3.selectAll(".rightGroups").remove();
					
					
					// clear and initialise arrays for storing data values					
					dvc.currentStartValues = [];
					dvc.currentEndValues = [];
										
					
					// retrieve reference to current graphic DIV, and recalculate width
					var graphic = $("#graphic"); 		
					width = graphic.width();
					
					
				  	// initialise breakpoints for different screen sizes
					var threshold_md = 788;
				   	var threshold_sm = dvc.config.optional.mobileBreakpoint; 
				   
				  
					//set variables for chart dimensions dependent on width of #graphic
					if (graphic.width() < threshold_sm) { 
						
							
							dvc.barHeight = dvc.config.vars.fixedBarHeights[0];	// initialise bar height					
							dvc.dyValue = dvc.config.vars.dyValue[0]; // initialise '.dy' value 							
							dvc.outer_buffer = dvc.config.vars.outer_buffer[0]; // initialise outer buffer size between bar end 
							dvc.numXAxisTicks = dvc.config.vars.numXAxisTicks[0]; // initialise number of ticks on x axis (when values are displayed).
							dvc.fontSize = dvc.config.vars.fontSize[0]; // initialise font size for labels
						
						
							// initialise chart margins, width and height based on screen size and aspect ratios
							var margin = {top: dvc.config.optional.margin_sm[0], right: dvc.config.optional.margin_sm[1], bottom: dvc.config.optional.margin_sm[2], left: dvc.config.optional.margin_sm[3]}; 
							var chart_width = graphic.width() - margin.left - margin.right;
							var height = (Math.ceil((chart_width * dvc.config.optional.aspectRatio_sm[1]) / dvc.config.optional.aspectRatio_sm[0]) - margin.top - margin.bottom)*1.15;
							
						
							
							// for each element in .vars.groups' array ...
							dvc.config.vars.groups.forEach(function(d,i){
								
								
								// manipulate element to set background colour from color array in config file
								var str = (d.toString()).replace(' ', '');
								d3.select("#" + str).style("background-color" , dvc.config.vars.grpColorArray[i]);
								
								
							})// end foreach
														
							
							// clear all options on selction list; modify button labels, and selction list x positions and class names
							d3.selectAll(".selectGroup").text("");
							d3.select("#Showall").text("All");
							d3.select("#headerLabel").text("");							
							d3.select("#selectDataGroupLeft_chosen").style( "width" ,  "20%");
							d3.select("#selectDataGroupRight_chosen").style( "width" , "20%");		
							d3.select("#menu").attr("class" , "col-sm-12 col-xs-12 hide");
							d3.select("#groupButtons").attr("class" , "col-sm-12 col-xs-12 show");
							d3.select("#groupButtonsColors").attr("class" , "col-sm-12 col-xs-12 show");
							d3.select("#menu").attr("class" , "col-sm-12 col-xs-12 show");
							d3.select("#groupButtons").attr("class" , "col-sm-12 col-xs-12 hide");
							d3.select("#groupButtonsColors").attr("class" , "col-sm-12 col-xs-12 hide");
														
					
					} // end if ... 
					
					
					else if (graphic.width() < threshold_md){ 
										
							dvc.barHeight = dvc.config.vars.fixedBarHeights[1];// initialise bar height				
							dvc.dyValue = dvc.config.vars.dyValue[1]; // initialise '.dy' value 							
							dvc.outer_buffer = dvc.config.vars.outer_buffer[1]; // initialise outer buffer size between bar end 
							dvc.numXAxisTicks = dvc.config.vars.numXAxisTicks[1]; // initialise number of ticks on x axis (when values are displayed).
							dvc.fontSize = dvc.config.vars.fontSize[1]; // initialise font size for labels
						
						
							// initialise chart margins, width and height based on screen size and aspect ratios
							var margin = {top: dvc.config.optional.margin_md[0], right: dvc.config.optional.margin_md[1], bottom: dvc.config.optional.margin_md[2], left: dvc.config.optional.margin_md[3]}; 
							var chart_width = graphic.width() - margin.left - margin.right;
							var height = (Math.ceil((chart_width * dvc.config.optional.aspectRatio_md[1]) / dvc.config.optional.aspectRatio_md[0]) - margin.top - margin.bottom)*1.15;
							
								
							// manipulate element to set background colour from color array in config file
							dvc.config.vars.groups.forEach(function(d,i){
								
								
								// manipulate element to set background colour from color array in config file
								var str = (d.toString()).replace(' ', '');
								d3.select("#" + str).text(d).style("background-color" , dvc.config.vars.grpColorArray[i]).style("background-color" , "#e7e7e7");
								
								
							})// end foreach
														
							
							// clear all options on selction list; modify button labels, and selction list x positions and class names
							d3.select("#Showall").text("All");
							d3.select("#headerLabel").text("Select data");
							d3.select("#selectDataGroupLeft_chosen").style( "width" ,  "20%");
							d3.select("#selectDataGroupRight_chosen").style( "width" , "20%");
							d3.select("#menu").attr("class" , "col-sm-12 col-xs-12 hide");
							d3.select("#groupButtons").attr("class" , "col-sm-12 col-xs-12 show");
							d3.select("#groupButtonsColors").attr("class" , "col-sm-12 col-xs-12 show");
							
					
					} // end else if ... 
					
					
					else {
										
							dvc.barHeight = dvc.config.vars.fixedBarHeights[2];// initialise bar height					
							dvc.dyValue = dvc.config.vars.dyValue[2]; // initialise '.dy' value 							
							dvc.outer_buffer = dvc.config.vars.outer_buffer[2]; // initialise outer buffer size between bar end 
							dvc.numXAxisTicks = dvc.config.vars.numXAxisTicks[2]; // initialise number of ticks on x axis (when values are displayed).
							dvc.fontSize = dvc.config.vars.fontSize[2]; // initialise font size for labels
							
								
							// manipulate element to set background colour from color array in config file
							var margin = {top: dvc.config.optional.margin_lg[0], right: dvc.config.optional.margin_lg[1], bottom: dvc.config.optional.margin_lg[2], left: dvc.config.optional.margin_lg[3]}
							var chart_width = graphic.width() - margin.left - margin.right;
							var height = (Math.ceil((chart_width * dvc.config.optional.aspectRatio_lg[1]) / dvc.config.optional.aspectRatio_lg[0]) - margin.top - margin.bottom)*1.15;
							
								
							// manipulate element to set background colour from color array in config file
							dvc.config.vars.groups.forEach(function(d,i){
								
								
								// manipulate element to set background colour from color array in config file
								var str = (d.toString()).replace(' ', '');
								d3.select("#" + str).text(d).style("background-color" , dvc.config.vars.grpColorArray[i]).style("background-color" , "#e7e7e7");
								
								
							})// end foreach
														
							
							// clear all options on selction list; modify button labels, and selction list x positions and class names
							d3.select("#Showall").text("Show all");
							d3.select("#headerLabel").text("Select data");
							d3.select("#selectDataGroupLeft_chosen").style( "width" ,  "20%");
							d3.select("#selectDataGroupRight_chosen").style( "width" , "20%");
							d3.select("#menu").attr("class" , "col-sm-12 col-xs-12 hide");
							d3.select("#groupButtons").attr("class" , "col-sm-12 col-xs-12 show");
							d3.select("#groupButtonsColors").attr("class" , "col-sm-12 col-xs-12 show");
							
							
					} // end else ...
									
					
					//	calculate height of chart
					var chartHeight = height - opts.margin.top - opts.margin.bottom;
					var parent = d3.select(this);
					var svg = parent.selectAll("svg.chart-root").data([0]);	
	
							
					//	recalculate graphic height accordingly, with new aspect ratio			
					svg.attr({width: width, height: height });
					svg.exit().remove();
					
				
					// reinitialise all temporary data arrays used through building slope graph
					dvc.myFullArray = []; // array for all data value relating to selection start and end variables
					dvc.startArray = []; // array for data values for left hand end of slope graph
					dvc.endArray = []; // array for data values for right hand end of slope graph
					dvc.labels = []; // array for containing variable labels
					dvc.groups = []; // array for containing variable groups
					dvc.startArrayRankIndexes = []; // array for data value indices for left hand end of slope graph
					dvc.endArrayRankIndexes = []; // array for data value indices for right hand end of slope graph
					dvc.myData = []; // array for all data value relating to selection start and end variables in alternate form to dvc.myFullArray 
									
					
					// for each value row in full data ... 
					dvc.data.forEach(function(d,i) {
								 

						dvc.labels.push(d.variable); // push variable into labels array
						dvc.groups.push(d.group); // push group value into labels array
	
						
						dvc.startArray.push(+d[dvc.low]); // push variable start value into startArray array
						dvc.endArray.push(+d[dvc.high]); // push variable start value into endArray array
	
						
					});	// end foreach ...
					
					
					// copy, sort and manipulate original start data array populated above so that rank indicies can be determined dynamically with need to reference static columns in input data.csv files as used in earlier versions
					dvc.sortedStart = [];
					dvc.sortedStart = dvc.startArray.slice(0,dvc.startArray.length);
					dvc.sortedStart = dvc.sortedStart.sort(compareNumbers);
					
					
					// create array containing reveresed sorted array of data values for left hand data					
					dvc.reservedSortedStart = dvc.sortedStart;
					dvc.reservedSortedStart = dvc.reservedSortedStart.reverse();
					
					
					// call function to use original input array so that rank indicies can be determined dynamically without need to reference static columns in input data.csv files as used in earlier versions				
					findIndicies(dvc.startArray, dvc.reservedSortedStart, dvc.startArrayRankIndexes);
					
					
					// copy, sort and manipulate original end data array populated above so that rank indicies can be determined dynamically with need to reference static columns in input data.csv files as used in earlier versions
					dvc.sortedEnd = [];
					dvc.sortedEnd = dvc.endArray.slice(0,dvc.endArray.length);
					dvc.sortedEnd = dvc.sortedEnd.sort(compareNumbers);
					
					
					// create array containing reveresed sorted array of data values for right hand data					
					dvc.reservedSortedEnd = dvc.sortedEnd;
					dvc.reservedSortedEnd = dvc.reservedSortedEnd.reverse();
					
					
					// call function to use original input array so that rank indicies can be determined dynamically without need to reference static columns in input data.csv files as used in earlier versions				
					findIndicies(dvc.endArray, dvc.reservedSortedEnd, dvc.endArrayRankIndexes);	
									
									
					// initial chart SVG object
					var chartSvg = svg.select('.chart-group');
					
					
					// set lateral position of left and right hand vertical (hidden) axis 
					dvc.left_axis_indent = parseFloat(width*(4/12));
					dvc.right_axis_indent = parseFloat(width*(8/12));									
					
					
					// modify horizontal positioning of left hand selection list based on with of containing DIV, and update view based on selection
					var selectLeft = $("#selectDataGroupLeft_chosen");
					var selectLeftWidth = selectLeft.width();
					d3.select("#selectDataGroupLeft_chosen").style( "left" , (dvc.left_axis_indent - dvc.outer_buffer - selectLeftWidth) + "px" );
					d3.select("#selectDataGroupRight_chosen").style( "left" ,(dvc.right_axis_indent + dvc.outer_buffer) + "px" );						
					
					
					// modify horizontal positioning of left hand selection list based on with of containing DIV, and update view based on selection
					d3.select("#selectionType_chosen").style( "width" , ((dvc.right_axis_indent - dvc.left_axis_indent)*9/10) + "px");
					var selType = $("#selectionType_chosen"); 
					selectionTypeWidth = selType.width();
					d3.select("#selectionType_chosen").style( "left" , (width/2)-(selectionTypeWidth/2) + "px" );
					
					 
					// construct full array using "values" to use in main slopegraph function
					dvc.myFullArray = [ dvc.startArray , dvc.endArray ];
					dvc.myData = d3.transpose(dvc.myFullArray);	
					
					 
					// construct full array using "value ranks" to use in main slopegraph function
					dvc.myFullArrayRankIndexes = [ dvc.startArrayRankIndexes , dvc.endArrayRankIndexes ];
					dvc.myDataRankIndexes = d3.transpose(dvc.myFullArrayRankIndexes);
									
					 
					// copy and sort array of start data values
					dvc.startArraySorted = dvc.startArray.slice(0,dvc.startArray.length);
					dvc.myRankedStartData = dvc.startArraySorted.sort(d3.descending);
					
					 
					// copy and sort array of end data values
					dvc.endArraySorted = dvc.endArray.slice(0,dvc.endArray.length);
					dvc.myRankedEndData = dvc.endArraySorted.sort(d3.descending);
					
																
					// modify vertical scales minimum and maximum values based on user selection of right hand pill pair. Set if user has selected fixed min and max values
					if( dvc.scalingType == "Values" ) {
						
						
						// update vertical y-axis scale					
						var scale = d3.scale.linear().domain([100,0]).range([0, chartHeight]);						
						
						
						// udpate minium and maximum values of data range
						dvc.minRangeValue = dvc.config.vars.minFixed;
						dvc.maxRangeValue = dvc.config.vars.maxFixed;
						
						
					}// end if ... 
									
					
					// if user wants to display data based on ranking indices and not data values
					if ( dvc.scalingType == "Ranking" || dvc.scalingType == "Ranking and Values" ) {
						
												
						// update vertical y-axis scale
						var scale = d3.scale.linear().domain([0,dvc.myData.length]).range([0, chartHeight]);
						
						
						// update min and max values to data range						
						dvc.minRangeValue = 0;
						dvc.maxRangeValue = dvc.myData.length;
						
						
						// modofy main data array to rank indice values, not data values
						dvc.myData = dvc.myDataRankIndexes;
						
																
						// copy array of index ranks, and soert in ascending fashion. Used to display rank index labels from ordered from top to bottom
						dvc.startArraySorted = dvc.startArrayRankIndexes.slice(0,dvc.startArrayRankIndexes.length);
						dvc.myRankedStartData = dvc.startArraySorted.sort(d3.descending);
										
										
						// copy array of index ranks, and soert in ascending fashion. Used to display rank index labels from ordered from top to bottom
						dvc.endArraySorted = dvc.endArrayRankIndexes.slice(0,dvc.endArrayRankIndexes.length);
						dvc.myRankedEndData = dvc.endArraySorted.sort(d3.descending);
	
	
						// calculate interval between vertically consecutive data points to equally sace indexed points between top and bottom of y-axis range.
						dvc.interval = ((chartHeight - (opts.margin.top - opts.margin.top))/dvc.myData.length)/2;
						
						
					}// end if ... 
					
	
					// initialise arrays to hold calculated arrays of unique instances of array content and count of number of instances of each array content
					dvc.countStartInstancesArray;
					dvc.countEndInstancesArray;
					var a, b, prev;
					
					
					// make copy of start data array. call function to determine unique content in input array and number of instances iof each unique instance, store these two spearate arrays as new 2D array to use later
					dvc.startArrayCountentCounts = dvc.startArray.slice(0,dvc.startArray.length);
					countInstances(dvc.startArrayCountentCounts);
					dvc.countStartInstancesArray = [ a , b ];
					
					
					// make copy of end data array. call function to determine unique content in input array and number of instances iof each unique instance, store these two spearate arrays as new 2D array to use later
					dvc.endArrayCountentCounts = dvc.endArray.slice(0,dvc.endArray.length);
					countInstances(dvc.endArrayCountentCounts);
					dvc.countEndInstancesArray = [ a , b ];	
		
		
							
					
					
					/*
						NAME: 			countInstances
						DESCRIPTION: 	called to determine unique content instances in input array, and also determine number of instances of each unique value
						CALLED FROM:	n/a
						CALLS: 			n/a				
						REQUIRES: 		arr - input arrayfor which details are required of. 
						RETURNS: 		Two arrays. First (a) contains one instance of each value in input array, abd (b) contains number of instances in oroginal input array of each element of array (a) 
						NOTE: this needs to be positioned here within the slopgraph object definiton. For some reason the interactive will not fully load if it is moved outside/to the base of script.js file
					*/
					function countInstances(arr) {
						
						
						// initialise local arrays						
						a = [], b = [], prev;
						
						
						// sort input array
						arr.sort();
						
						
						// for each element in sorted input array
						for ( var i = 0; i < arr.length; i++ ) {
							
							
							// if element is not equale ot previous value
							if ( arr[i] !== prev ) {
								a.push(arr[i]);
								b.push(1);
								
								
							// otherwise ... 
							} else {
								b[b.length-1]++;
							}
							
							
							// update local prev value with current value
							prev = arr[i];
							
							
						}	 // end for ... 
								
								
						// return argument	
						return [a, b];
						
						
					}// end function countInstances()
	
	
	
											
					// if user requires to display vertical y-axes on slope graph			
					if ( dvc.config.vars.axes == true )
					{
						
						
						// append left hand x-axis
						chartSvg.append("line")
							.attr("id" , "leftAxis")
							.attr("class" , "axisLines")
							.attr("x1" , dvc.left_axis_indent )
							.attr("x2" , dvc.left_axis_indent )
							.attr("y1" , opts.margin.top )
							.attr("y2" , opts.margin.top + chartHeight )
							.style("stroke" , "solid")
							.style("stroke-width" , "2px")
							.style("stroke" , "red")
							.style("fill" , "red")
							.style("opacity" , "1.00")
							.style("display" , "inline");
						
												
						// append right hand x-axis
						chartSvg.append("line")
							.attr("id" , "rightAxis")
							.attr("class" , "axisLines")
							.attr("x1" , dvc.right_axis_indent )
							.attr("x2" , dvc.right_axis_indent )
							.attr("y1" , opts.margin.top )
							.attr("y2" , opts.margin.top + chartHeight )
							.style("stroke" , "solid")
							.style("stroke-width" , "2px")
							.style("stroke" , "red")
							.style("fill" , "red")
							.style("opacity" , "1.00")
							.style("display" , "inline");
							
							
					} // end if ... 
														
									
					// define variables to represent left hand and right hand groups
					var leftGroups = chartSvg.selectAll('.groupLeft').data(dvc.myData);
					var rightGroups = chartSvg.selectAll('.groupRight').data(dvc.myData);
														
									
					// define variables to represent slope lines
					var lines = chartSvg.selectAll('line.slope-line').data(dvc.myData);
					
					
					// create objects for left hand and right hand category labels
					var leftLabels = chartSvg.selectAll('text.left_labels').data(dvc.myData);
					var rightLabels = chartSvg.selectAll('text.right_labels').data(dvc.myData);
					
					
					// create objects for left hand and right hand coloured dots
					var dotsL = chartSvg.selectAll('circle.dotsLeft').data(dvc.myData);
					var dotsR = chartSvg.selectAll('circle.dotsRight').data(dvc.myData);
					
					
					// create objects for left hand and right hand data value text labels
					var dataValuesL = chartSvg.selectAll('text.dataValuesL').data(dvc.myData);
					var dataValuesR = chartSvg.selectAll('text.dataValuesR').data(dvc.myData);
					
					
					// create objects for left hand and right hand indicie rank numbers
					var leftDotRankNumbers = chartSvg.selectAll('text.leftRankNumbers').data(dvc.myData);
					var rightDotRankNumbers = chartSvg.selectAll('text.rightRankNumbers').data(dvc.myData);		
					
					
					//	if fixed bar height have not been user defined in config file, dynamically calculate new bar heigths to use
					if ( dvc.config.vars.fixedBarHeights.length == 0 ) {
						
						
						dvc.gapHeight = parseFloat((chartHeight/(dvc.myData.length-1))-(chartHeight/dvc.myData.length));
						dvc.barHeight = (chartHeight/dvc.myData.length) - (dvc.gapHeight*dvc.config.vars.gapWidthValue);
						dvc.dotSize = parseInt(dvc.barHeight/2);
						
						
					}// end if ..
					
					
					else {
						
						
						dvc.gapHeight = parseFloat((chartHeight/(dvc.myData.length-1))-(chartHeight/dvc.myData.length));
						dvc.dotSize = parseInt(dvc.barHeight/2);
						
						
					}// end else ...
									
					
					// append left hand static "Rank" label to chart
					chartSvg.append("text")
						.attr("class" , "yAxisRankLabels")
						.attr("id" , "yAxisRankLabelLeft" )
						.attr( "x" , /*opts.margin.left + 60*/dvc.left_axis_indent )
						.attr( "y" , opts.margin.top - 55 )
						.style("text-anchor" , "middle")
						.text(function(d,i){
							if ( dvc.scalingType == "Values" ) { return dvc.config.vars.units; }
							else if ( dvc.scalingType == "Ranking and Values" ) { return "Rank";	}
							else if ( dvc.scalingType == "Ranking" ) { return "Rank"; }
						});
				
					
					// append left hand category label to chart
					chartSvg.append("text")
						.attr("class" , "yAxisCategoryLabels")
						.attr("id" , "yAxisCategoryLabelLeft" )
						.attr( "x" , (dvc.left_axis_indent - dvc.outer_buffer ) )
						.attr( "y" , opts.margin.top - 55 )
						.style("text-anchor" , "end")
						.text(dvc.config.vars.category);
				
										
					
					// append right hand static "Rank" label to chart
					chartSvg.append("text")
						.attr("class" , "yAxisRankLabels")
						.attr("id" , "yAxisRankLabelRight" )
						.attr( "x" , /*width - opts.margin.right - opts.labelLength - 20*/dvc.right_axis_indent )
						.attr( "y" , opts.margin.top - 55 )
						.style("text-anchor" , "middle")
						.text(function(d,i){
							if ( dvc.scalingType == "Values" ) { return dvc.config.vars.units; }
							else if ( dvc.scalingType == "Ranking and Values" ) { return "Rank";	}
							else if ( dvc.scalingType == "Ranking" ) { return "Rank"; }
						});
					
					
					// append right hand category label to chart
					chartSvg.append("text")
						.attr("class" , "yAxisCategoryLabels")
						.attr("id" , "yAxisCategoryLabelRight" )
						.attr( "x" , dvc.right_axis_indent + dvc.outer_buffer )
						.attr( "y" , opts.margin.top - 55 )
						.style("text-anchor" , "start")
						.text(dvc.config.vars.category);				
								
						
					// determine frequency of drawing horizontal grid lines btween vertical y-Axis
					if ( dvc.maxRangeValue >= 0 ) { dvc.tickFrequency = 1; }
					if ( dvc.maxRangeValue >= 10 ) { dvc.tickFrequency = 1; }
					if ( dvc.maxRangeValue >= 25 ) { dvc.tickFrequency = 5; }
					if ( dvc.maxRangeValue >= 50 ) { dvc.tickFrequency = 10; }

						
					// cycle through y-axis range, and draw horiontal grid lines and gridline labels at appropriate points
					for (var j=0; j<=dvc.maxRangeValue+1; j++ ) {
						
												
						// if incrementor value falls on required grid line interval ... 
						if ( (j)%dvc.tickFrequency==0 && ( j>=dvc.minRangeValue ) ) {
														
							
							// special case to prevent drawing gridline above the graph area when displaying using rank indicies
							if ( ( j == 0 || j > dvc.myData.length )  &&  ( dvc.scalingType == "Ranking" || dvc.scalingType == "Ranking and Values" ) ) { continue; }
														
							
							// append horizontal gridlines to between lefthand and righthand dots										
							chartSvg.append("line")
								.attr("class" , "axisgraphGridLines")
								.attr("id" , "graphGridLine" + j )
								.style("stroke" , "solid")
								.style("stroke-width" , "1px")
								.style("stroke" , "#666")
								.style("fill" , "none")
								.style("opacity" ,0.33)
								.attr( "x1" , dvc.left_axis_indent + (dvc.dotSize) )
								.attr( "x2" , dvc.right_axis_indent - (dvc.dotSize) )
								.attr( "y1" , function(d,i) {	
									if ( dvc.scalingType == "Values" ) { return opts.margin.top + scale(j) + 1; }
									else { return opts.margin.top + scale(j) - dvc.interval; }
								})
								.attr( "y2" , function(d,i) {
									if ( dvc.scalingType == "Values" ) { return opts.margin.top + scale(j); }
									else { return opts.margin.top + scale(j) - dvc.interval; }
								});
								
								
							// append small gridline value text labels to left-hand side between category and rank labels
							chartSvg.append("text")
								.attr("class" , "axisGraphGridLabels")
								.attr("id" , "graphGridLeftLabel" + j )
								.attr( "x" , dvc.left_axis_indent - (dvc.outer_buffer/3) )
								.attr( "y" , function(d,i) {
									  if ( dvc.scalingType == "Values" ) { return opts.margin.top + scale(j) + 1 ; }
									  else { return opts.margin.top + scale(j) - dvc.interval; }
								})
								.text(function(){								
									if ( dvc.scalingType == "Values" ) { return j; }
									else {  return; }
								})
								.style("stroke" , "solid")
								.style("stroke-width" , "1px")
								.style("stroke" , "none")
								.style("fill" , "#CCC")
								.style("font-size" , "10px")
								.style('text-anchor', 'end');
								
								
							// append small gridline value text labels to right-hand side between category and rank labels
							chartSvg.append("text")
								.attr("class" , "axisGraphGridLabels")
								.attr("id" , "graphGridRightLabel" + j )
								.attr( "x" , dvc.right_axis_indent + (dvc.outer_buffer/3) )
								.attr( "y" , function(d,i) {
									  if ( dvc.scalingType == "Values" ) { return opts.margin.top + scale(j) + 5; }
									  else { return opts.margin.top + scale(j) - dvc.interval; }
								})
								.text(function(){								
									if ( dvc.scalingType == "Values" ) { return j; }
									else { return; }
								})
								.style("stroke" , "solid")
								.style("stroke-width" , "1px")
								.style("stroke" , "none")
								.style("fill" , "#CCC")
								.style("font-size" , "10px")
								.style('text-anchor', 'start');																
						
								
						}// end if ...
						
						
					}// end for ... 
					
							
					// logic to determine rounded UP maximum value to consider in y-axis range
					if ( d3.max([ d3.max(dvc.startArray) , d3.max(dvc.endArray) ]) > 0 ) { dvc.roundVal = 1; } 
					if ( d3.max([ d3.max(dvc.startArray) , d3.max(dvc.endArray) ]) > 10 ) { dvc.roundVal = 10; } 
					if ( d3.max([ d3.max(dvc.startArray) , d3.max(dvc.endArray) ]) > 100 ) { dvc.roundVal = 20; } 
					if ( d3.max([ d3.max(dvc.startArray) , d3.max(dvc.endArray) ]) > 500 ) { dvc.roundVal = 50; } 
					if ( d3.max([ d3.max(dvc.startArray) , d3.max(dvc.endArray) ]) > 1000 ) { dvc.roundVal = 100; } 
										
					
					// assign data maximum value to local variable
					var maxValue = Math.ceil(d3.max( [ d3.max(dvc.startArray) , d3.max(dvc.endArray) ] )/dvc.roundVal)*dvc.roundVal;
					var right_axis_range = (chart_width - margin.right - dvc.outer_buffer) - dvc.right_axis_indent;
					var left_axis_range = right_axis_range;  
								
						
					// redefine both left and right hand horizontal scales.
					var horiScaleLeft = d3.scale.linear().domain([ 0 , maxValue ]).range([0, left_axis_range]); // hidden axis. leftBars are plotted against these ... 
					var horiScaleLeftFalse = d3.scale.linear().domain([ maxValue, 0 ]).range([0, left_axis_range]); // visible axis. leftBars are NOT plotted against these. Provided to give right 'sense' to axis values
					var horiScaleRight = d3.scale.linear().domain([ 0 , maxValue ]).range([0, right_axis_range]);				
					
	
					var maskLeftWidth = dvc.left_axis_indent;
					var maskRightWidth = width - dvc.right_axis_indent;
					
										
					// logic to enter to build slope graph if transitioning is not required during graph creations.
					if ( dvc.transitioning == false )
					{		
																							
						
						// if user wants to display data bars, daat labels....				
						if ( dvc.scalingType == "Ranking and Values" )
						{
							
							
							// define left hand x-axis		
							dvc.xAxisLeft=d3.svg.axis()
									.scale(horiScaleLeft)
									.ticks(dvc.numXAxisTicks)
									.orient("bottom");
									
							
							// attach and hide left hand x axis (runs wrong way to need for displaying data bars)
							chartSvg.append("g")
								.attr("class","axis")
								.attr("id", "xAxisLeft")
								.attr("transform","translate("+ (dvc.left_axis_indent - left_axis_range - dvc.outer_buffer) + ", " + (opts.margin.top - 40) + ")")
								.call(dvc.xAxisLeft)
								.style("display" , "none");
														
							
							// define false left hand x-axis		
							dvc.xAxisLeftFalse=d3.svg.axis()
									.scale(horiScaleLeftFalse)
									.ticks(dvc.numXAxisTicks)
									.orient("bottom");
			
														
							// attach and hide false left hand x axis (runs correct way to need for displaying data bars)
							chartSvg.append("g")
								.attr("class","axis")
								.attr("id", "xAxisLeftFalse")
								.attr("transform","translate("+ (dvc.left_axis_indent - left_axis_range - dvc.outer_buffer) + ", " + (opts.margin.top - 40) + ")")
								.call(dvc.xAxisLeftFalse)
								.style("display" , "inline");
								
														
							// define right hand x-axis		
							dvc.xAxisRight=d3.svg.axis()
									.scale(horiScaleRight)
									.ticks(dvc.numXAxisTicks)
									.orient("bottom");
										
							
							// attach and hide right hand x axis (runs correct way to need for displaying data bars)
							chartSvg.append("g")
								.attr("class","axis")
								.attr("id", "xAxisRight")
								.attr("transform","translate("+ (dvc.right_axis_indent + dvc.outer_buffer) + ", " +(opts.margin.top - 40 ) + ")")
								.call(dvc.xAxisRight);							
						
																
						}// end if ...
												
								
						// append slope lines to graph extending between lefthand and righthand coloured dots
						lines.enter().append("line")
							lines.attr({
								class: function(d,i) { return 'slope-line' + " " + dvc.groups[i]; },
								id: function(d,i) {	 return "lineID" + i; },
								name: function(d,i) { return dvc.groups[i]; },
								value: function(d,i) { return dvc.groups[i]; },
								x1: dvc.left_axis_indent,
								x2: dvc.right_axis_indent,
								y1: function(d,i) {	
										if ( dvc.scalingType == "Values" ) { return opts.margin.top + scale(d[0]); }									
										else { return opts.margin.top + scale(d[0]) - dvc.interval; }
								},
								y2: function(d,i) {
										if ( dvc.scalingType == "Values" ) { return opts.margin.top + scale(d[1]); }								
										else { return opts.margin.top + scale(d[1]) - dvc.interval; }
								},
								stroke: function(d,i){ return dvc.config.vars.grpColorArray[dvc.config.vars.groups.indexOf(dvc.groups[i])];}
							});
							lines.exit().remove();
							
							
						// clear array of current values to use on left hand of graph
						dvc.currentStartValues = [];
							
							
						/* 
						
						...
						...
						...
						NEW LEFT-HAND GROUPINGS	NEW LEFT-HAND GROUPINGS	NEW LEFT-HAND GROUPINGS	NEW LEFT-HAND GROUPINGS	NEW LEFT-HAND GROUPINGS	NEW LEFT-HAND GROUPINGS	NEW LEFT-HAND GROUPINGS	NEW LEFT-HAND GROUPINGS
						...
						...
						...
						
						*/
						// apend new group elements to DOM based on currently selected start data. DO NOT TRANSFORM/TRANSLATE HERE. WILL NOT WORK. DO THIS AFTERWARDS IN SEPERATE CODE
						var leftGroups = chartSvg.selectAll(".groupLeft")
											.data(dvc.myData)
											.enter()
											.append("g")
												.attr("class", function(d,i){ return 'groupLeft' + ' ' + dvc.groups[i]; })
												.attr("id", function(d,i) { return "LGroupID" + i; });
										
												  
						var rightGroups = chartSvg.selectAll(".groupRight")
											.data(dvc.myData)
											.enter()
											.append("g")
												.attr("class", function(d,i){ return 'groupRight' + ' ' + dvc.groups[i]; })
												.attr("id", function(d,i) { return "RGroupID" + i; });
												  
									
												  
						// Now you can transform/translate both sets of groups according to the new values to display
						d3.selectAll(".groupLeft")
							.attr("transform" , function(d , i) {
								  
								if ( dvc.scalingType == "Values" ) {
									var x = (dvc.left_axis_indent - maskLeftWidth);
									var y = (opts.margin.top +  scale(d[0]) - (dvc.barHeight/2));
									
									return "translate(" + x + ", " + y + ")";
								}
								else {
									var x = (dvc.left_axis_indent - maskLeftWidth);										
									var y = (opts.margin.top + scale(d[0]) - (dvc.barHeight/2) - dvc.interval);
																			
									return "translate(" + x + ", " + y + ")";														
								}	
							});
							  
						
						d3.selectAll(".groupRight")
							.attr("transform" , function(d , i) {
								
								  if ( dvc.scalingType == "Values" ) {
									  var x = dvc.right_axis_indent;
									  var y = opts.margin.top + scale(d[1]) - (dvc.barHeight/2);
									  return "translate(" + x + ", " + y + ")";
								  }
								  else {
									  var x = dvc.right_axis_indent;
									  var y = (opts.margin.top + scale(d[1]) - (dvc.barHeight/2) - dvc.interval);
									  return "translate(" + x + ", " + y + ")";														
								  }	
							  });
								  
															  
									
									
			
						//append left hand transparent bars for interaction interactive 
						leftGroups.append("rect")
									.attr("class", function(d,i){ return 'barMasksLeft' + ' ' + dvc.groups[i]; })
									.attr("id", function(d,i) { return "LrectMaskID" + i; })
									.attr("width", maskLeftWidth)
									.attr("height", dvc.barHeight)
									.attr("opacity", function(d,i) { return 0. ; });
									
			
			
						//append left hand coloured index dots. Colour based on variable group allocation defined in data.csv. DO NOT TRANSFORMS/TRANSLATE IN THIS APPEND OPERATION
						leftGroups.append("circle")
									.attr("class", function(d,i) { return 'dots dotsLeft' + ' ' + dvc.groups[i]; })
									.attr("id", function(d,i) { return "LdotID" + i; })
									.attr("r", function(){
										if ( dvc.scalingType == "Values" ) { return 0; }
										else if ( dvc.scalingType == "Ranking and Values" ) { return dvc.dotSize; }
										else if ( dvc.scalingType == "Ranking" ) { return dvc.dotSize; }
									})
									.style("opacity" , function(d,i){
										if ( dvc.scalingType == "Values" ) { return 0.0; }
										else if ( dvc.scalingType == "Ranking and Values" ) {
																							
											if ( dvc.currentStartValues.indexOf(dvc.startArray[i]) == -1 ) {
												dvc.currentStartValues.push(dvc.startArray[i]);
												return 1.0;
											}
											else { return 0.0; }
										}
										else if ( dvc.scalingType == "Ranking" ) { return 1.0; }
									})
									.attr("stroke", function(d,i) { return dvc.config.vars.grpColorArray[dvc.config.vars.groups.indexOf(dvc.groups[i])]; })
									.attr("fill", function(d,i) { return dvc.config.vars.grpColorArray[dvc.config.vars.groups.indexOf(dvc.groups[i])]; });
							
									
						//	NOW YOU CAN TRANSFORMS/TRANSLATE YOUR COLOURED DOTS	
						d3.selectAll(".dotsLeft").attr("transform" , function(d,i) { return "translate(" + (maskLeftWidth) + "," + (dvc.barHeight/2) + ")"; })
							
							
						// clear array of current values to use on left hand of graphr
						dvc.currentStartValues = [];
						
			
						//append numeric indice label on left hand coloured dots
						leftGroups.append("text")	
									.attr("class", function(d,i) { return 'leftRankNumbers' + ' ' + dvc.groups[i]; })
									.attr("id", function(d,i) { return "leftRankNumbersID" + i; })
									.attr("dy", '.35em')
									.attr('text-anchor', 'middle')
									.text(function(d,i) {
										var indexToPrint = dvc.startArraySorted.indexOf(d[0]);
										var invertedIndexToPrint = dvc.myData.length - indexToPrint;										
										var ind = dvc.countStartInstancesArray[1][dvc.countStartInstancesArray[0].indexOf(dvc.startArray[i])];
										
										if ( ind == 1 ) { return parseInt(invertedIndexToPrint); }
										else { return parseInt(invertedIndexToPrint-(dvc.countStartInstancesArray[1][dvc.countStartInstancesArray[0].indexOf(dvc.startArray[i])]-1)); }
									})
									.style("opacity" , function(d,i){
										if ( dvc.scalingType == "Values" ) { return 0.0; }
										else if ( dvc.scalingType == "Ranking and Values" ) {
																							
											if ( dvc.currentStartValues.indexOf(dvc.startArray[i]) == -1 ) {
												dvc.currentStartValues.push(dvc.startArray[i]);
												return 1.0;
											}
											else {
												return 0.0;
											}
										}
										else if ( dvc.scalingType == "Ranking" ) { return 1.0; }
									})
									.style("font-size" , dvc.fontSize + "px");
									
									
						// Now you can transform/translate the coloured bars using new current values
						d3.selectAll(".leftRankNumbers").attr("transform" , function(d,i) { return "translate(" + (dvc.left_axis_indent) + "," + (dvc.barHeight/2) + ")"; })
						
							
						// clear array of current values to use on left hand of graphr
						dvc.currentStartValues = [];
			
														
						// append coloured bar to left hand x-axis. size based on data value. made .style("opacity" , 0.0) to begin as not shown at onload.	DO NOT TRANSFORMS/TRANSLATE THIS OPERATION HERE			  
						leftGroups.append("rect")
							.attr("class", function(d,i){ return 'barsLeft' + ' ' + dvc.groups[i]; })
							.attr("id", function(d , i) { return "LrectID" + i; })
							.attr("height",dvc.barHeight)
							.attr("fill", function(d,i) { return dvc.config.vars.grpColorArray[dvc.config.vars.groups.indexOf(dvc.groups[i])]; })
							.attr("stroke", function(d,i) { return dvc.config.vars.grpColorArray[dvc.config.vars.groups.indexOf(dvc.groups[i])]; })
							.style("opacity" , function(d,i){
								if ( dvc.scalingType == "Values" ) { return 0.0; }
								else if ( dvc.scalingType == "Ranking and Values" ) {
																					
									if ( dvc.currentStartValues.indexOf(dvc.startArray[i]) == -1 ) {
										dvc.currentStartValues.push(dvc.startArray[i]);
										return 0.5;
									}
									else {
										return 0.0;
									}
								}
								else if ( dvc.scalingType == "Ranking" ) { return 0.0; }
							});
									
									
						// Now you can transform/translate the coloured bars using new current values
						d3.selectAll(".barsLeft")
							.attr("transform" , function(d,i){																														
								if ( dvc.scalingType == "Values" ) { return "translate(" + (dvc.left_axis_indent - dvc.outer_buffer - horiScaleLeft(dvc.startArray[i])) + "," + (0) + ")";  }
								else if ( dvc.scalingType == "Ranking and Values" ) { return "translate(" + (dvc.left_axis_indent - dvc.outer_buffer - horiScaleLeft(dvc.startArray[i])) + "," + (0) + ")";  }
								else if ( dvc.scalingType == "Ranking" ) { return "translate(" + (dvc.left_axis_indent - dvc.outer_buffer - horiScaleLeft(dvc.startArray[i])) + "," +  (0) + ")";  }
							})		
							.attr("width", function(d , i) {
								if ( dvc.scalingType == "Values" ) { return horiScaleLeft(dvc.startArray[i]); }
								else if ( dvc.scalingType == "Ranking and Values" ) { return horiScaleLeft(dvc.startArray[i]); }
								else if ( dvc.scalingType == "Ranking" ) { return horiScaleLeft(dvc.startArray[i]); } 
							});
						
							
						// clear array of current values to use on left hand of graphr
						dvc.currentStartValues = [];
									
									
						//append left hand data value labels to graph
						leftGroups.append("text")
							.attr("class", function(d,i){ return 'dataValuesL' + ' ' + dvc.groups[i]; })
							.attr("id", function(d,i) { return "leftValueLabelID" + i; })
							.attr('text-anchor', 'start')
							.style("opacity" , function(d,i){
								if ( dvc.scalingType == "Values" ) { return 0.0; }
								else if ( dvc.scalingType == "Ranking and Values" ) {
																					
									if ( dvc.currentStartValues.indexOf(dvc.startArray[i]) == -1 ) {
										dvc.currentStartValues.push(dvc.startArray[i]);
										return 1.0;
									}
									else {
										return 0.0;
									}
								}
								else if ( dvc.scalingType == "Ranking" ) { return 0.0; }
							})
							.text(function(d,i) {
								return dvc.startArray[i].toFixed(dvc.config.vars.precision);
							})
							.style("font-size" , dvc.fontSize + "px");
									
									
						// Now you can transform/translate the bar values using new current values
						d3.selectAll(".dataValuesL").attr("transform" , function(d,i){ return "translate(" + (margin.left) + "," + (dvc.barHeight/2) + ")"; }).attr("dy", dvc.dyValue + 'em').style("vertical-align" , "middle");									
									
									
						// initialise new arrays to concatenate variable labels for this variables that have same values on left hand side of graph. Set their lengths.
						// Call function 'buildConcatenatedLabels' to concatenate relevant labels based on values .
						// *** NOTE *** Currently only concatenates labels with exactly the same value as given in input data.csv file. DOes not rounding inside code.
						dvc.combinedStartLabels = [];
						dvc.leftLabelConflictingIDs = [];
						dvc.combinedStartLabels.length = dvc.labels.length;
						buildConcatenatedLabels(dvc.countStartInstancesArray, dvc.leftLabelConflictingIDs, dvc.startArray, dvc.combinedStartLabels, "#leftLabelID");
									
									
						// initialise new arrays to concatenate variable labels for this variables that have same values on right hand side of graph. Set their lengths.
						// Call function 'buildConcatenatedLabels' to concatenate relevant labels based on values.
						// *** NOTE *** Currently only concatenates labels with exactly the same value as given in input data.csv file. DOes not rounding inside code.
						dvc.combinedEndLabels = [];
						dvc.combinedEndLabels.length = dvc.labels.length;
						dvc.rightLabelConflictingIDs = [];					
						buildConcatenatedLabels(dvc.countEndInstancesArray, dvc.rightLabelConflictingIDs, dvc.endArray, dvc.combinedEndLabels, "#rightLabelID");
						
												
						// ininitialise count incrementation variable.
						j = 0;
						
						
						//append left hand variable labels to graph
						leftGroups.append("text")
									.attr("class", function(d,i){ return 'left_labels slope-label' + ' ' + dvc.groups[i]; })
									.attr("id", function(d,i) { return "leftLabelID" + i; })
									.attr('text-anchor', 'end')
									.text(function(d,i) {
										var ind = dvc.countStartInstancesArray[0].indexOf(dvc.startArray[i]);
										
										if ( dvc.countStartInstancesArray[1][ind] == 1 ) {									
												return dvc.labels[i];
										}
										else {
										
											j++;
											var str = dvc.combinedStartLabels[i].slice(1,dvc.combinedStartLabels[i].length);										
											return str;
										}
									})
									.style("opacity", function(){
										if ( dvc.scalingType == "Values" ) { return 1.0; }
										else if ( dvc.scalingType == "Ranking and Values" ) { return 1.0;	}
										else if ( dvc.scalingType == "Ranking" ) { return 1.0; }
									})
									.style("font-size" , dvc.fontSize + "px");
									
								
						// Now you can transform/translate the bar value labels using new current values
						d3.selectAll(".left_labels").attr("transform" , function(d,i) { return "translate(" + (dvc.left_axis_indent - dvc.outer_buffer - 10) + "," + (dvc.barHeight/2) + ")"; }).attr("dy", dvc.dyValue + 'em').style("vertical-align" , "middle");
									
									
						// Call function to remove all left hand labels from display that conflict (overlap) others that have identical labels.
						// Retains last/longest variable label, ie. that which 'lists' all variables possessing the ame value
						// uses text label ID to remvoe/retain labels
						removeConflictingLabels(dvc.leftLabelConflictingIDs);
											
						
						
						/* 
						
						...
						...
						...
						NEW RIGHT-HAND GROUPINGS	NEW RIGHT-HAND GROUPINGS	NEW RIGHT-HAND GROUPINGS	NEW RIGHT-HAND GROUPINGS	NEW RIGHT-HAND GROUPINGS	NEW RIGHT-HAND GROUPINGS	NEW RIGHT-HAND GROUPINGS
						...
						...
						...
						
						*/			
						//append right hand transparent interactive bars
						rightGroups.append("rect")
									.attr("class", function(d,i){ return 'barMasksRight' + ' ' + dvc.groups[i]; })
									.attr("id", function(d,i) { return "RrectMaskID" + i; })
									.attr("width", maskRightWidth)
									.attr("height", dvc.barHeight)
									.attr("opacity", function(d,i) { return 0.; });
									
			
						//append right hand coloured dots. Colour based on variable group allocation defined in data.csv. DO NOT TRANSFORM/TRANSLATE OPERATION HERE
						rightGroups.append("circle")
									.attr("class", function(d,i) { return 'dots dotsRight' + ' ' + dvc.groups[i]; })
									.attr("id", function(d,i) { return "RdotID" + i; })
									.attr("r", function(){
										if ( dvc.scalingType == "Values" ) { return 0; }
										else if ( dvc.scalingType == "Ranking and Values" ) { return dvc.dotSize; }
										else if ( dvc.scalingType == "Ranking" ) { return dvc.dotSize; }
									})
									.style("opacity" , function(d,i){
										if ( dvc.scalingType == "Values" ) { return 0.0; }
										else if ( dvc.scalingType == "Ranking and Values" ) {
																							
											if ( dvc.currentEndValues.indexOf(dvc.endArray[i]) == -1 ) {
												dvc.currentEndValues.push(dvc.endArray[i]);
												return 1.0;
											}
											else {
												return 0.0;
											}
										}
										else if ( dvc.scalingType == "Ranking" ) { return 1.0; }
									})
									.attr("stroke", function(d,i) { return dvc.config.vars.grpColorArray[dvc.config.vars.groups.indexOf(dvc.groups[i])]; })
									.attr("fill", function(d,i) { return dvc.config.vars.grpColorArray[dvc.config.vars.groups.indexOf(dvc.groups[i])]; });
									
								
						// Now you can transform/translate the coloured dots labels using new current values
						d3.selectAll(".dotsRight").attr("transform" , function(d,i){ return "translate(" + (0) + "," + (dvc.barHeight/2) + ")"; })
													
							
						// clear array of current values to use on left hand of graph
						dvc.currentEndValues = [];
							
			
						//append numeric indice label on right hand coloured dots.
						rightGroups.append("text")	
							.attr("class", function(d,i) { return 'rightRankNumbers' + ' ' + dvc.groups[i]; })
							.attr("id", function(d,i) { return "rightRankNumbersID" + i; })
							.attr("dy", '.35em')
							.attr('text-anchor', 'middle')
							.text(function(d,i) {
								var indexToPrint = dvc.endArraySorted.indexOf(d[1]);
								var invertedIndexToPrint = dvc.myData.length - indexToPrint;										
								var ind = dvc.countEndInstancesArray[1][dvc.countEndInstancesArray[0].indexOf(dvc.endArray[i])];
								
								if ( ind == 1 ) { return parseInt(invertedIndexToPrint); }
								else { return parseInt(invertedIndexToPrint-(dvc.countEndInstancesArray[1][dvc.countEndInstancesArray[0].indexOf(dvc.endArray[i])]-1)); }
							})
							.style("opacity" , function(d,i){
								if ( dvc.scalingType == "Values" ) { return 0.0; }
								else if ( dvc.scalingType == "Ranking and Values" ) {
																					
									if ( dvc.currentEndValues.indexOf(dvc.endArray[i]) == -1 ) {
										dvc.currentEndValues.push(dvc.endArray[i]);
										return 1.0;
									}
									else {
										return 0.0;
									}
								}
								else if ( dvc.scalingType == "Ranking" ) { return 1.0; }
							})
							.style("font-size" , dvc.fontSize + "px");
									
								
						// Now you can transform/translate the rank index numbers associated with coloured dots labels using new current values
						d3.selectAll(".rightRankNumbers").attr("transform" , function(d,i){ return "translate(" + (0) + "," + (dvc.barHeight/2) + ")"; })
		
				
						// clear values array containing current right hand data values
						dvc.currentEndValues = [];
				
							
						// append coloured bar to right hand x-axis. size based on data value. made .style("opacity" , 0.0) to begin as not shown at onload.	 DO NOT TRANSFORM/TRANSLATE AT THIS POINT			  
						rightGroups.append("rect")
									.attr("class", function(d,i){ return 'barsRight' + ' ' + dvc.groups[i]; })
									.attr("id", function(d , i) { return "RrectID" + i; })
									.attr("height", dvc.barHeight)
									.attr("fill", function(d,i) { return dvc.config.vars.grpColorArray[dvc.config.vars.groups.indexOf(dvc.groups[i])]; })
									.attr("stroke", function(d,i) { return dvc.config.vars.grpColorArray[dvc.config.vars.groups.indexOf(dvc.groups[i])]; })
									.style("opacity" , function(d,i){
										if ( dvc.scalingType == "Values" ) { return 0.0; }
										else if ( dvc.scalingType == "Ranking and Values" ) {
																							
											if ( dvc.currentEndValues.indexOf(dvc.endArray[i]) == -1 ) {
												dvc.currentEndValues.push(dvc.endArray[i]);
												return 0.5;
											}
											else {
												return 0.0;
											}
										}
										else if ( dvc.scalingType == "Ranking" ) { return 0.0; }
									});
									
									
						// NOW YOU CAN TRANSFORM/TRANSLATE RIGHT HAND COLOURED BARS
						d3.selectAll(".barsRight")
							.attr("transform" , function(d,i){												
								if ( dvc.scalingType == "Values" ) { return "translate(" + (dvc.outer_buffer) + "," +  (0) + ")"; }
								else if ( dvc.scalingType == "Ranking and Values" ) { return "translate(" + (dvc.outer_buffer) + "," + (0) + ")"; }
								else if ( dvc.scalingType == "Ranking" ) { return "translate(" + (dvc.outer_buffer) + "," + (0) + ")"; }
							})
							.attr("width", function(d , i) {
								if ( dvc.scalingType == "Ranking" || dvc.scalingType == "Ranking and Values" ) { return horiScaleRight(dvc.endArray[i]); }
								else { return horiScaleRight(d[1]); }
							});
		
				
						// clear values array containing current right hand data values
						dvc.currentEndValues = [];
															
									
						//append right hand data value labels to graph.. DO NOT TRANSFORM/TRANSLATE HERE
						rightGroups.append("text")
									.attr("class", function(d,i){ return 'dataValuesR' + ' ' + dvc.groups[i]; })
									.attr("id", function(d,i) { return "rightValueLabelID" + i; })
									.attr("dy", '0em')
									.attr('text-anchor', 'end')
									.text(function(d,i) { return dvc.endArray[i].toFixed(dvc.config.vars.precision); })
									.style("opacity" , function(d,i){
										if ( dvc.scalingType == "Values" ) { return 0.0; }
										else if ( dvc.scalingType == "Ranking and Values" ) {
																							
											if ( dvc.currentEndValues.indexOf(dvc.endArray[i]) == -1 ) {
												dvc.currentEndValues.push(dvc.endArray[i]);
												return 1.0;
											}
											else {
												return 0.0;
											}
										}
										else if ( dvc.scalingType == "Ranking" ) { return 0.0; }
									})
									.text(function(d,i) {
										return dvc.endArray[i].toFixed(dvc.config.vars.precision);
									})
									.style("font-size" , dvc.fontSize + "px");
								
						
						// now you can transforms/translate the right hand data values.	
						d3.selectAll(".dataValuesR").attr("transform" , function(d,i){ return "translate(" + (maskRightWidth-margin.right) + "," + (dvc.barHeight/2) + ")"; }).attr("dy", dvc.dyValue + 'em').style("vertical-align" , "middle");
									
											
						//append right hand category labels to graph. Do not transform/tranlate this append operation now. Do it separately 
						rightGroups.append("text")
									.attr("class", function(d,i) { return 'right_labels slope-label' + ' ' + dvc.groups[i]; })
									.attr("id", function(d,i) { return "rightLabelID" + i; })
									.attr('text-anchor', 'start')
									.text(function(d,i) {
										
										var ind = dvc.countEndInstancesArray[0].indexOf(dvc.endArray[i]);
										
										if ( dvc.countEndInstancesArray[1][ind] == 1 ) {									
											return dvc.labels[i];
										}
										else {
										
											j++;
											var str = dvc.combinedEndLabels[i].slice(1,dvc.combinedEndLabels[i].length);										
											return str;
										}
									})
									.style("opacity", function(){
										if ( dvc.scalingType == "Values" ) { return 1.0; }
										else if ( dvc.scalingType == "Ranking and Values" ) { return 1.0;	}
										else if ( dvc.scalingType == "Ranking" ) { return 1.0; }
									})
									.style("font-size" , dvc.fontSize + "px");
									
						
						// now you can transforms/translate the right hand labels.			
						d3.selectAll(".right_labels").attr("transform" , function(d,i){ return "translate(" + (dvc.outer_buffer+10) + "," + (dvc.barHeight/2) + ")"; }).attr("dy", dvc.dyValue + 'em').style("vertical-align" , "middle");
									
									
						// Call function to remove all left hand labels from display that conflict (overlap) others that have identical labels.
						// Retains last/longest variable label, ie. that which 'lists' all variables possessing the ame value
						// uses text label ID to remvoe/retain labels
						removeConflictingLabels(dvc.rightLabelConflictingIDs);
			
			
					}// end if ... 
					
					
					
					/* 
					
					...
					...
					...
					TRANSITIONING IS REQUIRED
					...
					...
					...
					
					*/
					else {
												
							
						// remove necessary DOM elements					
						d3.selectAll(".leftRankNumbers").remove();
						d3.selectAll(".rightRankNumbers").remove();
						d3.selectAll(".left_labels").remove();
						d3.selectAll(".right_labels").remove();									
									
									
						// initialise new arrays to concatenate variable labels for this variables that have same values on left hand side of graph. Set their lengths.
						// Call function 'buildConcatenatedLabels' to concatenate relevant labels based on values .
						// *** NOTE *** Currently only concatenates labels with exactly the same value as given in input data.csv file. DOes not rounding inside code.
						dvc.combinedStartLabels = [];
						dvc.leftLabelConflictingIDs = [];
						dvc.combinedStartLabels.length = dvc.labels.length;
						buildConcatenatedLabels(dvc.countStartInstancesArray, dvc.leftLabelConflictingIDs, dvc.startArray, dvc.combinedStartLabels, "#leftLabelID");
									
																		
						// initialise new arrays to concatenate variable labels for this variables that have same values on right hand side of graph. Set their lengths.
						// Call function 'buildConcatenatedLabels' to concatenate relevant labels based on values .
						// *** NOTE *** Currently only concatenates labels with exactly the same value as given in input data.csv file. DOes not rounding inside code.
						dvc.combinedEndLabels = [];
						dvc.combinedEndLabels.length = dvc.labels.length;
						dvc.rightLabelConflictingIDs = [];
						buildConcatenatedLabels(dvc.countEndInstancesArray, dvc.rightLabelConflictingIDs, dvc.endArray, dvc.combinedEndLabels, "#rightLabelID");
										
						
						// update and transition slope lines
						d3.selectAll(".slope-line")
							.transition()
							.duration(1250)
							.delay(function(d,i){ return i*250; })
							.ease("cubic")
							.attr("x1" , dvc.left_axis_indent)
							.attr("x2" , dvc.right_axis_indent)
							.attr("y1" , function(d,i) {
							
									if ( dvc.scalingType == "Values" ) { return opts.margin.top + scale(d[0]); }
									else { return opts.margin.top + scale(d[0]) - dvc.interval; }
							})
							.attr("y2" , function(d,i) {
							
									if ( dvc.scalingType == "Values" ) { return opts.margin.top + scale(d[1]); }
									else { return opts.margin.top + scale(d[1]) - dvc.interval; }
							});
							
									
						// clear array contianing current data values to process
						dvc.currentStartValues = [];
										
						
						// update and transition left hand groups (this contains data values, transparent interction bars, coloured data bars)
						d3.selectAll(".groupLeft")
							.transition()
							.duration(1250)
							.delay(function(d,i){ return i*250; })
							.ease("cubic")
							.attr("transform" , function(d , i) {
								  
								if ( dvc.scalingType == "Values" ) {
									var x = (dvc.left_axis_indent - maskLeftWidth);
									var y = (opts.margin.top + scale(d[0]) - (dvc.barHeight/2));
									return "translate(" + x + ", " + y + ")";
								}
								else {
									var x = (dvc.left_axis_indent - maskLeftWidth);
									var y = (opts.margin.top + scale(d[0]) - (dvc.barHeight/2) - dvc.interval);
									return "translate(" + x + ", " + y + ")";														
								}	
							});					
									
			
						//append new numeric indice label on left hand coloured dots
						leftGroups.append("text")	
							.attr("class", function(d,i) { return 'leftRankNumbers' + ' ' + dvc.groups[i]; })
							.attr("id", function(d,i) { return "leftRankNumbersID" + i; })
							.attr("dy", '.35em')
							.attr('text-anchor', 'middle')
							.attr("transform" , function(d,i){ return "translate(" + (dvc.left_axis_indent) + "," + (dvc.barHeight/2) + ")"; })
							.text(function(d,i) {
								var indexToPrint = dvc.startArraySorted.indexOf(d[0]);
								var invertedIndexToPrint = dvc.myData.length - indexToPrint;
								
								var ind = dvc.countStartInstancesArray[1][dvc.countStartInstancesArray[0].indexOf(dvc.startArray[i])];
								
								if ( ind == 1 ) { return parseInt(invertedIndexToPrint); }
								else { return parseInt(invertedIndexToPrint-(dvc.countStartInstancesArray[1][dvc.countStartInstancesArray[0].indexOf(dvc.startArray[i])]-1)); }
							})
							.style("opacity" , function(d,i){
								if ( dvc.scalingType == "Values" ) {
									return 0.0;
								}
								else if ( dvc.scalingType == "Ranking and Values" ) {
									
									if ( dvc.currentStartValues.indexOf(dvc.startArray[i]) == -1 && dvc.booleanButtons.indexOf(true) == -1 ) {
										dvc.currentStartValues.push(dvc.startArray[i]);
										return 1.0;
									}
									else {						
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");											
										
										if ( cls == "leftRankNumbers " + indClass ) { return 1.0; }
										else { return 1.0; };
									}
								}
								else if ( dvc.scalingType == "Ranking" ) {
									
									if ( dvc.booleanButtons.indexOf(true) == -1 ) {
											return 1.0;
									}
									else {												
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");
										
										if ( cls == "leftRankNumbers " + indClass) { return 1.0; }
										else { return 0.0; }
										
									}// end else ...
								}
							})
							.style("font-size" , dvc.fontSize + "px");	
							
									
						// clear array of current starting values
						dvc.currentStartValues = [];
						
						
						// select all colured dots and transition accordingly
						d3.selectAll(".dotsLeft")
							.attr("r" , function(d,i){
								if ( dvc.scalingType == "Values" ) { return 0; }
								else if ( dvc.scalingType == "Ranking and Values" ) { return dvc.dotSize; }
								else if ( dvc.scalingType == "Ranking" ) { return dvc.dotSize; }
							})
							.style("opacity" , function(d,i){
								if ( dvc.scalingType == "Values" ) { return 0.0; }
								else if ( dvc.scalingType == "Ranking and Values" ) {
							
									if ( dvc.currentStartValues.indexOf(dvc.startArray[i]) == -1 && dvc.booleanButtons.indexOf(true) == - 1 ) {
										dvc.currentStartValues.push(dvc.startArray[i]);
										return 1.0;
									}
									else {						
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");											
										
										if ( cls == "dots dotsLeft " + indClass) { return 1.0; }
										else { return 0.0 };
									}
								}
								else if ( dvc.scalingType == "Ranking" ) {
									
									if ( dvc.booleanButtons.indexOf(true) == -1 ) {
											return 1.0;
									}
									else {												
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");
										
										if ( cls == "dots dotsLeft " + indClass) { return 1.0; }
										else { return 0.0; }
										
									}// end else ...
								}
							});
							
									
						// clear array of current starting values
						dvc.currentStartValues = [];
												
						
						// ininitialise count incrementation variable.
						j = 0;
						
						
						//append LEFT hand category labels to graph
						leftGroups.append("text")
							.attr("class", function(d,i){ return 'left_labels slope-label' + ' ' + dvc.groups[i]; })
							.attr("id", function(d,i) { return "leftLabelID" + i; })
							.attr("transform" , function(d,i) { return "translate(" + (dvc.left_axis_indent - dvc.outer_buffer - 10) + "," + (dvc.barHeight/2+2*dvc.gapHeight) + ")"; })
							.attr('text-anchor', 'end')
							.text(function(d,i) {
								
								var ind = dvc.countStartInstancesArray[0].indexOf(dvc.startArray[i]);
								
								if ( dvc.countStartInstancesArray[1][ind] == 1 ) {					
									return dvc.labels[i];
								}
								else {
								
									j++;
									var str = dvc.combinedStartLabels[i].slice(1,dvc.combinedStartLabels[i].length);
									return str;
								}
							})
							.style("opacity" , function(d,i){
								
								if ( dvc.scalingType == "Values" ) {
								
									if ( dvc.currentStartValues.indexOf(dvc.startArray[i]) == -1 && dvc.booleanButtons.indexOf(true) == - 1 ) {
										dvc.currentStartValues.push(dvc.startArray[i]);
										return 1.0;
									}
									else {						
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");											
										
										if ( cls == "left_labels slope-label " + indClass) { return 1.0; }
										else { return 0.0 };
									}
								}
								else if ( dvc.scalingType == "Ranking and Values" ) {
																		
									if ( dvc.currentStartValues.indexOf(dvc.startArray[i]) == -1 && dvc.booleanButtons.indexOf(true) == - 1 ) {
										dvc.currentStartValues.push(dvc.startArray[i]);
										return 1.0;
									}
									else {						
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");											
										
										if ( cls == "left_labels slope-label " + indClass) { return 1.0; }
										else { return 1.0 };
									}
								}
								else if ( dvc.scalingType == "Ranking" ) {
	
									if ( dvc.booleanButtons.indexOf(true) == -1 ) {
											return 1.0;
									}
									else {												
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");
										
										if ( cls == "left_labels slope-label " + indClass) { return 1.0; }
										else { return 0.0; }
										
									}// end else ...
								}
							})
							.style("font-size" , dvc.fontSize + "px");	
						
									
						// Call function to remove all left hand labels from display that conflict (overlap) others that have identical labels.
						// Retains last/longest variable label, ie. that which 'lists' all variables possessing the same value
						// uses text label ID to remvoe/retain labels
						removeConflictingLabels(dvc.leftLabelConflictingIDs);
							
									
						// clear array of current starting values
						dvc.currentStartValues = [];
						
								
						// transition physical coloured data bars. THese need to be done separately from transitionin the containing groups as the widths change also
						d3.selectAll(".barsLeft")
							.transition()
							.duration(1250)
							.delay(function(d,i){ return i*250; })
							.ease("cubic")							
							.attr("transform" , function(d,i){																														
								if ( dvc.scalingType == "Values" ) { return "translate(" + (dvc.left_axis_indent - dvc.outer_buffer - horiScaleLeft(dvc.startArray[i])) + "," + (0) + ")"; }
								else if ( dvc.scalingType == "Ranking and Values" ) { return "translate(" + (dvc.left_axis_indent - dvc.outer_buffer - horiScaleLeft(dvc.startArray[i])) + "," + (0) + ")"; }
								else if ( dvc.scalingType == "Ranking" ) { return "translate(" + (dvc.left_axis_indent - dvc.outer_buffer - horiScaleLeft(dvc.startArray[i])) + "," +  (0) + ")"; }
							})									
							.attr("width", function(d , i) {
								if ( dvc.scalingType == "Values" ){ return horiScaleLeft(dvc.startArray[i]); }
								else if ( dvc.scalingType == "Ranking and Values" ) { return horiScaleLeft(dvc.startArray[i]); }
								else if ( dvc.scalingType == "Ranking" ) { return horiScaleLeft(dvc.startArray[i]); }
							});	
							
						
						// select all left hand coloured bars and transition accordingly						
						d3.selectAll(".barsLeft")
							.attr("height" , dvc.barHeight)
							.style("opacity" , function(d,i){
								if ( dvc.scalingType == "Values" ) {
									return 0.0;
								}
								else if ( dvc.scalingType == "Ranking and Values" ) {
								
									if ( dvc.currentStartValues.indexOf(dvc.startArray[i]) == -1 && dvc.booleanButtons.indexOf(true) == - 1 ) {
										dvc.currentStartValues.push(dvc.startArray[i]);
										return 0.5;
									}
									else {						
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");											
										
										if ( cls == "barsLeft " + indClass) { return 0.5; }
										else { return 0.0 };
									}
								}
								else if ( dvc.scalingType == "Ranking" ) {
									
									if ( dvc.booleanButtons.indexOf(true) == -1 ) {
											return 0.0;
									}
									else {												
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");
										
										if ( cls == "barsLeft " + indClass) { return 0.0; }
										else { return 0.0; }
										
									}// end else ...
								}
							});
							
									
						// clear array of current starting values
						dvc.currentStartValues = [];
						

						// transition left hand data values separately
						d3.selectAll(".dataValuesL")
							.text(function(d,i){ return dvc.startArray[i].toFixed(dvc.config.vars.precision); })
							.style("opacity" , function(d,i){
								if ( dvc.scalingType == "Values" ) { return 0.0; }
								else if ( dvc.scalingType == "Ranking and Values" ) {									
								
									if ( dvc.currentStartValues.indexOf(dvc.startArray[i]) == -1 && dvc.booleanButtons.indexOf(true) == - 1 ) {
										dvc.currentStartValues.push(dvc.startArray[i]);
										return 1.0;
									}
									else {						
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");											
										
										if ( cls == "dataValuesL " + indClass) { return 1.0; }
										else { return 0.0 };
									}
								}
								else if ( dvc.scalingType == "Ranking" ) {
									
									if ( dvc.booleanButtons.indexOf(true) == -1 ) {
										return 0.0;
									}
									else {												
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");
										
										if ( cls == "dataValuesL " + indClass) { return 0.0; }
										else { return 0.0; }
										
									}// end else ...
								}
							})
							.style("font-size" , dvc.fontSize + "px");
						
						
						// Update and transition left hand groups. 
						// This also transitions by proxy databars, data value labels and variable labels, colour index dots and associated index labels as they are contained within in.
						d3.selectAll(".groupRight")
							.transition()
							.duration(1250)
							.delay(function(d,i){ return i*250; })
							.ease("cubic")
							.attr("transform" , function(d , i) {
								
								  if ( dvc.scalingType == "Values" ) {
									  
									  var x = dvc.right_axis_indent;
									  var y = opts.margin.top + scale(d[1]) - dvc.barHeight/2;
									  
									  return "translate(" + x + ", " + y + ")";
								  }
								  else {
									  
									  var x = dvc.right_axis_indent;
									  var y = (opts.margin.top + scale(d[1]) - dvc.barHeight/2 - dvc.interval);
									  
									  return "translate(" + x + ", " + y + ")";														
								  }	
							  });									
									
			
						//append new numeric indice label on right hand coloured dots
						rightGroups.append("text")
							.attr("class", function(d,i) { return 'rightRankNumbers' + ' ' + dvc.groups[i]; })
							.attr("id", function(d,i) { return "rightRankNumbersID" + i; })
							.attr("dy", '.35em')
							.attr('text-anchor', 'middle')
							.attr("transform" , function(d,i){ return "translate(" + (0) + "," + (dvc.barHeight/2) + ")"; })
							.text(function(d,i) {
								var indexToPrint = dvc.endArraySorted.indexOf(d[1]);
								var invertedIndexToPrint = dvc.myData.length - indexToPrint;
								
								var ind = dvc.countEndInstancesArray[1][dvc.countEndInstancesArray[0].indexOf(dvc.endArray[i])];
								
								if ( ind == 1 ) { return parseInt(invertedIndexToPrint); }
								else { return parseInt(invertedIndexToPrint-(dvc.countEndInstancesArray[1][dvc.countEndInstancesArray[0].indexOf(dvc.endArray[i])]-1)); }
							})
							.style("opacity" , function(d,i){
								if ( dvc.scalingType == "Values" ) {
									return 0.0;
								}
								else if ( dvc.scalingType == "Ranking and Values" ) {
						
									if ( dvc.currentEndValues.indexOf(dvc.endArray[i]) == -1 && dvc.booleanButtons.indexOf(true) == -1 ) {
										dvc.currentEndValues.push(dvc.endArray[i]);
										return 1.0;
									}
									else {						
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");											
										
										if ( cls == "rightRankNumbers " + indClass) { return 1.0; }
										else { return 0.0 };
									}
								}
								else if ( dvc.scalingType == "Ranking" ) {
									
									if ( dvc.booleanButtons.indexOf(true) == -1 ) {
											return 1.0;
									}
									else {												
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");
										
										if ( cls == "rightRankNumbers " + indClass) { return 1.0; }
										else { return 0.0; }
										
									}// end else ...
								}
							})
							.style("font-size" , dvc.fontSize + "px");	
							
									
						// clear array of current ending values
						dvc.currentEndValues = [];										
						
						
						d3.selectAll(".dotsRight")
							.attr("r" , function(d,i){
								
								if ( dvc.scalingType == "Values" ) { return 0; }
								else if ( dvc.scalingType == "Ranking and Values" ) { return dvc.dotSize; }
								else if ( dvc.scalingType == "Ranking" ) { return dvc.dotSize; }
							})
							.style("opacity" , function(d,i){
								
								if ( dvc.scalingType == "Values" ) { return 0.0; }
								else if ( dvc.scalingType == "Ranking and Values" ) {
	
									if ( dvc.currentEndValues.indexOf(dvc.endArray[i]) == -1 && dvc.booleanButtons.indexOf(true) == - 1 ) {
										dvc.currentEndValues.push(dvc.endArray[i]);
										return 1.0;
									}
									else {						
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");											
										
										if ( cls == "dots dotsRight " + indClass) { return 1.0; }
										else { return 0.0 };
									}
								}
								else if ( dvc.scalingType == "Ranking" ) {
									
									if ( dvc.booleanButtons.indexOf(true) == -1 ) {
											return 1.0;
									}
									else {												
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");
										
										if ( cls == "dots dotsRight " + indClass) { return 1.0; }
										else { return 0.0; }
										
									}// end else ...
								}
							});
							
									
						// clear array of current ending values
						dvc.currentEndValues = [];
						
											
						//append right hand category labels to graph
						rightGroups.append("text")
							.attr("class", function(d,i) { return 'right_labels slope-label' + ' ' + dvc.groups[i]; })
							.attr("id", function(d,i) {
								
								return "rightLabelID" + i;
							})
							.attr("transform" , function(d,i){ return "translate(" + (dvc.outer_buffer+10)  + "," + (dvc.barHeight/2+2*dvc.gapHeight) + ")"; })
							.attr('text-anchor', 'start')
							.text(function(d,i) {
								
								var ind = dvc.countEndInstancesArray[0].indexOf(dvc.endArray[i]);
								
								if ( dvc.countEndInstancesArray[1][ind] == 1 ) {									
									return dvc.labels[i];
								}
								else {
								
									j++;
									var str = dvc.combinedEndLabels[i].slice(1,dvc.combinedEndLabels[i].length);										
									return str;
								}
							})
							.style("opacity" , function(d,i){
								if ( dvc.scalingType == "Values" ) {
																			
									if ( dvc.currentEndValues.indexOf(dvc.endArray[i]) == -1 && dvc.booleanButtons.indexOf(true) == - 1 ) {
										dvc.currentEndValues.push(dvc.endArray[i]);
										return 1.0;
									}
									else {						
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");											
										
										if ( cls == "right_labels slope-label " + indClass) { return 1.0; }
										else { return 0.0 };
									}
								}
								else if ( dvc.scalingType == "Ranking and Values" ) {
																			
									if ( dvc.currentEndValues.indexOf(dvc.endArray[i]) == -1 && dvc.booleanButtons.indexOf(true) == - 1 ) {
										dvc.currentEndValues.push(dvc.endArray[i]);
										return 1.0;
									}
									else {						
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");											
										
										if ( cls == "right_labels slope-label " + indClass) { return 1.0; }
										else { return 1.0 };
									}
								}
								else if ( dvc.scalingType == "Ranking" ) {
									
									if ( dvc.booleanButtons.indexOf(true) == -1 ) {
											return 1.0;
									}
									else {												
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");
										
										if ( cls == "right_labels slope-label " + indClass) { return 1.0; }
										else { return 0.0; }
										
									}// end else ...
								}
							})
							.style("font-size" , dvc.fontSize + "px");	
									
									
									
						// Call function to remove all right hand labels from display that conflict (overlap) others that have identical labels.
						// Retains last/longest variable label, ie. that which 'lists' all variables possessing the ame value
						// uses text label ID to remvoe/retain labels
						removeConflictingLabels(dvc.rightLabelConflictingIDs);								
									
								
								
						// transition physcial coloured data bars. THese need to be done separately from trantioning teh comt	inaing groups as the widths change also
						d3.selectAll(".barsRight")
							.transition()
							.duration(1250)
							.delay(function(d,i){ return i*250; })
							.ease("cubic")								
							.attr("width", function(d , i) {
								if ( dvc.scalingType == "Values" ) { return horiScaleRight(dvc.endArray[i]); }
								else if ( dvc.scalingType == "Ranking and Values" ) { return horiScaleRight(dvc.endArray[i]); }
								else if ( dvc.scalingType == "Ranking" ) { return horiScaleRight(dvc.endArray[i]); }
							});	
							
									
						// clear array of current ending values
						dvc.currentEndValues = [];							  
							  							
						d3.selectAll(".barsRight")
							.attr("height", dvc.barHeight)
							.style("opacity" , function(d,i){
								if ( dvc.scalingType == "Values" ) {
									return 0.0;
								}
								else if ( dvc.scalingType == "Ranking and Values" ) {
								
									if ( dvc.currentEndValues.indexOf(dvc.endArray[i]) == -1 && dvc.booleanButtons.indexOf(true) == - 1 ) {
										dvc.currentEndValues.push(dvc.endArray[i]);
										return 0.5;
									}
									else {						
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");											
										
										if ( cls == "barsRight " + indClass) { return 0.5; }
										else { return 0.0 };
									}
								}
								else if ( dvc.scalingType == "Ranking" ) {
									
									if ( dvc.booleanButtons.indexOf(true) == -1 ) {
											return 0.0;
									}
									else {												
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");
										
										if ( cls == "barsRight " + indClass) { return 0.0; }
										else { return 0.0; }
										
									}// end else ...
								}
							});
							
									
						// clear array of current ending values
						dvc.currentEndValues = [];
							
						
						// transition right hand data values separately
						d3.selectAll(".dataValuesR")
							.text(function(d,i){ return dvc.endArray[i].toFixed(dvc.config.vars.precision); })	
							.style("opacity" , function(d,i){
								
								if ( dvc.scalingType == "Values" ) { return 0.0; }
								else if ( dvc.scalingType == "Ranking and Values" ) {
									
									if ( dvc.currentEndValues.indexOf(dvc.endArray[i]) == -1 && dvc.booleanButtons.indexOf(true) == - 1 ) {
										dvc.currentEndValues.push(dvc.endArray[i]);
										return 1.0;
									}
									else {						
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");											
										
										if ( cls == "dataValuesR " + indClass) { return 1.0; }
										else { return 0.0 };
									}
								}
								else if ( dvc.scalingType == "Ranking" ) {
									
									if ( dvc.booleanButtons.indexOf(true) == -1 ) {
											return 0.0;
									}
									else {												
										var indClass = dvc.config.vars.groups[dvc.booleanButtons.indexOf(true)];
										var cls = d3.select(this).attr("class");
										
										if ( cls == "dataValuesR " + indClass) { return 0.0; }
										else { return 0.0; }
										
									}// end else ...
								}
							})
							.style("font-size" , dvc.fontSize + "px");									
	
							
						// if user wants to display data values and coloured bars								
						if (dvc.scalingType == "Ranking and Values" ) {
							
														
							// determine determine new rounding value based on maximum data value of start and end arrays
							if ( d3.max([ d3.max(dvc.startArray) , d3.max(dvc.endArray) ]) > 0 ) { dvc.roundVal = 1; } 
							if ( d3.max([ d3.max(dvc.startArray) , d3.max(dvc.endArray) ]) > 10 ) { dvc.roundVal = 10; } 
							if ( d3.max([ d3.max(dvc.startArray) , d3.max(dvc.endArray) ]) > 100 ) { dvc.roundVal = 20; } 
							if ( d3.max([ d3.max(dvc.startArray) , d3.max(dvc.endArray) ]) > 500 ) { dvc.roundVal = 50; } 
							if ( d3.max([ d3.max(dvc.startArray) , d3.max(dvc.endArray) ]) > 1000 ) { dvc.roundVal = 100; } 
							
							
							// assign data maximum value to local variable
							var maxValue = Math.ceil(d3.max( [ d3.max(dvc.startArray) , d3.max(dvc.endArray) ] )/dvc.roundVal)*dvc.roundVal;
							var right_axis_range = (chart_width - margin.right - dvc.outer_buffer) - dvc.right_axis_indent;
							var left_axis_range = right_axis_range;
									
								
							// redefine both left and right hand horizontal scales.
							var horiScaleLeft = d3.scale.linear().domain([ 0 , maxValue ]).range([0, left_axis_range]); // hidden axis. leftBars are plotted against these ... 
							var horiScaleLeftFalse = d3.scale.linear().domain([ maxValue, 0 ]).range([0, left_axis_range]); // visible axis. leftBars are NOT plotted against these. Provided to give right 'sense' to axis values
							var horiScaleRight = d3.scale.linear().domain([ 0 , maxValue ]).range([0, right_axis_range]); // hidden axis. rightBars are plotted against these ... 							
								
								
							// attach newly defined left hand x axis 
							dvc.xAxisLeft=d3.svg.axis()
									.scale(horiScaleLeft)
									.ticks(dvc.numXAxisTicks)
									.orient("bottom");
			
						
							// reposition left hand x axis
							chartSvg.append("g")
								.attr("class","axis")
								.attr("id", "xAxisLeft")
								.attr("transform","translate("+ (dvc.left_axis_indent - left_axis_range - dvc.outer_buffer) + ", " +  (opts.margin.top - 40) + ")")
								.call(dvc.xAxisLeft)
								.style("display" , "none");
											
								
							// attach newly defined false left hand x axis 
							dvc.xAxisLeftFalse=d3.svg.axis()
									.scale(horiScaleLeftFalse)
									.ticks(dvc.numXAxisTicks)
									.orient("bottom");
			
			
							// reposition false left hand x axis 
							chartSvg.append("g")
								.attr("class","axis")
								.attr("id", "xAxisLeftFalse")
								.attr("transform","translate("+ (dvc.left_axis_indent - left_axis_range - dvc.outer_buffer) + ", " + (opts.margin.top - 40) + ")")
								.call(dvc.xAxisLeftFalse)
								.style("display" , "inline");
			
								
							// attach newly defined right hand x axis 
							dvc.xAxisRight=d3.svg.axis()
									.scale(horiScaleRight)
									.ticks(dvc.numXAxisTicks)
									.orient("bottom");
			
			
							// reposition right hand x axis 
							chartSvg.append("g")
								.attr("class","axis")
								.attr("id", "xAxisRight")
								.attr("transform","translate("+ (dvc.right_axis_indent + dvc.outer_buffer) + ", " + (opts.margin.top - 40 ) + ")")
								.call(dvc.xAxisRight);
								
								
						}// end if 'dvc.showData == true '
	
													
					}// end else ... 
					
														
				});// end selection.each(function (dataset)
				
								
			}// end function exports(selection)
			
			
			// errrr......?			
			exports.opts = opts;
			createAccessors(exports);
		
		
			return exports;
			
			
		}// end d3.custom.slopegraph = function()
		
		
		// errrr......?						
		createAccessors = function(visExport) {
			
			
			for (var n in visExport.opts) {		
			
				
				if (!visExport.opts.hasOwnProperty(n)) continue;
				visExport[n] = (function(n) {
					return function(v) {					
						return arguments.length ? (visExport.opts[n] = v, this) : visExport.opts[n];
					}
					
				})(n);
				
				
			}
			
			
		};// end createAccessors
		
		
		
		
		
		/*
			NAME: 			findIndicies
			DESCRIPTION: 	use original input array so that rank indicies can be determined dynamically without need to reference static columns in input data.csv files as used in earlier versions					
			CALLED FROM:	within 'selection.each(function (dataset)' loop
			CALLS: 			n/a			
			REQUIRES: 		unsortedInputArray - original unmodified input array to interrogate
							sortedInputArray - copy of original unmodified input array sorted in ascending order to allow indexes to be determined
							indiciesArray - array to fill with indexes 
			RETURNS: 		n/a
		*/
		function findIndicies(unsortedInputArray, sortedInputArray, indiciesArray){
		
			
			// for each element in oroginal array, store as local variable, determine its place/index in sorted copy of input array. Store index value in new array.
			unsortedInputArray.forEach(function(d,i){					
			
			
				var val = d;
				var index = parseInt(sortedInputArray.indexOf(val))+1;
				indiciesArray[i] = index;	
				
				
			})// end forEach
			
						
			return;
			
			
		} // end function findIndicies()
		
		
							
		
		
		/*
			NAME: 			compareNumbers
			DESCRIPTION: 	compares two inputs to determine which is higher			
			CALLED FROM:	within 'selection.each(function (dataset)' loop
			CALLS: 			n/a			
			REQUIRES: 		a - value to compare
							b - value to compare
			RETURNS: 		the higher of a and b
			NOTE:			function to sort content of temporary start and end data arrays NUMERICALLY
							URL reference - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort - under 'Examples'
		*/ 
		function compareNumbers(a, b) {
		
		
			return a - b;
			
			
		}// end function compareNumbers()
		
		
							
		
		
		/*
			NAME: 			removeConflictingLabels
			DESCRIPTION: 	compares two inputs to determine which is higher			
			CALLED FROM:	within 'selection.each(function (dataset)' loop
			CALLS: 			n/a			
			REQUIRES: 		arg - array containing DOM IDs of variable labels that are conflicting due to posessing same data values
			RETURNS: 		n/a
		*/ 
		function removeConflictingLabels(arg){
				
			
		
			// store input array as local variable
			var arrayToUse = arg;
			
			
			
			// for each element in array 
			arrayToUse.forEach(function(d,i){
			
			
				// store value (i.e. list of DOM IDs) as a local variable	
				var arr = d;
				
								
				// initialise incrementation variable
				var j = 0;
				
				
				var inner_Cls_Str = '';						
				var cls_org = '';					
				var cls_mod = '';					
				var ele = '';
								
				
				//for each DOM ID ...
				arr.forEach(function(d,i){
					
					
					// store as local variable
					ele = d;
						
					cls_org = d3.select(ele).attr("class");
					cls_mod = d3.select(ele).attr("class").replace("left_labels slope-label " , '').replace("right_labels slope-label " , '');
					
					if ( inner_Cls_Str.indexOf(cls_mod) == -1 ) { inner_Cls_Str = inner_Cls_Str + " " + cls_mod; } // end if ...
					else { inner_Cls_Str = inner_Cls_Str; } // end else ..
																	
					
				})// end foreach
				

								
				
				//for each DOM ID ...
				arr.forEach(function(d,i){
					
					
					// store as local variable and determine new multi-group class to it using concatenated string from previous loop
					var ele = d;
					var newClass_subStr = (d3.select(ele).attr("class").substr(0,((d3.select(ele).attr("class").indexOf("slope-label")) + 11))) + inner_Cls_Str;
														
								
					// modify CSS display attributes based on whether ele is last element of input array or A N Other.
					if ( j < arr.length-1) {
						
												
						// assign new multi-gorop class to ID and hide label as it is not final element in array 'arr'
						d3.select(ele).attr("class" , newClass_subStr);
						d3.select(ele).style("display" , "none");
						
											
					}// end if
					else {
						
												
						// assign new multi-gorop class to ID and display label as it is  final element in array 'arr'
						d3.select(ele).attr("class" , newClass_subStr);
						d3.select(ele).style("display" , "inline");
						
						
					}// end else ...
				
					
					// increment count. Avoids code confusion with using 'i' as incrementor
					j++;
					
					
				})// end foreach				
				
				
			})// end foreach
			

			return;
	
			
		}// end function removeConflictingLabels() 
		
		
							
		
		
		/*					
			NAME: 			buildConcatenatedLabels
			DESCRIPTION: 	concatenates relevant individual labels that possess conflicting/identical data values into one single longer label to over write the individual labels.
			CALLED FROM:	within 'selection.each(function (dataset)' loop
			CALLS: 			multiIndexOf array prototype		
			REQUIRES: 		arg1 - 2D array containing information on uniqiue instances of input array content and a count of number of isntances of each in inbput array
							arg2 - initialised empty array to contain DOM IDs of labels relating to conflidting/ientical data values.
							arg3 - unmodified input data array. Required to find all instances/indexes of values using array prototype object definition
							arg4 - array to contained iterartviely concatenated labels
							arg5 - fixed static string to prefix labels with
			RETURNS: 		n/a
		*/ 
		function buildConcatenatedLabels(arg1, arg2, arg3, arg4, arg5){
			
							
					
			// initialise incrementation variable
			var j = 0;
				
				
			// foreach element in count instance array,
			arg1[1].forEach(function(d,i) {
								
				
				// bypass values which only have one occurrrence in input array					
				if (arg1[1][i] > 1 ) {
						
			
					// increment counter
					j++;
						
			
					// set up and initialise inner array specific for instances content with more than one occurrence in input array
					arg2[j] = [];
			
						
					// calling new array object proto to return array containing all indexes of the same content in submitted array
					var combinedLeftLabel = '';
					dvc.Indexes = arg3.multiIndexOf(arg1[0][i]);
										
					
					// for each element/index in newly created array of repeating values
					dvc.Indexes.forEach(function(d,i){
						
												
						// constuct an updated version of concatenated labels string, and push into relecant array to access and use later to modify display CSS attribution to show/hide labels.
						combinedLeftLabel = combinedLeftLabel + ", " + dvc.labels[d];
						arg4[d] = combinedLeftLabel;		
						arg2[j].push(arg5 + d);
						
						
					})// end foreach
					
					
				}// end if ... 
				
				
			})// end foreach
			
			
			return;
			
			
		} // end function buildConcatenatedLabels() 
		
					
		  
		  
			  
			  
		/*
			array prototype ... 
			new array object proto defined to return array containing all indexes of the same content in a given array
		*/
		Array.prototype.multiIndexOf = function (el) { 
			var idxs = [];
			for (var i = this.length - 1; i >= 0; i--) {
				if (this[i] === el) {
					idxs.unshift(i);
				}
			}
			
			return idxs;
			
		};// end array prototype
	
	
		  