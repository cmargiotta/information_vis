var w, h, cakeX, cakeY, ingredientNodes, graph;
var lineGenerator = d3.line().curve(d3.curveMonotoneX);

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
	d3.select("#graph").remove()
	
	w = window.innerWidth
	h = window.innerHeight

	cakeX = w/2
	cakeY = h/2
	
	ingredientNodes = {}
	graph = {}
	
	var rCake = 0

	var ingreX
	var ingreY

	var ingreDim = 8
	var ingreDist = (w<h ? w : h)/50

	var radCake = 0

	var i
	var ing = 0
	var cool = 0
	
	var count = ~~(2 * Math.PI * rCake / ingreDist)
	var radiansCake = ( 2 * Math.PI ) / count
	
	var svg = d3
		.selectAll("body")
		.append("svg")
		.attr("width", w)
		.attr("height", h)
		.attr("id", "graph")
	
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
				var node = graph[this.attributes.name.nodeValue].node
				for (l of graph[this.attributes.name.nodeValue].links)
				{
					l[1].attr('class', 'linkHover').moveToFront()
					l[0].node.attr('class', 'recipeHover').moveToFront()
				}
				
				node.attr('class', 'ingredientHover')
					.attr('r', ingreDim*4)
					
				node.moveToFront()
				
				var img = svg.append('image')
					.attr('href', 'https://www.themealdb.com/images/ingredients/' + this.attributes.name.nodeValue + '.png')
					.attr('y', node.attr('cy') - ingreDim*2)
					.attr('x', node.attr('cx') - ingreDim*2)
					.attr('width', ingreDim*4)
					.attr('height', ingreDim*4)
					.attr('id', 'delete')
					.style('pointer-events', 'none')
					.attr('name', this.attributes.name.nodeValue)
				
				node.append('title')
					.text(this.attributes.name.nodeValue)
			})
			
			node.on('mouseout', function() {
				d3.selectAll('#delete').remove()
				
				graph[this.attributes.name.nodeValue].node
					.attr('class', 'ingredient')
					.attr('r', ingreDim)
					
				for (l of graph[this.attributes.name.nodeValue].links)
				{
					l[1].attr('class', 'link').moveToBack()
					l[0].node.attr('class', 'recipe').moveToBack()
				}
			})
			
			node.on('click', function() {
				ingredientPopup(this.attributes.name.nodeValue)
			})
			
			radCake += radiansCake
			ing ++
			i ++
		}
		
		rCake += (w<h ? w : h)/45
		count = ~~(2 * Math.PI * rCake / ingreDist)
		radiansCake = ( 2 * Math.PI ) / count
		
		cool = (cool == 1) ? 2 : 0
	}
}

function drawSelectNationalityButtons(areas)
{
	var svg = d3
		.select("#graph")
	
	var rad = 0
	var freeAngle = 200
	var rCake = (w<h ? w : h)/1.5
	var deltaRad = ((360-freeAngle)*Math.PI/180)/areas.length
	
	for (area of areas)
	{
		x = cakeX + rCake * Math.cos( rad )
		y = cakeY + rCake * Math.sin( rad )
		
		svg.append('image')
			.attr('class', 'nationalityButton')
			.attr('nationality', area)
			.attr('href', "images/" + area + ".png")
			.attr('width', w/22)
			.attr('height', w/22)
			.attr('x', x - w/44)
			.attr('y', y - w/44)
			.on('click', function () {
				checked = false
				if (d3.select(this).attr('class') == 'nationalityButton')
				{
					d3.selectAll('.nationalityButtonPressed').attr('class', 'nationalityButton')
					d3.select(this).attr('class', 'nationalityButtonPressed')
					checked = true
				}
				else
					d3.select(this).attr('class', 'nationalityButton')

				selectNationality(d3.select(this).attr("nationality"),
									checked)
			})

		
		rad += deltaRad
		if (((rad*180/Math.PI >= (360 - freeAngle)/4) && (rad*180/Math.PI <= (360 - freeAngle)/4 + freeAngle/2)) || 
			((rad*180/Math.PI >= (360 - freeAngle/2 - (360-freeAngle)/4)) && (rad*180/Math.PI <= (360-freeAngle/2 - (360-freeAngle)/4) + freeAngle/2)))
			rad += freeAngle/2*Math.PI/180
	}
}

