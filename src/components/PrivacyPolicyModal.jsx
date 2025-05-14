import React, { useState, useEffect } from 'react';

const PrivacyPolicyOverlay = ({ onAccept }) => {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        // Impede rolagem do fundo enquanto o overlay está ativo
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div style={styles.overlay}>
            <div style={styles.panel}>
                <h2 style={styles.title}>Política de Privacidade</h2>
                <p>Precisamos da sua permissão para processar seus dados de pagamento.</p>

                {!expanded && (
                    <button style={styles.linkButton} onClick={() => setExpanded(true)}>
                        Saber mais
                    </button>
                )}

                {expanded && (
                    <div style={styles.policyText}>
                        <p>
                            Esta política de privacidade descreve como suas informações são coletadas, usadas e protegidas.
                            Utilizamos seus dados apenas para processar pagamentos, verificar sua identidade e cumprir com obrigações legais.
                        </p>
                        <p>
                            Os dados que coletamos incluem: nome, CPF, e-mail, selfie, documentos anexados, valor da transação e detalhes técnicos do dispositivo.
                        </p>
                        <p>
                            Seus dados são mantidos em segurança, armazenados temporariamente em nossos servidores e nunca serão compartilhados com terceiros sem seu consentimento explícito.
                        </p>
                        <p>
                            Você tem o direito de acessar, corrigir ou solicitar a exclusão de seus dados a qualquer momento, conforme previsto na LGPD.
                        </p>
                    </div>
                )}

                <button style={styles.acceptButton} onClick={onAccept}>
                    Aceitar e Continuar
                </button>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(2px)',
    },
    panel: {
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 0 20px rgba(0,0,0,0.4)',
    },
    title: {
        marginBottom: '1rem',
    },
    linkButton: {
        background: 'none',
        border: 'none',
        color: '#007bff',
        cursor: 'pointer',
        textDecoration: 'underline',
        marginTop: '1rem',
        fontSize: '0.95rem',
    },
    policyText: {
        textAlign: 'left',
        marginTop: '1rem',
        maxHeight: '300px',
        overflowY: 'auto',
        fontSize: '0.95rem',
        color: '#333',
    },
    acceptButton: {
        marginTop: '1.5rem',
        padding: '0.7rem 1.5rem',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
    },
};

export default PrivacyPolicyOverlay;
