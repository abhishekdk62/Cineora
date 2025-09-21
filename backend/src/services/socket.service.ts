import { Server as SocketIOServer } from 'socket.io';

export class SocketService {
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
    
    this.io.on('connection', (socket) => {
      console.log('🔗 New client connected:', socket.id);
      
      // Existing seat booking events
      socket.on('join-showtime', (showtimeId) => {
        socket.join(showtimeId);
        console.log(`✅ Client ${socket.id} joined room: ${showtimeId}`);
        console.log(`👥 Room ${showtimeId} now has ${this.io.sockets.adapter.rooms.get(showtimeId)?.size || 0} clients`);
      });
      
      socket.on('leave-showtime', (showtimeId) => {
        socket.leave(showtimeId);
        console.log(`👋 Client ${socket.id} left room: ${showtimeId}`);
      });

 
      
      socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
      });
    });
  }

  
  emitSeatUpdate(showtimeId: string, bookedSeats: string[]): void {
    console.log('🚀 Emitting seat update to room:', showtimeId);
    console.log('📊 Clients in room:', this.io.sockets.adapter.rooms.get(showtimeId)?.size || 0);
    console.log('💺 Booked seats:', bookedSeats);
    
    this.io.to(showtimeId).emit('seat-update', {
      showtimeId,
      bookedSeats,
      action: 'booked'
    });
  }

  emitSeatCancellation(showtimeId: string, cancelledSeats: string[]): void {
    console.log('🚀 Emitting seat cancellation to room:', showtimeId);
    console.log('📊 Clients in room:', this.io.sockets.adapter.rooms.get(showtimeId)?.size || 0);
    console.log('💺 Cancelled seats:', cancelledSeats);
    
    this.io.to(showtimeId).emit('seat-update', {
      showtimeId,
      cancelledSeats,
      action: 'cancelled'
    });
  }


  emitParticipantJoined(inviteId: string, participantData: any): void {
    
    this.io.emit('participant_joined', {
      inviteId,
      availableSlots: participantData.availableSlots,
      totalJoined: participantData.totalJoined || 0
    });
    
  }

emitParticipantLeft(inviteId: string, participantData: any): void {
  console.log(`🔊 [SOCKET] emitParticipantLeft called for ${inviteId}:`, participantData);
  
  // ✅ USE EXACT SAME STRUCTURE AS participant_joined
  const eventData = {
    inviteId: participantData.inviteId,
    availableSlots: participantData.availableSlots,
    leftUserId: participantData.leftUserId,
    releasedSeat: participantData.releasedSeat,
    releasedSeatPrice: participantData.releasedSeatPrice,
  };
  
  console.log(`📡 [SOCKET] Broadcasting participant_left event:`, eventData);
  
  this.io.emit('participant_left', eventData);
  
  console.log(`✅ [SOCKET] participant_left event broadcasted`);
}




  emitGroupCompleted(inviteId: string, completionData: any): void {
    
    this.io.emit('group_completed', {
      inviteId,
      status: 'completed'
    });
    
  }

  emitInviteCancelled(inviteId: string): void {
    
    this.io.emit('invite_cancelled', {
      inviteId
    });
    
  }


  emitSeatHold(showtimeId: string, heldSeats: string[], inviteId?: string): void {
    console.log('🚀 Emitting seat hold to room:', showtimeId);
    
    this.io.to(showtimeId).emit('seat-update', {
      showtimeId,
      heldSeats,
      action: 'held',
      inviteId: inviteId || null
    });
  }

  emitSeatRelease(showtimeId: string, releasedSeats: string[], inviteId?: string): void {
    console.log('🚀 Emitting seat release to room:', showtimeId);
    
    this.io.to(showtimeId).emit('seat-update', {
      showtimeId,
      releasedSeats,
      action: 'released',
      inviteId: inviteId || null
    });
  }

  //!chat soket funcs


// Add these new emit methods to your existing SocketService class

emitNewMessage(chatRoomId: string, messageData: any): void {
  console.log('🚀 Broadcasting new message to chat room:', chatRoomId);
  console.log('📊 Clients in chat room:', this.io.sockets.adapter.rooms.get(`chat-${chatRoomId}`)?.size || 0);
  
  this.io.to(`chat-${chatRoomId}`).emit('new-message', messageData);
}

emitMessageEdit(chatRoomId: string, messageData: any): void {
  console.log('🚀 Broadcasting message edit to chat room:', chatRoomId);
  
  this.io.to(`chat-${chatRoomId}`).emit('message-edited', {
    messageId: messageData.messageId,
    content: messageData.content,
    chatRoomId
  });
}

emitMessageDelete(chatRoomId: string, messageId: string): void {
  console.log('🚀 Broadcasting message delete to chat room:', chatRoomId);
  
  this.io.to(`chat-${chatRoomId}`).emit('message-deleted', {
    messageId,
    chatRoomId
  });
}

emitUserJoinedChat(chatRoomId: string, userData: any): void {
  console.log('🚀 Broadcasting user joined chat:', chatRoomId);
  
  this.io.to(`chat-${chatRoomId}`).emit('user-joined-chat', userData);
}

emitUserLeftChat(chatRoomId: string, userData: any): void {
  console.log('🚀 Broadcasting user left chat:', chatRoomId);
  
  this.io.to(`chat-${chatRoomId}`).emit('user-left-chat', userData);
}


}