function selectNationality(nationality, checked)
{
	if (checked)
	{
		d3.selectAll(".recipe")
			.transition()
			.style('opacity', '0.1')
			.duration(1000)
				
		d3.selectAll("."+nationality)
			.transition()
			.style('opacity', '1')
			.duration(1000)
		  
		d3.selectAll('.nationalityButton')
			.transition()
			.style('opacity', '0.4')
			.duration(1000)
			
		d3.selectAll('.nationalityButtonPressed')
			.transition()
			.style('opacity', '1')
			.duration(1000)
		  
	} else
	{
		d3.selectAll(".recipe")
		  .transition()
		  .duration(1000)
		  .style('opacity', '1')
		  
		d3.selectAll('.nationalityButton')
			.transition()
			.style('opacity', '1')
			.duration(1000)
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
		.select("#graph")

	deltaRad = ( 2 * Math.PI ) / len
	
	for (c of data) 
	{
		for (f of c.values) 
		{
			var name = f.name
			
			if (name.length >= 23) 
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
				.attr("class", "recipe " + c.key)
				.attr("nationality", c.key)
				.attr("dominant-baseline", "middle")
				.text(name)

			graph[name] = {}		
			graph[name].fullName = f.name
			graph[name].node = node
			graph[name].ingredients = []
			graph[name].nationality = c.key
					
			for (ingredient of f.ingredients)
			{
				if (!(ingredient in ingredientNodes))
				{
					continue
				}
				
				link = svg.append('path')
					.datum([[foodX, foodY], ingredientNodes[ingredient]])
					.attr('d', lineGenerator)
					.attr('class', 'link ')
					.moveToBack()
					
				graph[name].ingredients.push([graph[ingredient], link]) 
				graph[ingredient].links.push([graph[name], link])
			}
			
			node.on('mouseover', function() {
				graph[this.textContent].node.attr('class', 'recipeHover')
				for (l of graph[this.textContent].ingredients)
				{
					l[1].attr('class', 'linkHover').moveToFront()
					l[0].node.attr('class', 'ingredientHover').moveToFront()
				}
			})
			
			node.on('mouseout', function() {
				graph[this.textContent].node.attr('class', 'recipe ' + 
					graph[this.textContent].node.attr('nationality'))
				for (l of graph[this.textContent].ingredients)
				{
					l[1].attr('class', 'link').moveToBack()
					l[0].node.attr('class', 'ingredient').moveToFront()
				}
			})
			
			node.on('click', function() {
				foodPopup(this.textContent)
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

function buildPopup(size)
{
	d3.selectAll('#popupdiv').remove()
	
	var popup = d3.select("body")
		.append('div')
			.attr('id', 'popupdiv')
	
	popup.append('span')
		.attr('class', 'helper')
	
	var body = popup.append('div')
		.style('width', (size*100) + '%')
		.style('height', (size*100) + '%')
	
	body.append('div')
		.attr('class', 'popupCloseButton')
		.html('&times;')
		.on('click', function() {
			d3.select('#popupdiv')
				.remove()
		})
	
	return body
		.append("svg")
		.attr('width', w * size)
	    .attr('height', h * size)
}

function foodPopup(food) 
{
	var svg = buildPopup(0.5)
	    
	var request = new XMLHttpRequest()
	request.open('GET', 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + graph[food].fullName, true)
	request.onload = function () {
		var imgw = (w > h ? w : h)/9
		var imgh = imgw
		var imgx = 0
		var imgy = h/4 - h/11
		var recipeImgW = h/(graph[food].ingredients.length + 15)
		
		var imgOk = false
		JSON.parse(this.response, (k, v) => {
			if (k == "strMealThumb") {
				imgOk = true
				svg.append('image')
					.attr('href', v)
					.attr('y', imgy)
					.attr('x', imgx)
					.attr('width', imgw)
					.attr('height', imgh)
			}
		})
		
		svg.append('image')
			.attr('href', 'images/' + graph[food].nationality + '.png')
			.attr('y', imgh/20)
			.attr('x', 0)
			.attr('width', imgw/1.8)
			.attr('height', imgh/1.8)
			.attr('transform', 'rotate(-5)')
		
		if (imgOk) 
		{
			var title = svg.append("text")
				.attr("y", imgh/(1.8*2))
				.attr("x", imgw/1.8 + 10)
				.attr("text-anchor", "start")
				.attr("font-size", "150%")
				.style('font-weight', 'bold')
				.attr("dominant-baseline", "middle")
				.text(graph[food].fullName)
				.moveToFront()
			
			if (title.node().getBBox().width > w/4)
				title.attr('font-size', (((w/2.8)/title.node().getBBox().width) * 100) + '%')
			
		} else 
		{
			var f = svg.append("text")
				.attr("y", h/4)
				.attr("x", 0)
				.attr("text-anchor", "start")
				.text(graph[food].fullName)
				.node().getBBox()
				
			imgy = f.y
			imgh = f.height
			imgw = f.width
		}
			
		var y = h/(2*graph[food].ingredients.length + 2)

		for (l of graph[food].ingredients)
		{
			var name = l[0].node.node().attributes.name.nodeValue
			var x = w/2.5 - recipeImgW*1.3
			var n = svg.append("text")
				.attr("y", y)
				.attr("x", x)
				.attr("text-anchor", "start")
				.text(name)
				.attr('name', name)
				.attr('class', 'clickable')
				
			var i = svg.append('image')
				.attr('href', 'https://www.themealdb.com/images/ingredients/' + name + '.png')
				.attr('y', y - recipeImgW/2)
				.attr('x', x + n.node().getBBox().width + 5)
				.attr('width', recipeImgW)
				.attr('height', recipeImgW)
				.attr('name', name)
				.attr('class', 'clickable')
				
			function onclick() {
				var name = this.attributes.name.nodeValue
				
				ingredientPopup(name)
			}
			
			n.on('click', onclick)
			i.on('click', onclick)
				
			link = svg.append('path')
				.datum([[imgw + 3, imgy + imgh/2], [x - 10, y - n.node().getBBox().height/4]])
				.attr('d', lineGenerator)
				.attr('class', 'linkPopup')
				
			y += h/(2*graph[food].ingredients.length + 2)
		}
	}
	request.send()
}

function ingredientPopup(ingredient) 
{
	var size = 0.75
	var svg = buildPopup(size)
	
	var divw = w*size
	var divh = h*size
	
	var imgw = (w > h ? w : h)/9
	var imgh = imgw
	var imgx = divw/2 - imgw/2
	var imgy = divh/2 - imgh/2
	
	var img = svg.append('image')
		.attr('href', 'https://www.themealdb.com/images/ingredients/' + ingredient + '.png')
		.attr('y', imgy)
		.attr('x', imgx)
		.attr('width', imgw)
		.attr('height', imgh)
		
	var lbl = svg.append("text")
		.attr("y", 20)
		.attr("x", imgx + imgw/4)
		.attr("text-anchor", "center")
		.attr("font-size", "150%")
		.style('font-weight', 'bold')
		.text(ingredient)		
		
	var dy =  2*divh/(graph[ingredient].links.length + 2)
	var y = dy

	for (i = 0; i < graph[ingredient].links.length; i++)
	{
		var l = graph[ingredient].links[i]
		var name = l[0].fullName
		var x
		
		if (i%2 == 0)
		{
			var x = divw
			var n = svg.append("text")
				.attr("y", y)
				.attr("x", x)
				.attr("text-anchor", "end")
				.attr('class', 'clickable')
				.text(name)
				.on('click', function() {
					var name = this.textContent

					if (name.length >= 23) 
						name = name.substring(0,20) + '...'
					
					foodPopup(name)
				})
				.node().getBBox()
				
			var points
			
			points = [[imgw/2 + imgx, imgy + imgh/2], [imgx + imgw, y], [x - n.width, y - n.height/4]]
			
			link = svg.append('path')
				.datum(points)
				.attr('d', lineGenerator)
				.attr('class', 'linkPopup')
		} else
		{
			var x = 0
			var n = svg.append("text")
				.attr("y", y)
				.attr("x", x)
				.attr("text-anchor", "start")
				.attr('class', 'clickable')
				.text(name)
				.on('click', function() {
					var name = this.textContent

					if (name.length >= 23) 
						name = name.substring(0,20) + '...'
					
					foodPopup(name)
				})
				.node().getBBox()
				
			var points
			
			if (y != imgy)
			{
				points = [[imgw/2 + imgx, imgy + imgh/2], [imgx, y], [x + n.width, y - n.height/4]]
			} else
			{
				points = [[imgw/2 + imgx, imgy + imgh/2], [x + n.width, y - n.height/4]]
			}
			
			link = svg.append('path')
				.datum(points)
				.attr('d', lineGenerator)
				.attr('class', 'linkPopup')
			
			y += dy
		}
	}
	
	img.moveToFront()
	lbl.moveToFront()
}
