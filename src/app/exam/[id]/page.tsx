import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { getExamById } from './actions';

interface ExamPageProps {
  params: { id: string };
}

export const generateMetadata = async ({ params }: ExamPageProps) => {
  const exam = await getExamById(params.id);
  return {
    title: `試験 - ${exam?.id || '不明'}`,
  };
};

const ExamPage = async ({ params }: ExamPageProps) => {
  try {
    const exam = await getExamById(params.id);

    if (!exam) {
      return <div>試験情報が見つかりませんでした。</div>;
    }

    return (
      <Card sx={{ maxWidth: 600, margin: "auto", mt: 5 }}>
        <Card sx={{ maxWidth: 600, margin: "auto" }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              過去問詳細
            </Typography>
            <Box sx={{ maxWidth: "100%", margin: "auto", mt: 10 }}>
              <Stack direction="row" spacing={2}>    
                <CardContent>
                  <Typography variant="subtitle1" color="textSecondary">
                    講義名
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {exam.lecture.name}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    学科
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {exam.department.name}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    年度
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {exam.year}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    教授名
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {exam.professor || "不明"}
                  </Typography>
                </CardContent>   
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Card>
    );
  } catch (error) {
    console.error('試験情報の取得中にエラーが発生しました：', error);
    return <div>試験情報の取得中にエラーが発生しました。</div>;
  }
};

export default ExamPage;
