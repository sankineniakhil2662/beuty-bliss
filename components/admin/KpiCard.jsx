// One `.kpi` block from the admin mockup. `deltaType` is "up" | "flat" | undefined
// (undefined = plain/default color, matching the mockup's Pending Reviews card).
export default function KpiCard({ label, value, delta, deltaType, accent = false }) {
  return (
    <div className={"kpi" + (accent ? " accent" : "")}>
      <div className="kl">{label}</div>
      <div className="kv">{value}</div>
      {delta && (
        <div className={"kd" + (deltaType ? " " + deltaType : "")}>{delta}</div>
      )}
    </div>
  );
}
