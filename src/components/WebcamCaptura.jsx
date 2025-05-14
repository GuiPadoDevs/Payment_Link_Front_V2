import React, { useRef, useState, useEffect } from 'react';

export default function WebcamCapture({ onCapture, label = "Capturar Imagem" }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [streaming, setStreaming] = useState(false);
    const [preview, setPreview] = useState(null);
    const [videoReady, setVideoReady] = useState(false);
    const [shouldStart, setShouldStart] = useState(false);

    // Efeito que roda quando <video> estiver montado no DOM
    useEffect(() => {
        if (shouldStart && videoRef.current) {
            const start = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    const video = videoRef.current;
                    video.srcObject = stream;
                    video.play();

                    video.addEventListener('canplay', () => {
                        setVideoReady(true);
                    }, { once: true });

                    setStreaming(true);
                } catch (err) {
                    alert("Erro ao acessar câmera: " + err.message);
                    setShouldStart(false); // cancela tentativa
                }
            };

            start();
        }
    }, [shouldStart]);

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
                        marginBottom: '10px'
                    }}
                >
                    {label}
                </button>
            )}

            {(shouldStart || streaming) && (
                <>
                    <video
                        ref={videoRef}
                        width="300"
                        height="225"
                        style={{ borderRadius: '8px' }}
                        autoPlay
                        muted
                    />
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
