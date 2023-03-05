class chessPiece{

	constructor({
		image="",
		pos,
		color,
		type,
		moves=0
	})
	{
		this.image = image
		this.pos = pos
		this.color = color
		this.type = type
		this.moves = moves
	}

}

//assets

//pawns
var white_pawn = new Image()
white_pawn.src = "assets/white_pawn.png"

var black_pawn = new Image()
black_pawn.src = "assets/black_pawn.png"

//bishops
var white_bishop = new Image()
white_bishop.src = "assets/white_bishop.png"

var black_bishop = new Image()
black_bishop.src = "assets/black_bishop.png"


//knights
var white_knight = new Image()
white_knight.src = "assets/white_knight.png"

var black_knight = new Image()
black_knight.src = "assets/black_knight.png"


//rooks
var white_rook = new Image()
white_rook.src = "assets/white_rook.png"

var black_rook = new Image()
black_rook.src = "assets/black_rook.png"


//queens
var white_queen = new Image()
white_queen.src = "assets/white_queen.png"

var black_queen = new Image()
black_queen.src = "assets/black_queen.png"


//kings
var white_king = new Image()
white_king.src = "assets/white_king.png"

var black_king = new Image()
black_king.src = "assets/black_king.png"