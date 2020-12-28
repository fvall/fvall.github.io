import styles from "./post.module.scss";

export default function Post({ children }) {
  return <div className={styles.container}>{children}</div>;
}
