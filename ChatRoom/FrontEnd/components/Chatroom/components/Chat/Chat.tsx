import React, { useState, useEffect, useContext, useRef } from "react";
import io from "socket.io-client";
// import ReactEmoji from "react-emoji";
import Input from "../Input/Input";
import InfoBar from "../InfoBar/InfoBar";
import Message from "../Message/Message";

import {
  CallApi,
  CENTER_FACTORY,
  None,
  SystemContext,
  SystemFunc,
} from "../../../../resource/index";
import "./Chat.css";

let socket = null;

interface ChatProps {
  room: roomProps;
  user: userProps;
}
interface roomProps {
  room_name: string;
  room_id: string;
  is_group: string;
  member: userProps[];
}

interface messageProps {
  d: string;
  hm: string;
  isread: string;
  message_id: string;
  message_content: string;
  message_seq?: number;
  room_id: string;
  send_member: string;
  send_member_name: string;
}

interface userProps {
  account: string;
  account_uid: string;
  email: string;
  name: string;
}

interface usersProps {
  id: string;
  info: userProps;
  room: roomProps;
}

interface userProps {
  account: string;
  account_uid: string;
  email: string;
  name: string;
}

const DateMessage = ({ date }) => (
  <p
    style={{
      color: "darkgray",
      width: "100%",
      letterSpacing: "0",
      float: "inherit",
      fontSize: "1.1em",
      wordWrap: "break-word",
      textAlign: "center",
    }}
  >
    {date}
  </p>
);

