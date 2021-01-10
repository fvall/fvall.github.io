import path from "path";
import { useRouter } from "next/router";

export default function Script({ scripts }) {
  const base_path = useRouter().basePath;
  return (
    <>
      {scripts.map((s) => {
        return (
          <script src={path.join(base_path, "scripts", s)} key={s}></script>
        );
      })}
    </>
  );
}

Script.defaultProps = {
  scripts: [],
};
