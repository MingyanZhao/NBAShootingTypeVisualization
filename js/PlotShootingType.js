var shootingTypefilter
var resultDimension;
var playerDimension;
var typeDimension;
var distanceDimension;
var distanceFilter;
var resultfilter;
var typefiler;
var playerfilter;
var filtered;
var typeWidth = 300;
var misswidth  = 150;
var topmargin = 30
var barwidth = 150
var typesvgwidth = 700
var accuwidth = 150;
var typeHeight = 900;
var typeBarsStartx = 200;
var offset = 20
var selectedPlayer;
var selectedType;
var selectedResult;
var jump5 = "jump in 5feet";
var jump5to10 = "jump 5ft-10ft"
var jump11to15 = "jump 11ft-15ft"
var jump15to22 = "jump 15ft-22ft"
var jump21to25 = "jump 21ft-25ft"
var jumpover25 = "jump >25ft"


function clearShootingType()
{
	shootingTypeDiv.selectAll("p").remove();
	shootingTypeDiv.select(".shootingType").remove();
}

function ShootingType(d)
{
	//clearShootingChart();
	//console.log("there")
	var d = arguments[0];
	var array = new Array();
	for (var i=1; i < d.length; i++)
	{
		Array.prototype.push.apply(array , d[i]);
	}
	
	shootingTypefilter = crossfilter(array);

	typeDimension = shootingTypefilter.dimension(function(d) {
		//console.log(d.type); 
		if(d.type == "") return "other"; 
		else return d.type; });
	
	playerDimension = shootingTypefilter.dimension(function(d) {
		//console.log(d.type); 
		if(d.type == "") return "other"; 
		else return d.player; });

	resultDimension = shootingTypefilter.dimension(function(d) {
		if(d.type == "") return "other"; 
		else return d.result; });	
		
		
	distanceDimension = shootingTypefilter.dimension(function(d){
		var t = Math.sqrt(Math.pow(d.x - 25, 2) + Math.pow(d.y - 5.5, 2))

		return t;
	})
		
	typeDimension.filterAll();	
	playerDimension.filterAll();
	resultDimension.filterAll();
	distanceDimension.filterAll();
	result = "NULL";
	type = "NULL";
	player = "NULL";
	
	shootingTypeFilter(result, type, player);
}



function shootingTypeFilter(result, type, player)
{
	selectedPlayer = player;
	selectedType = type;
	selectedResult = result;
	typeDimension.filterAll();	
	playerDimension.filterAll();
	resultDimension.filterAll();
	
	resultfilter = resultDimension.filterFunction(function(d) { 
		if(result == "NULL") return true;
		if(d == result) return true;
		else return false;
	})

	typefiler = typeDimension.filterFunction(function(d) { 
		if(type == "NULL") return true;
		if(d == type) return true;
		else return false;
	})

	playerfilter = playerDimension.filterFunction(function(d) { 
		 //console.log(d);
		if(player == "NULL") return true;
		if(d == player) return true;
		else return false;
	})
	

//console.log(filtered)
	filtered = typeDimension.top(Infinity);
	addShootingPoints(filtered);
	
	drawBars(filtered);
}

function clearfilters()
{
	selectedPlayer = "NULL";
	selectedResult = "NULL";
	selectedType = "NULL";
	typeDimension.filterAll();	
	playerDimension.filterAll();
	resultDimension.filterAll();
}

