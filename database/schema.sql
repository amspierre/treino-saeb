-- Criação do banco de dados (execute como superusuário se necessário)
-- CREATE DATABASE saep;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS tarefas (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    descricao TEXT NOT NULL,
    setor VARCHAR(100),
    prioridade VARCHAR(10) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
    data_cadastro DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'À fazer' CHECK (status IN ('À fazer', 'Fazendo', 'Feito')),
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Dados de exemplo
INSERT INTO usuarios (nome, email, senha) VALUES
    ('Ana Silva', 'ana@email.com', '123456'),
    ('Bruno Costa', 'bruno@email.com', '123456'),
    ('Carla Souza', 'carla@email.com', '123456')
ON CONFLICT (email) DO NOTHING;