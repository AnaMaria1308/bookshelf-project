import styles from "../styles/home.module.scss"

function Home () {
    return (
        <div className={styles.homeContainer}>
            <h1>Welcome to your reading space</h1>
            <p>What would you like to do today?</p>
            <div className={styles.imgContainer}>
                <img src="src\assets\images\normal-people.jpg" className={styles.img}/>
                <img src="src\assets\images\binding-13.jpg" className={styles.img}/>
                <img src="src\assets\images\the-love-hypothesis.jpg" className={styles.img} />
                <img src="src\assets\images\it-ends-with-us.jpg" className={styles.img} />
            </div>
        </div>
    )
}

export default Home;