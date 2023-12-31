import styled from "@emotion/styled";
import { IconButton, Paper, TextField } from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";

const Wrapper = styled.div`
  height: 400px;
  position: relative;
`;
const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: scroll;
  height: calc(100% - 60px);
`;

const UserMessage = styled.div`
  background: #b3e5fc;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 8px;
  margin-left: auto;
`;
const SystemMessage = styled.div`
  background: #81d4fa;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 8px;
  margin-right: auto;
`;

export function ChatBox() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<
    { source: string; message: string }[]
  >([{ source: "system", message: "What do you want to know?" }]);
  const messagesRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, [messages]);

  function updateUserInput(e: ChangeEvent<HTMLInputElement>) {
    setUserInput(e.target.value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  async function sendMessage() {
    if (userInput.length === 0) {
      return;
    }

    const newMessage = messages.slice();
    newMessage.push({ source: "user", message: userInput });
    setUserInput("");
    setMessages(newMessage);

    const storageVal = localStorage.getItem("image-metadata") || "";
    const metadata = Object.values(JSON.parse(storageVal));

    const res = await fetch("http://localhost:7400/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userInput, metadata: metadata }),
    });

    const message = await res.json();
    const newMessage2 = newMessage.slice();

    newMessage2.push({ source: "system", message: message });
    setMessages(newMessage2);
  }

  return (
    <Paper
      elevation={2}
      sx={{
        padding: "24px",
      }}
    >
      <Wrapper>
        <MessageWrapper>
          {messages.map((m) =>
            m.source === "user" ? (
              <UserMessage>{m.message}</UserMessage>
            ) : (
              <SystemMessage>{m.message}</SystemMessage>
            )
          )}
          <div ref={messagesRef} />
        </MessageWrapper>
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 0,
            width: "100%",
            background: "white",
            padding: "10px 0px",
          }}
        >
          <TextField
            id="standard-basic"
            variant="standard"
            fullWidth
            onChange={updateUserInput}
            onKeyDown={handleKeyDown}
            value={userInput}
          />
          <IconButton aria-label="delete" onClick={sendMessage}>
            <SendIcon />
          </IconButton>
        </div>
      </Wrapper>
    </Paper>
  );
}
