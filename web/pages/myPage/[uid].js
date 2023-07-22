import Navbar from "components/Navbar";
import Head from "next/head";
import Tail from "components/Tail";
import styles from "styles/myPage.module.scss";
import { useRouter } from "next/router";

const myPage = () => {
    const router = useRouter();
    const { uid } = router.query;
    return (
        <div>
            <Head>
                <title>마이페이지</title>
                <meta name="Name" content="Content" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <div className={styles.container}>{uid}</div>
            <Tail />
        </div>
    );
};

export default myPage;
