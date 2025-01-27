// import React, { useRef, useState, useEffect } from 'react';

// function CameraCapture() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [imageSrc, setImageSrc] = useState('');

//   // Mengakses kamera saat komponen di-mount
//   useEffect(() => {
//     const getCameraStream = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (err) {
//         console.error("Error accessing camera: ", err);
//       }
//     };

//     getCameraStream();
//   }, []);

//   // Fungsi untuk menangkap gambar
//   const capturePhoto = () => {
//     if (canvasRef.current && videoRef.current) {
//       const context = canvasRef.current.getContext('2d');
//       context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
//       const dataUrl = canvasRef.current.toDataURL('image/png');
//       setImageSrc(dataUrl); // Set gambar yang diambil
//     }
//   };

//   return (
//     <div>
//       <div>
//         <video ref={videoRef} autoPlay style={{ width: '100%', maxHeight: '400px' }} />
//         <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480" />
//       </div>
//       <button onClick={capturePhoto}>Ambil Gambar</button>
//       {imageSrc && (
//         <div>
//           <h3>Gambar yang Diambil:</h3>
//           <img src={imageSrc} alt="Captured" style={{ width: '100%', maxHeight: '400px' }} />
//         </div>
//       )}
//     </div>
//   );
// }

// export default CameraCapture;
