import Grid from "@mui/material/Grid";
import styled from "@emotion/styled";
import { ImageUploader } from "./components/ImageUploader";
import { ChatBox } from "./components/ChatBox";
import { EssayBox } from "./components/EssayBox";

const Wrapper = styled.div`
  padding: 32px;
`;

function App() {
  return (
    <Wrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={8}>
          <ImageUploader />
        </Grid>
        <Grid item xs={12} md={4}>
          <ChatBox />
        </Grid>
        <Grid item xs={12}>
          <EssayBox />
        </Grid>
      </Grid>
    </Wrapper>
  );
}

export default App;
