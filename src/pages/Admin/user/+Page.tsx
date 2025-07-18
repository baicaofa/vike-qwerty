import BlockStats from "./BlockStats";

export default function AdminPage() {
  return (
    <>
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: 16 }}>
          用户区块统计页面
        </h1>

        <BlockStats />
      </div>
    </>
  );
}
