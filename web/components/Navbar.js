import Link from "next/link";
import styles from "styles/Navbar.module.scss";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    GoogleAuthProvider,
    browserSessionPersistence,
    setPersistence,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "pages/api/auth/firebase";
import { useEffect, useState } from "react";

const Navbar = () => {
    const [userData, setUserData] = useState(null);
    // Google SignIn
    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider(); // provider를 구글로 설정
        setPersistence(auth, browserSessionPersistence).then(async () => {
            try {
                const data = await signInWithPopup(auth, provider); // popup을 이용한 signup
                setUserData(data.user); // user data 설정
                console.log(data); // console로 들어온 데이터 표시
            } catch (err) {
                console.log(err);
            }
        });
    };

    // Google SignOut
    const handleGoogleSignOut = () => {
        auth.signOut();
        setUserData(null);
    };

    const handleClickUserIcon = () => {
        if (userData) {
        }
    };

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                setUserData(auth.currentUser);
            } else {
                // No user is signed in.
            }
        });

        // setUserID(auth.currentUser.uid);
        // setUserPhoto(auth.currentUser.photoURL);
    });

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <Link href="/">
                    <a>손글씨폰트</a>
                </Link>
            </div>
            <div className={styles.menu}>
                {userData ? (
                    <Link href="#">
                        <a onClick={handleGoogleSignOut}>로그아웃</a>
                    </Link>
                ) : (
                    <Link href="#">
                        <a onClick={handleGoogleSignIn}>로그인</a>
                    </Link>
                )}
                <Link href="#">
                    <a>소개</a>
                </Link>
                <Link href="#">
                    <a>서비스</a>
                </Link>
                <Link href="#">
                    <a>고객지원</a>
                </Link>
                {userData ? (
                    <Link href={"myPage/" + userData.uid}>
                        <a className={styles.iconDiv}>
                            <img src={userData.photoURL} />
                        </a>
                    </Link>
                ) : (
                    <Link href="#">
                        <a className={styles.iconDiv}>
                            <FontAwesomeIcon icon={faCircleUser} />
                        </a>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
