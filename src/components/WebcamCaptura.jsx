import React, { useRef, useState } from 'react';

export default function WebcamCapture({ onCapture, label = "Capturar Imagem" }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [streaming, setStreaming] = useState(false);
    const [preview, setPreview] = useState(null);
    const [videoReady, setVideoReady] = useState(false);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = videoRef.current;
            video.srcObject = stream;
            video.play();

            // Aguarda até que o vídeo esteja pronto para desenhar
            video.addEventListener('canplay', () => {
                setVideoReady(true);
            }, { once: true });

            setStreaming(true);
        } catch (err) {
            alert("Erro ao acessar câmera: " + err.message);
        }
    };

    const captureImage = () => {
        if (!videoReady) {
            alert("Aguardando a câmera carregar. Tente novamente em 1 segundo.");
            return;
        }

        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, 300, 225);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setPreview(dataUrl);
        onCapture(dataUrl);

        // Encerrar a câmera após captura
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        setStreaming(false);
        setVideoReady(false);
    };

    return (
        <div style={{ marginTop: '10px' }}>
            {!streaming ? (
                <button
                    type="button"
                    onClick={startCamera}
                    style={{
                        ...uploadButtonStyle,
                        marginBottom: '10px'
                    }}
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
                        style={{
                            ...uploadButtonStyle,
                            marginTop: '10px'
                        }}
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
                    style={{
                        ...imagePreviewStyle,
                        marginTop: '10px'
                    }}
                />
            )}
        </div>
    );
}

// Reaproveitando os estilos do seu código original
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
    objectFit: 'cover'
};
