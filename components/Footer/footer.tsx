import styles from '../../styles/Footer.module.css';
import Router from 'next/router';


function footer() {
  const homehandler = ()=>{
    Router.push('/')
  }
  const Eventshandler = ()=>{
    Router.push('/students')
  }
  const Signuphandler = ()=>{
    Router.push('/courses')
  }
  const Loginhandler = ()=>{
    Router.push('/attendance')
  }
  return (
    <footer className={`${styles.footer} bg-red-700`}>
      <div className={styles.container}>
        <p>&copy; 2023 Awais Management Company</p>
        <ul className={styles.links}>
          <li><h5 className={styles.footerlinks} onClick={homehandler}>Home</h5></li>
          <li><h5 className={styles.footerlinks} onClick={Eventshandler}>Students</h5></li>
          <li><h5 className={styles.footerlinks} onClick={Signuphandler}>Courses</h5></li>
          <li><h5 className={styles.footerlinks} onClick={Loginhandler}>Attendance</h5></li>
        </ul>
      </div>
    </footer>
  );
}

export default footer;