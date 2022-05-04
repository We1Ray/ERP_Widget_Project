import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import io from "socket.io-client";

import Input from "../Input/Input";
import InfoBar from "../InfoBar/InfoBar";
import Message from "../Message/Message";
import Messages from "../Messages/Messages";
// import TextContainer from "../TextContainer/TextContainer";

import {
  CallApi,
  CENTER_FACTORY,
  None,
  SystemContext,
} from "../../../../resource/index";
import "./Chat.css";
import useMessagesSearch from "../hooks/useMessagesSearch";

let socket = null;

interface Props {
  room: room;
}
interface room {
  room_id: string;
  is_group: string;
}

interface messageProps {
  d: string;
  hm: string;
  isread: string;
  message_id: string;
  message_content: string;
  room_id: string;
  send_member: string;
  send_member_name: string;
}

interface user {
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

const Chat: React.FC<Props> = ({ room }) => {
  const ENDPOINT = "http://10.1.50.59:81";
  const { System } = useContext(SystemContext);
  const [user, setUser] = useState<user>(null);
  const [users, setUsers] = useState("");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<messageProps[]>([]);
  const [newMsg, setNewMsg] = useState(null);
  const [scrollTop, setScrollTop] = useState(null);
  const [scrollBottom, setScrollBottom] = useState(true);
  const [init, setInit] = useState(true);
  const scrollRef = useRef<any>(null);
  // const { messages, hasMore, loading, error } = useMessagesSearch(
  //   page,
  //   room.room_id
  // );

  /**
   * 取得使用者資訊
   */
  useEffect(() => {
    socket = io(ENDPOINT);
    CallApi.ExecuteApi(CENTER_FACTORY, ENDPOINT + "/chat/get_userInfo", {
      access_token: System.token,
    })
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data[0]);
          getMessages();
        }
      })
      .catch((error) => {
        console.log("EROOR: Chat: /chat/get_userInfo");
        console.log(error);
      });
  }, []);

  /**
   * 更新聊天室所有使用者資訊
   */
  useEffect(() => {
    if (user) {
      socket.emit(
        "join",
        { room: room.room_id, userInfo: user },
        (error: any) => {
          if (error) {
            alert(error);
          }
        }
      );
    }
  }, [ENDPOINT, JSON.stringify(user), JSON.stringify(room)]);

  /**
   * 設定初始置底、自己發訊息也置底
   */
  useEffect(() => {
    if (
      scrollRef.current.clientHeight < scrollRef.current.scrollHeight &&
      messages
    ) {
      if (
        messages[messages.length - 1].send_member === user.account_uid &&
        scrollBottom
      ) {
        scrollToBottom();
      } else if (init) {
        scrollToBottom();
        setInit(false);
      }
    }
  }, [JSON.stringify(messages), init, scrollBottom]);

  function scrollToBottom() {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }

  /**
   * 判斷聊天室scrollbar是否滑動和判斷scrollbar置底
   */
  useEffect(() => {
    const onScroll = (e: any) => {
      setScrollTop(e.target.scrollTop);

      if (e.target.scrollTop == 0) {
        setPage(page + 1);
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

  // const observer = useRef<any>();
  // const lastMessageElementRef = useCallback(
  //   (node) => {
  //     if (loading) return;
  //     if (observer.current) observer.current.disconnect();
  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && hasMore) {
  //         setPage((prevPageNumber) => prevPageNumber + 1);
  //       }
  //     });
  //     if (node) observer.current.observe(node);
  //     console.log(node);
  //   },
  //   [loading, hasMore]
  // );

  /**
   * 聊天室新訊息更新
   */
  useEffect(() => {
    if (user) {
      socket.on("message", ({ text, userInfo, socket_user }) => {
        if (
          user.account_uid === userInfo.account_uid &&
          socket.id === socket_user
        ) {
          getMessages();
        } else {
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

          if (scrollBottom) {
            getMessages();
          } else {
            setNewMsg(text);
          }
        }
      });
      socket.on("roomData", ({ users }) => {
        setUsers(users);
      });
    }
  }, [JSON.stringify(user), scrollBottom]);

  /**
   * 更新訊息已讀狀態
   */
  useEffect(() => {
    if (user) {
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
    }
  }, [JSON.stringify(users)]);

  /**
   * 往上滾抓取以前的訊息
   */
  useEffect(() => {
    let loading = false;
    const get_room_page_message = async () => {
      loading = true;
      CallApi.ExecuteApi(
        CENTER_FACTORY,
        ENDPOINT + "/chat/get_room_page_message",
        {
          room_id: room.room_id,
          page: page,
        }
      )
        .then((res) => {
          if (res.status === 200 && loading) {
            setMessages((prev) => [...res.data, ...prev]);
            loading = false;
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/get_room_page_message");
          console.log(error);
        });
    };
    if (user) {
      get_room_page_message();
    }
  }, [page]);

  async function getMessages() {
    let latest = true;
    await CallApi.ExecuteApi(
      CENTER_FACTORY,
      ENDPOINT + "/chat/get_room_message",
      {
        room_id: room.room_id,
        page: page,
      }
    )
      .then((res) => {
        if (res.status === 200 && latest) {
          setMessages(res.data);
        }
      })
      .catch((error) => {
        console.log("EROOR: Chat: /chat/get_room_message");
        console.log(error);
      });
    return () => {
      latest = false;
    };
  }

  const sendMessage = (event: { preventDefault: () => void }) => {
    event.preventDefault(); // full browser refreshes aren't good

    if (message) {
      CallApi.ExecuteApi(
        CENTER_FACTORY,
        ENDPOINT + "/chat/insert_room_message",
        {
          room_id: room.room_id,
          message_content: message,
          send_member: user.account_uid,
        }
      )
        .then((res) => {
          if (res.status === 200) {
            socket.emit(
              "sendMessage",
              { room: room.room_id, message: message, userInfo: user },
              () => {
                setMessage("");
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

  // i need another component that will display the users
  return (
    <div className="container">
      <InfoBar room={room.room_id} />
      <div className="messages" ref={scrollRef}>
        {user && socket ? (
          messages.map((message, i) => (
            <div
              key={i}
              // ref={i === 25 ? lastMessageElementRef : null}
            >
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
          <></>
        )}
      </div>
      <Input
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default Chat;
