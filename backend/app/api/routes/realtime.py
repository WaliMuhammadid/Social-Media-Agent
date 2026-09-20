from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict, Any
import asyncio
import json
import logging
import random
import time

logger = logging.getLogger(__name__)

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"New client connected to realtime stream. Total active: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"Client disconnected. Remaining active: {len(self.active_connections)}")

    async def broadcast(self, message: Dict[str, Any]):
        if not self.active_connections:
            return
        text = json.dumps(message)
        for connection in list(self.active_connections):
            try:
                await connection.send_text(text)
            except Exception as e:
                logger.warning(f"Failed to send to client: {e}")
                self.disconnect(connection)

manager = ConnectionManager()

@router.on_event("startup")
async def start_realtime_ticker():
    logger.info("Realtime WebSocket hub initialized.")

@router.websocket("/stream")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial connected handshake with active swarm status
        from .swarm import swarm_state
        uptime = int(time.time() - swarm_state.get("start_timestamp", time.time()))
        await websocket.send_text(json.dumps({
            "type": "connection_ack",
            "status": "connected",
            "message": "Connected to Social Swarm Realtime Hub",
            "uptimeSeconds": uptime,
            "isActive": swarm_state.get("is_active", True)
        }))

        while True:
            # Keep connection alive and listen for client pings or actions
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
                if payload.get("type") == "ping":
                    await websocket.send_text(json.dumps({"type": "pong"}))
            except Exception:
                pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.warning(f"WebSocket connection error: {e}")
        manager.disconnect(websocket)

