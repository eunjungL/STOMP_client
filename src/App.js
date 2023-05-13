import {Routes, Route, Link} from 'react-router-dom';
import './App.css';
import ChatRoom from "./ChatRoom";
import ChatList from "./ChatList";
import ChatRoomUser from "./ChatRoomUser";
import ChatListUser from "./ChatListUser";

function App() {
  return [
        <Routes>
          <Route path={'/room-1936'} element={<ChatRoom />} />
            <Route path={'/room-user'} element={<ChatRoomUser />} />
            <Route path={'/list-1936'} element={<ChatList />} />
            <Route path={'/list-user'} element={<ChatListUser />} />
        </Routes>,
      <div>
          <Link to={"/room-1936"}>1번 계정(19361936)의 채팅방</Link><br/>
          <Link to={"/list-1936"}>1번 계정(19361936)의 채팅방 목록</Link><br/>
          <hr/>
          <Link to={"/room-user"}>본인 계정의 채팅방</Link><br/>
          <Link to={"/list-user"}>본인 계정의 채팅방 목록</Link><br/>
      </div>
  ];
}

export default App;
