				
				var ips = a(".form_area .field",u).toArray();
				var fips = a(".form_area .field input",u).toArray();
			
				var commands = [];
				var ihtml = [];
			
				for ( var _i=0; _i<ips.length; ++_i ) {
					var spl = ips[_i].innerHTML.split("=&gt;");
					ihtml.push(ips[_i].innerHTML);
				
					if ( spl.length == 1 ) {
						commands.push("");
					} else {
						var command = spl[1].split(":<div")[0];
						commands.push(command);
						ips[_i].innerHTML = ips[_i].innerHTML.split("=&gt;" + command).join("");
					}
				
					//link:scale(global_1@.1234);
					//link:match(global)
				}
				
				window.CALCPRO_SCALING_GLOBALS = {};
				
				//globals must be declared before use, so one pass
				
				var precision = 4;
				var event_handler = function() {

					if ( !a(this).attr("data-scale") ) {
						return;
					}
					var typem = a(this).attr("data-type");
					if ( typem == "scale") {
						window.CALCPRO_SCALING_GLOBALS[a(this).attr("data-global")] = 
							this.value / a(this).attr("data-scale");
					} else if ( typem = "linear" ) {
						window.CALCPRO_SCALING_GLOBALS[a(this).attr("data-global")] = 
							( this.value - 1*a(this).attr("data-offset" )  )/ a(this).attr("data-scale");						
					}

					for ( var _j=0; _j < ips.length; ++_j ) {
						if ( this == a("input",ips[_j]).toArray()[0] ) {
							continue;
						}
						if ( commands[_j].length ) {
							var type = a("input",ips[_j]).attr("data-type");
							if ( type == "scale" ) {
								a("input",ips[_j]).val(
									(window.CALCPRO_SCALING_GLOBALS[a("input",ips[_j]).attr("data-global")] * 
									a("input",ips[_j]).attr("data-scale")).toFixed(precision)
								);
							} else if ( type == "linear" ) {
								a("input",ips[_j]).val(
									(
										window.CALCPRO_SCALING_GLOBALS[a("input",ips[_j]).attr("data-global")] * 
										a("input",ips[_j]).attr("data-scale") + 
										a("input",ips[_j]).attr("data-offset")*1
									).toFixed(precision)
								);								
							}
						}
					}
				}
				
				for ( var _i = 0; _i < commands.length; ++_i ) {
					var com = commands[_i];
					if ( com.length ) {
						if ( com.indexOf("match(") > -1 ) {
							var name = com.split("match(")[1].split(")")[0];
							
							var value = 0;
							
							a("input",ips[_i]).val(value)
								.attr("data-scale",1)
								.attr("data-global",name)
								.attr("data-type","scale");
								
								window.CALCPRO_SCALING_GLOBALS[name] = value;
						} else if( com.indexOf("scale(") > -1 ){
							var name = com.split("scale(")[1].split("@")[0];
							var scale = com.split("@")[1].split(")")[0];
							var value = 0;
							
							a("input",ips[_i])
								.val(value)
								.attr("data-scale",scale)
								.attr("data-type","scale")
								.attr("data-global",name);
								
						} else if( com.indexOf("linear(") > -1 ){
							var name = com.split("linear(")[1].split("@")[0];
							var scale = com.split("@")[1];
							var offset = com.split("@")[2].split(")")[0];
							var value = offset;
							
							a("input",ips[_i]).val(value)
								.attr("data-scale",scale)
								.attr("data-offset",offset)
								.attr("data-type","linear")
								.attr("data-global",name);
						}
						a("input",ips[_i]).keyup(event_handler);
					
					}
				}
				
            }
