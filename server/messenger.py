import time
import json
from utility.websocket import broadcast


class Messenger:
    def __init__(self, max_history=100, max_length=500): # 100 messages, 500 chars per message
        self.chat_history = []
        self.max_history = max_history
        self.max_length = max_length
    
    def validate_message(self, message):
        if not message or not isinstance(message, str):
            return False, "Message must be non empty"
        
        if len(message) > self.max_length:
            return False, "Message is too long"
        
        return True,None

    
    def add_message(self, role, message):
        timestamp = int(time.time())
        
        msg = {
            "sender": role,
            "message": message,
            "timestamp": timestamp
        }
        
        self.chat_history.append(msg)
        return msg

        
    
    async def handle_chat_message(self, websocket, sender_role, message, clients):
        
        print(f"[Message] processing message from: {sender_role}")
        print(f"[Message]message from: {message[:50]}")
        
        isvalid, error = self.validate_message(message)
        
        if not isvalid:
            print(f"[Message] Invalid message sent, Error {error}")
            await websocket.send(json.dumps({
                "type": "chat_error",
                "error": error
            }))
            return False
        
        message = self.add_message(sender_role, message)
        
        print(f"[MESSENGER] Broadcasting to {len(clients)} clients")
        await broadcast(
            clients,
            {
                "type": "chat_message",
                "sender": message["sender"],
                "message": message["message"],
                "timestamp": message["timestamp"]
            }
        )
    
    async def get_history(self, websocket):
        if not self.chat_history:
            print(f"[MESSENGER] No chat history for {websocket}")
            return "There is no chat history"
        else:
            await websocket.send(json.dumps({
                "type": "chat_history",
                "messages": self.chat_history
            }))
        
            return self.chat_history
    
    def clear_history(self):
        message_count = len(self.chat_history)
        self.chat_history = []
        print(f"[MESSENGER] Cleared {message_count} messages")
     