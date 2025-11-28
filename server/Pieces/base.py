class ChessPiece:
    def __init__(self,code,colour):
        self.code = code # r,n,b,k,q,p
        self.colour = colour # b,w black or white
    
    def __repr__(self):
        return f"{self.code},{self.colour}"