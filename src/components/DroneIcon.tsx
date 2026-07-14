interface DroneIconProps {
  size?: number;
}

export function DroneIcon({ size = 34 }: DroneIconProps) {
  const bar = Math.round(size * 0.59);
  const dot = Math.round(size * 0.147);

  return (
    <div style={{
      position: "relative",
      width: size,
      height: size,
      borderRadius: "50%",
      background: "#16324f",
      border: "1.5px solid #3d7ab5",
      flexShrink: 0,
    }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: bar, height: 3, background: "#eaf2fa", transform: "translate(-50%,-50%)" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 3, height: bar, background: "#eaf2fa", transform: "translate(-50%,-50%)" }} />
      <div style={{ position: "absolute", top: 2, left: 2, width: dot, height: dot, borderRadius: "50%", background: "#3d7ab5" }} />
      <div style={{ position: "absolute", top: 2, right: 2, width: dot, height: dot, borderRadius: "50%", background: "#3d7ab5" }} />
      <div style={{ position: "absolute", bottom: 2, left: 2, width: dot, height: dot, borderRadius: "50%", background: "#3d7ab5" }} />
      <div style={{ position: "absolute", bottom: 2, right: 2, width: dot, height: dot, borderRadius: "50%", background: "#3d7ab5" }} />
    </div>
  );
}
