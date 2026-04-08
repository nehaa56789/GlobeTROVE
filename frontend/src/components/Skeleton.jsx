const Skeleton = ({ h = 20, w = "100%", r = 8 }) => (
  <div
    style={{
      height: h,
      width: w,
      borderRadius: r,
      background: "linear-gradient(90deg,#1e2a3a 25%,#243348 50%,#1e2a3a 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }}
  />
);

export default Skeleton;