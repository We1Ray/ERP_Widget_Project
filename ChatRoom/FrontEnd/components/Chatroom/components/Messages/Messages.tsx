import { Button } from "@material-ui/core";
import { Socket } from "net";
import React, { useEffect, useRef, useState } from "react";
import { None } from "../../../../resource";
import Message from "../Message/Message";

import "./Messages.css";

interface MessagesProps {
  messages: messagesProps;
  user: user;
  scrollGetMessage?: () => void;
  onBottom?: (onBottom: boolean) => void;
  newMsg?: messageProps;
  users: any;
}

interface messagesProps {
  data: messageProps[];
  isUserMessage: boolean;
}

interface messageProps {
  create_date: string;
  d: string;
  hm: string;
  is_group: string;
  isread: string;
  message_id: string;
  message_content: string;
  read_member: string;
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

const Messages: React.FC<MessagesProps> = ({
  messages,
  user,
  scrollGetMessage,
  onBottom,
  newMsg,
  users,
}) => {
  const [scrollTop, setScrollTop] = useState(null);
  const [scrollBottom, setScrollBottom] = useState(true);
  const [init, setInit] = useState(true);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    if (
      scrollRef.current.clientHeight < scrollRef.current.scrollHeight &&
      messages
    ) {
      if (
        messages.data[messages.data.length - 1].send_member ===
          user.account_uid &&
        (messages.isUserMessage || scrollBottom)
      ) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      } else if (init) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        setInit(false);
      }
    }
  }, [JSON.stringify(messages), init, scrollBottom]);

  useEffect(() => {
    onBottom(scrollBottom);
  }, [scrollBottom]);

  useEffect(() => {
    const onScroll = (e: any) => {
      setScrollTop(e.target.scrollTop);

      if (e.target.scrollTop == 0 && scrollGetMessage) {
        scrollGetMessage();
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

  return (
    <>
      <div className="messages" ref={scrollRef}>
        {user ? (
          messages.data.map((message, i) => (
            <div key={i}>
              {i == 0 ? (
                <DateMessage date={message.d} />
              ) : messages.data[i - 1].d !== message.d ? (
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
      {!scrollBottom && newMsg ? (
        <div
          style={{
            color: "gray",
            height: "15px",
          }}
        >
          {7777777}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

// return (
//   <div id="messages" style={{ height: "100%", overflowY: "scroll" }}>
//     <InfiniteScroll
//       dataLength={messages.data.length}
//       next={() => {
//         scrollGetMessage();
//       }}
//       hasMore={messages.data.length < 50}
//       loader={<h4>Loading...</h4>}
//       scrollableTarget="scrollableDiv"
//     >
//       {messages.data.map((message, i) => (
//         <div key={i}>
//           {i == 0 ? (
//             <DateMessage date={message.d} />
//           ) : messages.data[i - 1].d !== message.d ? (
//             <DateMessage date={message.d} />
//           ) : (
//             <None />
//           )}
//           <Message message={message} user={user} users={users} />
//         </div>
//       ))}
//     </InfiniteScroll>
//   </div>
// );
export default Messages;
