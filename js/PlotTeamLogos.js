function drawTeamLogos()
{
	d3.csv("datasets/usamap/arenaCoordinates.csv", function(err, d){
		var coordinates = [];

		d.forEach(function(d, i)
		{
			d.longtitude = +d.longtitude;
			d.latitude = +d.latitude;
			coordinates[i] = new Array();
			coordinates[i] = projection([d.longtitude,d.latitude])
			teamAbbreviation[d.Team] = d.T;
		})		
	
		tip.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<img src=\"img/" + d.T +".svg\" height=\"100\"></img>" 
			+ "<p><strong>"+ d.Team +"</strong> <span style='color:red'></p>"
			+ "<p><strong>Offensive Rating:</strong> <span style='color:red'>" + d.ORtg + "</span></p>"
			+ "<p><strong>Deffensive Rating:</strong> <span style='color:red'>" + d.DRtg + "</span></p>"
			+ "<p><strong>Pace:</strong> <span style='color:red'>" + d.Pace + "</span></p>";
		})

		usaMapSvg.call(tip);
	
		var teamLogoGroup = usaMapSvg.selectAll("g")
				.data(d)
				.enter()
					.append("g")
		

		var defs = teamLogoGroup.append("defs")
		
		
		var catpattern = defs.append("pattern")
                    .attr("id", function(d,i){return d.T;})
                    .attr("height", 1)
                    .attr("width", 1)
                    .attr("x", "0")
                    .attr("y", "0")
		
		catpattern.append("image")
						.attr("id", function(d){ return "logoid_" + d.T})
						.attr("xlink:href",function(d,i){return "img/" +  d.T + ".svg"} )
						.attr("x", 0)
						.attr("y", 0)
						.attr("width",teamLogoWidth)
						.attr("height", teamLogoHeight)	
						.attr("opacity", 0)
						.transition()
							.duration(800)
							.attr("opacity", 1)
									
		circles = teamLogoGroup.append("circle")
				.attr("cx", function (d, i){var co = coordinates[i];return co[0];})
				.attr("cy", function (d, i){var co = coordinates[i];return co[1];})
				.attr("r", teamLogoRaduis)
				.attr("fill", function (d,i){return "url(#"+d.T + ")"})
				.on('mouseover', function(d, i){
					d3.select(this)
								.attr("fill", function (d,i){return "url(#"+d.T + ")"})
								.transition()
								.duration(200)
								.attr("r", teamLogoRaduis * 3)
								.transition()
								.duration(50)
								.attr("r", teamLogoRaduis * 2.8)
								
					teamLogoGroup.select("#logoid_" + d.T)
								.transition()
								.duration(200)
								.attr("width",teamLogoWidth * 3)
								.attr("height", teamLogoHeight * 3)	
								.transition()
								.duration(50)
								.attr("width",teamLogoWidth * 2.8)
								.attr("height", teamLogoHeight * 2.8)
							
				})
				.on('mouseout', function(d, i){
					d3.select(this).transition()
								.duration(200)
								.attr("r", teamLogoRaduis)
								
					teamLogoGroup.select("#logoid_" + d.T)
								.transition()
								.duration(200)
								.attr("width",teamLogoWidth)
								.attr("height", teamLogoHeight)	
			
				})
				.on('click', function(d, i){
					selectedTeam = d; // Will be used in NBAGo.js file, in the "back" button function.
					d3.select("#gameBarChartSvg svg").attr("height", gameBarChartHeight);

					d3.selectAll(".TeamDes").remove();
					d3.selectAll(".BarChartDes").remove();
					d3.selectAll(".img-container").remove();

					d3.csv("datasets/seasonSumary.csv", function(err, data){
						for (var i=0; i<31; i++) {
							if (data[i].Team == d.T) {
								var team = data[i];
								d3.select("#gameBarChartSvg").append("div").attr("class", "img-container").attr("id", "img-container");
								d3.select("#img-container").append("div").append("img").attr("src", "img\/" + d.T + ".jpg").attr("class", "TeamDes").attr("class", "img-thumb");
								var temp = d3.select("#img-container").append("div").attr("class", "team-desc").attr("id", "team-desc");
									temp.append("p").text("You've chosen " + d.Team+"! Also known as: " + d.T + "!" + " The home stadium for " + d.Team + " is " + d.Arena + ".").attr("class", "TeamDes");
								d3.select("#img-container").append("div").append("p").text("For 09-10 season, " + d.Team + " has Average Field Goal Persentage: 0" + team.FGP + "; Average 3-Points Accuracy: 0" + team['3P'] + "; Average Points per Game: " + team['PTS/G'] + ".").attr("class", "TeamDes");;
							
							}
						}
					})
					
					dispatch.chooseTeam(d.T, "2009-2010", "20091027", "20100414");
				})
		})		
		return true;
}