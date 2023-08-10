import styled from "@emotion/styled";
import { Button, Paper } from "@mui/material";
import { useState } from "react";

const EssayWrapper = styled.div`
  border: 1px solid #ba68c880;
  border-radius: 8px;
  padding: 24px;
  margin-top: 24px;
  min-height: 200px;
`;

export function EssayBox() {
  const [essay, setEssay] = useState("");

  async function handleSubmission() {
    const storageVal = localStorage.getItem("image-metadata") || "";
    const metadata = Object.values(JSON.parse(storageVal));
    const res = await fetch("http://localhost:7400/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ metadata: metadata }),
    });

    const message = await res.json();
    setEssay(message);
  }
  return (
    <Paper
      elevation={2}
      sx={{
        padding: "24px",
      }}
    >
      <Button variant="contained" onClick={handleSubmission} color="secondary">
        Generate Summary
      </Button>
      <EssayWrapper>{essay}</EssayWrapper>
    </Paper>
  );
}
