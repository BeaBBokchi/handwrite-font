import styles from "styles/FontBlock.module.scss";

const FontBlock = ({ props }) => {
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

    const handleClick = () => {};
    return (
        <div className={styles.block} onClick={handleClick}>
            <span className={styles.time}>{parsedDate}</span>
        </div>
    );
};

export default FontBlock;
