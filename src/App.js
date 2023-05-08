import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as StompJs from '@stomp/stompjs';
import './App.css';

function App() {
  const [chatList, setChatList] = useState([]);
  const [chat, setChat] = useState('');

  const client = useRef({});

  // 발급받은 소켓용 토큰 채워넣기~
  const accessToken = '';

  const connect = () => {
    client.current = new StompJs.Client({
      // brokerURL: 'ws://34.64.137.61:8787/ws',
      brokerURL: `ws://localhost:8080/ws?accessToken=Bearer ${accessToken}`,
      onConnect: () => {
        console.log('success');
        subscribe();
      },
      onStompError: (frame) => {
        console.log('Broker reported error: ' + frame.headers['message']);
        console.log('Additional details: ' + frame.body);
      },
      // connectHeaders: {
      //   Authorization: window.localStorage.getItem('authorization'),
      // },
    });
    client.current.activate();
  };

  const publish = (chat) => {
    console.log('/pub/chat/');
    if (!client.current.connected) return;

    client.current.publish({
      destination: '/pub/chat',
      body: JSON.stringify({
        chat: chat,
      }),
    });

    setChat('');
  };

  const subscribe = () => {
    console.log('/sub/chat/');
    client.current.subscribe('/sub/chat/1', (body) => {
      console.log(JSON.parse(body.body));
      const json_body = JSON.parse(body.body);
      setChatList((_chat_list) => [
        ..._chat_list,
        [
          <div className={'chat-item'} key={json_body.chat + json_body.writerId}>
            <p className={'chat-writer'}>
              {json_body.name} {json_body.role}
            </p>
            <p className={'chat-context'}>{json_body.chat}</p>
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

  // const fetchChat = async () => {
  //   const res = await instance.get(`/chat/${apply_id}`);
  //   setChatList(
  //       res.data.map((data) => {
  //         return [
  //           <div className={'chat-item'} key={data.chat + data.staff.user.id}>
  //             <p className={'chat-writer'}>
  //               {data.staff.user.name} {data.staff.role}
  //             </p>
  //             <p className={'chat-context'}>{data.chat}</p>
  //           </div>,
  //         ];
  //       })
  //   );
  // };

  const handleChange = (event) => {
    setChat(event.target.value);
  };

  const handleSubmit = (event, chat) => {
    event.preventDefault();

    publish(chat);
  };

  return (
      <div className={'L-container'}>
        <div className={'L-description'}>
          <h3 className={'L-description-title'}>채점 의견</h3>
          <p className={'L-description-context'}>실시간으로 의견을 나눌 수 있습니다.</p>
        </div>
        <div className={'chat-list'}>{chatList}</div>
        <form className="L_form" onSubmit={(event) => handleSubmit(event, chat)}>
          <div>
            <input className={'L-input-text'} type={'text'} name={'chatInput'} onChange={handleChange} value={chat} />
          </div>
          <input className={'L-submit'} type={'submit'} value={'의견 보내기'} />
        </form>
      </div>
  );
}

export default App;
