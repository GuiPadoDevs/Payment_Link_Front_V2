import React, { useRef, useState } from 'react';

export default function WebcamCapture({ onCapture, label = "Capturar Imagem" }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [streaming, setStreaming] = useState(false);
    const [preview, setPreview] = useState(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setStreaming(true);
            } else {
                alert("Erro: elemento de vídeo não está pronto.");
            }
        } catch (err) {
            console.error("Erro ao acessar câmera:", err);
            alert("Erro ao acessar câmera: " + (err?.message || 'Desconhecido'));
        }
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, 300, 225);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setPreview(dataUrl);
        onCapture(dataUrl);

        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        setStreaming(false);
    };

    return (
        <div style={{ marginTop: '10px' }}>
            {!streaming ? (
                <button
                    type="button"
                    onClick={startCamera}
                    style={{ ...uploadButtonStyle, marginBottom: '10px' }}
                >
                    {label}
                </button>
            ) : (
                <>
                    <video ref={videoRef} width="300" height="225" style={{ borderRadius: '8px' }} />
                    <br />
                    <button
                        type="button"
                        onClick={captureImage}
                        style={{ ...uploadButtonStyle, marginTop: '10px' }}
                    >
                        Tirar Foto
                    </button>
                </>
            )}

            <canvas ref={canvasRef} width="300" height="225" style={{ display: 'none' }} />

            {preview && (
                <img
                    src={preview}
                    alt="Prévia da selfie"
                    style={{ ...imagePreviewStyle, marginTop: '10px' }}
                />
            )}
        </div>
    );
}

const uploadButtonStyle = {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#0063F7',
    color: '#ffffff',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    border: 'none',
    outline: 'none',
};

const imagePreviewStyle = {
    width: '100%',
    maxWidth: '300px',
    marginTop: '10px',
    borderRadius: '8px',
    objectFit: 'cover',
};
