import React, { useRef, useState, useEffect } from 'react';

export default function WebcamCapture({ onCapture, label = "Capturar Imagem" }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [streaming, setStreaming] = useState(false);
    const [preview, setPreview] = useState(null);
    const [videoReady, setVideoReady] = useState(false);
    const [shouldStart, setShouldStart] = useState(false);
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkDevice();
        window.addEventListener("resize", checkDevice);
        return () => window.removeEventListener("resize", checkDevice);
    }, []);

    useEffect(() => {
        if (shouldStart && videoRef.current) {
            const start = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    const video = videoRef.current;
                    video.srcObject = stream;
                    video.play();
                    video.addEventListener('canplay', () => setVideoReady(true), { once: true });
                    setStreaming(true);
                } catch (err) {
                    alert("Erro ao acessar câmera: " + err.message);
                    setShouldStart(false);
                }
            };
            start();
        }
    }, [shouldStart]);

    const captureImage = () => {
        if (!videoReady) {
            alert("Aguardando a câmera carregar. Tente novamente.");
            return;
        }

        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, 300, 225);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setPreview(dataUrl);
        onCapture(dataUrl);

        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        setStreaming(false);
        setVideoReady(false);
        setShouldStart(false);
    };

    return (
        <div style={{ marginTop: '10px' }}>
            {!streaming && (
                <button
                    type="button"
                    onClick={() => setShouldStart(true)}
                    style={{
                        ...uploadButtonStyle,
                        width: isMobile ? 'auto' : '200px'
                    }}
                >
                    {label}
                </button>
            )}

            {(shouldStart || streaming) && (
                <div style={isMobile ? {} : containerDesktopStyle}>
                    {!isMobile && <span style={cameraStatusStyle}>🟢 Câmera Ativa</span>}

                    <video
                        ref={videoRef}
                        width={isMobile ? "300" : "480"}
                        height={isMobile ? "225" : "360"}
                        style={isMobile ? mobileVideoStyle : desktopVideoStyle}
                        autoPlay
                        muted
                    />

                    <button
                        type="button"
                        onClick={captureImage}
                        style={{
                            ...uploadButtonStyle,
                            marginTop: '10px',
                            width: isMobile ? 'auto' : '200px'
                        }}
                    >
                        Tirar Foto
                    </button>
                </div>
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

// Estilos comuns
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
    borderRadius: '8px',
    objectFit: 'cover'
};

// Estilos específicos para desktop
const containerDesktopStyle = {
    marginTop: '20px',
    backgroundColor: '#0f172a',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 0 12px rgba(0, 99, 247, 0.5)',
    textAlign: 'center',
    position: 'relative',
    maxWidth: '520px',
    margin: '20px auto',
};

const desktopVideoStyle = {
    borderRadius: '12px',
    boxShadow: '0 0 8px rgba(0, 99, 247, 0.4)',
    border: '2px solid #0063F7',
};

// Estilos para mobile
const mobileVideoStyle = {
    borderRadius: '8px',
};

// Indicador de status da câmera
const cameraStatusStyle = {
    position: 'absolute',
    top: '-15px',
    right: '20px',
    color: '#00ff88',
    fontSize: '14px',
    fontWeight: 'bold',
};
