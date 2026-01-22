import json
import asyncio

def serialize_board(board):
    """
    Convert a chess board into a JSON-safe 2D list.
    """
    serial = []
    for row in board:
        serial_row = []
        for piece in row:
            if piece:
                serial_row.append(f"{piece.code}{piece.colour}")
            else:
                serial_row.append(None)
        serial.append(serial_row)
    return serial


async def broadcast(clients, message, exclude=None):
    """
    Broadcast a JSON message to all connected clients except `exclude`.
    """
    msg = json.dumps(message)
    targets = [c for c in clients if c != exclude]

    if targets:
        await asyncio.gather(*(c.send(msg) for c in targets))
