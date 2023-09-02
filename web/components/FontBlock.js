import { query } from "firebase/firestore";
import Link from "next/link";
import { useState } from "react";
import styles from "styles/FontBlock.module.scss";

const FontBlock = ({ props }) => {
    const [showBtn, setShowBtn] = useState(false);
    const { time } = props;
    const currentDate = new Date(Number(time));

    const getYyyyMmDdMmSsToString = (date) => {
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!

        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = "0" + dd;
        }
        if (mm < 10) {
            mm = "0" + mm;
        }

        yyyy = yyyy.toString();
        mm = mm.toString();
        dd = dd.toString();

        var m = date.getHours();
        var s = date.getMinutes();

        if (m < 10) {
            m = "0" + m;
        }
        if (s < 10) {
            s = "0" + s;
        }
        m = m.toString();
        s = s.toString();

        var s1 = `${yyyy}/${mm}/${dd} ${m}:${s}`;
        return s1;
    };

    const parsedDate = getYyyyMmDdMmSsToString(currentDate);

    const handleClick = () => {
        // setShowBtn(!showBtn);
    };

    const handleHoverOn = () => {
        setShowBtn(true);
    };
    const handleHoverOut = () => {
        setShowBtn(false);
    };

    const handleDownloadBtn = () => {
        console.log("download");
    };

    const handleTouchBtn = () => {
        console.log("touch");
    };

    return (
        <div
            className={styles.block}
            onClick={handleClick}
            onMouseOver={handleHoverOn}
            onMouseOut={handleHoverOut}
        >
            <span className={styles.time}>{parsedDate}</span>
            {showBtn && (
                <div className={styles.downloadBtn} onClick={handleDownloadBtn}>
                    다운로드
                </div>
            )}
            {showBtn && (
                <div className={styles.touchBtn} onClick={handleTouchBtn}>
                    <Link
                        href={{
                            pathname: "/getTouch",
                            query: { data: JSON.stringify(props) },
                        }}
                        as="/getTouch"
                    >
                        보정하기
                    </Link>
                </div>
            )}
        </div>
    );
};

export default FontBlock;
