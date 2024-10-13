"use client";

import Skeleton from "@mui/material/Skeleton";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  InputBase,
  Box,
  Button,
  Container,
  Grid,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import CircleIcon from "./components/CircleIcon";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const cardData = [
  { id: 1, title: "Card 1", content: "This is card 1 content" },
  { id: 2, title: "Card 2", content: "This is card 2 content" },
  { id: 3, title: "Card 3", content: "This is card 3 content" },
  { id: 4, title: "Card 4", content: "This is card 4 content" },
  { id: 5, title: "Card 5", content: "This is card 5 content" },
  { id: 6, title: "Card 6", content: "This is card 6 content" },
  { id: 7, title: "Card 7", content: "This is card 7 content" },
  // 必要に応じてデータを追加
];

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  height: "70px",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& svg": {
    fontSize: "30px",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: "12px 0", // 上下パディングを増やして中央揃えに
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    height: "45px", // 高さを検索ボックスと一致させる
    fontSize: "25px", // テキストサイズを変更
    display: "flex",
    alignItems: "center", // 縦の中央揃え
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  right: "2%",
  top: "50%",
  width: "14%",
  transform: "translateY(-50%)",
  height: "50px",
  backgroundColor: "#444f7c",
  color: "#fff",
}));

export default function Home() {
  const { data: session, status } = useSession();

  const [subject, setSubject] = React.useState("");
  const [year, setYear] = React.useState("");

  const handleSubjectChange = (event: SelectChangeEvent) => {
    setSubject(event.target.value as string);
  };

  const handleYearChange = (event: SelectChangeEvent) => {
    setYear(event.target.value as string);
  };

  // if (session) {
  //   return (
  //     <>
  //       <p>Signed in as {session.user?.email}</p>
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </>
  //   );
  // } else {
  //   return (
  //     <>
  //       <p>Not signed in</p>
  //       <button onClick={() => signIn("github")}>Sign in with GitHub</button>
  //     </>
  //   );
  // }

  return (
    <>
      <div style={{ margin: "30px" }}>
        <div style={{ display: "flex" }}>
          <Box
            sx={{
              width: "18%",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#c0d7d2",
              padding: "10px",
              height: "800px",
              borderRadius: 2,
            }}
          >
            <CircleIcon
              src="/icon/school-icon.png"
              alt="School Icon"
              text="シラバス"
              size={100}
              linkUrl="https://edragon-syllabus.jimu.kyutech.ac.jp/guest/syllabuses"
            />
            <CircleIcon
              src="/icon/pen.png"
              alt="Pen"
              text="Live Campus"
              size={100}
              linkUrl="https://virginia.jimu.kyutech.ac.jp/lcu-web/"
            />
            <CircleIcon
              src="/icon/note.png"
              alt="Note"
              text="Moodle"
              size={100}
              linkUrl="https://ict-i.el.kyutech.ac.jp/login/index.php"
            />
          </Box>
          <div
            style={{
              width: "2px", // 線の幅
              marginLeft: "2%",
              height: "800px", // 線の高さ
              backgroundColor: "#ccc", // 線の色
              margin: "0 20px", // 両Boxとの間隔
            }}
          ></div>
          <Box
            sx={{
              width: "75%",
              marginLeft: "0.5%",
              height: "800px",
              overflowY: "auto",
              padding: 2,
              borderRadius: 2,
              // スクロールバーを非表示にするためのCSS
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none", // Firefox対応
            }}
          >
            <Grid container spacing={2}>
              {cardData.map((card) => (
                <Grid item xs={6} key={card.id}>
                  <Card
                    sx={{
                      height: "200px",
                      marginBottom: 2,
                      backgroundColor: "#ffffff",
                      boxShadow: 3,
                      display: "flex",
                    }}
                  >
                    <img
                      src="/icon/book.png"
                      alt="book"
                      style={{
                        position: "relative",
                        top: "15%",
                        width: "100%",
                        height: "100%",
                      }}
                    ></img>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {card.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          <div
            style={{
              width: "2px", // 線の幅
              height: "800px", // 線の高さ
              backgroundColor: "#ccc", // 線の色
              margin: "0 20px", // 両Boxとの間隔
            }}
          ></div>
          <Box
            sx={{
              width: "75%",
              marginLeft: "12px",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#c0d7d2",
              padding: "10px",
              height: "800px",
              borderRadius: 2,
            }}
          >
            <Card
              sx={{
                position: "relative",
                height: "760px",
                boxShadow: "0px 2px 10px 4px rgba(0, 0, 0, 0.2)",
                margin: "20px",
                overflow: "visible",
              }}
            >
              <div
                style={{
                  width: "90%",
                  height: "2px",
                  backgroundColor: "#c0d7d2",
                  position: "relative",
                  top: "90px",
                  margin: "0 auto",
                }}
              ></div>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/icon/search-icon.png"
                  alt="search"
                  style={{
                    width: "30px",
                    height: "30px",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#444f7c",
                    fontWeight: 550,
                    fontSize: "30px",
                  }}
                >
                  講義名検索
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  marginTop: "5px",
                  color: "#444f7c",
                  fontWeight: 550,
                  fontSize: "16px",
                }}
              >
                検索したい講義名を入力してください。
                <br />
                条件で絞り込みたい場合は詳細検索をご利用ください。
              </Typography>
              <CardContent sx={{ paddingTop: "20px" }}>
                <Search>
                  <StyledInputBase
                    placeholder=""
                    inputProps={{ "aria-label": "search" }}
                  />
                  <SearchButton variant="contained">検索</SearchButton>
                </Search>
              </CardContent>
              <div
                style={{
                  width: "90%",
                  height: "2px",
                  backgroundColor: "#c0d7d2",
                  position: "relative",
                  top: "20px",
                  margin: "0 auto",
                }}
              ></div>
              <div
                style={{
                  width: "90%",
                  height: "2px",
                  backgroundColor: "#c0d7d2",
                  position: "relative",
                  top: "30px",
                  margin: "0 auto",
                }}
              ></div>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "30px",
                }}
              >
                <img
                  src="/icon/search-icon.png"
                  alt="search"
                  style={{
                    width: "30px",
                    height: "30px",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#444f7c",
                    fontWeight: 550,
                    fontSize: "30px",
                  }}
                >
                  詳細検索
                </Typography>
              </Box>
              <div
                style={{
                  width: "90%",
                  height: "2px",
                  backgroundColor: "#c0d7d2",
                  position: "relative",
                  top: "-20px",
                  margin: "0 auto",
                }}
              ></div>
              <Box
                sx={{
                  minWidth: 120,
                  display: "flex",
                  padding: "10px 50px",
                }}
              >
                <Card
                  sx={{
                    backgroundColor: "#444f7c",
                    flexGrow: 1, // 横幅に応じて伸縮する
                    flexBasis: "40%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 1,
                    marginLeft: "30px",
                    marginRight: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#ffffff",
                      fontWeight: 450,
                      fontSize: "23px",
                    }}
                  >
                    開講学科
                  </Typography>
                </Card>
                <FormControl
                  sx={{
                    flexGrow: 2, // 横幅に応じて伸縮する
                    flexBasis: "60%",
                    backgroundColor: alpha("#000000", 0.05),
                    marginRight: "30px",
                    "& fieldset": {
                      borderColor: "#444f7c", // 初期状態の枠線の色
                    },
                    "&:hover fieldset": {
                      borderColor: "red", // ホバー時の枠線の色
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#444f7c", // フォーカス時の枠線の色
                    },
                  }}
                >
                  <Select
                    value={subject}
                    label=""
                    onChange={handleSubjectChange}
                    sx={{ fontSize: "20px" }}
                  >
                    <MenuItem value={"知能情報工学科"}>知能情報工学科</MenuItem>
                    <MenuItem value={"情報・通信工学科"}>
                      情報・通信工学科
                    </MenuItem>
                    <MenuItem value={"知的システム工学科"}>
                      知的システム工学科
                    </MenuItem>
                    <MenuItem value={"物理情報工学科"}>物理情報工学科</MenuItem>
                    <MenuItem value={"生命化学情報工学科"}>
                      生命化学情報工学科
                    </MenuItem>
                    <MenuItem value={"情工１類"}>情工１類</MenuItem>
                    <MenuItem value={"情工２類"}>情工２類</MenuItem>
                    <MenuItem value={"情工３類"}>情工３類</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box
                sx={{
                  minWidth: 120,
                  display: "flex",
                  padding: "10px 50px",
                }}
              >
                <Card
                  sx={{
                    backgroundColor: "#444f7c",
                    flexGrow: 1, // 横幅に応じて伸縮する
                    flexBasis: "40%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 1,
                    marginLeft: "30px",
                    marginRight: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#ffffff",
                      fontWeight: 450,
                      fontSize: "23px",
                    }}
                  >
                    開講年度
                  </Typography>
                </Card>
                <FormControl
                  sx={{
                    flexGrow: 2, // 横幅に応じて伸縮する
                    flexBasis: "60%",
                    backgroundColor: alpha("#000000", 0.05),
                    marginRight: "30px",
                    "& fieldset": {
                      borderColor: "#444f7c", // 初期状態の枠線の色
                    },
                    "&:hover fieldset": {
                      borderColor: "red", // ホバー時の枠線の色
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#444f7c", // フォーカス時の枠線の色
                    },
                  }}
                >
                  <Select
                    value={year}
                    label=""
                    onChange={handleYearChange}
                    sx={{ fontSize: "20px" }}
                  >
                    <MenuItem value={"2024"}>2024</MenuItem>
                    <MenuItem value={"2023"}>2023</MenuItem>
                    <MenuItem value={"2022"}>2022</MenuItem>
                    <MenuItem value={"2021"}>2021</MenuItem>
                    <MenuItem value={"2020"}>2020</MenuItem>
                    <MenuItem value={"2019"}>2019</MenuItem>
                    <MenuItem value={"2018"}>2018</MenuItem>
                    <MenuItem value={"2017"}>2017</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box
                sx={{
                  minWidth: 120,
                  display: "flex",
                  padding: "10px 50px",
                }}
              >
                <Card
                  sx={{
                    backgroundColor: "#444f7c",
                    flexGrow: 1, // 横幅に応じて伸縮する
                    flexBasis: "40%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 1,
                    marginLeft: "30px",
                    marginRight: 1,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#ffffff",
                      fontWeight: 450,
                      fontSize: "23px",
                    }}
                  >
                    教授名
                  </Typography>
                </Card>
                <FormControl
                  sx={{
                    flexGrow: 2, // 横幅に応じて伸縮する
                    flexBasis: "60%",
                    marginRight: "30px",
                  }}
                >
                  <Search sx={{ margin: 0 }}>
                    <StyledInputBase
                      placeholder=""
                      inputProps={{ "aria-label": "search" }}
                    />
                  </Search>
                </FormControl>
              </Box>
              <div
                style={{
                  width: "90%",
                  height: "2px",
                  backgroundColor: "#c0d7d2",
                  position: "relative",
                  top: "15px",
                  margin: "0 auto",
                }}
              ></div>
              <Button
                sx={{
                  position: "relative",
                  left: "80.5%",
                  top: "1%",
                  width: "13%",
                  height: "50px",
                  backgroundColor: "#444f7c",
                  color: "#fff",
                  marginTop: "20px",
                }}
              >
                検索
              </Button>
            </Card>
          </Box>
        </div>
        <Box
          component="footer"
          flexGrow={0}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
            margin: "20px 0",
          }}
        >
          <div
            style={{
              width: "100%", // 線の幅
              height: "2px", // 線の高さ
              backgroundColor: "#c0d7d2", // 線の色
              marginBottom: "15px",
            }}
          ></div>
          <div
            style={{
              width: "100%", // 線の幅
              height: "20px", // 線の高さ
              backgroundColor: "#444f7c", // 線の色
              marginBottom: "8px",
            }}
          ></div>
          {/* <button onClick={() => signOut()}>サインアウト</button> */}
        </Box>
      </div>
    </>
  );
}