function clearTypeBars()
{
	shootingTypeDiv.selectAll("svg").remove();
}
var types;
function drawBars(data)
{
	clearTypeBars();

	
	var typeForDomain = [];
	var tmptype;
	var distance = "";
	types = [];
	data.forEach(function(d){
		if(d.result == "") return;
		//types[d.type] = new Object();
		if(d.type == "" || d.type == "layup") return;
		
		if(d.type == "jump"){
			distance = Math.sqrt(Math.pow(d.x - 25, 2) + Math.pow(d.y - 5.5, 2))
			if(distance >0 && distance <= 5) tmptype = "jump in 5feet";
			else if(distance > 6 && distance < 10) tmptype = "jump 5ft-10ft"
			else if(distance >= 11 && distance < 15) tmptype = "jump 11ft-15ft"
			else if(distance >= 16 && distance < 20) tmptype = "jump 15ft-22ft"
			else if(distance >= 21 && distance < 25) tmptype = "jump 21ft-25ft"
		}
		else tmptype = d.type;
		
		if(types[tmptype] == null){
			types[tmptype] = {}
			types[tmptype].player = [];
			if(d.type == "jump") types[tmptype].distance = tmptype;
			else types[tmptype].distance = "";
			
			if(d.result == "made"){
				types[tmptype].made = 1;
				types[tmptype].miss = 0;
				
			} 
			else if (d.result == "missed")
			{
				types[tmptype].miss = 1;
				types[tmptype].made = 0;
			}
		}
		else{
			var i = types[tmptype].player.length;
			types[tmptype].player[i] = d.player;
			if(d.result == "made") types[tmptype].made++;
			else if (d.result == "missed") types[tmptype].miss++;
		}
	})
	
	var index = 0;
	for (var i in types) {
		//console.log('Key is: ' + i + '. Value is: ' + types[i]);

		typeForDomain[index] = i;
		index++;
	} 
	
    var margin = {top: 20, right: 250, bottom: 150, left: 50};
    var width = typeWidth;
    //var height = typeHeight + topmargin + 10;
    var height = typeHeight;
		
	var y = d3.scale.ordinal()

    var x = d3.scale.linear()
  
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top")
		.ticks(1);

    var yAxis = d3.svg.axis()
        .scale(y)
		.orient("left")
		//.ticks(0);

	y.domain(typeForDomain)
		.rangeRoundBands([0, height], 0.08);	

	x.domain(d3.extent(typeForDomain, function (d) {    
		return types[d].made;
    }))
	.range([0, barwidth])

	/*
	y.domain(d3.extent(typeForDomain, function (d) {    
		return types[d].made;
    }))
	.range([0, height])
	*/
	
	var typeMadeSvg = TypeMadeDiv.append("svg")
					.attr("id", "typeMadeSvg")
					.attr("width", typesvgwidth)
					.attr("height", height + 100)

					
					
	var madebargroup =  typeMadeSvg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + (typeBarsStartx + misswidth + offset) + "," + topmargin + ")")
        .call(xAxis)
		.selectAll(".tick")
		.each(function (d, i) {this.remove();})
 		
	typeMadeSvg.append("text")
		.attr("id", " xAxis")
        .attr("y", 10)
        .attr("x", (typeBarsStartx + 2 * misswidth + 5 * offset)) //0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("miss shot");
		
	typeMadeSvg.append("text")
		.attr("id", " xAxis")
        .attr("y", 10)
        .attr("x", (typeBarsStartx +  2 * offset)) //0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("shot accuracy");

	typeMadeSvg.append("text")
		.attr("id", " xAxis")
        .attr("y", 10)
        .attr("x", (typeBarsStartx + misswidth + 3 * offset)) //0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("made shot");
		
	var madeyg = typeMadeSvg.append("g")
        .attr("class", "y axis")
		.attr("transform", "translate(" + (typeBarsStartx + misswidth + offset) + "," + topmargin + ")")
        .call(yAxis)

	 madeyg.selectAll(".tick")
		.each(function (d, i) {this.remove();});		
		
	var madeBarGroup = typeMadeSvg.append("g")
		madeBarGroup.selectAll("rect")
			.data(typeForDomain)
			.enter()
				.append("rect")
				.attr("height", y.rangeBand())
				.attr("width", function(d,i) {return x(types[d].made)})
				.attr("transform", function (d, i) {return "translate(" + (typeBarsStartx + misswidth + offset) +"," + (y(d) + topmargin) + ")"})
				.attr("fill", "green")
				.on("mouseover", function(){
					d3.select(this).attr("fill", "#feff4d");
					//typeIsselect(d , "made")
				})				
				.on("mouseout", function(){
					d3.select(this).attr("fill", "green");
				})
				.on("click", function(d){
					selectedType = d;
					typeIsselect(d , "made")})
		
		madeBarGroup.selectAll("text")
			.data(typeForDomain)
			.enter().append("text")
				.attr("transform", function (d, i) {return "translate(" + (1 + x(types[d].made) + typeBarsStartx + misswidth + offset) 
				+"," + (y(d) + topmargin + y.rangeBand() - 1) + ")"})
				.text(function(d){return types[d].made})
				
	
	x.domain(d3.extent(typeForDomain, function (d) {    
		return types[d].miss;
    }))
	.range([0, misswidth])
	
	/*
	var typeMissSvg = TypeMissDiv.append("svg")
					.attr("width", misswidth)
					.attr("height", height + 5)
				
	typeMissSvg
	*/
	typeMadeSvg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + (typeBarsStartx + 2 * misswidth + 2 * offset) + "," + topmargin + ")")
        .call(xAxis)
		.selectAll(".tick")
		.each(function (d, i) {this.remove();})
 		.append("text")
        .attr("y", topmargin)
        .attr("x", (typeBarsStartx + 2 * misswidth + 2 * offset)) //0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("made shot");

	
	var missyAxis = d3.svg.axis()
        .scale(y)
		.orient("left")
	
	var missg = typeMadeSvg.append("g")
        .attr("class", "y axis")
		.attr("transform", "translate(" + (typeBarsStartx + 2 * misswidth + 2 * offset)  + "," +topmargin + ")")
        .call(missyAxis)
		
     missg.selectAll(".tick")
		.each(function (d, i) {this.remove();});
		
		
		/*
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 2)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("type");
		*/
	var missBarGroup = typeMadeSvg.append("g")
		
	missBarGroup.selectAll("rect")
			.data(typeForDomain)
			.enter()
				.append("rect")
				.attr("height", y.rangeBand())
				.attr("width", function(d,i) {return x(types[d].miss)})
				.attr("transform", function (d, i) {return "translate(" + ((typeBarsStartx + 2 * misswidth + 2 * offset)) +"," + (y(d) + topmargin) + ")"})
				.attr("fill", "red")			
				.on("mouseover", function(){
					d3.select(this).attr("fill", "#feff4d");
					//typeIsselect(d , "missed");
				})				
				.on("mouseout", function(){
					d3.select(this).attr("fill", "red");
				})
				.on("click", function(d){
					selectedType = d;
					typeIsselect(d , "missed")})

	missBarGroup.selectAll("text")
			.data(typeForDomain)
			.enter().append("text")
				.attr("transform", function (d, i) {return "translate(" + (1 + x(types[d].miss) + typeBarsStartx + 2 * misswidth + 2 * offset) 
				+"," + (y(d) + topmargin + y.rangeBand() - 1) + ")"})
				.text(function(d){return types[d].miss})


				
	var xAccuracyScale = d3.scale.linear()
					.domain([0,1])
					.range([0, accuwidth])
	/*
	var typeAccuracySvg = TypeAccuracyDiv.append("svg")
					.attr("width", accuwidth)
					.attr("height", typeHeight)
				
	typeAccuracySvg
	*/

	var accuyAxis = d3.svg.axis()
        .scale(y)
		.orient("left")
		.ticks(2)

	var accuyg = typeMadeSvg.append("g")
        .attr("class", "y axis")
		.attr("transform", "translate(" + (typeBarsStartx)  + "," + topmargin + ")")
        .call(accuyAxis)
	
		
	var madexg = typeMadeSvg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + (typeBarsStartx ) + "," + topmargin + ")")
        .call(xAxis)
		.selectAll(".tick")
		.each(function (d, i) {this.remove();})
		

		
	var madeBarsGroup = typeMadeSvg.append("g")
		
	madeBarsGroup.selectAll("rect")
			.data(typeForDomain)
			.enter()
				.append("rect")
				.attr("height", y.rangeBand())
				.attr("width", function(d,i) {return xAccuracyScale(types[d].made / (types[d].made + types[d].miss));})
				.attr("transform", function (d, i) {return "translate(" + ((typeBarsStartx)) +"," + (y(d) + topmargin) + ")"})
				.attr("fill", "#6699ff")			
				.on("mouseover", function(d, i){

					d3.select(this).attr("fill", "#feff4d");
					//typeIsselect(d , "NULL");
				})				
				.on("mouseout", function(){
					d3.select(this).attr("fill", "#6699ff");
				})
				.on("click", 
					function(d){
					selectedType = d;
					typeIsselect(d , "NULL")})
		
		}

