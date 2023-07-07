import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faA, faPen, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import Navbar from "components/Navbar";
import Head from "next/head";
import styles from "styles/Standard-Korean.module.scss";
import { useCallback, useReducer, useRef, useState } from "react";
import DropZone from "components/DropZone";
import classNames from "classnames";
import { useRouter } from "next/router";

import ReactCrop from "react-image-crop";
import FilePreview from "components/FilePreview";
import Tail from "components/Tail";

const StandardKorean = () => {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const lastPage = 3;

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

    const onClickTest = () => {
        const file = data.fileList[0];
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
                <div className={styles.block}>
                    {page === 0 && (
                        <div className={styles.pageDiv}>
                            <span className={styles.pageHeader}>유의 사항</span>
                            <div className={styles.page1DescDiv}>
                                <div className={styles.pageDescDiv}>
                                    <div>
                                        <FontAwesomeIcon icon={faPen} />
                                    </div>
                                    <span>
                                        &nbsp;손글씨 작성 시 0.7mm 이상의
                                        <br />
                                        검정색 펜을 사용해 주세요.
                                    </span>
                                </div>
                                <div className={styles.pageDescDiv}>
                                    <div>
                                        <FontAwesomeIcon icon={faA} />
                                    </div>
                                    <span>
                                        &nbsp;글씨의 획이 붙거나 떨어진 곳이
                                        <br />
                                        있는지 꼭 확인해 주세요.
                                    </span>
                                </div>
                                <div className={styles.pageDescDiv}>
                                    <div>
                                        <FontAwesomeIcon icon={faSquareCheck} />
                                    </div>
                                    <span>
                                        &nbsp;글씨가 글 상자 밖으로 나가지
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
                                <img src="/template/손글씨작성템플릿.jpg" />

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
                                <DropZone data={data} dispatch={dispatch} />
                            </div>
                            {/* <img height={200} src="test.png" /> */}
                        </div>
                    )}
                    {page === 3 && (
                        <div className={styles.pageDiv}>
                            <span className={styles.pageHeader}>완료</span>
                            <div className={styles.pageDesc}></div>
                            <FilePreview fileData={data} />
                        </div>
                    )}
                </div>
                <div className={styles.progressDiv}>
                    <div
                        className={classNames(styles.progressDiv_element, {
                            [styles.progressDiv_element_active]: page === 0,
                        })}
                    >
                        유의 사항
                    </div>
                    <div className={styles.dot}>&#8226; &#8226; &#8226;</div>
                    <div
                        className={classNames(styles.progressDiv_element, {
                            [styles.progressDiv_element_active]: page === 1,
                        })}
                    >
                        템플릿 작성
                    </div>
                    <div className={styles.dot}>&#8226; &#8226; &#8226;</div>
                    <div
                        className={classNames(styles.progressDiv_element, {
                            [styles.progressDiv_element_active]: page === 2,
                        })}
                    >
                        손글씨 업로드
                    </div>
                    <div className={styles.dot}>&#8226; &#8226; &#8226;</div>
                    <div
                        className={classNames(styles.progressDiv_element, {
                            [styles.progressDiv_element_active]: page === 3,
                        })}
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
                            // onClick={handlePageNext}
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
            </div>
            <Tail />
        </div>
    );
};

export default StandardKorean;
