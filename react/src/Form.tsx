import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";

import { useUploadForm } from "./hooks";

interface PostData {
  file: File | null;
}

const Form: React.FunctionComponent = () => {
  const [formValues, setFormValues] = useState<PostData>({
    file: null,
  });

  const { isLoading, isSuccess, uploadForm, progress } = useUploadForm(
    "http://localhost:2324/uploadmultiple"
  );

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      title: event.target.value,
    }));
  };

  const handleBodyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      body: event.target.value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      file: event.target.files ? event.target.files[0] : null,
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formValues.file && formData.append("myFiles", formValues.file);
    return await uploadForm(formData);
  };

  return (
    <Box
      display="flex"
      height="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
     <Button variant="contained" component="label">
        {formValues.file?.name ?? "Upload File"}
        <input type="file" onChange={handleImageChange} multiple hidden />
      </Button>
      <Box marginY={3}>
        {isSuccess ? (
          <Box color="success.main" display="flex">
            <CheckIcon color="success" />
            <Typography>Success</Typography>
          </Box>
        ) : (
          <>
            <Button onClick={handleSubmit}>Submit Post </Button>
            <LinearProgress variant="determinate" value={progress} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Form;
