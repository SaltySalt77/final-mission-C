import {
  Box,
  FormControl,
  Input,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import CategoryItem from "../category/categoryItem";
import { useEffect, useState } from "react";
import { Categories } from "@/types/categories";
import Styles from "./questionForm.module.css";
import { styled } from "styled-components";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { ErrorType } from "@/types/error";
import BasicModal from "../common/BasicModal";
import Link from "next/link";
import { useRouter } from "next/router";

const Button = styled.button`
  display: block;
  background-color: #a6d5ff;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  color: white;
  border-color: lightgrey;
  border-width: 1.5px;
  height: 50px;
  width: 80px;
`;

type FormValue = {
  questionTitle: string;
  questionBody: string;
  nickname: string;
  password: string;
};

const QuestionForm: React.FC = (props) => {
  const categories = Object.values(Categories);
  const [selected, setSelected] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const initialValues: FormValue = {} as FormValue;
  initialValues.questionTitle = "";
  initialValues.questionBody = "";
  initialValues.nickname = "";
  initialValues.password = "";

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValue>({ defaultValues: initialValues });

  const onSubmitHandler: SubmitHandler<FormValue> = (data: FormValue) => {
    setTouched(true);
    if (!selected) {
      return;
    }
    // data.preventDefault();
    setIsLoading(true);
    setModalOpen(true);
    const fetchData = async (data: FormValue) => {
      const questionData = {
        type: "question",
        title: data.questionTitle,
        nickname: data.nickname,
        password: data.password,
        category: selected,
        content: data.questionBody,
      };
      console.log(questionData);
      const res = await axios
        .post("http://localhost:8000/v1/question", questionData)
        .then((res) => {
          console.log(res);
          setIsLoading(false);
          resetField("questionTitle");
          resetField("questionBody");
          resetField("nickname");
          resetField("password");
          setSelected("");
          setTouched(false);
          const route = useRouter();
          route.push("/");
          return res;
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
          setErrorMessage("Something went wrong");
        });
    };
    if (!isLoading) {
      fetchData(data);
    }
  };

  return (
    <div>
      {!isLoading && (
        <form
          className={Styles.questionContent}
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <FormControl
            margin="normal"
            style={{ borderTop: "1px lightgray solid", padding: "30px 0 0" }}
            sx={{ m: 2, width: 0.9 }}
          >
            <Input
              required
              style={{ height: "30px", fontSize: "1.1em" }}
              placeholder="ex. Is there some tips for minishell?"
              startAdornment={
                <InputAdornment position="start">Q.</InputAdornment>
              }
              {...register("questionTitle", {
                required: "Question title is required",
              })}
            />
          </FormControl>
          {touched && !selected && (
            <p style={{ color: "red", margin: "0", padding: "0" }}>
              need to select category
            </p>
          )}
          <div className={Styles.categoryList}>
            {categories.map((category) => {
              if (category !== "")
                return (
                  <div key={category} className={Styles.categoryItem}>
                    <CategoryItem
                      key={category}
                      selected={selected}
                      setSelected={setSelected}
                      categoryName={category}
                    />
                  </div>
                );
            })}
          </div>

          <FormControl margin="normal" sx={{ m: 1, width: 0.9 }}>
            <TextField
              required
              multiline
              rows={10}
              style={{
                height: "100%",
                fontSize: "1.1em",
              }}
              placeholder="ex. PLZ gimme any tips for minishell. I don't have any idea."
              {...register("questionBody", {
                required: "Question body is required",
              })}
            />
          </FormControl>
          <div className={Styles.footer}>
            <div className={Styles.login}>
              <TextField
                required
                label="Nickname"
                size="small"
                placeholder="ex. peer"
                style={{ margin: "5px 0" }}
                {...register("nickname", {
                  required: "Nickname is required",
                  minLength: {
                    value: 4,
                    message: "The min length of password is 4",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/,
                    message: "You can only use alphabet or number for password",
                  },
                })}
              />
              <TextField
                required
                label="Password"
                size="small"
                type="password"
                style={{ margin: "5px 0" }}
                {...register("password", { required: "Password is required" })}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              Post
            </Button>
          </div>
        </form>
      )}
      <BasicModal open={modalOpen} setOpen={setModalOpen}>
        <div>
          {isLoading && <h3>Loading</h3>}
          {!isLoading && !errorMessage && (
            <div
              style={{
                padding: "0",
                margin: "0",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3>Successfully Posted!</h3>
              {/* <Button>
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  href="/"
                >
                  go to main
                </Link>
              </Button> */}
            </div>
          )}
          {errorMessage && (
            <div
              style={{
                padding: "0",
                margin: "0",
              }}
            >
              <h3>{errorMessage}</h3>
            </div>
          )}
        </div>
      </BasicModal>
    </div>
  );
};

export default QuestionForm;
