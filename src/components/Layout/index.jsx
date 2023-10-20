import SideBar from './SideBar';
import HeaderBar from './HeaderBar';
import styles from './index.module.scss';

const Layout = (props) => {
    if(location.pathname === `${BASEDIR}/login`) {
        return props.children || null;
    }

    return (
        <div className={styles['layout-container']}>
            <div className={styles['header-bar']}><HeaderBar /></div>
            <div className={styles['content']}>
                <div className={styles['side-bar']}>
                    <SideBar />
                </div>
                <div className={styles['page-content']}>{props.children || null}</div>
            </div>
        </div>
    );
};

export default Layout;

