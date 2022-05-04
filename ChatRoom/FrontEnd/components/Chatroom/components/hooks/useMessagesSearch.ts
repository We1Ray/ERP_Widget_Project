import { useEffect, useState } from "react";
import axios from "axios";
import { CallApi, CENTER_FACTORY } from "../../../../resource";

export default function useMessagesSearch(pageNumber: any, room_id: any) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  // useEffect(() => {
  //   setMessages([]);
  // }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const ENDPOINT = "http://10.1.50.59:81";
    CallApi.ExecuteApi(
      CENTER_FACTORY,
      ENDPOINT + "/chat/get_room_page_message",
      {
        room_id: room_id,
        page: pageNumber,
      }
    )
      .then((res) => {
        if (res.status === 200) {
          setMessages((prevMessages) => {
            return [...res.data, ...prevMessages];
          });
          setHasMore(res.data.length > 0);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) return;
        setError(true);
        console.log("EROOR: Chat: /chat/get_room_message");
        console.log(error);
      });
  }, [pageNumber]);

  return { messages, hasMore, loading, error };
}
