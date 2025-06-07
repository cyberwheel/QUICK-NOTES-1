// File: components/DrivePreview.js
export default function DrivePreview({ embedLink, height='80vh' }) {
  return (
    <iframe
      src={embedLink}
      style={{ width:'100%', height, border:0 }}
      allow="fullscreen"
    />
  );
}
