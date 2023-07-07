import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Navbar from "components/Navbar";
import Tail from "components/Tail";
import Head from "next/head";
import Link from "next/link";
import styles from "styles/Home.module.scss";

const Home = () => {
    return (
        <div>
            <Head>
                <title>홈 | 손글씨폰트</title>
                <meta name="Name" content="Content" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <div className={styles.container}>
                <p className={styles.title}>나만의 손글씨 폰트 만들기</p>
                <div className={styles.desc}>
                    <p>특별한 나만의 손글씨로</p>
                    <p>세상에서 하나밖에 없는 폰트를 만들어요.</p>
                </div>
                <Link href="/getStart">
                    <a className={styles.link}>시작하기</a>
                </Link>
                <div className={styles.imgDiv}>
                    <div className={styles.div1}>
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <span>템플릿 작성</span>
                        <div>
                            <p>특별한 나만의</p>
                            <p>손글씨를 담아주세요.</p>
                        </div>
                    </div>
                    <div className={styles.div2}>
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <span>업로드</span>
                        <div>
                            <p>특별한 손글씨가 담긴</p>
                            <p>템플릿을 업로드 해주세요.</p>
                        </div>
                    </div>
                    <div className={styles.div3}>
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <span>인공지능 학습</span>
                        <div>
                            <p>이제 인공지능이</p>
                            <p>일할 차례예요.</p>
                        </div>
                    </div>
                    <div className={styles.div4}>
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <span>검토 및 수정</span>
                        <div>
                            <p>폰트가 완성되기 전,</p>
                            <p>맘에 들지 않는 부분은</p>
                            <p>다시 수정할 수 있어요.</p>
                        </div>
                    </div>
                    <div className={styles.div5}>
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <span>폰트 완성</span>
                        <div>
                            <p>특별한 나만의 손글씨를</p>
                            <p>폰트로 사용할 수 있어요.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Tail />
        </div>
    );
};

export default Home;
