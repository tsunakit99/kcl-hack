const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // const departments = ['共通', '知能情報工学科', '情報通信工学科', '知的システム工学科', '物理情報工学科', '生命化学情報工学科']; // 事前に用意した学科名

  // for (const name of departments) {
  //   await prisma.department.upsert({
  //     where: { name },
  //     update: {},
  //     create: { name },
  //   });
  // }
  // const lectureNames = [
  //   "教職論", "教育原理", "教育心理学", "解析Ⅰ・同演習", "線形代数Ⅰ", "離散数学Ⅰ", "解析Ⅱ", "線形代数Ⅱ・同演習", "離散数学Ⅱ",
  //   "力学Ⅰ", "電磁気学Ⅰ", "化学Ⅰ", "生物学Ⅰ", "情報工学基礎実験", "プログラミング", "計算機システムⅠ", "情報工学概論", 
  //   "データ構造とアルゴリズム", "計算機システムⅡ", "オートマトンと言語理論", "情報セキュリティ概論", "初等物理補習", 
  //   "数学リメディアル", "海外研修Ⅰ", "海外研修Ⅱ", "一般言語学Ⅰ", "一般言語学Ⅱ", "地理学Ⅰ", "地理学Ⅱ", "経済学Ⅰ", "経済学Ⅱ", 
  //   "経営学Ⅰ", "経営学Ⅱ", "政治学Ⅰ", "政治学Ⅱ", "職業と社会", "異文化間コミュニケーション論", "西洋近現代史", "国際経営論", 
  //   "サスティナビリティ論", "ＩＣＴと現代社会論", "現代社会論", "スポーツ実技", "科学技術と社会Ⅰ", "科学技術と社会Ⅱ", 
  //   "家族と社会", "科学コミュニケーション論", "市民社会論", "現代健康論", "ジェンダー論", "自己探求・アントレプレナーシップ入門", 
  //   "アイデア創出・思考法入門", "英語ⅠＣ", "英語ⅡＣ", "英語ⅢＣ", "英語ⅣＣ", "英語ⅤＣ", "英語ⅥＣ", "英語ⅦＡ", "英語ⅦＢ", 
  //   "英語ⅦＣ", "英語ⅦＤ", "英語ⅧＡ", "英語ⅧＢ", "英語ⅧＤ", "選択英語１Ｔ", "選択英語２Ｔ", "選択英語３Ｔ", "選択英語４Ｔ", 
  //   "ドイツ語Ⅰ", "ドイツ語Ⅱ", "ドイツ語Ⅲ", "中国語Ⅰ", "中国語Ⅱ", "中国語Ⅲ", "フランス語Ⅰ", "フランス語Ⅱ", "フランス語Ⅲ", 
  //   "日本事情ⅠＡ", "日本事情ⅠＢ", "日本事情ⅡＡ", "日本事情ⅡＢ", "日本語Ⅰ", "日本語Ⅱ", "教育社会学", "教育課程論", 
  //   "特別活動の指導法", "生徒指導", "学校安全管理論", "確率・統計", "微分方程式", "プログラム設計", "ネットワーク通信基礎", 
  //   "知能情報工学基礎実験", "情報通信工学実験Ⅰ", "化学Ⅱ", "生物学Ⅱ", "知的システム工学実験演習Ⅰ", "物理情報工学実験Ⅰ", 
  //   "化学実験", "知的財産概論", "キャリア形成概論", "インターンシップ", "長期インターンシップ", "海外インターンシップ実習Ⅰ", 
  //   "海外インターンシップ実習Ⅱ", "哲学Ⅰ", "哲学Ⅱ", "教育学Ⅰ", "教育学Ⅱ", "文学Ⅰ", "文学Ⅱ", "歴史学Ⅰ", "歴史学Ⅱ", "地域研究Ⅰ", 
  //   "地域研究Ⅱ", "法学Ⅰ", "法学Ⅱ", "日本国憲法Ⅰ", "日本国憲法Ⅱ", "社会学Ⅰ", "社会学Ⅱ", "心理学Ⅰ", "心理学Ⅱ", "健康スポーツ科学論", 
  //   "言語類型論", "東南アジア文化論", "心理適応論", "東アジア論", "国際関係論", "国際経済論", "日本近現代史", "日本社会論", 
  //   "教育システム論", "言語分析法", "情報倫理", "ゲーム理論", "情報社会と教育", "情報メディアとコミュニケーション", "環境学Ⅰ", 
  //   "環境学Ⅱ", "オペレーティングシステム", "人工知能論理", "ソフトウェア工学", "データ解析", "組込みプログラミング", 
  //   "信号処理", "プログラミング言語処理系", "組込システム", "ネットワークプログラミングＰ", "生物物理学", "論理回路", 
  //   "アルゴリズム設計", "オブジェクト指向プログラミング", "計算理論", "論理設計", "情報通信工学実験Ⅱ", "ネットワークアーキテクチャ", 
  //   "電気回路", "ディジタル信号処理", "電気回路Ⅰ", "ロボティクス基礎", "システム制御基礎", "機械システム基礎", "熱力学", 
  //   "構造システムの基礎Ⅰ", "ダイナミクス", "画像工学Ⅰ", "現代制御論", "電気システム回路Ⅰ", "物理数学", "電磁気学Ⅱ", "量子力学", 
  //   "連続体物理学", "光学・波動", "物理情報工学実験Ⅱ", "生命化学情報工学入門", "有機化学", "ケミカルバイオロジー", "生化学", 
  //   "環境情報学", "細胞生物学", "生物有機化学", "バイオ統計・演習", "知能情報工学プロジェクト", "脳型システム", "情報理論", 
  //   "人工知能プログラミング", "自然言語処理", "最適化", "知能情報工学実験演習Ⅱ", "コンピュータグラフィックス", "コンピュータビジョン", 
  //   "データ圧縮", "特別卒業研究", "信号処理回路", "システム最適論", "メカノシステム", "電子情報回路", "構造生物学", 
  //   "光情報エレクトロニクス", "生命化学情報工学実験Ⅰ", "生命化学情報工学実験Ⅱ", "人工知能Ｂ", "数値計算", "酵素工学", 
  //   "脳情報工学", "知的システム工学特別講義", "卒業研究", "知的システム工学実験演習Ⅲ"
  // ];

  // for (const name of lectureNames) {
  //   await prisma.lecture.upsert({
  //     where: { name },
  //     update: {},
  //     create: { name },
  //   });
  // }

  const tags = [
    { name: '期末' },
    { name: '期末解説' },
    { name: '中間' },
    { name: '中間解説' },
    { name: '小テ' },
    { name: '小テ解説' },
    { name: '講義資料' },
    { name: 'その他' },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
