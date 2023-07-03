import Link from "next/link";
import styles from "styles/Navbar.module.scss";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = () => {
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
                    <a>고객지원</a>
                </Link>
                <Link href="#">
                    <a>
                        <FontAwesomeIcon icon={faCircleUser} />
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
