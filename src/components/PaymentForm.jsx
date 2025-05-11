import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { IMaskInput } from 'react-imask';
import { useParams } from 'react-router-dom';

const schema = z.object({
    nome: z.string().min(3, 'Nome muito curto'),
    email: z.string().email('E-mail inválido'),
    telefone: z.string().min(14, 'Telefone incompleto'),
});

export default function PaymentForm() {
    const { id: linkId } = useParams();
    const [progress, setProgress] = useState(0);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [selfiePreview, setSelfiePreview] = useState(null);
    const [redirectUrl, setRedirectUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const fotoRef = useRef(null);
    const selfieRef = useRef(null);

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    useEffect(() => {
        // Buscar a URL de redirecionamento associada ao linkId
        const fetchLinkData = async () => {
            try {
                const { data } = await axios.get(`https://payment-link-server.vercel.app/api/link-data/${linkId}`);
                setRedirectUrl(data.redirectUrl);
            } catch (error) {
                console.error('Erro ao buscar dados do link:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLinkData();
    }, [linkId]);

    const handleFileChange = (e, setPreview) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        if (!fotoRef.current?.files[0] || !selfieRef.current?.files[0]) {
            alert('Por favor, selecione as imagens.');
            return;
        }

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => formData.append(key, value));
        formData.append('fotoDocumento', fotoRef.current.files[0]);
        formData.append('selfieDocumento', selfieRef.current.files[0]);
        formData.append('linkId', linkId);

        try {
            await axios.post('https://payment-link-server.vercel.app/api/submit-payment', formData, {
                onUploadProgress: (e) =>
                    setProgress(Math.round((e.loaded * 100) / (e.total || 1))),
            });
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                alert('Pagamento enviado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao enviar pagamento:', error);
            alert('Erro ao enviar pagamento.');
        }
    };

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            Carregando...
        </div>;
    }

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#ffffff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
        }}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                style={{
                    width: '100%',
                    maxWidth: '480px',
                    padding: '30px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    fontFamily: 'Arial, sans-serif',
                }}
            >
                <h1 style={{
                    color: '#0063F7',
                    textAlign: 'center',
                    marginBottom: '20px',
                    fontSize: '24px',
                }}>
                    Finalizar Pagamento
                </h1>

                <div style={fieldContainer}>
                    <label style={labelStyle}>Nome Completo</label>
                    <input
                        {...register('nome')}
                        style={inputStyle}
                    />
                    {errors.nome && <span style={errorStyle}>{errors.nome.message}</span>}
                </div>

                <div style={fieldContainer}>
                    <label style={labelStyle}>E-mail</label>
                    <input
                        type="email"
                        {...register('email')}
                        style={inputStyle}
                    />
                    {errors.email && <span style={errorStyle}>{errors.email.message}</span>}
                </div>

                <div style={fieldContainer}>
                    <label style={labelStyle}>Telefone</label>
                    <Controller
                        name="telefone"
                        control={control}
                        render={({ field }) => (
                            <IMaskInput
                                {...field}
                                mask="(00) 00000-0000"
                                placeholder="(00) 00000-0000"
                                style={inputStyle}
                            />
                        )}
                    />
                    {errors.telefone && <span style={errorStyle}>{errors.telefone.message}</span>}
                </div>

                <div style={fieldContainer}>
                    <label style={labelStyle}>Foto do Documento</label>
                    <label style={uploadButtonStyle}>
                        Selecionar Foto
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            ref={fotoRef}
                            onChange={(e) => handleFileChange(e, setFotoPreview)}
                            required
                            style={{ display: 'none' }}
                        />
                    </label>
                    {fotoPreview && (
                        <img src={fotoPreview} alt="Documento" style={imagePreviewStyle} />
                    )}
                </div>

                <div style={fieldContainer}>
                    <label style={labelStyle}>Selfie com Documento</label>
                    <label style={uploadButtonStyle}>
                        Tirar Selfie
                        <input
                            type="file"
                            accept="image/*"
                            capture="user"
                            ref={selfieRef}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    if (!file.name || file.name === 'image.jpeg' || file.name === 'image.jpg') {
                                        handleFileChange(e, setSelfiePreview);
                                    } else {
                                        alert('Por favor, tire uma foto usando a câmera do celular.');
                                        e.target.value = ''; // Limpa o input
                                        setSelfiePreview(null); // Remove a prévia
                                    }
                                }
                            }}
                            required
                            style={{ display: 'none' }}
                            onClick={(e) => {
                                e.target.value = '';
                            }}
                        />
                    </label>
                    {selfiePreview && (
                        <img src={selfiePreview} alt="Selfie" style={imagePreviewStyle} />
                    )}
                </div>

                {progress > 0 && (
                    <progress
                        value={progress}
                        max="100"
                        style={{ width: '100%', height: '20px', marginTop: '10px' }}
                    />
                )}

                <button
                    type="submit"
                    style={{
                        marginTop: '20px',
                        padding: '14px',
                        backgroundColor: '#0063F7',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#0052cc'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#0063F7'}
                >
                    Enviar
                </button>
            </form>
        </div>
    );
}

// Styles
const inputStyle = {
    padding: '12px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#ffffff',
    color: '#000000',
    outlineColor: '#0063F7',
};

const fileInputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
};

const fieldContainer = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
};

const labelStyle = {
    fontSize: '14px',
    color: '#000000',
    fontWeight: 'bold',
};

const errorStyle = {
    color: 'red',
    fontSize: '12px',
    marginTop: '4px'
};

const imagePreviewStyle = {
    width: '100%',
    maxWidth: '300px',
    marginTop: '10px',
    borderRadius: '8px',
    objectFit: 'cover'
};

// Novo estilo para o botão de upload
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
