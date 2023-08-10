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

  function handleSubmission() {
    setEssay("summary of the day");
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
