import React, { useEffect, useState } from 'react'
import './Chat.css'
import ScrollToBottom from 'react-scroll-to-bottom'

function Chat({socket, room, username}) {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [currentmessage, setCurrentmessage] = useState('')
    const [messageList, setMessageList] = useState([])

    useEffect(() => {
        socket.emit("join_room", room);
    }, [room, socket]);

    const sendmessage = async () => {
        if (!socket.connected) {
            console.error("Socket not connected");
            return;
        }
        if(currentmessage !== '') {
            const messageData = {
                room: room,
                author: username,
                message: currentmessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            }
            try {
                await socket.emit("send_message", messageData);
                // Remove this line since we'll get the message back from the server
                // setMessageList((list) => [...list, messageData]);
                setCurrentmessage('');
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    }

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, [socket]);

    useEffect(() => {
        const messageHandler = (data) => {
            setMessageList((list) => [...list, data]);
        };

        socket.on("receive_message", messageHandler);
    
        return () => {
            socket.off("receive_message", messageHandler);
        };
    }, [socket]);

    return (
        <>
            <div className='chat-container'>
                <div className='chat-header'>
                    <p>Live Chat {isConnected ? '(Connected)' : '(Disconnected)'}</p>
                </div>
                <div className='chat-body'>
                    <ScrollToBottom className='chat-body'>
                    {messageList.map((messageContent, index) => (
                      
                        <div key={index} className='message-content' id={username===messageContent.author?"you":"other"}>
                            <div className='message-info'>
                            <p>{messageContent.message}</p>
                                <span>{messageContent.time} {messageContent.author}</span>
                            </div>
                        </div>
                    ))}
                    </ScrollToBottom>
                </div>
                <div className='chat-footer'>
                    <input 
                        type='text' 
                        value={currentmessage}
                        placeholder='Hey...' 
                        onChange={(e) => setCurrentmessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendmessage()}
                    />
                    <button 
                        className='send-message-btn' 
                        onClick={sendmessage}
                    >
                        &#9658;
                    </button>
                </div>
            </div>
        </>
    )
}

export default Chat