var w, h, cakeX, cakeY, ingredientNodes, graph;

const border = 150

d3.selection.prototype.moveToBack = function() {  
	return this.each(function() { 
		var firstChild = this.parentNode.firstChild; 
		if (firstChild) { 
			this.parentNode.insertBefore(this, firstChild); 
		} 
	});
};

d3.selection.prototype.moveToFront = function() {  
	return this.each(function(){
		this.parentNode.appendChild(this);
	});
};

function drawIngre(data)
{
	d3.selectAll("svg").remove()
	
	w = window.innerWidth
	h = window.innerHeight

	cakeX = w/2
	cakeY = h/2
	
	ingredientNodes = {}
	graph = {}
	
	var	radiansCake
	var rCake

	var ingreX
	var ingreY

	var ingreDim = 5
	var ingreDist = w/88

	var radCake = 0

	var count
	var i
	var ing
	var cool
	
	var svg = d3
		.selectAll("body")
		.append("svg")
		.attr("width", w)
		.attr("height", h)

	svg
		.append('image')
	    .attr('xlink:href', 'https://static.wixstatic.com/media/d7f3d4_dec975d469874505976cbd20c3da41ea.png')
	    .attr('width', 50)
	    .attr('height', 50)
	    .attr('x',cakeX -25)
	    .attr('y',cakeY -25)

	rCake = 60
	count = ~~(2 * Math.PI * rCake / ingreDist)
	ing = 0
	radiansCake = ( 2 * Math.PI ) / count
	cool = 0
	
	while (ing < data.length) {
		radCake = 0
		i = 0
		
		if (data.length-ing < count)
			radiansCake = ( 2 * Math.PI ) / (data.length - ing) 

		if (cool == 0){
			radCake += (radiansCake / 2)
			cool = 1
		}
			
		while(i < count && ing < data.length) {
			ingreX = cakeX + rCake * Math.cos( radCake )
			ingreY = cakeY + rCake * Math.sin( radCake )
			
			node = svg
				.append("circle")
			    .attr("class", "ingredient")
			    .attr("cx", ingreX)
			    .attr("cy", ingreY)
			    .attr("r", ingreDim)
				.attr('name', data[ing])
			
			ingredientNodes[data[ing]] = [ingreX, ingreY]
			graph[data[ing]] = {}
			graph[data[ing]].node = node
			graph[data[ing]].links = []
			
			node.on('mouseover', function() {
				for (l of graph[this.attributes.name.nodeValue].links)
				{
					l.attr('class', 'linkHover').moveToFront()
				}
			})
			
			node.on('mouseout', function() {
				for (l of graph[this.attributes.name.nodeValue].links)
				{
					l.attr('class', 'link').moveToBack()
				}
			})
			
			radCake += radiansCake
			ing ++
			i ++
		}
		
		rCake += h/85

		if (cool == 1){
			cool = 2
		}
		else if (cool == 2){
			cool = 0
		}
	}
}

function drawFood(data, len)
{		
	var	radiansCake
	var rCake

	var foodX
	var foodY

	var foodDim = 5

	var rad = 0

	var rCake = (w<h ? w : h)/2 - border

	var count = 0
	
	var svg = d3
		.selectAll("svg")

	deltaRad = ( 2 * Math.PI ) / len
	
	var lineGenerator = d3.line();
	
	for (c in data) 
	{
		for (f of data[c].values) 
		{
			var name = f.name
			
			if (name.length > 20) 
			{
				name = name.substring(0,20) + '...'
			}
			
			foodX = cakeX + rCake * Math.cos( rad )
			foodY = cakeY + rCake * Math.sin( rad )
			node = svg.append("text")
					.attr("y", foodY)
					.attr("x", foodX)
					.attr("text-anchor", foodX >= cakeX ? "start" : "end")
					.attr("transform", "rotate(" + (((foodX <= cakeX ? Math.PI : 0) + rad) * 180/Math.PI) + ',' + foodX + ',' + foodY + ")")
					.attr("font-size", "75%")
					.attr("class", "recipe")
					.text(name)
			
			graph[name] = {}		
			graph[name].fullName = f.name
			graph[name].node = node
			graph[name].ingredients = []
					
			for (ingredient of f.ingredients)
			{
				if (!(ingredient in ingredientNodes))
				{
					continue
				}
				
				link = svg.append('path')
					.datum([[foodX, foodY], ingredientNodes[ingredient]])
					.attr('d', lineGenerator)
					.attr('class', 'link')
					.moveToBack()
					
				graph[name].ingredients.push([graph[ingredient], link]) 
				graph[ingredient].links.push(link)
			}
			
			node.on('mouseover', function() {
				for (l of graph[this.textContent].ingredients)
				{
					l[1].attr('class', 'linkHover').moveToFront()
				}
			})
			
			node.on('mouseout', function() {
				for (l of graph[this.textContent].ingredients)
				{
					l[1].attr('class', 'link').moveToBack()
				}
			})

			rad += deltaRad
			count++
		}
	}
}

function groupByArea(data)
{
	return d3.nest()
		.key(function(d) {return d.area;})
		.entries(Object.values(data))
}
