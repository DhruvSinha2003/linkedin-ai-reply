export default function App() {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: "350px",
        height: "150px",
        backgroundColor: "#4F5D73",
        padding: "16px",
      }}
    >
      <div
        style={{
          padding: "16px",
          borderRadius: "8px",
          textAlign: "center",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#75FBF3",
            marginBottom: "16px",
          }}
        >
          Dhruv Sinha
        </h1>
        <div>
          <a
            href="https://www.linkedin.com/in/dhruvsinha2003/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#75FBF3",
              fontWeight: "bold",
              display: "block",
              marginBottom: "8px",
            }}
          >
            LinkedIn Profile
          </a>
          <a
            href="https://github.com/DhruvSinha2003"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#75FBF3",
              fontWeight: "bold",
              display: "block",
            }}
          >
            GitHub Profile
          </a>
        </div>
      </div>
    </div>
  );
}