function typeIsselect(s , result)
{
	typeSelectSwitch = false;
	//selectedType = s;
	var t = types[s];

	//if(typeSelectSwitch == false) return;
	if(false) return;
	else{
		typeDimension.filterAll();
		distanceDimension.filterAll();
		resultDimension.filterAll();
		playerDimension.filterAll();
		resultfilter.filterAll();
		typefiler = typeDimension.filterFunction(function(d, i) { 
			if(d == "jump" 
				&& (selectedType == jump5
				|| selectedType == jump5to10
				|| selectedType == jump11to15
				|| selectedType == jump15to22
				|| selectedType == jump21to25
				|| selectedType == jumpover25))
			{
				return true;
			}																						
			else if(d == selectedType) return true;
			else if(selectedType == "NULL") return false;
			else
			{
				if(d == "jump" && t.distance != "") {

				}
				return false;
			}											
		})
		filtered = typeDimension.top(Infinity);
		
		switch(selectedType)
		{
			case jump5:
				filtered = distanceDimension.filter([0,5]).top(Infinity);
				break;
			case jump5to10:
				filtered = distanceDimension.filter([5,10]).top(Infinity);
				break;
			case jump11to15:
				filtered = distanceDimension.filter([11,15]).top(Infinity);
				break;
			case jump15to22:
				filtered = distanceDimension.filter([15,21]).top(Infinity);
				break;
			case jump21to25:
				filtered = distanceDimension.filter([22,25]).top(Infinity);
				break;
			case jumpover25:
				filtered = distanceDimension.filter([26,30]).top(Infinity);
				
				break;
			default:
				break;
		}
		
		
		selectedResult = result;
		if(result != "NULL")
		{
			filtered = resultfilter.filter(result).top(Infinity);
		}
		else{
			resultDimension.filterAll();
			filtered = resultfilter.filterAll().top(Infinity);
		}
		
		if(selectedPlayer != "NULL")
		{
			filtered = playerfilter.filter(selectedPlayer).top(Infinity);
		}
		else{
			
			filtered = playerfilter.filterAll().top(Infinity);
		}
		

		//drawBars(filtered);
		addShootingPoints(filtered);	
	}

}


function test()
{
	console.log("test");
}

function drawShootingType(d)
{
	dispatch.on("change.drawShootingType", function(d) {

			ShootingType(d);
	 });
}