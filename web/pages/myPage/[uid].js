import Navbar from "components/Navbar";
import Head from "next/head";
import Tail from "components/Tail";
import styles from "styles/myPage.module.scss";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fireStore } from "pages/api/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { BounceLoader } from "react-spinners";
import FontBlock from "components/FontBlock";

const myPage = () => {
    const router = useRouter();
    const { uid } = router.query;
    const [isLoading, setIsLoading] = useState(false);
    const [fontList, setFontList] = useState([]);

    // test
    // const [test, setTest] = useState(false);
    let test = false;

    const fetchData = async () => {
        const q = query(
            collection(fireStore, "Fonts", uid, "Uploads"),
            orderBy("time")
        );
        let count = 0;
        getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let list = fontList;
                list[count] = doc.data();
                setFontList(list);
                count += 1;
            });
            setIsLoading(false);
            console.log(fontList);
        });
    };

    useEffect(() => {
        setIsLoading(true);
        fetchData();
    }, []);

    return (
        <div>
            <Head>
                <title>마이페이지</title>
                <meta name="Name" content="Content" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <div className={styles.container}>
                {!isLoading ? (
                    <div className={styles.blockContainer}>
                        {" "}
                        {fontList.map((element) => {
                            const currentTest = test;
                            test = true;
                            return (
                                <FontBlock props={element} test={currentTest} />
                            );
                        })}
                    </div>
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

export default myPage;
