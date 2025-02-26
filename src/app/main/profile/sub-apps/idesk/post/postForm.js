import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { lighten } from "@mui/material/styles";
import Box from "@mui/material/Box";

import { useDeepCompareEffect } from "@fuse/hooks";
import FuseLoading from "@fuse/core/FuseLoading";

import _ from "@lodash";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

//Redux
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { addPost, getPosts } from "../store/postSlice";
//Controls
// import PostTypeSelector from "./PostTypeSelector";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  text: yup.string().required("Please type a short message before posting!"),
  picture: yup.string(),
});

const PostForm = () => {
  const [pictureFile, setPictureFile] = useState()
  const user = useSelector(selectUser);

  const dispatch = useDispatch();

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm(
    {
      // mode: "onChange",
      resolver: yupResolver(schema),
    }
  );

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  // FORM SUBMIT



  const onSubmitNew = (data) => {
    const payload = {
      userId: user._id,
      text: data.text
    };

    const formData = new FormData();

    formData.append("picture", pictureFile);
    formData.append("post", JSON.stringify(payload));
    

    dispatch(addPost(formData));
    setPictureFile(null)
    reset({
      text: "",
    });
  };

  return (
    <>
     <Card
  component={motion.div}
  variants={item}
  className="w-full overflow-hidden mb-32"
>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    {/* CardHeader with Avatar */}
    <CardHeader
      sx={{marginRight: 0, paddingRight:0}}
      avatar={
        <Avatar
          className="md:mx-4"
          alt="user photo"
          src={user.avatar ? user.avatar : user.displayName[0]}
          sx={{
            width: 56, // Set width
            height: 56, // Set height
            marginRight: 5, // Remove right margin
            // Add any additional styles here
          }}
        />
      }
      title=""
      subheader=""
    />

    {/* Controller with TextField */}
    <Controller
      control={control}
      name="text"
      render={({ field }) => (
        <TextField
          className="p-24 pl-0 w-full"
          {...field}
          label=""
          placeholder="What do you want to share with your team?"
          id="text"
          error={!!errors?.message?.message}
          helperText={errors?.message?.message}
          fullWidth
          sx={{
            marginBottom: "-2px",
          }}
          multiline
          minRows={1}
          maxRows={3}
          variant="outlined"
          inputProps={{
            maxLength: 100,
          }}
        />
      )}
    />
  </div>

        <Controller
          control={control}
          name="picture"
          render={({ field: { onChange, value } }) => (
            <Box
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
            >
              {value && (
                <div className="relative w-full h-160 sm:h-292 px-32 sm:px-48">
                  <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div>
                      <IconButton
                        onClick={() => {
                          onChange("");
                        }}
                      >
                        <FuseSvgIcon className="text-white">
                          heroicons-solid:trash
                        </FuseSvgIcon>
                      </IconButton>
                    </div>
                  </div>
                  <img
                    src={value}
                    className="absolute inset-0 object-cover w-full h-full"
                  />
                </div>
              )}

              <div className="card-footer flex items-center flex-row border-t-1 px-24 py-12">
                <div className="flex flex-1 items-center">
                  <IconButton>
                    <label aria-label="Add photo">
                      <input
                        accept="image/*"
                        className="hidden"
                        id="button-avatar"
                        type="file"
                        onChange={async (e) => {
                          function readFileAsync() {
                            return new Promise((resolve, reject) => {
                              setPictureFile(e.target.files[0])

                              const file = e.target.files[0];
                              if (!file) {
                                return;
                              }
                              const reader = new FileReader();

                              reader.onload = () => {
                                resolve(
                                  `data:${file.type};base64,${btoa(
                                    reader.result
                                  )}`
                                );
                              };

                              reader.onerror = reject;

                              reader.readAsBinaryString(file);
                            });
                          }

                          const newImage = await readFileAsync();

                          onChange(newImage);
                        }}
                      />
                      <FuseSvgIcon size={20}>
                        heroicons-solid:photograph
                      </FuseSvgIcon>
                    </label>
                  </IconButton>
                  <IconButton aria-label="Mention somebody" disabled={true}>
                    <FuseSvgIcon size={20}>heroicons-solid:user</FuseSvgIcon>
                  </IconButton>
                </div>

                <div className="">
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    aria-label="post"
                    disabled={_.isEmpty(dirtyFields) || !isValid}
                    onClick={handleSubmit(onSubmitNew)}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </Box>
          )}
        />
      </Card>
    </>
  );
};

export default PostForm;
