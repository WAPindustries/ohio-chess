function check_king_dist(){

	var white_king = null, black_king = null

	for (var i=0;i<game.pieces.length;i++){
		if (game.pieces[i].type=="king"){
			if (game.pieces[i].color=="white") white_king = Object.assign({}, game.pieces[i].pos)
			else black_king = Object.assign({}, game.pieces[i].pos)
		}
	}
	
	//check if kings are adjacent
	if (
		Math.abs(white_king.x-black_king.x)<=1 &&
		Math.abs(white_king.y-black_king.y)<=1
	) return true

	return false
}



function check_checked(color){

	for (var i=0;i<game.grid.length;i++){
		var tile = game.grid[i]

		if (tile.piece!=null){
			if (tile.piece.color==color){
				if (search_check(tile.piece)) return true
			}
		}
	}
	return false
}

function search_check(piece){

	var search_func = [
		{"piece": "pawn", "func": search_pawn},
		{"piece": "bishop" , "func": search_bishop},
		{"piece": "knight", "func": search_knight},
		{"piece": "rook", "func": search_rook},
		{"piece": "queen", "func": null}
	]

	for (var func in search_func){
		if (piece.type==search_func[func]["piece"]){
			if (piece.type=="queen") return (search_rook(piece) || search_bishop(piece)  ? true:false)
			else return search_func[func]["func"](piece)
		}
	}
}

function search_pawn(piece){

	var pos = piece.pos

	var dir = (piece.color=="white" ? -1:1)

	for (var i=-1;i<2;i+=2){

		if (piece.pos.y+dir<0 || piece.pos.y+dir>game.width-1) continue
		else if (piece.pos.x+i<0 || piece.pos.x+i>game.width-1) continue

		var tile = (piece.pos.y+dir)*game.width+(piece.pos.x+i)

		 mark_tile(game.grid[tile])

		if (game.grid[tile].piece!=null){
			if (game.grid[tile].piece.type=="king" && game.grid[tile].piece.color!=game.grid[pos.y*game.width+pos.x].piece.color) return true
		}
	}
	return false
}

function search_bishop(piece){

	var pos = piece.pos

	var step = {x: 0, y:0, end: 0}

	for (var i=0;i<4;i++){
		//change step values
		switch (i){
			case 0:
				step = {x: -1, y: -1, end: 0}
			break;
			case 1:
				step = {x: -1, y: 1, end: 0}
			break;
			case 2:
				step = {x: 1, y: -1, end: game.width-1}
			break;
			case 3:
				step = {x: 1, y: 1, end: game.width-1}
			break;
		}

		for (var j=1; ;j++){

			if (pos.y+step.y*j<0 || pos.y+step.y*j>game.width-1) break
			if (pos.x+step.x*j<0 || pos.x+step.x*j>game.width-1) break

			var curr_tile = pos.y*game.width+pos.x
			var tile = (pos.y+step.y*j)*game.width+(pos.x+step.x*j)
			
			if (tile>game.grid.length-1 || tile<0) break

			 	mark_tile(game.grid[tile])

			if (game.grid[tile].piece!=null) {
				if (game.grid[tile].piece.type=="king" && game.grid[tile].piece.color!=game.grid[curr_tile].piece.color) return true
				break
			}
		}
	}
	
	return false
}



function search_knight(piece){

	var pos = piece.pos

	for (var i=0;i<4;i++){

		var x_step = (i==0 || i==1 ? 1:2)
		var y_step = (i==0 || i==1 ? 2:1)

		for (var j=-1;j<2;j+=2){

			var new_x = pos.x+ ((x_step*j* +(x_step==2))+ (i%2==0? -1:1)*(j* +(x_step==1)))
			var new_y = pos.y+((y_step*j* +(y_step==2))+(i%2==0? -1:1)*(j* +(y_step==1)))

			if (new_x<0 || new_x>game.width-1) break
			if (new_y<0 || new_y>game.width-1) break

			var tile = (pos.y+((y_step*j* +(y_step==2))+(i%2==0? -1:1)*(j* +(y_step==1))))*game.width+
			(pos.x+ ((x_step*j* +(x_step==2))+ (i%2==0? -1:1)*(j* +(x_step==1))))
			
			if (tile>game.grid.length-1 || tile<0) break

			 mark_tile(game.grid[tile])

			if (game.grid[tile].piece!=null) {
				if (game.grid[tile].piece.type=="king" && game.grid[tile].piece.color!=game.grid[pos.y*game.width+pos.x].piece.color) return true
				break
			}

		}
	}

	return false
}



function search_rook(piece){

	var pos = piece.pos
	for (var i=0;i<4;i++){

		var x_step = ( +(i<2)) *(i==1 ? -1:1)
		var y_step = ( +(i>1)) *(i==3 ? -1:1)

		for (var j=1; ;j++){

			if (pos.x+j*x_step<0 || pos.x+j*x_step>game.width-1) break
			if (pos.y+j*y_step<0 || pos.y+j*y_step>game.width-1) break

			var tile = (pos.y+j*y_step)*game.width+(pos.x+j*x_step)

			if (tile<0 || tile>game.grid.length-1) break

			 mark_tile(game.grid[tile])
			
			if (game.grid[tile].piece!=null){
				if (game.grid[tile].piece.type=="king" && game.grid[tile].piece.color!=piece.color) return true
				break
			}
		}
	}

	return false
}



 function mark_tile(tile){

	tile.style.background = "red"

}

mark_tile = ()=>{}