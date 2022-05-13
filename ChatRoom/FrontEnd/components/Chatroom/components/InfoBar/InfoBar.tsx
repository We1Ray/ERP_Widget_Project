import React, { useState, useEffect, useCallback } from "react";
import "./InfoBar.css";
import {
  CallApi,
  CENTER_FACTORY,
  Column,
  None,
  Row,
  TextBox,
} from "../../../../resource";

import { roomProps, userProps, messageProps } from "../Chat/Chat";

interface InfoBarProps {
  room: roomProps;
  user: userProps;
  searchedMessage: (searchedMessage: messageProps) => any;
}

const InfoBar: React.FC<InfoBarProps> = ({ room, user, searchedMessage }) => {
  const ENDPOINT = "http://10.1.50.59:81";
  const [onSearch, setOnSearch] = useState(false);
  const [keyWord, setKeyWord] = useState("");
  const [searchedMessageList, setSearchedMessageList] = useState<
    messageProps[]
  >([]);
  const [searchedMessageNumber, setSearchedMessageNumber] = useState(null);

  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      setOnSearch(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  useEffect(() => {
    searchedMessage(searchedMessageList[searchedMessageNumber - 1]);
  }, [searchedMessageNumber, searchedMessageList]);

  function searchValue(event: { preventDefault: () => void }) {
    if (event.preventDefault) event.preventDefault();

    CallApi.ExecuteApi(
      CENTER_FACTORY,
      ENDPOINT + "/chat/get_room_search_keyword",
      {
        room_id: room.room_id,
        keyWord: keyWord,
      }
    )
      .then((res) => {
        if (res.status === 200) {
          setSearchedMessageList(res.data);
          setSearchedMessageNumber(res.data.length);
        }
      })
      .catch((error) => {
        console.log("EROOR: Chat: /chat/get_room_search_keyword");
        console.log(error);
      });
  }

  return (
    <>
      <div className="infoBar">
        <div className="leftInnerContainer">
          <h3>
            {room.is_group === "N"
              ? room.member.filter(
                  (otherSide) => otherSide.name != user.name
                )[0].name
              : room.room_name}
          </h3>
        </div>
        <div className="rightInnerContainer">
          <div
            onClick={() => {
              setOnSearch((prev) => !prev);
            }}
          >
            <em className="fab fa-sistrix a" title={"搜尋聊天"} />
          </div>
        </div>
      </div>
      {onSearch ? (
        <div className="searchKeyword">
          <Row>
            <Column md={10}>
              <TextBox
                placeholder="搜尋訊息..."
                onKeyPress={(event: any) =>
                  event.key === "Enter" ? searchValue(event) : null
                }
                onChange={(event: any) => setKeyWord(event.target.value)}
              />
            </Column>
            <Column md={2} className="updown">
              <Row>
                {searchedMessageList.length > 0 ? (
                  <>
                    {searchedMessageNumber + "/" + searchedMessageList.length}
                    &emsp;
                    <em
                      className="fas fa-angle-up"
                      onClick={() => {
                        setSearchedMessageNumber((prev: number) =>
                          prev > 1 ? prev - 1 : prev
                        );
                      }}
                    />
                    &emsp;
                    <em
                      className="fas fa-angle-down"
                      onClick={() => {
                        setSearchedMessageNumber((prev: number) =>
                          prev < searchedMessageList.length ? prev + 1 : prev
                        );
                      }}
                    />
                  </>
                ) : (
                  <div className="backspace">
                    <em
                      className="fas fa-times-circle"
                      title={"關閉"}
                      onClick={() => {
                        setOnSearch(false);
                      }}
                    />{" "}
                    &emsp;{" "}
                    <em
                      className="fab fa-sistrix c"
                      title={"搜尋"}
                      onClick={(event) => {
                        searchValue(event);
                      }}
                    />
                  </div>
                )}
              </Row>
            </Column>
          </Row>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default InfoBar;
