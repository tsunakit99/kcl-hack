"use client";

import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Typography,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { alpha, styled } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { getExams } from "./actions"; // デフォルトの過去問データを取得する関数
import ScrollButton from "./components/ScrollButton";
import { getDepartments, getLectureNames } from "./exam/upload/actions";
import Image from "next/image";
// import { searchExams } from "./actions"; // 検索クエリに基づいたデータを取得する関数

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
    "@media(max-width: 1000px)": {
      fontSize: "15px",
      padding: "10px 0",
      paddingLeft: `calc(1em + ${theme.spacing(2)})`,
    },
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  right: "2%",
  top: "50%",
  width: "30px",
  transform: "translateY(-50%)",
  height: "50px",
  backgroundColor: "#444f7c",
  color: "#fff",
}));

export default function Home() {
  const { data: session, status } = useSession();

  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);
  const [year, setYear] = useState("");
  const [lectureName, setLectureName] = useState("");

  // 画面幅が1000px以下の場合はtrueになる
  const isSmallScreen = useMediaQuery("(max-width: 1000px)");

  const [lectureOptions, setLectureOptions] = useState<string[]>([]);
  const [exams, setExams] = useState<
    {
      id: string;
      lecture: { name: string };
      department: { name: string };
      year: number;
      professor: string;
      pdfUrl: string;
    }[]
  >([]);
  const { control } = useForm();

  const [isToggled, setIsToggled] = useState(true);

  // ボタンを押したときにレイアウトを切り替える関数
  const toggleLayout = () => {
    setIsToggled(!isToggled);
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // スクロール関数（割合を受け取り、画面幅に応じてスクロール）
  const scroll = (scrollPercentage: number) => {
    if (scrollRef.current) {
      const scrollOffset = window.innerWidth * scrollPercentage;
      scrollRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  };

  const handleYearChange = (event: SelectChangeEvent) => {
    setYear(event.target.value as string);
  };

  // useEffect(() => {
  //   document.body.style.overflow = "hidden"; // スクロール無効化
  //   return () => {
  //     document.body.style.overflow = "auto"; // クリーンアップで元に戻す
  //   };
  // }, []);

  useEffect(() => {
    const loadDepartments = async () => {
      const data = await getDepartments();
      setDepartments(data);
    };
    loadDepartments();
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

  useEffect(() => {
    const loadExams = async () => {
      const data = await getExams();
      setExams(data);
    };
    loadExams();
  }, []);

  return (
    <>
      <Box
        sx={{
          overflow: "hidden",
          height: "100vh",
          background: "linear-gradient(to right, #c0d7d2 57%, #fff 57%)",
          gap: "4vw", // 間隔を調整
          flexDirection: "row",
          transition: "all 0.3s ease", // スムーズにサイズが変わるように
          "@media (max-width: 1600px)": {
            background: "linear-gradient(to right, #c0d7d2 54%, #fff 54%)",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            height: "95%",
            margin: "2% 0 2% 2%",
            gap: "4vw", // 間隔を調整
          }}
        >
          {isToggled ? (
            <Box
              sx={{
                width: "45vw",
                marginLeft: "10vw",
                flexDirection: "column",
                zIndex: 999,
                overflowY: "auto",
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
                  padding: "12px 0",
                }}
              >
                直近に投稿された過去問一覧
              </Divider>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 4,
                }}
              >
                {exams.map((exam) => (
                  <Box
                    key={exam.id}
                    sx={{
                      flexBasis: "calc(40% - 4px)", // 2列レイアウト
                      minWidth: "220px", // カードの最小幅を設定
                    }}
                  >
                    {/* リンクを追加するときはこのコメントを外す */}
                    {/* <Link href={`/exams/${exam.id}`} key={exam.id} style={{textDecoration: "none"}}> */}
                    <Card
                      sx={{
                        height: "25vh",
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
                        <Typography variant="h6" component="div">
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
                ))}
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                width: "50vw",
                marginLeft: "10vw",
                overflowY: "auto",
                padding: 2,
                borderRadius: 2,
                flexDirection: "column",
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
                検索結果　{exams.length}件
              </Divider>
              <Box sx={{ display: "flex", alignItems: "center", gap: "2vw" }}>
                {/* 左スクロールボタン */}
                <ScrollButton
                  text="←"
                  scroll={() => scroll(-0.22)}
                  color="#444f7c"
                  hoverColor="#5a6aa1"
                />

                {/* 横スクロール可能なコンテナ */}
                <Box
                  ref={scrollRef}
                  sx={{
                    display: "flex",
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    width: "100%", // 2枚分のカードが表示される幅に設定
                    "&::-webkit-scrollbar": { display: "none" }, // スクロールバーを非表示
                  }}
                >
                  {/* カードリスト */}
                  {exams.map((exam) => (
                    <Box
                      key={exam.id}
                      sx={{
                        marginRight: "2%", // カード間のスペース
                        flexGrow: 1, // カードの幅をコンテンツに応じて拡大
                      }}
                    >
                      {/* リンクを追加するときはこのコメントを外す */}
                      {/* <Link href={`/exams/${exam.id}`} key={exam.id} style={{textDecoration: "none"}}> */}
                      <Card
                        sx={{
                          width: "19vw",
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
                  ))}
                </Box>

                {/* 右スクロールボタン */}
                <ScrollButton
                  text="→"
                  scroll={() => scroll(0.22)}
                  color="#444f7c"
                  hoverColor="#5a6aa1"
                />
              </Box>
              <Divider
                textAlign="center"
                sx={{
                  marginBottom: "20px",
                  marginTop: "10px",
                }}
              ></Divider>
              {/* <div> */}
              {/* <h1>PDF Viewer</h1> */}
              {/* examsリストのマッピング */}
              {/* {exams.map((exam) => ( */}
              {/* <div key={exam.id} style={{ marginBottom: "20px" }}> */}
              {/* PdfViewerComponentを使用してPDFを表示 */}
              {/* <PdfViewer fileUrl={exam.pdfUrl} /> */}
              {/* </div> */}
              {/* ))} */}
              {/* </div> */}
            </Box>
          )}

          <Box
            sx={{
              width: "40vw",
              marginTop: "-2vw",
              flexDirection: "column",
              justifyContent: "center",
              padding: "2vw",
              borderRadius: 2,
              transition: "all 0.3s ease", // スムーズにサイズが変わるように
            }}
          >
            <Card
              sx={{
                position: "relative",
                height: "100%",
                backgroundColor: "rgba(255, 255, 255, 0)",
                boxShadow: "none", // 影を消す
                border: "none",
                // boxShadow: "0px 2px 10px 4px rgba(0, 0, 0, 0.2)",
                padding: "10px",
                overflowY: "auto", // スクロール可能にする
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none", // Firefox対応
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  className="search-icon"
                  src="/icon/search-icon.png"
                  alt="search"
                  width={50}
                  height={50}
                />
                <Typography
                  sx={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#444f7c",
                    fontWeight: 550,
                    fontSize: "28px",
                    transition: "all 0.3s ease",
                    "@media(max-width: 1000px)": {
                      fontSize: "20px",
                    },
                  }}
                >
                  講義名検索
                </Typography>
              </Box>
              <div
                style={{
                  width: "90%",
                  height: "2px",
                  backgroundColor: "#c0d7d2",
                  position: "relative",
                  top: "-10px",
                  margin: "0 auto",
                  transition: "all 0.3s ease", // スムーズにサイズが変わるように
                }}
              ></div>
              <Typography
                sx={{
                  textAlign: "center",
                  marginTop: "5px",
                  padding: "0 5px",
                  color: "#444f7c",
                  fontWeight: 550,
                  fontSize: "16px",
                  transition: "all 0.3s ease",
                  "@media(max-width: 1000px)": {
                    fontSize: "12px",
                  },
                }}
              >
                検索したい講義名を入力してください。
                <br />
                条件で絞り込みたい場合は詳細検索をご利用ください。
              </Typography>
              <CardContent sx={{ paddingTop: "20px" }}>
                {isSmallScreen ? (
                  // 1000px以下の場合、SearchButtonをSearchの外に表示
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Search>
                      <Autocomplete
                        freeSolo
                        options={lectureOptions}
                        onInputChange={(event, newValue) =>
                          setLectureName(newValue)
                        }
                        renderInput={(params) => (
                          <StyledInputBase
                            ref={params.InputProps.ref}
                            inputProps={params.inputProps}
                            placeholder="講義名を入力"
                          />
                        )}
                      />
                    </Search>
                    <Button
                      variant="contained"
                      onClick={toggleLayout}
                      style={{
                        width: "30px",
                        height: "30px",
                        backgroundColor: "#444f7c",
                        color: "#fff",
                        marginTop: "20px",
                      }}
                    >
                      検索
                    </Button>
                  </div>
                ) : (
                  // 600pxより大きい場合、SearchButtonをSearchの中に表示
                  <Search>
                    <Autocomplete
                      freeSolo
                      options={lectureOptions}
                      onInputChange={(event, newValue) =>
                        setLectureName(newValue)
                      }
                      renderInput={(params) => (
                        <StyledInputBase
                          ref={params.InputProps.ref}
                          inputProps={params.inputProps}
                          placeholder="講義名を入力"
                        />
                      )}
                    />
                    <SearchButton variant="contained" onClick={toggleLayout}>
                      検索
                    </SearchButton>
                  </Search>
                )}
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
                  className="search-icon"
                  src="/icon/search-icon.png"
                  alt="search"
                />
                <Typography
                  sx={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#444f7c",
                    fontWeight: 550,
                    fontSize: "28px",
                    "@media(max-width: 1000px)": {
                      fontSize: "20px",
                    },
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
                  minWidth: 140,
                  display: "flex",
                  padding: "10px 50px",
                  "@media(max-width: 1200px)": {
                    flexDirection: "column", // 縦並びにする
                    gap: "2vh",
                  },
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
                    marginLeft: "3vw",
                    marginRight: "3vw",
                    "@media(max-width: 1200px)": {
                      marginLeft: "2vw",
                      marginRight: "2vw",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "#ffffff",
                      fontWeight: 450,
                      fontSize: "20px",
                      "@media(max-width: 1200px)": {
                        fontSize: "16px",
                      },
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
                    marginRight: "2vw",
                    "& fieldset": {
                      borderColor: "#444f7c", // 初期状態の枠線の色
                    },
                    "&:hover fieldset": {
                      borderColor: "red", // ホバー時の枠線の色
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#444f7c", // フォーカス時の枠線の色
                    },
                    "@media(max-width: 1200px)": {
                      flexGrow: 1,
                      flexBasis: "40%",
                      marginLeft: "2vw",
                      marginRight: "2vw",
                    },
                  }}
                >
                  <InputLabel id="department-label">学科</InputLabel>
                  <Controller
                    name="departmentId"
                    control={control}
                    defaultValue={departments[0]?.id || ""}
                    render={({ field }) => (
                      <Select
                        labelId="department-label"
                        label="学科"
                        {...field}
                        value={field.value || ""}
                      >
                        {departments.map((dept) => (
                          <MenuItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Box>
              <Box
                sx={{
                  minWidth: 120,
                  display: "flex",
                  padding: "10px 50px",
                  "@media(max-width: 1200px)": {
                    flexDirection: "column", // 縦並びにする
                    gap: "2vh",
                  },
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
                    marginLeft: "3vw",
                    marginRight: "3vw",
                    "@media(max-width: 1200px)": {
                      marginLeft: "2vw",
                      marginRight: "2vw",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "#ffffff",
                      fontWeight: 450,
                      fontSize: "20px",
                      "@media(max-width: 1200px)": {
                        fontSize: "16px",
                      },
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
                    marginRight: "2vw",
                    "& fieldset": {
                      borderColor: "#444f7c", // 初期状態の枠線の色
                    },
                    "&:hover fieldset": {
                      borderColor: "red", // ホバー時の枠線の色
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#444f7c", // フォーカス時の枠線の色
                    },
                    "@media(max-width: 1200px)": {
                      flexGrow: 1,
                      flexBasis: "40%",
                      marginLeft: "2vw",
                      marginRight: "2vw",
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
                  "@media(max-width: 1200px)": {
                    flexDirection: "column", // 縦並びにする
                    gap: "2vh",
                  },
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
                    marginLeft: "3vw",
                    marginRight: "3vw",
                    "@media(max-width: 1200px)": {
                      marginLeft: "2vw",
                      marginRight: "2vw",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "#ffffff",
                      fontWeight: 450,
                      fontSize: "20px",
                      "@media(max-width: 1200px)": {
                        fontSize: "16px",
                      },
                    }}
                  >
                    教授名
                  </Typography>
                </Card>
                <FormControl>
                  <Search
                    sx={{
                      margin: 0,
                      flexGrow: 2, // 横幅に応じて伸縮する
                      flexBasis: "60%",
                      marginRight: "2vw",
                      "@media(max-width: 1200px)": {
                        flexGrow: 1,
                        flexBasis: "40%",
                        marginLeft: "2vw",
                        marginRight: "2vw",
                      },
                    }}
                  >
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
                  left: "30vw",
                  width: "30px",
                  height: "50px",
                  backgroundColor: "#444f7c",
                  color: "#fff",
                  marginTop: "25px",
                  "@media(max-width: 1000px)": {
                    width: "20px",
                    height: "30px",
                    left: "26vw",
                  },
                }}
              >
                検索
              </Button>
            </Card>
          </Box>
        </div>
      </Box>
    </>
  );
}
