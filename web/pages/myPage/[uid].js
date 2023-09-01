import Navbar from "components/Navbar";
import Head from "next/head";
import Tail from "components/Tail";
import styles from "styles/myPage.module.scss";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { fbInstance, fireStore } from "pages/api/firebase";
import { collection, getDoc, getDocs, query } from "firebase/firestore";

const myPage = () => {
    const router = useRouter();
    const { uid } = router.query;

    const fetchData = async () => {
        const querySnapshot = await getDocs(collection(fireStore, "Uploads"));
        querySnapshot.forEach((doc) => {
            // 가져온 모든 문서들을 확인
            console.log(doc.id, " => ", doc.data());
        });
    };

    useEffect(() => {
        fetchData();
    });

    return (
        <div>
            <Head>
                <title>마이페이지</title>
                <meta name="Name" content="Content" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <div className={styles.container}></div>
            <Tail />
        </div>
    );
};

export default myPage;
