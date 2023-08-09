import Navbar from "components/Navbar";
import Head from "next/head";
import Tail from "components/Tail";
import styles from "styles/myPage.module.scss";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

const myPage = () => {
    const router = useRouter();
    const { uid } = router.query;

    const [testData, setTestData] = useState();

    const handleGetBtn = async () => {
        let res = await axios.get("http://127.0.0.1:3030/test");
        console.log(res.data);
    };

    const handlePostBtn = async () => {
        let res = await axios.get("http://127.0.0.1:3030/test");
        console.log(res.data);
    };

    useEffect(() => {});

    return (
        <div>
            <Head>
                <title>마이페이지</title>
                <meta name="Name" content="Content" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <div className={styles.container}>
                {uid}
                <button onClick={handleGetBtn}>get</button>
                <button onClick={handlePostBtn}>post</button>
            </div>
            <Tail />
        </div>
    );
};

export default myPage;
