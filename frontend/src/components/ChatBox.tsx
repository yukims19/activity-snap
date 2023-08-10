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
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log(messagesRef.current);
  }, [messages]);

  function updateUserInput(e: ChangeEvent<HTMLInputElement>) {
    setUserInput(e.target.value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  function sendMessage() {
    if (userInput.length === 0) {
      return;
    }
    const newMessage = messages.slice();
    newMessage.push({ source: "user", message: userInput });
    setUserInput("");
    setMessages(newMessage);
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
