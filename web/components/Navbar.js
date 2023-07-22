import Link from "next/link";
import styles from "styles/Navbar.module.scss";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "pages/api/firebase";

const Navbar = () => {
    const [userData, setUserData] = useState(null);

    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider(); // provider를 구글로 설정
        signInWithPopup(auth, provider) // popup을 이용한 signup
            .then((data) => {
                setUserData(data.user); // user data 설정
                console.log(data); // console로 들어온 데이터 표시
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleGoogleSignOut = () => {
        auth.signOut();
        setUserData(null);
    };

    useEffect(() => {});
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <Link href="/">
                    <a>손글씨폰트</a>
                </Link>
            </div>
            <div className={styles.menu}>
                <Link href="#">
                    <a>소개</a>
                </Link>
                <Link href="#">
                    <a>서비스</a>
                </Link>
                <Link href="#">
                    <a onClick={handleGoogleSignOut}>고객지원</a>
                </Link>
                <Link href="#">
                    <a onClick={handleGoogleSignIn}>
                        <FontAwesomeIcon icon={faCircleUser} />
                        {userData ? userData.displayName : null}
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