const Chat: React.FC<ChatProps> = ({ room, user }) => {
  const ENDPOINT = "http://10.1.50.59:81";
  const { System } = useContext(SystemContext);
  const [init, setInit] = useState(true); /** 是否初始化 */
  const [users, setUsers] = useState<usersProps[]>(
    []
  ); /** 目前聊天室內的人員 */
  const [page, setPage] = useState(0); /** 目前訊息的頁數 */
  const [pastScroll, setPastScroll] =
    useState(0); /** 延展scrollbar前 scrollbar的位置 */
  const [scrollPage, setScrollPage] = useState(false); /** 判斷延展scrollbar*/
  const [scrollTop, setScrollTop] =
    useState(null); /** 是否滑到scrollbar 頂部 */
  const [scrollBottom, setScrollBottom] =
    useState(true); /** 是否滑到srollbar底部 */
  const [messages, setMessages] = useState<messageProps[]>(
    []
  ); /** 目前抓取的所有訊息 */
  const [newMsg, setNewMsg] = useState<messageProps>(null); /** 新訊息 */
  const [notReadMsg, setNotReadMsg] =
    useState<messageProps>(null); /** 未讀訊息 */
  const [message, setMessage] = useState(""); /** 目前打字的訊息 */
  const [searchedMessage, setSearchedMessage] =
    useState<messageProps>(null); /** 目前查詢指定的訊息 */
  const scrollRef = useRef<any>(null);

  /**
   * 取得聊天紀錄
   */
  useEffect(() => {
    socket = io(ENDPOINT);

    CallApi.ExecuteApi(
      CENTER_FACTORY,
      ENDPOINT + "/chat/get_room_page_message",
      {
        room_id: room.room_id,
        page: page,
      }
    )
      .then((res) => {
        if (res.status === 200) {
          setMessages((prev) => [...res.data, ...prev]);
        }
      })
      .catch((error) => {
        console.log("EROOR: Chat: /chat/get_room_page_message");
        console.log(error);
      });
  }, []);

  /**
   *  進入聊天室
   */
  useEffect(() => {
    socket.emit("join", { room: room, userInfo: user }, (error: any) => {
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT, JSON.stringify(user), JSON.stringify(room)]);

  /**
   * 設定初始置底、自己發訊息也置底
   */
  useEffect(() => {
    if (scrollRef.current.clientHeight < scrollRef.current.scrollHeight) {
      if (newMsg) {
        if (newMsg.send_member === user.account_uid) {
          setNewMsg(null);
          scrollToBottom();
        }
      } else if (init) {
        setInit(false);
        scrollToBottom();
      }
    }

    if (newMsg) {
      if (newMsg.send_member !== user.account_uid) {
        if (scrollBottom) {
          setNewMsg(null);
          setNotReadMsg(null);
          scrollToBottom();
        } else {
          setNotReadMsg(newMsg);
        }
      }
    }

    if (page === 0) {
      scrollToBottom();
    }
  }, [init, JSON.stringify(messages), JSON.stringify(newMsg), scrollBottom]);

  /**
   * 設定訊息置底
   */
  function scrollToBottom() {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }

  /**
   * 增加Srollbar 長度 回復原scrollbar位置
   */
  useEffect(() => {
    if (!scrollBottom && scrollPage) {
      const currentScroll = scrollRef.current.scrollHeight - pastScroll;
      scrollRef.current.scrollTo(0, currentScroll);
      setScrollPage(false);
    }
  }, [JSON.stringify(messages), scrollPage]);

  /**
   * 判斷聊天室scrollbar是否滑動和判斷scrollbar置底
   */
  useEffect(() => {
    const onScroll = (e: any) => {
      setScrollTop(e.target.scrollTop);

      if (e.target.scrollTop == 0) {
        setPage((page) => page + 1);

        setPastScroll(e.target.scrollHeight);
      }

      if (
        e.target.scrollHeight - e.target.scrollTop ===
        e.target.offsetHeight
      ) {
        setScrollBottom(true);
      } else {
        setScrollBottom(false);
      }
    };
    scrollRef.current.addEventListener("scroll", onScroll);

    return () =>
      scrollRef.current
        ? scrollRef.current.removeEventListener("scroll", onScroll)
        : null;
  }, [scrollTop]);

  /**
   * 聊天室新訊息更新
   */
  useEffect(() => {
    socket.on("message", ({ sendMessage, userInfo, socket_user }) => {
      if (
        !(
          user.account_uid === userInfo.account_uid && socket.id === socket_user
        )
      ) {
        CallApi.ExecuteApi(
          CENTER_FACTORY,
          ENDPOINT + "/chat/update_message_read",
          {
            room_id: room.room_id,
            account_uid: user.account_uid,
          }
        )
          .then((res) => {
            if (res.status !== 200) {
              console.log(res);
            }
          })
          .catch((error) => {
            console.log("EROOR: Chat: /chat/update_message_read");
            console.log(error);
          });
        let today = new Date();
        let msg = {
          d:
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1 < 10
              ? "0" + (today.getMonth() + 1)
              : today.getMonth() + 1) +
            "-" +
            (today.getDate() < 10 ? "0" + today.getDate() : today.getDate()),
          hm:
            (today.getHours() < 10
              ? "0" + today.getHours()
              : today.getHours()) +
            ":" +
            (today.getMinutes() < 10
              ? "0" + today.getMinutes()
              : today.getMinutes()),
          isread: "0",
          message_id: sendMessage.message_id,
          message_content: sendMessage.message_content,
          room_id: room.room_id,
          send_member: userInfo.account_uid,
          send_member_name: userInfo.name,
        };
        setMessages((prev) => [...prev, ...[msg]]);
        setNewMsg(msg);
      }
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [JSON.stringify(user)]);

  /**
   * 更新訊息已讀狀態
   */
  useEffect(() => {
    CallApi.ExecuteApi(CENTER_FACTORY, ENDPOINT + "/chat/update_message_read", {
      room_id: room.room_id,
      account_uid: user.account_uid,
    })
      .then((res) => {
        if (res.status !== 200) {
          console.log(res);
        }
      })
      .catch((error) => {
        console.log("EROOR: Chat: /chat/update_message_read");
        console.log(error);
      });
  }, [JSON.stringify(users)]);

  /**
   * 往上滾抓取以前的訊息
   */
  useEffect(() => {
    const get_room_page_message = async () => {
      CallApi.ExecuteApi(
        CENTER_FACTORY,
        ENDPOINT + "/chat/get_room_page_message",
        {
          room_id: room.room_id,
          page: page,
        }
      )
        .then((res) => {
          if (res.status === 200) {
            setMessages((prev) => [...res.data, ...prev]);
            setScrollPage(true);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/get_room_page_message");
          console.log(error);
        });
    };
    if (page > 0) {
      get_room_page_message();
    } else {
      CallApi.ExecuteApi(
        CENTER_FACTORY,
        ENDPOINT + "/chat/get_room_page_message",
        {
          room_id: room.room_id,
          page: page,
        }
      )
        .then((res) => {
          if (res.status === 200) {
            setMessages(res.data);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/get_room_page_message");
          console.log(error);
        });
    }
  }, [page]);

  /**
   * 設定scrollbar到查詢指定的訊息的位置
   */
  useEffect(() => {
    if (searchedMessage) {
      CallApi.ExecuteApi(
        CENTER_FACTORY,
        ENDPOINT + "/chat/get_room_keyword_seq_message",
        {
          room_id: room.room_id,
          message_seq: searchedMessage.message_seq,
        }
      )
        .then((res) => {
          if (res.status === 200) {
            setMessages(res.data);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/get_room_keyword_seq_message");
          console.log(error);
        });
    } else {
      setPage(0);
    }
  }, [JSON.stringify(searchedMessage)]);

  /**
   * 發送訊息
   */
  const sendMessage = (event?: { preventDefault: () => void }) => {
    if (event.preventDefault) event.preventDefault();

    if (message) {
      let message_id = "Msg-" + SystemFunc.uuid();
      CallApi.ExecuteApi(
        CENTER_FACTORY,
        ENDPOINT + "/chat/insert_room_message",
        {
          room_id: room.room_id,
          message_id: message_id,
          message_content: message,
          send_member: user.account_uid,
        }
      )
        .then((res) => {
          if (res.status === 200) {
            let today = new Date();
            let send_msg = {
              d:
                today.getFullYear() +
                "-" +
                (today.getMonth() + 1 < 10
                  ? "0" + (today.getMonth() + 1)
                  : today.getMonth() + 1) +
                "-" +
                (today.getDate() < 10
                  ? "0" + today.getDate()
                  : today.getDate()),
              hm:
                (today.getHours() < 10
                  ? "0" + today.getHours()
                  : today.getHours()) +
                ":" +
                (today.getMinutes() < 10
                  ? "0" + today.getMinutes()
                  : today.getMinutes()),
              isread: "0",
              message_id: message_id,
              message_content: message,
              room_id: room.room_id,
              send_member: user.account_uid,
              send_member_name: user.name,
            };

            socket.emit(
              "sendMessage",
              { room: room, message: send_msg, userInfo: user },
              () => {
                setMessage("");
                setMessages((prev) => [...prev, ...[send_msg]]);
                setNewMsg(send_msg);
              }
            );
          } else {
            console.log(res);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/insert_room_message");
          console.log(error);
        });
    }
  };

  return (
    <div className="container">
      <InfoBar
        room={room}
        user={user}
        searchedMessage={(searchedMessage) => {
          setSearchedMessage(searchedMessage);
        }}
      />
      <div className="messages" ref={scrollRef}>
        {socket ? (
          messages.map((message, i) => (
            <div key={i}>
              {i == 0 ? (
                <DateMessage date={message.d} />
              ) : messages[i - 1].d !== message.d ? (
                <DateMessage date={message.d} />
              ) : (
                <None />
              )}
              <Message message={message} user={user} users={users} />
            </div>
          ))
        ) : (
          <None />
        )}
      </div>
      {notReadMsg ? (
        <div className="notReadMsg">
          {/* {ReactEmoji.emojify(
            notReadMsg.send_member_name + ": " + notReadMsg.message_content
          )} */}
          {notReadMsg.send_member_name + ": " + notReadMsg.message_content}
        </div>
      ) : (
        <None />
      )}
      <Input
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default Chat;
export type { messageProps, userProps, usersProps, roomProps };
