import React, { useState } from "react";
import Image from "next/image";
import FilePreview from "components/FilePreview";
import styles from "styles/DropZone.module.scss";

const DropZone = ({ data, dispatch }) => {
    const [fileSelected, setFileSelected] = useState(false);
    // onDragEnter sets inDropZone to true
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
    };

    // onDragLeave sets inDropZone to false
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
    };

    // onDragOver sets inDropZone to true
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // set dropEffect to copy i.e copy of the source item
        e.dataTransfer.dropEffect = "copy";
        dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
    };

    // onDrop sets inDropZone to false and adds files to fileList
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // get files from event on the dataTransfer object as an array
        let files = [...e.dataTransfer.files];

        // ensure a file or files are dropped
        if (files && files.length > 0) {
            // loop over existing files
            const existingFiles = data.fileList.map((f) => f.name);
            // check if file already exists, if so, don't add to fileList
            // this is to prevent duplicates
            files = files.filter((f) => !existingFiles.includes(f.name));

            // dispatch action to add droped file or files to fileList
            dispatch({ type: "ADD_FILE_TO_LIST", files });
            // reset inDropZone to false
            dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
        }
        setFileSelected(true);
    };

    // handle file selection via input element
    const handleFileSelect = (e) => {
        // get files from event on the input element as an array
        let files = [...e.target.files];

        // ensure a file or files are selected
        if (files && files.length > 0) {
            // loop over existing files
            const existingFiles = data.fileList.map((f) => f.name);
            // check if file already exists, if so, don't add to fileList
            // this is to prevent duplicates
            files = files.filter((f) => !existingFiles.includes(f.name));

            // dispatch action to add selected file or files to fileList
            dispatch({ type: "ADD_FILE_TO_LIST", files });
        }
        setFileSelected(true);
    };

    // to handle file uploads
    const uploadFiles = async () => {
        // get the files from the fileList as an array
        let files = data.fileList;
        // initialize formData object
        const formData = new FormData();
        // loop over files and add to formData
        files.forEach((file) => formData.append("files", file));

        // Upload the files as a POST request to the server using fetch
        // Note: /api/fileupload is not a real endpoint, it is just an example
        const response = await fetch("/api/fileupload", {
            method: "POST",
            body: formData,
        });

        //successful file upload
        if (response.ok) {
            alert("Files uploaded successfully");
        } else {
            // unsuccessful file upload
            alert("Error uploading files");
        }
    };

    return (
        <>
            {!fileSelected && (
                <div
                    className={styles.dropzone}
                    onDragEnter={(e) => handleDragEnter(e)}
                    onDragOver={(e) => handleDragOver(e)}
                    onDragLeave={(e) => handleDragLeave(e)}
                    onDrop={(e) => handleDrop(e)}
                >
                    <Image
                        src="/upload.svg"
                        alt="upload"
                        height={50}
                        width={50}
                    />

                    <input
                        id="fileSelect"
                        type="file"
                        className={styles.files}
                        onChange={(e) => handleFileSelect(e)}
                        accept="image/*, .pdf"
                    />
                    <label htmlFor="fileSelect">파일 업로드</label>

                    <h3 className={styles.uploadMessage}>
                        버튼을 눌러 선택하거나, 이 곳에 드래그 하여 작성이
                        완료된 템플릿을 업로드 해주세요.
                    </h3>
                </div>
            )}

            {/* Pass the selectect or dropped files as props */}
            {fileSelected && (
                <div className={styles.resultDiv}>
                    <span>
                        파일이 선택되었습니다! 다음 단계로 진행해 주세요.
                    </span>
                </div>
            )}

            {/* {data.fileList.length > 0 && (
                <button className={styles.uploadBtn} onClick={uploadFiles}>
                    Upload
                </button>
            )} */}
        </>
    );
};

export default DropZone;
