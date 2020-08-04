var cakeX = 400
var cakeY = 400

function drawIngre(data)
{	
	var	radiansCake
	var rCake

	var ingreX
	var ingreY

	var ingreDim = 5
	var ingreDist = 20

	var radCake = 0

	var count
	var i
	var ing
	var cool
	
	var svg = d3
		.selectAll("body")
		.append("svg")
		.attr("width", window.innerWidth)
		.attr("height", window.innerWidth)

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
			
			svg
				.append("circle")
			    .attr("class", "ingredient")
			    .attr("cx", ingreX)
			    .attr("cy", ingreY)
			    .attr("r", ingreDim)

			radCake += radiansCake
			ing ++
			i ++
		}
		rCake += 30
		count = ~~(2 * Math.PI * rCake / ingreDist)
		radiansCake = ( 2 * Math.PI ) / count

		if (cool == 1){
				cool = 2
			}
		else if (cool == 2){
				cool = 0
			}
	}
}

function drawFood(data)
{	
	var d = Object.keys(data)
	var	radiansCake
	var rCake

	var foodX
	var foodY

	var foodDim = 5

	var radCake = 0

	var rCake = 400

	var count = 0
	
	var svg = d3
		.selectAll("svg")
		console.log(data)

	radiansCake = ( 2 * Math.PI ) / d.length
	
	while (count < d.length) {
		foodX = cakeX + rCake * Math.cos( radCake )
		foodY = cakeY + rCake * Math.sin( radCake )
		svg
			.append("circle")
		    .attr("class", "ingredient")
		    .attr("cx", foodX)
		    .attr("cy", foodY)
		    .attr("r", foodDim)

		radCake += radiansCake
		count++
	}
}