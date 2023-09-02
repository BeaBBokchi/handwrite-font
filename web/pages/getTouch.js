import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Navbar from "components/Navbar";
import Head from "next/head";
import styles from "styles/GetTouch.module.scss";
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
                <span className={styles.head}>원하는 보정 스타일 선택하기</span>
                <div className={styles.blockContainer}>
                    <div className={styles.block} onClick={handleGothic}>
                        <div
                            className={classNames(
                                styles.blockHead,
                                styles.blockHead_color1
                            )}
                        >
                            <span className={styles.title}>고딕</span>
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
                        </div>
                    </div>
                </div>
            </div>
            <Tail />
        </div>
    );
};

export default withRouter(GetTouch);
