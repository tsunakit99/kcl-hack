'use client';

import { UploadExamForm } from "./_components/UploadExamForm";
import "./upload-page.css";

export default function UploadExam() {
    UploadExamForm();

    return (
        <>
            <h1>過去問登録</h1>
            <div className="body-container">
                <div className="exam-container">
                    {/* ドロップボックス用
                        <div className="exam-image">
                        <textarea placeholder='リンク' />
                    </div> */}
                    <div id="exam-information">
                        <input type='text' id="exam-image" placeholder='リンク' />
                        <input type='text' id="title" placeholder='教科名' maxLength={20} />
                        <input type='text' id="department" placeholder='学科名' maxLength={10}/>
                        <input type='text' id="professor" placeholder='教授名' maxLength={10}/>
                        <select id="year">
                            <option value="">年度</option>
                                {Array.from({length: 50}, (_, index) => 2024 - index).map((number) => (
                                <option key={number} value={number}>
                                    {number}
                                </option>
                                ))}
                        </select>
                            
                            
                    </div>
                </div>
                <button className="submit-button" type='submit'>過去問を投稿する</button>
            </div>
        </>
    )
}