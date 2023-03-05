// searching for checkmate

function doMove(curr_pos, new_pos){

	var curr_tile = curr_pos.y*game.width+curr_pos.x
	var new_tile = new_pos.y*game.width+new_pos.x

	//save game tiles
	game.save_current_tile = Object.assign({}, game.grid[curr_tile])
	game.save_move_tile = Object.assign({}, game.grid[new_tile])

	//simulate move
	game.grid[new_tile].piece = game.grid[curr_tile].piece
	game.grid[new_tile].piece.pos = game.grid[new_tile].pos
	game.grid[curr_tile].piece = null

}

function undoMove(curr_pos, new_pos){

	var curr_tile = curr_pos.y*game.width+curr_pos.x
	var new_tile = new_pos.y*game.width+new_pos.x

	// undo move
	game.grid[curr_tile].piece = game.save_current_tile.piece
	if (game.grid[curr_tile].piece!=null) game.grid[curr_tile].piece.pos = game.grid[curr_tile].pos
	game.grid[new_tile].piece = game.save_move_tile.piece
	if (game.grid[new_tile].piece!=null) game.grid[new_tile].piece.pos = game.grid[new_tile].pos

	game.save_current_tile = null
	game.save_move_tile = null

}


function search_checkmate(color){
	for (var tile in game.grid){
		if (game.grid[tile].piece!=null){
			if (game.grid[tile].piece.color==color){
				if (!testMoves(game.grid[tile].piece)) return false
			}
		}
	}
	return true
}


//test all legal moves to see if any prevents checkmate
function testMoves(piece){

	var moves = genMoves(piece)

	for (var move in moves){

		var tile = game.grid[moves[move]]

		var save_piece_pos = Object.assign({}, piece.pos)

		doMove(piece.pos, tile.pos)

		if (!check_checked((piece.color=="white"? "black": "white")) && !check_king_dist()){
			undoMove(save_piece_pos, tile.pos)
			return false
		}
		undoMove(save_piece_pos, tile.pos)
	}
	return true
}



//generate all legal moves for piece
function genMoves(piece){

	var gen_funcs = [
		{"piece": "pawn", "func": gen_pawn_moves},
		{"piece": "knight", "func": gen_knight_moves},
		{"piece": "bishop", "func": gen_bishop_moves},
		{"piece": "rook", "func": gen_rook_moves},
		{"piece": "queen", "func": gen_queen_moves},
		{"piece": "king", "func": gen_king_moves},
	]

	for (var func in gen_funcs){
		if (gen_funcs[func]["piece"]==piece.type){
			return gen_funcs[func]["func"](piece)
		}
	}
}


//generating legal pawn moves
function gen_pawn_moves(piece){

	var step = (piece.color=="white" ? -1:1)

	var moves = []

	for (var i=-1;i<2;i++){

		//invalid pos
		if (piece.pos.y+step<0 || piece.pos.y+step>game.width-1) continue
		if (piece.pos.x+i<0 || piece.pos.x+i>game.width-1) continue

		var tile = (piece.pos.y+step)*game.width+(piece.pos.x+i)

		if (Math.abs(i)==1){
			if (game.grid[tile].piece!=null){
				if (game.grid[tile].piece.color!=piece.color) moves.push(tile)
			}
		}
		
		else
			if (game.grid[tile].piece==null) moves.push(tile)
	}

	return moves
}


// generating legal knight moves
function gen_knight_moves(piece){
	var pos = piece.pos

	var moves = []

	for (var i=0;i<4;i++){

		var x_step = (i==0 || i==1 ? 1:2)
		var y_step = (i==0 || i==1 ? 2:1)

		for (var j=-1;j<2;j+=2){

			var new_x = pos.x+ ((x_step*j* +(x_step==2))+ (i%2==0? -1:1)*(j* +(x_step==1)))
			var new_y = pos.y+((y_step*j* +(y_step==2))+(i%2==0? -1:1)*(j* +(y_step==1)))

			if (new_x<0 || new_x>game.width-1) continue
			if (new_y<0 || new_y>game.width-1) continue

			var tile = (pos.y+((y_step*j* +(y_step==2))+(i%2==0? -1:1)*(j* +(y_step==1))))*game.width+
			(pos.x+ ((x_step*j* +(x_step==2))+ (i%2==0? -1:1)*(j* +(x_step==1))))
			
			if (tile>game.grid.length-1 || tile<0) break

			if (game.grid[tile].piece==null || game.grid[tile].piece.color!=piece.color) moves.push(tile)
		}
	}

	return moves
}


//generating legal rook moves
function gen_rook_moves(piece){

	var pos = piece.pos

	var moves = []

	for (var i=0;i<4;i++){

		var x_step = ( +(i<2)) *(i==1 ? -1:1)
		var y_step = ( +(i>1)) *(i==3 ? -1:1)

		for (var j=1; ;j++){

			if (pos.x+j*x_step<0 || pos.x+j*x_step>game.width-1) break
			if (pos.y+j*y_step<0 || pos.y+j*y_step>game.width-1) break

			var tile = (pos.y+j*y_step)*game.width+(pos.x+j*x_step)

			if (tile<0 || tile>game.grid.length-1) break

			if (game.grid[tile].piece!=null){
				if (game.grid[tile].piece.color==piece.color) break
			}

			if (game.grid[tile].piece==null || game.grid[tile].piece.color!=piece.color){
				moves.push(tile)
				if (game.grid[tile].piece!=null && game.grid[tile].piece.color!=piece.color) break
			}

		}
	}

	return moves
}


//generate legal bishop moves
function gen_bishop_moves(piece){

	var pos = piece.pos

	var moves = []

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

			if (game.grid[tile].piece!=null){
				if (game.grid[tile].piece.color==piece.color) break
			}

			if (game.grid[tile].piece==null || game.grid[tile].piece.color!=piece.color){
				moves.push(tile)
				if (game.grid[tile].piece!=null && game.grid[tile].piece.color!=piece.color) break
			}
		}
	}

	return moves
}



//generate legal king moves (not considering checkmate)
function gen_king_moves(piece){

	var moves = []

	var pos = piece.pos

	var steps = [
		[-1, -1],
		[0, -1],
		[1, -1],
		[1, 0],
		[1, 1],
		[0, 1],
		[-1, 1],
		[-1, 0],
	]

	for (var step in steps){

		if (piece.pos.y+steps[step][1]<0 || piece.pos.y+steps[step][1]>game.width-1) continue
		if (piece.pos.x+steps[step][0]<0 || piece.pos.x+steps[step][0]>game.width-1) continue

		var tile = (piece.pos.y+steps[step][1])*game.width+(piece.pos.x+steps[step][0])

		if (game.grid[tile].piece==null || game.grid[tile].piece.color!=piece.color) moves.push(tile)
	}

	return moves
}


//generate legal queen moves
function gen_queen_moves(piece){
	var moves = []

	var bishop_moves = gen_bishop_moves(piece)
	var rook_moves = gen_rook_moves(piece)

	moves.push(...bishop_moves, ...rook_moves)

	return moves
}