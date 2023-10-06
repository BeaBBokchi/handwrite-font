import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faA, faPen, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import Navbar from "components/Navbar";
import Head from "next/head";
import styles from "styles/Standard-Korean.module.scss";
import { useReducer, useState } from "react";
import DropZone from "components/DropZone";
import classNames from "classnames";
import { useRouter } from "next/router";

import FilePreview from "components/FilePreview";
import Tail from "components/Tail";
import { auth, fireStorage, fireStore } from "./api/firebase";
import axios from "axios";
import { doc, setDoc, collection } from "firebase/firestore";
import { BounceLoader } from "react-spinners";

const StandardKorean = () => {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const lastPage = 3;
    const [isUploading, setIsUploading] = useState(false);

    const handlePageNext = () => {
        if (page < lastPage) {
            setPage(page + 1);
        }
    };
    const handlePagePrev = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    // reducer function to handle state changes
    const reducer = (state, action) => {
        switch (action.type) {
            case "SET_IN_DROP_ZONE":
                return { ...state, inDropZone: action.inDropZone };
            case "ADD_FILE_TO_LIST":
                return {
                    ...state,
                    fileList: state.fileList.concat(action.files),
                };
            default:
                return state;
        }
    };

    // destructuring state and dispatch, initializing fileList to empty array
    const [data, dispatch] = useReducer(reducer, {
        inDropZone: false,
        fileList: [],
    });

    const [crop, setCrop] = useState({ aspect: 16 / 9 });

    const handleUploadBtn = async () => {
        setIsUploading(true);
        // 업로드 할 파일
        const uploadedFile = data.fileList[0];
        let returnUrl = "";
        // 유저 정보
        const {
            currentUser: { uid, email },
        } = auth;
        // Timestamp
        const timestamp = +new Date();
        // Storage Instance
        const { storage, ref, getDownloadURL, uploadBytes } = fireStorage;
        // upload
        const storageRef = ref(storage, `web-upload/${uid + timestamp}`);
        const response = await uploadBytes(storageRef, uploadedFile).then(
            (snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadUrl) => {
                    returnUrl = downloadUrl;

                    // 서버 콜
                    const formData = new FormData();
                    formData.append("uid", uid);
                    formData.append("time", timestamp);
                    formData.append("url", returnUrl);
                    formData.append("file", uploadedFile);
                    console.log("formdata = ", formData);
                    console.log("uploadedFile = ", uploadedFile);
                    try {
                        const res = axios.post(
                            "http://127.0.0.1:3030/upload", //send file to flask
                            formData
                        );
                    } catch {
                        console.log("Server Error");
                    }

                    setDoc(doc(fireStore, "Fonts", uid), {
                        uid,
                    });
                    const docRef = doc(
                        collection(fireStore, "Fonts", uid, "Uploads"),
                        timestamp.toString()
                    );
                    setDoc(docRef, {
                        uid,
                        email,
                        time: timestamp.toString(),
                        uploadURL: returnUrl,
                        isDone: false,
                        downloadURL: "",
                    });
                    // const docRef = doc(
                    //     collection(fireStore, uid, timestamp.toString())
                    // );
                    // setDoc(docRef, {
                    //     uid,
                    //     email,
                    //     uploadURL: returnUrl,
                    // });
                });
                setIsUploading(false);
                router.push("/");
            }
        );
        // TODO: DB
    };

    return (
        <div>
            <Head>
                <title>Title</title>
                <meta name="Name" content="Content" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <div className={styles.container}>
                {!isUploading ? (
                    <>
                        <div className={styles.block}>
                            {page === 0 && (
                                <div className={styles.pageDiv}>
                                    <span className={styles.pageHeader}>
                                        유의 사항
                                    </span>
                                    <div className={styles.page1DescDiv}>
                                        <div className={styles.pageDescDiv}>
                                            <div>
                                                <FontAwesomeIcon icon={faPen} />
                                            </div>
                                            <span>
                                                &nbsp;손글씨 작성 시 0.7mm
                                                이상의
                                                <br />
                                                검정색 펜을 사용해 주세요.
                                            </span>
                                        </div>
                                        <div className={styles.pageDescDiv}>
                                            <div>
                                                <FontAwesomeIcon icon={faA} />
                                            </div>
                                            <span>
                                                &nbsp;글씨의 획이 붙거나 떨어진
                                                곳이
                                                <br />
                                                있는지 꼭 확인해 주세요.
                                            </span>
                                        </div>
                                        <div className={styles.pageDescDiv}>
                                            <div>
                                                <FontAwesomeIcon
                                                    icon={faSquareCheck}
                                                />
                                            </div>
                                            <span>
                                                &nbsp;글씨가 글 상자 밖으로
                                                나가지
                                                <br />
                                                않게 조심해주세요.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {page === 1 && (
                                <div className={styles.pageDiv}>
                                    <span className={styles.pageHeader}>
                                        템플릿 작성
                                    </span>
                                    <div className={styles.page2DescDiv}>
                                        <div className={styles.templateDiv}>
                                            <a
                                                className={styles.download1}
                                                href="/template/손글씨작성템플릿.pdf"
                                                download
                                            >
                                                템플릿 다운로드 PDF
                                            </a>
                                            <a
                                                className={styles.download2}
                                                href="/template/손글씨작성템플릿.jpg"
                                                download
                                            >
                                                템플릿 다운로드 JPG
                                            </a>
                                        </div>
                                        <img
                                            className="template_preview_img"
                                            src="/assets/template_preview_1.png"
                                        />
                                    </div>
                                </div>
                            )}
                            {page === 2 && (
                                <div className={styles.pageDiv}>
                                    <span className={styles.pageHeader}>
                                        손글씨 업로드
                                    </span>
                                    <div className={styles.pageDesc}>
                                        <span>
                                            손글씨 작성이 완료된 템플릿을 업로드
                                            해주세요.
                                        </span>
                                    </div>
                                    <div className={styles.dropzoneDiv}>
                                        <DropZone
                                            data={data}
                                            dispatch={dispatch}
                                        />
                                    </div>
                                </div>
                            )}
                            {page === 3 && (
                                <div className={styles.pageDiv}>
                                    <span className={styles.pageHeader}>
                                        완료
                                    </span>
                                    <div className={styles.pageDesc}></div>
                                    <FilePreview fileData={data} />
                                </div>
                            )}
                        </div>
                        <div className={styles.progressDiv}>
                            <div
                                className={classNames(
                                    styles.progressDiv_element,
                                    {
                                        [styles.progressDiv_element_active]:
                                            page === 0,
                                    }
                                )}
                            >
                                유의 사항
                            </div>
                            <div className={styles.dot}>
                                &#8226; &#8226; &#8226;
                            </div>
                            <div
                                className={classNames(
                                    styles.progressDiv_element,
                                    {
                                        [styles.progressDiv_element_active]:
                                            page === 1,
                                    }
                                )}
                            >
                                템플릿 작성
                            </div>
                            <div className={styles.dot}>
                                &#8226; &#8226; &#8226;
                            </div>
                            <div
                                className={classNames(
                                    styles.progressDiv_element,
                                    {
                                        [styles.progressDiv_element_active]:
                                            page === 2,
                                    }
                                )}
                            >
                                손글씨 업로드
                            </div>
                            <div className={styles.dot}>
                                &#8226; &#8226; &#8226;
                            </div>
                            <div
                                className={classNames(
                                    styles.progressDiv_element,
                                    {
                                        [styles.progressDiv_element_active]:
                                            page === 3,
                                    }
                                )}
                            >
                                완료
                            </div>
                        </div>
                        <div>
                            {page === 0 ? (
                                <button
                                    className={classNames(
                                        styles.pageBtn,
                                        styles.pageBtn_prev
                                    )}
                                    onClick={() => router.push("/getStart")}
                                >
                                    다시 선택하기
                                </button>
                            ) : (
                                <button
                                    className={classNames(
                                        styles.pageBtn,
                                        styles.pageBtn_prev
                                    )}
                                    onClick={handlePagePrev}
                                >
                                    &#60; 이전 단계로
                                </button>
                            )}
                            {page === lastPage ? (
                                <button
                                    className={classNames(
                                        styles.pageBtn,
                                        styles.pageBtn_next
                                    )}
                                    onClick={handleUploadBtn}
                                >
                                    완료 하기
                                </button>
                            ) : (
                                <button
                                    className={classNames(
                                        styles.pageBtn,
                                        styles.pageBtn_next
                                    )}
                                    onClick={handlePageNext}
                                >
                                    다음 단계로 &#62;
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className={styles.loaderDiv}>
                        <BounceLoader size={100} color={"#FFFFFF"} />
                    </div>
                )}
            </div>
            <Tail />
        </div>
    );
};

export default StandardKorean;
