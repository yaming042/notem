import { Spin } from 'antd';
import styles from './index.module.scss';

export default (props) => {
    let tip = props.tip || '努力加载中...';

    return (
        <div className={styles['container']}>
            <Spin tip={tip} size="large">
                <div style={{width:200}}></div>
            </Spin>
        </div>
    );
}