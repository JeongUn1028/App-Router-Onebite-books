import Link from "next/link";

export default function Layout({
  children,
  sidebar,
  feed,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  feed: React.ReactNode;
}) {
  return (
    <div>
      <div>
        <Link href={"/parallel"}>parallel</Link>
        &nbsp;
        <Link href={"/parallel/setting"}>setting</Link>
      </div>
      {sidebar}
      {feed}
      {children}
    </div>
  );
}
