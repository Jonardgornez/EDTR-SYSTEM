export default function ProgressModal({ show, percent }) {
  if (!show) return null;

  return (
    <div className="progress-backdrop">
      <div className="progress-card">
        <h5 className="text-center m-0">Processing PDF...</h5>

        <div className="progress mt-3">
          <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-success"
            role="progressbar"
            style={{ width: `${percent}%` }}
          >
            {percent}%
          </div>
        </div>
      </div>
    </div>
  );
}
