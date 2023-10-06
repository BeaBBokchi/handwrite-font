import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Navbar from "components/Navbar";
import Head from "next/head";
import styles from "styles/GetTouch.module.scss";
import classNames from "classnames";
import { useRouter, withRouter } from "next/router";
import Tail from "components/Tail";
import axios from "axios";
import { useState } from "react";
import { BounceLoader } from "react-spinners";

const GetTouch = ({ router: { query } }) => {
    const props = JSON.parse(query.data);
    const [isLoading, setIsLoading] = useState(false);
    const userouter = useRouter();

    const handleGothic = () => {
        setIsLoading(true);
        // 서버 콜
        const formData = new FormData();
        // formData.append("uid", uid);
        // formData.append("time", timestamp);
        // formData.append("url", returnUrl);
        // formData.append("file", uploadedFile);
        try {
            const res = axios
                .post(
                    "http://127.0.0.1:3030/refine", //send file to flask
                    formData
                )
                .then(() => {
                    setIsLoading(false);
                    userouter.push("/");
                });
        } catch {
            console.log("Server Error");
        }
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
                {!isLoading ? (
                    <>
                        <span className={styles.head}>
                            원하는 보정 스타일 선택하기
                        </span>
                        <div className={styles.blockContainer}>
                            <div
                                className={styles.block}
                                onClick={handleGothic}
                            >
                                <div
                                    className={classNames(
                                        styles.blockHead,
                                        styles.blockHead_color1
                                    )}
                                >
                                    <span className={styles.titleGothic}>
                                        고딕
                                    </span>
                                </div>
                            </div>
                            <div
                                className={styles.block}
                                onClick={handleMyeongjo}
                            >
                                <div
                                    className={classNames(
                                        styles.blockHead,
                                        styles.blockHead_color2
                                    )}
                                >
                                    <span className={styles.titleMyeongjo}>
                                        명조
                                    </span>
                                </div>
                            </div>
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

export default withRouter(GetTouch);
