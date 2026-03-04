export default function UploadBox({ onFile, onPrint, canPrint }) {
  return (
    <div className="upload-box d-flex flex-column align-items-center my-4">
      <label htmlFor="pdfUpload" className="form-label fw-bold">
        Upload your DTR PDF
      </label>

      <input
        type="file"
        id="pdfUpload"
        accept="application/pdf"
        className="form-control mb-3"
        style={{ maxWidth: 300 }}
        onChange={(e) => onFile(e.target.files?.[0] || null)}
      />

      <button
        className="btn btn-primary"
        onClick={onPrint}
        disabled={!canPrint} // ✅ disable if no file
      >
        🖨 Print All
      </button>
    </div>
  );
}
