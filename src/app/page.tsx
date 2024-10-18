"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  InputBase,
  MenuItem,
  Typography,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { alpha, styled } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getExams } from "./actions";
import CircleIcon from "./components/CircleIcon";
import { getLectureNames } from "./exam/upload/actions";

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

  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [lectureName, setLectureName] = useState("");

  const [lectureOptions, setLectureOptions] = useState<string[]>([]);
  const [exams, setExams] = useState<
    {
      id: string;
      lecture: { name: string };
      department: { name: string };
      year: number;
      professor: string;
    }[]
  >([]);

  const [searchedExams, setSearchedExams] = useState<typeof exams>([]);

  const handleSubjectChange = (event: SelectChangeEvent) => {
    setSubject(event.target.value as string);
  };

  const handleYearChange = (event: SelectChangeEvent) => {
    setYear(event.target.value as string);
  };

  const handleSearch = async () => {
    // ここでAPIコールを行い、検索結果を取得する
    // 例: const result = await fetch('/api/search', { method: 'POST', body: JSON.stringify({ subject, year, lectureName }) });
    // const data = await result.json();
    // setSearchedExams(data);
    // 今はモックデータで代用
    const mockData = exams.filter(
      (exam) =>
        (!subject || exam.department.name.includes(subject)) &&
        (!year || exam.year.toString() === year) &&
        (!lectureName || exam.lecture.name.includes(lectureName))
    );
    console.log(mockData);
    setSearchedExams(mockData);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden"; // スクロール無効化
    return () => {
      document.body.style.overflow = "auto"; // クリーンアップで元に戻す
    };
  }, []);

  useEffect(() => {
    const loadExams = async () => {
      const data = await getExams();
      setExams(data);
    };
    loadExams();
  }, []);

  useEffect(() => {
    const fetchLectureNames = async () => {
      if (lectureName.length > 0) {
        const data = await getLectureNames(lectureName);
        setLectureOptions(data);
      }
    };
    fetchLectureNames();
  }, [lectureName]);

  return (
    <>
      <div
        style={{
          margin: "30px",
          overflow: "hidden",
          height: "100vh",
        }}
      >
        <div style={{ display: "flex", height: "95%" }}>
          <Box
            sx={{
              width: "50%",
              height: "100vh",
              marginLeft: "6%",
              overflowY: "auto",
              padding: 2,
              borderRadius: 2,
              zIndex: 999,
              // スクロールバーを非表示にするためのCSS
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none", // Firefox対応
            }}
          >
            <Divider
              textAlign="center"
              sx={{
                marginBottom: "20px",
                marginTop: "-15px",
              }}
            >
              {searchedExams.length > 0
                ? "検索結果"
                : "直近に投稿された過去問一覧"}
            </Divider>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {(searchedExams.length > 0 ? searchedExams : exams).map(
                (exam) => (
                  <Box
                    key={exam.id}
                    sx={{
                      width: "calc(50% - 16px)", // 2列レイアウト
                    }}
                  >
                    {/* リンクを追加するときはこのコメントを外す */}
                    {/* <Link href={`/exams/${exam.id}`} key={exam.id} style={{textDecoration: "none"}}> */}
                    <Card
                      sx={{
                        height: "25vh",
                        marginBottom: "2vh",
                        backgroundColor: "#ffffff",
                        boxShadow: 3,
                        display: "flex",
                      }}
                    >
                      <Box
                        component="img"
                        src="/icon/book.png"
                        alt="book"
                        sx={{
                          position: "relative",
                          top: "15%", // カード内で位置調整
                          width: "30%", // 相対的にサイズを設定
                          height: "auto", // アスペクト比を保つ
                          objectFit: "contain", // 画像がコンテナに収まるようにする
                        }}
                      />
                      <CardContent>
                        <Typography variant="h5" component="div">
                          {exam.lecture.name} ({exam.year})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          学科: {exam.department.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          教授名: {exam.professor || "不明"}
                        </Typography>
                      </CardContent>
                    </Card>
                    {/* </Link> */}
                  </Box>
                )
              )}
            </Box>
          </Box>

          <div
            style={{
              width: "2px", // 線の幅
              backgroundColor: "#ccc", // 線の色
              margin: "0 20px", // 両Boxとの間隔
              alignSelf: "stretch",
            }}
          ></div>
          <Box
            sx={{
              width: "40%",
              marginLeft: "12px",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#c0d7d2",
              padding: "30px",
              borderRadius: 2,
            }}
          >
            <Card
              sx={{
                position: "relative",
                height: "100%",
                boxShadow: "0px 2px 10px 4px rgba(0, 0, 0, 0.2)",
                padding: "10px",
                marginTop: "-7px",
                overflowY: "auto", // スクロール可能にする
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none", // Firefox対応
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
                  padding: "0 5px",
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
                  {/* <Autocomplete
                    freeSolo
                    options={lectureOptions}
                    onInputChange={(event, newValue) => setLectureName(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="講義名" variant="outlined" />
                    )}
                  /> */}
                  <StyledInputBase
                    placeholder=""
                    inputProps={{ "aria-label": "search" }}
                  />
                  <SearchButton variant="contained" onClick={handleSearch}>
                    検索
                  </SearchButton>
                </Search>
              </CardContent>
              <div
                style={{
                  width: "90%",
                  height: "2px",
                  backgroundColor: "#c0d7d2",
                  position: "relative",
                  top: "20px",
                  margin: "20px auto",
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
                  marginTop: "40px",
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
      </div>
    </>
  );
}
