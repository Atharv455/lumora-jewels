import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>The page you're looking for doesn't exist or isn't available yet.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}

export default NotFound;
