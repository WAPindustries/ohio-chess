class Game{
	constructor({
		width,
		height,
		scale,
		grid = [],
		pieces = [],


		turn = "white",

		//moving pieces
		current_tile = null,
		move_tile = null,
		save_current_tile = null,
		save_move_tile = null,

		castle = {"white": null, "black": null}
	}){
		this.castle = castle
		this.width = width
		this.height = height
		this.scale = scale
		this.grid = grid
		this.pieces = pieces

		this.turn = turn
		this.current_tile = current_tile
		this.move_tile = move_tile
		this.save_current_tile = save_current_tile
		this.save_move_tile = save_move_tile
	}	

	reset_tiles(){
		//reset current and new tiles
		this.current_tile.style.opacity = 1
		this.current_tile = null
		this.move_tile.style.opacity = 1
		this.move_tile = null
	}

	define_grid(){	

		for (var i=0;i<this.width;i++){
			for (var j=0;j<this.height;j++){

				var tile_color
				if ((i%2==0 && j%2==0) || (i%2!=0 && j%2!=0)) tile_color = "white"
				else tile_color = "green"

				//create new tile div element
				var new_tile = document.createElement("canvas")
				new_tile.style.position = "absolute"
				new_tile.style.margin = "auto"

				//calculate offset
				var offset = {

					x: canvas.width/2-this.width*this.scale/2+2,
					y: canvas.height/2-this.height*this.scale/2+2

				}


				//matching canvas bit size and screen size
				new_tile.width = this.scale
				new_tile.height = this.scale
				new_tile.style.width = this.scale+"px"
				new_tile.style.height = this.scale+"px"

				//css styling
				new_tile.style.background = tile_color
				new_tile.style.left = j*this.scale+parseInt(canvas.style.left, 10)+offset.x
				new_tile.style.top = i*this.scale+parseInt(canvas.style.top, 10)+offset.y

				//on-the-fly properties
				new_tile.piece = null
				new_tile.pos = {x: j, y: i}


				//moving piece event
				new_tile.onclick = ()=>{
					this.move_piece(event.srcElement)
				}
				new_tile.onmouseover = ()=>{
					event.srcElement.style.opacity = 0.7
				}
				new_tile.onmouseout = ()=>{
					event.srcElement.style.opacity = 1
				}



				this.grid.push(new_tile)

			}
		}

		this.grid.forEach((tile)=>{
			document.body.appendChild(tile)
		})
	}

	define_pieces(){

		for (var side=0;side<2;side++){

			var color = side==0 ? "black":"white"

			//pawns
			var position = color=="white" ? {x: 0, y:this.height-2}:{x: 0, y: 1}
			var image = color=="white"? white_pawn:black_pawn
			for (var i=0;i<8;i++){
				this.pieces.push(
					new chessPiece({
						image: image,
						pos: {
							x: position.x+i,
							y: position.y
						},
						type: "pawn",
						color: color
					})
				)
			}

			//rooks
			var position = color=="white" ? {x: 0, y: this.height-1}:{x: 0, y:0}
			var image = color=="white" ? white_rook:black_rook
			for (var i=0;i<2;i++){
				this.pieces.push(
					new chessPiece({
						image: image,
						pos:{
							x: position.x+i*(this.width-1),
							y: position.y
						},
						type: "rook",
						color: color
					})
				)
			}


			//knights
			var position = color=="white" ? {x: 1, y: this.height-1}:{x: 1, y:0}
			var image = color=="white" ? white_knight:black_knight
			for (var i=0;i<2;i++){
				this.pieces.push(
					new chessPiece({
						image: image,
						pos:{
							x: position.x+i*(this.width-3),
							y: position.y
						},
						type: "knight",
						color: color
					})
				)
			}


			//bishops
			var position = color=="white" ? {x:2, y: this.height-1} : {x:2, y:0}
			var image = color=="white" ? white_bishop:black_bishop
			for (var i=0;i<2;i++){
				this.pieces.push(
					new chessPiece({
						image: image,
						pos:{
							x: position.x+i*(this.width-5),
							y: position.y
						},
						type: "bishop",
						color: color
					})
				)
			}


			//queen
			var position = color=="white" ? {x:3, y:this.height-1}:{x:3, y:0}
			var image = color=="white" ? white_queen:black_queen
			this.pieces.push(
				new chessPiece({
					image: image,
					pos:{
						x: position.x,
						y: position.y
					},
					type: "queen",
					color: color
				})
			)

			//king
			var position = color=="white" ? {x:4, y: this.height-1}:{x:4, y:0}
			var image = color=="white" ? white_king:black_king
			this.pieces.push(
				new chessPiece({
					image: image,
					pos:{
						x: position.x,
						y: position.y
					},
					type: "king",
					color: color
				})
			)

		}

	}

	set_pieces(){

		this.pieces.forEach((piece)=>{

			var pos = piece.pos.y*this.width+piece.pos.x

			this.grid[pos].piece = piece

			//this.pieces.splice(this.pieces.indexOf(piece), 1)

		})
	}

	render_board(){

		this.grid.forEach((tile)=>{

			//get context of current tile
			var context = tile.getContext('2d')
			context.clearRect(0,0,canvas.width, canvas.height)

			if (tile.piece!=null){
				if (tile.piece.image!=""){
				context.drawImage(
					tile.piece.image,
					0,0,
					this.scale, this.scale
				)
				}
			}
		})

	}



	//moving pieces
	move_piece(tile){

		if (this.current_tile==null){
			if (tile.piece==null) return
			if (tile.piece.color!=this.turn) return

			else this.current_tile = tile
		} 
		else if (this.current_tile!=null){

			this.move_tile = tile

			this.save_current_tile = Object.assign({}, this.current_tile)
			this.save_move_tile = Object.assign({}, this.move_tile)

			// change piece position
			if (this.validate_move() || this.validate_castle()){

				var valid_castle = this.validate_castle()

				this.move_tile.piece = this.current_tile.piece
				this.move_tile.piece.pos = this.move_tile.pos

				this.current_tile.piece.moves++
				this.current_tile.piece = null

				// illegal move - check own king, kings are adjacent
				if (check_checked(game.turn=="white" ? "black":"white") || check_king_dist()){

					this.current_tile.piece = this.save_current_tile.piece
					if (this.current_tile.piece!=null){
						this.current_tile.piece.pos = this.current_tile.pos
						this.current_tile.piece.moves--
					}

					this.move_tile.piece = this.save_move_tile.piece
					if (this.move_tile.piece!=null)this.move_tile.piece.pos = this.move_tile.pos

					this.save_current_tile = null, this.save_move_tile = null
					
					alert(`wut der helll thats illegal`)
					this.reset_tiles()

					return
				}


				//promote pawn
				if (this.move_tile.piece.type=="pawn"){	

					var pos_y = this.turn=="white" ? 0:game.width-1

					if (this.move_tile.pos.y==pos_y){
						this.move_tile.piece = new chessPiece({
								image: this.turn=="white" ? white_queen:black_queen,
								pos: Object.assign({}, this.move_tile.pos),
								type: "queen",
								color: this.turn
						})
					}

				}


				//castling
				if (valid_castle){					
					var rook_y = this.turn=="white" ? this.width-1:0
					var rook_x = this.castle[this.turn]=="left" ? 0:this.width-1 
					var rook_shift =  this.castle[this.turn]=="left" ? 3:-2

					var curr_rook_tile = rook_y*this.width+rook_x
					var new_rook_tile = rook_y*this.width+(rook_x+rook_shift)

					//shift rook
					game.grid[new_rook_tile].piece = game.grid[curr_rook_tile].piece
					game.grid[new_rook_tile].piece.pos = game.grid[new_rook_tile].pos
					game.grid[curr_rook_tile].piece = null

				}


				if (check_checked(this.turn)){
					if (search_checkmate((this.turn=="white" ? "black":"white"))) alert("CHECKMATE!")
					else alert(`${game.turn.toUpperCase()} CHECKS!`)
				}

				if (search_checkmate((this.turn=="white" ? "black":"white"))) {
					if (!check_checked(this.turn)) console.log("DRAW!")
				}

				this.turn =  this.turn=="white"? "black":"white"
			} 
			this.reset_tiles()
		}
	}


	//check if move is valid
	validate_move(){
		var valid = false

		switch (this.current_tile.piece.type){
			case "pawn":
				if (this.validate_pawn()) valid = true
			break;
			case "knight":
				if (this.validate_knight()) valid = true
			break;
			case "bishop":
				if (this.validate_bishop()) valid = true
			break;
			case "rook":
				if (this.validate_rook()) valid = true
			break;
			case "king":
				if (this.validate_king()) valid = true
			break;
			case "queen":
				if (this.validate_bishop() || this.validate_rook()) valid = true
			break;
		}

		//check if move_tile piece is same color
		if (this.move_tile.piece!=null){
			if (this.move_tile.piece.color==this.current_tile.piece.color) valid = false
		}

		return valid

	}


	//check pawn moves
	validate_pawn(){

		var step = 1
		if (this.current_tile.piece.color=="black") step = -1

		if (
			//pawn moves forward
			((this.current_tile.pos.y-this.move_tile.pos.y==1*step || this.current_tile.piece.moves==0 && this.current_tile.pos.y-this.move_tile.pos.y==2*step)

			&& this.current_tile.pos.x==this.move_tile.pos.x
			&& (this.move_tile.piece==null ||this.move_tile.piece.color!="black")) ||
			

			//pawn takes enemy piece
			(this.move_tile.piece!=null &&
			(this.current_tile.pos.y-this.move_tile.pos.y==1*step && Math.abs(this.current_tile.pos.x-this.move_tile.pos.x)==1
			&& this.move_tile.piece.color!=this.current_tile.piece.color))

		) return true

		return false

	}

	//check knight moves
	validate_knight(){

		if (
			(Math.abs(this.current_tile.pos.y-this.move_tile.pos.y)==2
			&& Math.abs(this.current_tile.pos.x-this.move_tile.pos.x)==1) ||

			(Math.abs(this.current_tile.pos.x-this.move_tile.pos.x)==2
			&& Math.abs(this.current_tile.pos.y-this.move_tile.pos.y)==1)

		) return true

		return false
	}

	//checking bishop moves
	validate_bishop(){

		if (Math.abs(this.current_tile.pos.y-this.move_tile.pos.y)!=Math.abs(this.current_tile.pos.x-this.move_tile.pos.x)) return false

		var x_step = 0
		var y_step = 0

		x_step = (this.move_tile.pos.x<this.current_tile.pos.x ? -1:1)
		y_step = (this.move_tile.pos.y<this.current_tile.pos.y ? -1:1)

		var tile_taken = false
		for (var i=0;i<Math.abs(this.current_tile.pos.y-this.move_tile.pos.y);i++){
			if (
				this.grid[(this.current_tile.pos.y+i*y_step)*this.width+(this.current_tile.pos.x+i*x_step)].piece!=null
				&& this.grid[(this.current_tile.pos.y+i*y_step)*this.width+(this.current_tile.pos.x+i*x_step)]!=this.current_tile
			){
				tile_taken = true
				break
			}
		}

		if (tile_taken) return false

		return true
	}



	validate_castle(){

		if (this.move_tile.pos.y!=this.current_tile.pos.y) return false

		var diff = this.move_tile.pos.x-this.current_tile.pos.x
		if (Math.abs(diff)==2) {

			// get rook position
			var rook_y = this.turn=="white" ? 0:this.width-1
			var rook_x = diff<0? 0:this.width-1 
			var rook_shift =  diff<0? 3:-2

			var rook_tile = rook_y*this.width+rook_x

			if (this.current_tile.piece.moves>0 || this.grid[rook_tile].piece.moves>0) return false

			// check for pieces between rook and king
			for (var i=1;i<Math.abs(rook_x-this.current_tile.pos.x);i++){
				var tile = this.current_tile.pos.y*this.width+(this.current_tile.pos.x+(i*(diff<0 ? -1:1)))
				if (this.grid[tile].piece!=null) return false
			}

			this.castle[this.turn] = diff<0 ? "left":"right"
			return true
		}

		return false
	}



	//check king moves
	validate_king(){
		if (
			Math.abs(this.current_tile.pos.y-this.move_tile.pos.y)<=1 && Math.abs(this.current_tile.pos.x-this.move_tile.pos.x)<=1 ) return true
		return false
	}


	//check rook moves
	validate_rook(){

		if (this.current_tile.pos.y!=this.move_tile.pos.y && this.current_tile.pos.x!=this.move_tile.pos.x) return false

		var start_dir = (this.current_tile.pos.y!=this.move_tile.pos.y ? this.current_tile.pos.y:this.current_tile.pos.x)
		var new_dir = (this.current_tile.pos.y!=this.move_tile.pos.y ? this.move_tile.pos.y:this.move_tile.pos.x)

		var x_step = 0
		var y_step = 0

		x_step = (this.current_tile.pos.x!=this.move_tile.pos.x ? (this.move_tile.pos.x<this.current_tile.pos.x ? -1:1):0)
		y_step = (this.current_tile.pos.y!=this.move_tile.pos.y ? (this.move_tile.pos.y<this.current_tile.pos.y ? -1:1):0)

		var tile_taken = false
		for (var i=0;i<Math.abs(new_dir-start_dir);i++){			
			if (
				this.grid[(this.current_tile.pos.y+y_step*i)*this.width+(this.current_tile.pos.x+x_step*i)].piece!=null
				&& this.grid[(this.current_tile.pos.y+y_step*i)*this.width+(this.current_tile.pos.x+x_step*i)]!=this.current_tile
			){
				tile_taken = true
				break
			}

		}

		if (tile_taken) return false

		return true

	}
}