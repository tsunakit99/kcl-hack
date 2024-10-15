import React from "react";
import { UploadExamForm } from "./_components/UploadExamForm";  // 相対パスを指定
import "./page.css"

const Page = () => {
    return (
        <div>
            <h1>Exam Upload Page</h1>
            <UploadExamForm />
        </div>
    );
};

export default Page;