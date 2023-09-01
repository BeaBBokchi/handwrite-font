import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Navbar from "components/Navbar";
import Head from "next/head";
import styles from "styles/GetStart.module.scss";
import classNames from "classnames";
import { withRouter } from "next/router";
import Tail from "components/Tail";
import axios from "axios";

const GetTouch = ({ router: { query } }) => {
    const props = JSON.parse(query.data);
    const handleGothic = () => {
        // // 서버 콜
        // const formData = new FormData();
        // formData.append("uid", uid);
        // formData.append("time", timestamp);
        // formData.append("url", returnUrl);
        // formData.append("file", uploadedFile);
        // try {
        //     const res = axios.post(
        //         "http://127.0.0.1:3030/upload", //send file to flask
        //         formData
        //     );
        // } catch {
        //     console.log("Server Error");
        // }
    };

    const handleMyeongjo = () => {};

    return (
        <div>
            <Head>
                <title>Title</title>
                <meta name="Name" content="Content" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <div className={styles.container}>
                <span className={styles.head}>원하는 폰트 선택하기</span>
                <div className={styles.blockContainer}>
                    <div className={styles.block} onClick={handleGothic}>
                        <div
                            className={classNames(
                                styles.blockHead,
                                styles.blockHead_color1
                            )}
                        >
                            <span className={styles.title}>고딕</span>
                            <span className={styles.desc}>
                                특별한 나만의 손글씨 폰트를 만들 수 있어요.
                            </span>
                            <div>
                                <span>
                                    <FontAwesomeIcon icon={faCircleCheck} />{" "}
                                    50자의 손글씨 작성
                                </span>
                                <span>
                                    <FontAwesomeIcon icon={faCircleCheck} />{" "}
                                    폰트 공유 및 배포 가능
                                </span>
                                <span>
                                    <FontAwesomeIcon icon={faCircleCheck} />{" "}
                                    한글 2780/11172자 선택 가능
                                </span>
                                <span>
                                    <FontAwesomeIcon icon={faCircleCheck} />{" "}
                                    이메일 알림
                                </span>
                                <span>
                                    <FontAwesomeIcon icon={faCircleCheck} />{" "}
                                    영어, 숫자 및 특수문자 포함
                                </span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.block} onClick={handleMyeongjo}>
                        <div
                            className={classNames(
                                styles.blockHead,
                                styles.blockHead_color2
                            )}
                        >
                            <span className={styles.title}>명조</span>
                            <span className={styles.desc}>
                                나의 손글씨를 다른 폰트와 혼합하여 만들 수
                                있어요.
                            </span>
                            <div>
                                <span>
                                    <FontAwesomeIcon icon={faCircleCheck} />{" "}
                                    Standard 기능 모두 지원
                                </span>
                                <span>
                                    <FontAwesomeIcon icon={faCircleCheck} />{" "}
                                    손글씨 보정 가능
                                </span>
                                <span>
                                    <FontAwesomeIcon icon={faCircleCheck} />{" "}
                                    저작권 소유 가능
                                </span>
                                <span>
                                    <FontAwesomeIcon icon={faCircleCheck} />{" "}
                                    폰트 스타일 혼합 가능
                                </span>
                                <span>
                                    <FontAwesomeIcon icon={faCircleCheck} />{" "}
                                    폰트 파일 수정 가능
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Tail />
        </div>
    );
};

export default withRouter(GetTouch);
