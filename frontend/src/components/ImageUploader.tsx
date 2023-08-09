import { ChangeEvent, useState } from "react";

import {
  Button,
  CircularProgress,
  ImageList,
  ImageListItem,
  Paper,
} from "@mui/material";
import styled from "@emotion/styled";

const ImageBar = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  max-height: 60%;
  overflow: scroll;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 8px;
  box-sizing: border-box;
`;

const LoadingWrap = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export function ImageUploader() {
  const [imageMetadata, setImageMetadata] = useState<any>({});
  const [images, setImages] = useState<FileList | null>(null);
  const [imageUrls, setImageUrls] = useState<{ name: string; url: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  function changeHandler(e: ChangeEvent) {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) {
      setImages(null);
      setImageUrls([]);
    }

    setImages(files);
    const newUrls = [];
    for (let i = 0; i < (files?.length || 0); i++) {
      const url = files ? URL.createObjectURL(files[i]) : "";
      newUrls.push({ name: files?.[i].name || "", url });
    }
    setImageUrls(newUrls);
  }

  async function handleSubmission() {
    /* const data = {
      "IMG_4734.jpeg": {
        datetime: "2023:07:09 13:17:02",
        location:
          "642, Moorpark Way, Whisman Station, Mountain View, Santa Clara County, CAL Fire Northern Region, California, 94041, United States",
        caption: "a little girl brushing her teeth with a tooth brush",
        people: ["Liba"],
      },
      "IMG_4736.jpeg": {
        datetime: "2023:07:09 13:29:46",
        location:
          "641, Moorpark Way, Whisman Station, Mountain View, Santa Clara County, CAL Fire Northern Region, California, 94041, United States",
        caption: "a bowl of food on a table with a person in the background",
        people: [],
      },
      "IMG_6482.jpeg": {
        datetime: "2022:12:29 23:26:48",
        location:
          "川口町三丁目, Fukuyama, Hiroshima Prefecture, 720-0824, Japan",
        caption: "a woman holding a baby in front of a cake",
        people: ["Yuki", "Liba"],
      },
    };
    setImageMetadata(data);
    localStorage.setItem("image-metadata", JSON.stringify(data));
    return; */

    setIsLoading(true);
    const formData = new FormData();
    if (!images) {
      setImageMetadata({});
      return;
    }

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i], images[i].name);
    }
    const res = await fetch("http://localhost:7400/process-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setImageMetadata(data);
    localStorage.setItem("image-metadata", JSON.stringify(data));
    setIsLoading(false);
  }

  return (
    <Paper
      elevation={2}
      sx={{
        padding: "24px",
      }}
    >
      <Button variant="outlined" component="label" color="secondary">
        Upload File
        <input
          type="file"
          name="file"
          onChange={changeHandler}
          multiple
          hidden
        />
      </Button>

      <div
        style={{
          overflow: "scroll",
          maxHeight: "500px",
          margin: "24px",
          position: "relative",
        }}
      >
        <ImageList cols={4}>
          {imageUrls.map((url) => (
            <ImageListItem key={url.name}>
              <img src={url.url} alt="" loading="lazy" />
              <ImageBar>
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(imageMetadata[url.name], null, 2)}
                </pre>
              </ImageBar>
            </ImageListItem>
          ))}
        </ImageList>
        {isLoading && (
          <LoadingWrap>
            <CircularProgress />
          </LoadingWrap>
        )}
      </div>
      <Button variant="contained" onClick={handleSubmission} fullWidth>
        Submit
      </Button>
    </Paper>
  );
}
