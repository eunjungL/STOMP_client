import {useEffect, useRef, useState} from "react";
import * as StompJs from "@stomp/stompjs";
import {Link} from "react-router-dom";

function ChatList() {
    const [chatList, setChatList] = useState([]);

    const client = useRef({});

    // 19361936 계정의 소켓 토큰
    const accessToken = '';

    const connect = () => {
        client.current = new StompJs.Client({
            // brokerURL: 'ws://34.64.137.61:8787/ws',
            brokerURL: `ws://localhost:8080/ws?roomId=0&accessToken=Bearer ${accessToken}`,
            onConnect: () => {
                console.log('success');
                subscribe();
            },
            onStompError: (frame) => {
                console.log('Broker reported error: ' + frame.headers['message']);
                console.log('Additional details: ' + frame.body);
            },
        });
        client.current.activate();
    };

    const subscribe = () => {
        console.log('/sub/list/');
        client.current.subscribe('/sub/list/1', (body) => {
            console.log(JSON.parse(body.body));
            const json_body = JSON.parse(body.body);
            setChatList((_chat_list) => [
                ..._chat_list,
                [
                    <div className={'chat-item'}>
                        <Link to={'/' + json_body.roomId} className={'chat-context'}>{json_body.lastChat}</Link>
                    </div>,
                ],
            ]);
        });

        console.log(chatList);
    };

    const disconnect = () => {
        client.current.deactivate();
    };

    useEffect(() => {
        connect();

        return () => disconnect();
    }, []);

    useEffect(() => {
        // fetchChat();
    }, []);

    return (
        <div className={'L-container'}>
            <div className={'L-description'}>
                <h3 className={'L-description-title'}>하나는 채팅방에, 하나는 채팅방 목록 페이지에서 채팅방에 메시지를 보내면 확인 가능</h3>
            </div>
            <div className={'chat-list'}>{chatList}</div>
        </div>
    );
}

export default ChatList;